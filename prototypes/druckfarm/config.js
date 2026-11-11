// PROTOTYPE - NOT FOR PRODUCTION
// Question: Macht der Loop aus Filament, Drucken, Verkaufen und Upgraden mit Fehlern und Wartung 15+ Minuten Spaß, und stimmt die Balance?
// Date: 2026-11-11
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.5, min: 0, max: 1, step: 0.05 },

  // --- Start ---
  start_money:    { value: 50,  min: 0, max: 500, step: 5 },   // € at the start of a run
  start_filament: { value: 120, min: 0, max: 1000, step: 10 }, // g of Billig-PLA on printer #1's spool at the start

  // --- Day, rent, bankruptcy ---
  day_length:       { value: 90,   min: 30, max: 300, step: 5 },     // s per day
  rent_base:        { value: 10,   min: 0, max: 200, step: 1 },      // € rent per day
  rent_per_printer: { value: 6,    min: 0, max: 100, step: 1 },      // € power per printer per day
  rent_growth:      { value: 1.03, min: 1, max: 1.2, step: 0.01 },   // rent multiplier per day
  stuck_grace:      { value: 4,    min: 1, max: 20, step: 1 },       // s with nothing possible before bankruptcy

  // --- Filament (a pack is pack_grams) ---
  pack_grams:      { value: 250,  min: 50, max: 1000, step: 50 },  // g per filament pack
  fil_cheap_price: { value: 30,   min: 1, max: 300, step: 1 },     // € per pack
  fil_cheap_fail:  { value: 0.15, min: 0, max: 0.6, step: 0.01 },  // base misprint chance
  fil_cheap_value: { value: 1.0,  min: 0.5, max: 4, step: 0.05 },  // sale price multiplier
  fil_cheap_speed: { value: 1.3,  min: 0.5, max: 3, step: 0.05 },  // print speed multiplier (cheap PLA runs hot and fast)
  fil_plus_price:  { value: 50,   min: 1, max: 300, step: 1 },
  fil_plus_fail:   { value: 0.05, min: 0, max: 0.6, step: 0.01 },
  fil_plus_value:  { value: 1.3,  min: 0.5, max: 4, step: 0.05 },
  fil_plus_speed:  { value: 1.0,  min: 0.5, max: 3, step: 0.05 },
  fil_petg_price:  { value: 80,   min: 1, max: 400, step: 1 },
  fil_petg_fail:   { value: 0.04, min: 0, max: 0.6, step: 0.01 },
  fil_petg_value:  { value: 1.7,  min: 0.5, max: 4, step: 0.05 },
  fil_petg_speed:  { value: 1.0,  min: 0.5, max: 3, step: 0.05 },
  fil_resin_price: { value: 130,  min: 1, max: 600, step: 1 },
  fil_resin_fail:  { value: 0.03, min: 0, max: 0.6, step: 0.01 },
  fil_resin_value: { value: 2.3,  min: 0.5, max: 5, step: 0.05 },
  fil_resin_speed: { value: 1.0,  min: 0.5, max: 3, step: 0.05 },

  // --- Print objects: grams, print time at speed 1 (s), base sale price (€), blueprint price (€) ---
  obj_key_g: { value: 30, min: 1, max: 500, step: 1 },     obj_key_time: { value: 8, min: 1, max: 120, step: 1 },
  obj_key_price: { value: 12, min: 1, max: 500, step: 1 }, obj_key_plan: { value: 0, min: 0, max: 0, step: 1 },
  obj_holder_g: { value: 60, min: 1, max: 500, step: 1 },     obj_holder_time: { value: 14, min: 1, max: 120, step: 1 },
  obj_holder_price: { value: 26, min: 1, max: 500, step: 1 }, obj_holder_plan: { value: 120, min: 0, max: 5000, step: 10 },
  obj_dragon_g: { value: 90, min: 1, max: 500, step: 1 },     obj_dragon_time: { value: 22, min: 1, max: 120, step: 1 },
  obj_dragon_price: { value: 45, min: 1, max: 500, step: 1 }, obj_dragon_plan: { value: 300, min: 0, max: 5000, step: 10 },
  obj_gear_g: { value: 70, min: 1, max: 500, step: 1 },       obj_gear_time: { value: 18, min: 1, max: 120, step: 1 },
  obj_gear_price: { value: 59, min: 1, max: 500, step: 1 },   obj_gear_plan: { value: 600, min: 0, max: 5000, step: 10 },
  obj_helmet_g: { value: 300, min: 1, max: 1000, step: 5 },   obj_helmet_time: { value: 60, min: 1, max: 240, step: 1 },
  obj_helmet_price: { value: 210, min: 1, max: 2000, step: 5 }, obj_helmet_plan: { value: 1500, min: 0, max: 10000, step: 50 },
  obj_drone_g: { value: 250, min: 1, max: 1000, step: 5 },    obj_drone_time: { value: 60, min: 1, max: 240, step: 1 },
  obj_drone_price: { value: 210, min: 1, max: 2000, step: 5 }, obj_drone_plan: { value: 4000, min: 0, max: 20000, step: 100 },

  // --- Printers: speed multiplier, wear per printing second (%), maintenance €, repair €, upgrade € ---
  printer_base_price:   { value: 100,  min: 10, max: 1000, step: 5 },  // € for the 2nd printer
  printer_price_growth: { value: 1.35, min: 1, max: 2, step: 0.05 },   // each further printer costs this much more
  pr_starter_speed: { value: 1.0, min: 0.2, max: 5, step: 0.1 },
  pr_starter_wear:  { value: 1.2, min: 0, max: 10, step: 0.1 },
  pr_starter_maint: { value: 8,   min: 0, max: 200, step: 1 },
  pr_starter_repair:{ value: 40,  min: 0, max: 500, step: 5 },
  pr_pro_speed:     { value: 1.6, min: 0.2, max: 5, step: 0.1 },
  pr_pro_wear:      { value: 1.6, min: 0, max: 10, step: 0.1 },
  pr_pro_maint:     { value: 20,  min: 0, max: 300, step: 1 },
  pr_pro_repair:    { value: 90,  min: 0, max: 800, step: 5 },
  pr_pro_upgrade:   { value: 350, min: 0, max: 3000, step: 10 },  // € Starter -> Pro
  pr_ind_speed:     { value: 2.5, min: 0.2, max: 8, step: 0.1 },
  pr_ind_wear:      { value: 2.2, min: 0, max: 10, step: 0.1 },
  pr_ind_maint:     { value: 30,  min: 0, max: 500, step: 5 },
  pr_ind_repair:    { value: 200, min: 0, max: 2000, step: 10 },
  pr_ind_upgrade:   { value: 1400, min: 0, max: 10000, step: 50 }, // € Pro -> Industrie
  maint_time:  { value: 3, min: 0.5, max: 20, step: 0.5 },  // s a maintenance takes
  repair_time: { value: 8, min: 1, max: 40, step: 1 },      // s a repair takes
  repair_wear: { value: 20, min: 0, max: 80, step: 5 },     // % wear left after a repair

  // --- Wear, misprints, clogs ---
  wear_warn:       { value: 60,   min: 10, max: 99, step: 1 },    // % from which the printer shows orange
  wear_fail_start: { value: 50,   min: 0, max: 99, step: 1 },     // % from which wear adds misprint chance
  wear_fail_add:   { value: 0.25, min: 0, max: 1, step: 0.01 },   // extra misprint chance at 100 % wear
  wear_clog_start: { value: 70,   min: 0, max: 99, step: 1 },     // % from which a clog can happen
  clog_rate:       { value: 0.08, min: 0, max: 1, step: 0.01 },   // clog chance per printing second at 100 % wear

  // --- Goals ---
  daily_goal_base: { value: 1000, min: 100, max: 20000, step: 100 }, // € for the first endless daily goal
  big_goal_reward: { value: 0.1,  min: 0, max: 0.5, step: 0.01 },    // share of a big goal paid as reward

  // --- Player (walking, like a Roblox character) ---
  walk_speed:     { value: 190, min: 60, max: 400, step: 10 },  // px/s
  interact_range: { value: 62,  min: 30, max: 140, step: 2 },   // px from a station's prompt point

  // --- Spool per printer ---
  spool_max: { value: 1000, min: 250, max: 3000, step: 50 },    // g a printer's spool holder takes
  start_spool_new: { value: 1, min: 0, max: 4, step: 1 },       // packs of Billig-PLA a newly bought printer comes with

  // --- Automation per printer (bought at the printer) ---
  auto_maint_price: { value: 180, min: 0, max: 3000, step: 10 },  // € Wartungs-Roboter
  auto_maint_at:    { value: 55,  min: 10, max: 95, step: 1 },    // % wear the robot never lets a print end above (it maintains before the print)
  auto_maint_cost_mult: { value: 1.5, min: 1, max: 5, step: 0.1 }, // a robot maintenance costs this times a manual one
  auto_feed_price:  { value: 220, min: 0, max: 3000, step: 10 },  // € Filament-Zuführung (buys a pack when the spool runs low)

  // --- Storage, packing, shipping ---
  store_cap:       { value: 16,  min: 2, max: 200, step: 1 },     // items the storage rack holds at the start
  store_cap_add:   { value: 16,  min: 1, max: 200, step: 1 },     // items each rack upgrade adds
  store_up_price:  { value: 150, min: 0, max: 5000, step: 10 },   // € first rack upgrade (doubles each time)
  pack_time:       { value: 0.25, min: 0.02, max: 3, step: 0.01 }, // s per item at the packing table
  pack_cost:       { value: 1,   min: 0, max: 20, step: 0.5 },    // € box per item
  ship_time:       { value: 8,   min: 1, max: 60, step: 1 },      // s the van is away; money arrives when it is back
  auto_pack_price: { value: 400, min: 0, max: 10000, step: 10 },  // € Packautomat: packs the shelf by itself, shipping stays by hand
  auto_ship_price: { value: 1200, min: 0, max: 20000, step: 50 }, // € Auto-Versand: ships packed parcels by itself (needs the Packautomat)
  auto_ship_every: { value: 6,   min: 1, max: 60, step: 1 },      // s between automatic pack-and-ship checks

  // --- Customer orders (Auftragsbrett): hand work, never shipped by Auto-Versand ---
  order_slots:      { value: 3,   min: 1, max: 6, step: 1 },       // offers on the board
  order_max_active: { value: 2,   min: 1, max: 6, step: 1 },       // orders you can hold at once
  order_mult:       { value: 1.6, min: 1, max: 4, step: 0.05 },    // reward = normal price x this
  order_penalty:    { value: 0.2, min: 0, max: 1, step: 0.05 },    // share of the order value lost on a missed deadline
  order_time_base:  { value: 45,  min: 0, max: 600, step: 5 },     // s every order gets on top of its print time
  order_time_factor:{ value: 0.8, min: 0.3, max: 3, step: 0.05 },  // x (parts x print time on your best printer); never under 1.0 with one printer
  order_special_every: { value: 4, min: 2, max: 20, step: 1 },     // every n-th order is special: mixed or rush
  order_mixed_mult: { value: 1.8, min: 1, max: 4, step: 0.05 },    // reward multiplier of a mixed order (two objects)
  order_rush_mult:  { value: 2.2, min: 1, max: 5, step: 0.05 },    // reward multiplier of a rush order
  order_rush_time:  { value: 0.5, min: 0.1, max: 1, step: 0.05 },  // a rush order's deadline is this share of a normal one
  order_n_base:     { value: 4,   min: 1, max: 30, step: 1 },      // parts in an order at tier 0
  order_n_per_tier: { value: 3,   min: 0, max: 20, step: 1 },      // extra parts per unlocked printer tier
  order_n_spread:   { value: 2,   min: 0, max: 10, step: 1 },      // random extra parts, 0..this

  // --- Saving, camera, touch ---
  save_every: { value: 30,   min: 5, max: 300, step: 5 },          // s between autosaves (plus every day end)
  cam_zoom:   { value: 1.15, min: 1, max: 2.5, step: 0.05 },       // fixed camera zoom; the camera follows the player
  joy_radius: { value: 60,   min: 30, max: 120, step: 5 },         // px of the touch joystick

  // --- Bank credit instead of bankruptcy ---
  debt_interest:  { value: 0.10, min: 0, max: 0.5, step: 0.01 },   // interest on the credit per day
  confirm_window: { value: 4,    min: 1, max: 10, step: 0.5 },     // s in which a second press confirms a purchase that dips below today's rent

  // --- Walking ---
  path_grid: { value: 12, min: 6, max: 24, step: 1 },             // px per cell of the click-to-walk path grid
};
