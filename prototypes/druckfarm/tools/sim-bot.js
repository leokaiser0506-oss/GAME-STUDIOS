// PROTOTYPE - NOT FOR PRODUCTION
// Druckfarm balance bot: loads the real game (index.html + config.js) in Node with a stub canvas,
// plays it through window.game with ?seed=N like a sensible player, and prints the numbers asked for.
// It walks with the game's own path finding (no teleporting) and counts every key press or panel
// click as one action. Usage: node prototypes/druckfarm/tools/sim-bot.js [minutes=35] [seed=1]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..');
const MIN = Number(process.argv[2] || 35), SEED = Number(process.argv[3] || 1);

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
  Uint8Array, Int32Array,
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
const G = new Proxy({}, { get: (_, k) => vm.runInContext(String(k), sb) }); // the game's own top-level bindings
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
const minute = () => Math.floor(S().t / 60);
function act(code) { game.press(code); actions[minute()]++; }
function click(fn) { fn(); actions[minute()]++; }
const stationPt = k => ({ x: G.STATION[k].px, y: G.STATION[k].py });
const slotPt = i => { const s = G.slotPos(i); return { x: s.px, y: s.py }; };
let dest = null, onArrive = null;
function goTo(pt, then) { // walk with the game's path finding, then act there
  run(`walkTo(${pt.x}, ${pt.y})`); dest = pt; onArrive = then;
}
function stepRoute() {
  if (!dest) return false;
  const pl = S().player;
  if (pl.to || (pl.path && pl.path.length)) return true;
  const ok = Math.hypot(pl.x - dest.x, pl.y - dest.y) < G.tune.interact_range - 4;
  const f = onArrive; dest = null; onArrive = null;
  if (ok && f) f();
  return true;
}
const P = () => S().printers;
const money = () => S().money;
let RES = 40;
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
function setupPrinter(p) { // at the printer: right job and filament (unless it prints for an order), filament in, running
  if (!p.forOrder) {
    const w = bestJob(p);
    if (w && (p.job !== w.o || p.fil !== w.f)) click(() => { run(`chooseJob(printerAt(${p.slot}), '${w.o}')`); run(`chooseFil(printerAt(${p.slot}), '${w.f}')`); });
  }
  const od = G.objDef(p.job);
  const loaded = p.spool.type === p.fil ? p.spool.g : (S().spools[p.fil] || 0);
  if (loaded < od.g && money() >= G.filDef(p.fil).price) act('KeyF');
  if (!p.auto) act('KeyE');
}
const missingParts = () => {
  const out = [];
  for (const o of S().orders) {
    if (S().carry === o.id) continue;
    o.parts.forEach((q, k) => {
      if (G.partGot(o, k) >= q.n) return;
      if (P().some(p => p.forOrder && p.forOrder.id === o.id && p.forOrder.part === k)) return;
      out.push({ o, k, q });
    });
  }
  return out;
};
function decide() {
  const s = S();
  if (s.carry) return goTo(stationPt('ship'), () => act('KeyE'));
  if (s.orders.find(G.orderReady)) return goTo(stationPt('store'), () => act('KeyF'));
  for (const p of P()) if (p.status === 'clog' && money() >= G.tierDef(p.tier).repair) return goTo(slotPt(p.slot), () => act('KeyR'));
  for (const p of P()) if (!p.autoMaint && p.wear >= 50 && !p.maintQueued && (p.status === 'print' || p.status === 'idle' || p.status === 'wait') && money() >= G.tierDef(p.tier).maint) return goTo(slotPt(p.slot), () => act('KeyR'));
  for (const p of P()) if (!p.autoFeed && p.status === 'wait' && p.why === 'Spule leer' && money() >= G.filDef(p.fil).price) return goTo(slotPt(p.slot), () => setupPrinter(p));
  for (const p of P()) if (!p.auto && p.status === 'idle') return goTo(slotPt(p.slot), () => setupPrinter(p));
  const free = s.store.filter(it => !it.res).length;
  if (!s.autoShip && s.packed.length && s.truck.st === 'dock' && !s.packQ.length) return goTo(stationPt('ship'), () => act('KeyE'));
  if (!s.autoPack && free && (free >= 8 || money() < 80 || s.store.length >= G.storeCap() - 3)) return goTo(stationPt('pack'), () => act('KeyE'));
  // orders: take one a printer can make, then give each missing part a printer with G
  if (s.orders.length < G.tune.order_max_active && P().length >= 2) {
    const mt = G.maxTier(), i = s.offers.slice(0, 3).findIndex(of => G.orderTier(of) <= mt);
    if (i >= 0) return goTo(stationPt('board'), () => act(['KeyE', 'KeyF', 'KeyR'][i]));
  }
  for (const m of missingParts()) {
    const cand = P().filter(p => !p.forOrder && p.tier >= G.partTier(m.q) && p.status !== 'clog').sort((a, b) => a.tier - b.tier)[0];
    if (cand) return goTo(slotPt(cand.slot), () => act('KeyG'));
  }
  for (const p of P()) { if (p.forOrder) continue; const w = bestJob(p); if (w && (p.job !== w.o || p.fil !== w.f) && p.status !== 'clog') return goTo(slotPt(p.slot), () => setupPrinter(p)); }
  // purchases: automation as soon as possible, then growth; keep today's rent plus 20 € a printer
  RES = 40 + G.rentToday() + 20 * P().length;
  if (G.tune.day_length - s.dayT < 15) return null;
  const m = money();
  if (P().length < 3 && m >= G.nextPrice() + RES) { const slot = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !G.printerAt(i)); return goTo(slotPt(slot), () => act('KeyE')); } // the first printers come before anything else
  for (const p of P()) {
    if (!p.autoFeed && m >= G.tune.auto_feed_price + RES) return goTo(slotPt(p.slot), () => click(() => run(`buyAuto(printerAt(${p.slot}), 'feed')`)));
    if (!p.autoMaint && m >= G.tune.auto_maint_price + RES) return goTo(slotPt(p.slot), () => click(() => run(`buyAuto(printerAt(${p.slot}), 'maint')`)));
  }
  if (!s.autoPack && P().length >= 3 && m >= G.tune.auto_pack_price + RES) return goTo(stationPt('pack'), () => act('KeyF'));
  const up = P().length >= 4 && P().filter(p => p.tier < 2 && !p.upQueued && m >= G.tierDef(p.tier).upgrade + RES).sort((a, b) => a.tier - b.tier)[0];
  if (up) return goTo(slotPt(up.slot), () => act('KeyU')); // U while printing: queued, paid after the print
  const plans = [['holder', 0], ['dragon', 0], ['gear', 1], ['helmet', 1], ['drone', 2]];
  for (const [o, tier] of plans) if (!s.plans[o] && G.maxTier() >= tier && m >= G.objDef(o).plan + RES) return goTo(slotPt(P()[0].slot), () => click(() => run(`buyPlan('${o}')`)));
  if (P().length < 8 && m >= G.nextPrice() + RES) { const slot = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !G.printerAt(i)); return goTo(slotPt(slot), () => act('KeyE')); }
  if (s.autoPack && !s.autoShip && m >= G.tune.auto_ship_price + RES) return goTo(stationPt('ship'), () => act('KeyF'));
  const up2 = P().filter(p => p.tier < 2 && !p.upQueued && m >= G.tierDef(p.tier).upgrade + RES).sort((a, b) => a.tier - b.tier)[0];
  if (up2) return goTo(slotPt(up2.slot), () => act('KeyU'));
  if (s.store.length >= G.storeCap() - 2 && m >= G.storeUpPrice() + RES) return goTo(stationPt('store'), () => act('KeyE'));
  return null;
}
function tickBot() { if (stepRoute()) return; decide(); }

