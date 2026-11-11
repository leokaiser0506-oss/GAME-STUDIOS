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
  start_filament: { value: 120, min: 0, max: 1000, step: 10 }, // g of Billig-PLA loaded at the start

  // --- Day, rent, bankruptcy ---
  day_length:       { value: 90,   min: 30, max: 300, step: 5 },     // s per day
  rent_base:        { value: 10,   min: 0, max: 200, step: 1 },      // € rent per day
  rent_per_printer: { value: 6,    min: 0, max: 100, step: 1 },      // € power per printer per day
  rent_growth:      { value: 1.04, min: 1, max: 1.2, step: 0.01 },   // rent multiplier per day
  stuck_grace:      { value: 4,    min: 1, max: 20, step: 1 },       // s with nothing possible before bankruptcy

  // --- Filament (a pack is pack_grams) ---
  pack_grams:      { value: 250,  min: 50, max: 1000, step: 50 },  // g per filament pack
  fil_cheap_price: { value: 30,   min: 1, max: 300, step: 1 },     // € per pack
  fil_cheap_fail:  { value: 0.15, min: 0, max: 0.6, step: 0.01 },  // base misprint chance
  fil_cheap_value: { value: 1.0,  min: 0.5, max: 4, step: 0.05 },  // sale price multiplier
  fil_plus_price:  { value: 50,   min: 1, max: 300, step: 1 },
  fil_plus_fail:   { value: 0.05, min: 0, max: 0.6, step: 0.01 },
  fil_plus_value:  { value: 1.3,  min: 0.5, max: 4, step: 0.05 },
  fil_petg_price:  { value: 80,   min: 1, max: 400, step: 1 },
  fil_petg_fail:   { value: 0.04, min: 0, max: 0.6, step: 0.01 },
  fil_petg_value:  { value: 1.7,  min: 0.5, max: 4, step: 0.05 },
  fil_resin_price: { value: 130,  min: 1, max: 600, step: 1 },
  fil_resin_fail:  { value: 0.03, min: 0, max: 0.6, step: 0.01 },
  fil_resin_value: { value: 2.3,  min: 0.5, max: 5, step: 0.05 },

  // --- Print objects: grams, print time at speed 1 (s), base sale price (€), blueprint price (€) ---
  obj_key_g: { value: 30, min: 1, max: 500, step: 1 },     obj_key_time: { value: 8, min: 1, max: 120, step: 1 },
  obj_key_price: { value: 12, min: 1, max: 500, step: 1 }, obj_key_plan: { value: 0, min: 0, max: 0, step: 1 },
  obj_holder_g: { value: 60, min: 1, max: 500, step: 1 },     obj_holder_time: { value: 14, min: 1, max: 120, step: 1 },
  obj_holder_price: { value: 26, min: 1, max: 500, step: 1 }, obj_holder_plan: { value: 120, min: 0, max: 5000, step: 10 },
  obj_dragon_g: { value: 90, min: 1, max: 500, step: 1 },     obj_dragon_time: { value: 22, min: 1, max: 120, step: 1 },
  obj_dragon_price: { value: 45, min: 1, max: 500, step: 1 }, obj_dragon_plan: { value: 300, min: 0, max: 5000, step: 10 },
  obj_gear_g: { value: 70, min: 1, max: 500, step: 1 },       obj_gear_time: { value: 18, min: 1, max: 120, step: 1 },
  obj_gear_price: { value: 48, min: 1, max: 500, step: 1 },   obj_gear_plan: { value: 600, min: 0, max: 5000, step: 10 },
  obj_helmet_g: { value: 300, min: 1, max: 1000, step: 5 },   obj_helmet_time: { value: 60, min: 1, max: 240, step: 1 },
  obj_helmet_price: { value: 220, min: 1, max: 2000, step: 5 }, obj_helmet_plan: { value: 1500, min: 0, max: 10000, step: 50 },
  obj_drone_g: { value: 150, min: 1, max: 1000, step: 5 },    obj_drone_time: { value: 40, min: 1, max: 240, step: 1 },
  obj_drone_price: { value: 200, min: 1, max: 2000, step: 5 }, obj_drone_plan: { value: 4000, min: 0, max: 20000, step: 100 },

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
  pr_ind_maint:     { value: 50,  min: 0, max: 500, step: 5 },
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
};
