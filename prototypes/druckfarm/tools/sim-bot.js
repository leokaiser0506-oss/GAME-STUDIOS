// PROTOTYPE - NOT FOR PRODUCTION
// Druckfarm balance bot: loads the real game (index.html + config.js) in Node with a stub canvas,
// plays it through window.game with ?seed=1 like a sensible player, and prints the numbers asked for.
// It walks like the player (no teleporting) and counts every key press or panel click as one action.
// Usage: node prototypes/druckfarm/tools/sim-bot.js [minutes=25] [seed=1]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..');
const MIN = Number(process.argv[2] || 25), SEED = Number(process.argv[3] || 1);

// ---- a browser just big enough for the game ----------------------------------------------------
const noop = () => {};
const ctx2d = new Proxy({}, { get: (t, k) => {
  if (k === 'measureText') return s => ({ width: String(s).length * 7 });
  if (k === 'createLinearGradient') return () => ({ addColorStop: noop });
  if (k in t) return t[k];
  return noop;
}, set: (t, k, v) => { t[k] = v; return true; } });
const canvas = { style: {}, width: 0, height: 0, getContext: () => ctx2d, addEventListener: noop, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 720 }) };
const store = {};
const sb = {
  console, Math, JSON, Date, URLSearchParams, Proxy, Set, Map, Object, Array, Number, String, Boolean, Symbol, Error, parseInt, parseFloat, isFinite,
  location: { search: `?seed=${SEED}&manual=1` },
  document: { getElementById: () => canvas, visibilityState: 'visible' },
  addEventListener: noop, innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
  performance: { now: () => 0 }, requestAnimationFrame: noop, setInterval: noop,
  matchMedia: () => ({ matches: false }), navigator: { maxTouchPoints: 0 },
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
};
sb.window = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(dir, 'config.js'), 'utf8'), sb);
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
vm.runInContext(html.split('<script>')[1].split('</script>')[0], sb, { filename: 'index.html' });
// read the game's own top-level bindings (they live in the context's global scope)
const G = new Proxy({}, { get: (_, k) => vm.runInContext(String(k), sb) });
const game = sb.game;
const run = code => vm.runInContext(code, sb);

// ---- analytic €/s for every object x filament x printer tier ---------------------------------------
function rates() {
  const t = G.tune, rows = [];
  for (const tier of [0, 1, 2]) for (const o of G.OBJ) for (const f of G.FIL) {
    const od = G.objDef(o), fd = G.filDef(f), td = G.tierDef(tier);
    if (od.tier > tier || fd.tier > tier) continue;
    const time = od.time / (td.speed * fd.speed);
    const net = od.price * fd.value * (1 - fd.fail) - od.g * fd.price / t.pack_grams - t.pack_cost;
    const wear = td.wear * time;
    const n = Math.max(1, Math.floor(t.auto_maint_at / wear)); // prints between robot maintenances
    const withRobot = (n * net - td.maint * t.auto_maint_cost_mult) / (n * time + t.maint_time);
    rows.push({ tier: G.TIER_NAME[tier], obj: G.OBJ_SHORT[o], fil: G.FIL_SHORT[f], time, perS: net / time, robot: withRobot, wear });
  }
  return rows;
}