// ---- play -------------------------------------------------------------------------------------------
game.press('Enter'); game.step(1, false);
const T = { printer2: -1, auto: -1, pro: -1, ind: -1, autoPack: -1, autoShip: -1, full: -1 };
const mark = (k, c) => { if (T[k] < 0 && c) T[k] = S().t; };
let doneAtFull = 0, actionsAfterFull = 0, maxDebt = 0;
while (S().t < MIN * 60) {
  if (game.scene === 'summary') { game.press('Enter'); game.step(1, false); continue; }
  if (game.scene === 'over') break; // not reachable since v5 (bank credit)
  tickBot();
  game.step(6, false);
  mark('printer2', P().length >= 2); mark('auto', S().stats.firstAutoT >= 0); mark('pro', G.maxTier() >= 1); mark('ind', G.maxTier() >= 2);
  mark('autoPack', S().autoPack); mark('autoShip', S().autoShip);
  if (T.full < 0 && P().length === 8 && P().every(p => p.autoMaint && p.autoFeed) && S().autoShip) { T.full = S().t; doneAtFull = S().stats.ordersDone; }
  maxDebt = Math.max(maxDebt, S().debt);
}
const st = S().stats;
if (T.full >= 0) for (let i = Math.ceil(T.full / 60); i < MIN; i++) actionsAfterFull += actions[i];

// ---- report ------------------------------------------------------------------------------------------
const f1 = n => n.toFixed(1).replace('.', ','), f2 = n => n.toFixed(2).replace('.', ',');
const at = t => (t >= 0 ? 'Minute ' + f1(t / 60) : 'nicht erreicht');
console.log(`Bot: seed=${SEED}, ${MIN} min Spielzeit, Spiel-Szene am Ende: ${game.scene}`);
console.log(`Ende: Tag ${S().day}, Geld ${Math.round(S().money)} €, Schulden ${Math.round(S().debt)} €, verdient ${Math.round(st.earned)} €, ${P().length} Drucker (Stufen ${P().map(p => p.tier).join('')})`);
console.log(`2. Drucker: ${at(T.printer2)} · erste Automatisierung: ${at(T.auto)} · erstes Pro-Upgrade: ${at(T.pro)} · erster Industrie: ${at(T.ind)} · Packautomat: ${at(T.autoPack)} · Auto-Versand: ${at(T.autoShip)}`);
console.log(`Aufträge nach Stufe (erfüllt/verpasst): ${st.ordersByTier.map((x, i) => `Stufe ${i}: ${x.done}/${x.missed}`).join(' · ')} · gesamt ${st.ordersDone}/${st.ordersMissed}`);
console.log(`Tage mit Kredit: ${st.creditDays} · geliehen gesamt ${Math.round(st.borrowed)} € · Zinsen ${Math.round(st.interest)} € · höchster Schuldenstand ${Math.round(maxDebt)} €`);
console.log(`Verstopfungen: ${st.clogs} gesamt, ${st.robotClogs} mit Roboter · volle Farm (8 Drucker, alles automatisiert): ${at(T.full)}${T.full >= 0 ? ` · danach ${st.ordersDone - doneAtFull} Aufträge, ${actionsAfterFull} Aktionen` : ''}`);
console.log('Aktionen je Minute (1..' + MIN + '): ' + actions.slice(0, MIN).join(' '));
if (process.argv.includes('--table')) {
  console.log('\n€/s je Kombination (netto: Erlös × (1 − Fehlerquote) − Filament − Karton, geteilt durch Druckzeit; "mit Roboter": inkl. Roboter-Wartung ×1,5 und Wartungszeit)');
  console.log('Drucker   Objekt       Filament  Zeit s   €/s   mit Roboter  Verschleiß/Druck');
  for (const r of rates()) console.log(`${r.tier.padEnd(9)} ${r.obj.padEnd(12)} ${r.fil.padEnd(8)} ${f2(r.time).padStart(6)} ${f2(r.perS).padStart(6)} ${f2(r.robot).padStart(9)}      ${f2(r.wear).padStart(6)} %`);
}