// ---- the bot -------------------------------------------------------------------------------------
const S = () => G.state;
const actions = new Array(MIN + 2).fill(0);
let walkCmds = 0;
const minute = () => Math.floor(S().t / 60);
function act(code) { game.press(code); actions[minute()]++; }
function click(fn) { fn(); actions[minute()]++; }
const pts = {
  ship: () => ({ x: G.STATION.ship.px, y: G.STATION.ship.py }), pack: () => ({ x: G.STATION.pack.px, y: G.STATION.pack.py }),
  store: () => ({ x: G.STATION.store.px, y: G.STATION.store.py }), board: () => ({ x: G.STATION.board.px, y: G.STATION.board.py }),
};
const slotPt = i => { const s = G.slotPos(i); return { x: s.px, y: s.py }; };
let route = [], onArrive = null, waitFor = null, plan = null;
function goTo(pt, then) {
  const pl = S().player; route = [];
  if (Math.abs(pl.y - pt.y) > 2) { route.push({ x: 200, y: pl.y }, { x: 200, y: pt.y }); }
  route.push(pt); onArrive = then; walkCmds++;
}
function stepRoute() {
  const pl = S().player;
  if (!route.length) return false;
  if (!pl.to) {
    const nx = route[0];
    if (Math.hypot(pl.x - nx.x, pl.y - nx.y) < 5) { route.shift(); if (!route.length) { const f = onArrive; onArrive = null; if (f) f(); return true; } }
    else pl.to = { x: nx.x, y: nx.y };
  }
  return true;
}
const P = () => S().printers;
const near = (kind, slot) => { const n = S().near; return n && n.kind === kind && (slot === undefined || n.slot === slot); };
const money = () => S().money;
// cash the bot keeps: today's rent, 20 € per printer for filament and maintenance; nothing is bought in a day's last 15 s
const RES0 = 40;
let RES = RES0;
const orderPrinter = {};
function bestJob(p) { // best owned object and filament on this printer by net €/s
  let best = null;
  for (const o of G.OBJ) for (const f of G.FIL) {
    const od = G.objDef(o), fd = G.filDef(f), td = G.tierDef(p.tier);
    if (!S().plans[o] || od.tier > p.tier || fd.tier > p.tier) continue;
    const time = od.time / (td.speed * fd.speed);
    const v = (od.price * fd.value * (1 - fd.fail) - od.g * fd.price / G.tune.pack_grams - G.tune.pack_cost) / time;
    if (!best || v > best.v) best = { o, f, v };
  }
  return best;
}
function wantJob(p) {
  const oid = Object.keys(orderPrinter).find(k => orderPrinter[k] === p.slot && S().orders.some(o => String(o.id) === k));
  if (oid) { const o = S().orders.find(q => String(q.id) === oid); if (G.reservedFor(o) < o.n && S().carry !== o.id) return { o: o.obj, f: o.fil }; }
  return bestJob(p);
}
function setupPrinter(p) { // at the printer: right job and filament, filament in, running
  const w = wantJob(p);
  if (w && (p.job !== w.o || p.fil !== w.f)) { click(() => { run(`chooseJob(printerAt(${p.slot}), '${w.o}')`); run(`chooseFil(printerAt(${p.slot}), '${w.f}')`); }); }
  const od = G.objDef(p.job);
  if (p.spool.g < od.g && money() >= G.filDef(p.fil).price) act('KeyF');
  else if (p.spool.type !== p.fil && p.spool.g < od.g * 2 && money() >= G.filDef(p.fil).price) act('KeyF');
  if (!p.auto) act('KeyE');
}
function feasible(of) { return P().some(p => p.tier >= Math.max(G.OBJ_TIER[of.obj], G.FIL_TIER[of.fil])); }
function decide() {
  const s = S();
  for (const k of Object.keys(orderPrinter)) if (!s.orders.some(o => String(o.id) === k)) delete orderPrinter[k]; // finished or missed orders free their printer
  if (s.carry) return goTo(pts.ship(), () => act('KeyE'));
  const ready = s.orders.find(G.orderReady);
  if (ready) return goTo(pts.store(), () => { act('KeyF'); });
  for (const p of P()) if (p.status === 'clog' && money() >= G.tierDef(p.tier).repair) return goTo(slotPt(p.slot), () => act('KeyR'));
  for (const p of P()) if (!p.autoMaint && p.wear >= 50 && !p.maintQueued && (p.status === 'print' || p.status === 'idle' || p.status === 'wait') && money() >= G.tierDef(p.tier).maint) return goTo(slotPt(p.slot), () => act('KeyR'));
  for (const p of P()) if (!p.autoFeed && p.status === 'wait' && p.why === 'Spule leer' && money() >= G.filDef(p.fil).price) return goTo(slotPt(p.slot), () => setupPrinter(p));
  for (const p of P()) if (!p.auto && p.status === 'idle') return goTo(slotPt(p.slot), () => setupPrinter(p));
  const free = s.store.filter(it => !it.res).length;
  if (!s.autoShip) {
    if (s.packed.length && s.truck.st === 'dock' && !s.packQ.length) return goTo(pts.ship(), () => act('KeyE'));
    if (free && (free >= 8 || money() < 80 || s.store.length >= G.storeCap() - 3)) return goTo(pts.pack(), () => act('KeyE'));
  }
  // orders: take one when a printer can make it, and give it a printer
  if (s.orders.length < G.tune.order_max_active && P().length >= 2) {
    const i = s.offers.slice(0, 3).findIndex(feasible);
    if (i >= 0) return goTo(pts.board(), () => { act(['KeyE', 'KeyF', 'KeyR'][i]); });
  }
  for (const o of s.orders) {
    if (orderPrinter[o.id] !== undefined || G.reservedFor(o) >= o.n) continue;
    const need = Math.max(G.OBJ_TIER[o.obj], G.FIL_TIER[o.fil]);
    const cand = P().filter(p => p.tier >= need && !Object.values(orderPrinter).includes(p.slot)).sort((a, b) => a.tier - b.tier)[0];
    if (cand) { orderPrinter[o.id] = cand.slot; return goTo(slotPt(cand.slot), () => setupPrinter(cand)); }
  }
  // printers whose job no longer fits what they should print
  for (const p of P()) { const w = wantJob(p); if (w && (p.job !== w.o || p.fil !== w.f) && p.status !== 'clog') return goTo(slotPt(p.slot), () => setupPrinter(p)); }
  // purchases: automation as soon as possible, then growth
  RES = RES0 + G.rentToday() + 20 * P().length;
  if (G.tune.day_length - s.dayT < 15) return null;
  const m = money();
  for (const p of P()) {
    if (!p.autoFeed && m >= G.tune.auto_feed_price + RES) return goTo(slotPt(p.slot), () => click(() => run(`buyAuto(printerAt(${p.slot}), 'feed')`)));
    if (!p.autoMaint && m >= G.tune.auto_maint_price + RES) return goTo(slotPt(p.slot), () => click(() => run(`buyAuto(printerAt(${p.slot}), 'maint')`)));
  }
  // from four printers on, a printer upgrade comes before more printers
  const up4 = P().length >= 4 && P().filter(p => p.tier < 2 && m >= G.tierDef(p.tier).upgrade + RES).sort((a, b) => a.tier - b.tier)[0];
  if (up4) return goTo(slotPt(up4.slot), () => { if (up4.auto) act('KeyE'); waitFor = { slot: up4.slot }; });
  const plans = [['holder', 0], ['dragon', 0], ['gear', 1], ['helmet', 1], ['drone', 2]];
  for (const [o, tier] of plans) if (!s.plans[o] && G.maxTier() >= tier && m >= G.objDef(o).plan + RES) return goTo(slotPt(P()[0].slot), () => click(() => run(`buyPlan('${o}')`)));
  if (P().length < 8 && m >= G.nextPrice() + RES) { const slot = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !G.printerAt(i)); return goTo(slotPt(slot), () => act('KeyE')); }
  if (!s.autoShip && m >= G.tune.auto_ship_price + RES) return goTo(pts.ship(), () => act('KeyF'));
  const up = P().filter(p => p.tier < 2 && m >= G.tierDef(p.tier).upgrade + RES).sort((a, b) => a.tier - b.tier)[0];
  if (up) return goTo(slotPt(up.slot), () => { if (up.auto) act('KeyE'); waitFor = { slot: up.slot }; });
  if (s.store.length >= G.storeCap() - 2 && m >= G.storeUpPrice() + RES) return goTo(pts.store(), () => act('KeyE'));
  return null;
}
function tickBot() {
  const s = S();
  if (waitFor) { // standing at a printer until its print ends, then upgrade and restart it
    const p = G.printerAt(waitFor.slot);
    if (waitFor.restart) { waitFor = null; setupPrinter(p); return; } // one step after U, so E cannot beat it
    if (!G.busy(p)) { act('KeyU'); waitFor.restart = true; }
    return;
  }
  if (stepRoute()) return;
  decide();
}

// ---- play -------------------------------------------------------------------------------------------
game.press('Enter'); game.step(1, false);
let fullAutoT = -1, ordersAfterFull = 0, actionsAfterFull = 0, doneAtFull = 0;
const allAuto = () => P().length === 8 && P().every(p => p.autoMaint && p.autoFeed) && S().autoShip;
const allOwnedAuto = () => P().every(p => p.autoMaint && p.autoFeed) && S().autoShip;
let ownedAutoT = -1;
let over = null;
while (S().t < MIN * 60) {
  const sc = game.scene;
  if (sc === 'summary') { game.press('Enter'); game.step(1, false); continue; }
  if (sc === 'over') { over = { t: S().t, why: S().overReason }; break; }
  tickBot();
  game.step(6, false);
  if (ownedAutoT < 0 && allOwnedAuto()) ownedAutoT = S().t;
  if (fullAutoT < 0 && allAuto()) { fullAutoT = S().t; doneAtFull = S().stats.ordersDone; actionsAfterFull = 0; }
}
const st = S().stats;
if (fullAutoT >= 0) { ordersAfterFull = st.ordersDone - doneAtFull; for (let i = Math.ceil(fullAutoT / 60); i < MIN; i++) actionsAfterFull += actions[i]; }

// ---- report ------------------------------------------------------------------------------------------
const f1 = n => n.toFixed(2).replace('.', ',');
console.log(`Bot: seed=${SEED}, ${MIN} min Spielzeit${over ? `, PLEITE nach ${f1(over.t / 60)} min: ${over.why}` : ''}`);
console.log(`Ende: Tag ${S().day}, Geld ${Math.round(S().money)} €, verdient ${Math.round(st.earned)} €, ${P().length} Drucker (Stufen ${P().map(p => p.tier).join('')}), Auto-Versand ${S().autoShip ? 'ja' : 'nein'}`);
console.log(`Erste Automatisierung: ${st.firstAutoT >= 0 ? 'Minute ' + f1(st.firstAutoT / 60) : 'nie'}`);
console.log(`Verstopfungen gesamt: ${st.clogs} · davon bei Druckern mit Roboter: ${st.robotClogs} · Roboter-Wartungen: ${st.robotMaint}`);
console.log(`Aufträge: geliefert ${st.ordersDone}, verpasst ${st.ordersMissed}`);
console.log(`Aktionen (Tasten/Klicks) pro Minute: Minute 5: ${actions[4]} · Minute 15: ${actions[14]} · Minute 25: ${actions[24] ?? '-'}`);
console.log(`Alle eigenen Drucker + Auto-Versand automatisiert ab: ${ownedAutoT >= 0 ? 'Minute ' + f1(ownedAutoT / 60) : 'nie'}`);
console.log(`Volle Farm (8 Drucker, alle mit Roboter + Zuführung, Auto-Versand) ab: ${fullAutoT >= 0 ? 'Minute ' + f1(fullAutoT / 60) + ` · danach ${ordersAfterFull} Aufträge von Hand geliefert, ${actionsAfterFull} Aktionen` : 'nie erreicht'}`);
console.log('Aktionen je Minute: ' + actions.slice(0, MIN).join(' '));
console.log('\n€/s pro Kombination (netto: Erlös × (1 − Fehlerquote) − Filament − Karton, geteilt durch Druckzeit; "mit Roboter" zieht Roboter-Wartungen ×1,5 und Wartungszeit ab)');
console.log('Drucker   Objekt       Filament  Zeit s   €/s    €/s mit Roboter  Verschleiß/Druck');
for (const r of rates()) console.log(`${r.tier.padEnd(9)} ${r.obj.padEnd(12)} ${r.fil.padEnd(8)} ${f1(r.time).padStart(6)} ${f1(r.perS).padStart(7)} ${f1(r.robot).padStart(10)}       ${f1(r.wear).padStart(6)} %`);
