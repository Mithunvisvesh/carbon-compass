// Curated Sustainability Challenges Database (80+ items)
// Schema: { id, title, category, description, difficulty, estimatedTime, estimatedCost, estimatedImpactKg, eligibilityRules }

export const ALL_CHALLENGES = [
  // --- TRANSPORT (21 Challenges) ---
  {
    id: "trans_tire_pressure",
    title: "Tire Pressure Check",
    category: "transport",
    description: "Check and inflate your vehicle's tires to correct specifications. Correct inflation improves fuel efficiency by 3%.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.8,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_eco_driving",
    title: "Eco-Driving Mode",
    category: "transport",
    description: "Drive smoothly: keep speeds under 60 km/h and avoid rapid acceleration. Saves up to 15% fuel.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.1,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_idle_engine",
    title: "Zero-Idle Commute",
    category: "transport",
    description: "Turn off your engine at red lights if the wait time is longer than 15 seconds.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.2,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_walk_short",
    title: "Short Errands Walk",
    category: "transport",
    description: "Commit to walking for any errands or shopping trips that are less than 1.5 km away.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.5,
    eligibilityRules: {}
  },
  {
    id: "trans_luggage_clear",
    title: "Lighten the Load",
    category: "transport",
    description: "Remove unnecessary heavy items from your car trunk or scooter storage. Heavy vehicles burn more fuel.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.1,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_speed_limit",
    title: "Speed Cap Challenge",
    category: "transport",
    description: "Limit highway speeds to 90 km/h. Fuel consumption increases rapidly above this speed threshold.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.4,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_route_plan",
    title: "Smart Route Planning",
    category: "transport",
    description: "Combine multiple single errands into one contiguous circular trip to avoid cold engine starts.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.8,
    eligibilityRules: {}
  },
  {
    id: "trans_metro_card",
    title: "Metro Card Recharge",
    category: "transport",
    description: "Keep your public transit card recharged and in your wallet to reduce friction for sudden transit trips.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.0,
    eligibilityRules: {}
  },
  {
    id: "trans_carpool_one",
    title: "Carpool Buddy Swap",
    category: "transport",
    description: "Share your ride with a colleague or friend for at least one commute trip this week.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 5.2,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_active_errand",
    title: "Active Commute Errand",
    category: "transport",
    description: "Cycle or walk for a short trip instead of turning on your vehicle engine.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.5,
    eligibilityRules: {}
  },
  {
    id: "trans_bus_trial",
    title: "Transit Wednesday",
    category: "transport",
    description: "Substitute your private car or scooter commute with a public bus or electric train for one day.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 4.5,
    eligibilityRules: {}
  },
  {
    id: "trans_air_filter",
    title: "Air Filter Check",
    category: "transport",
    description: "Inspect and replace your vehicle's dirty engine air filter. Restores fuel mileage by up to 10%.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 2.3,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_park_and_ride",
    title: "Park and Ride Transit",
    category: "transport",
    description: "Drive your car to the nearest metro station and use the train for the heavy traffic portion of your trip.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 6.2,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_electric_cab",
    title: "Green Cab Choice",
    category: "transport",
    description: "When booking a ride-share app, select an electric vehicle (EV) option instead of a combustion vehicle.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 2.2,
    eligibilityRules: {}
  },
  {
    id: "trans_scooter_tune",
    title: "Scooter Tune-Up",
    category: "transport",
    description: "Get your scooter serviced: oil change and spark plug check. Restores combustion efficiency.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.5,
    eligibilityRules: { requiresScooter: true }
  },
  {
    id: "trans_bike_share",
    title: "Bike Share Trial",
    category: "transport",
    description: "Use a local public bicycle sharing station for a short commute leg rather than booking an auto-rickshaw.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.9,
    eligibilityRules: {}
  },
  {
    id: "trans_train_swap",
    title: "Metro Master Class",
    category: "transport",
    description: "Swap 3 private car commute trips for metro or electric train travel this week.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 12.0,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_bike_commute",
    title: "Cycle to Work Day",
    category: "transport",
    description: "Cycle all the way to work or study at least one day this week (aim for trips under 8 km).",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 10.0,
    eligibilityRules: {}
  },
  {
    id: "trans_remote_work",
    title: "WFC: Work from Home",
    category: "transport",
    description: "Secure permission to work from home for two days this week to completely eliminate travel emissions.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 15.0,
    eligibilityRules: {}
  },
  {
    id: "trans_car_pool_multi",
    title: "Office Pool Operator",
    category: "transport",
    description: "Organize a recurring carpool group with 3 colleagues from your neighborhood for the entire week.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 14.5,
    eligibilityRules: { requiresCar: true }
  },
  {
    id: "trans_no_drive_day",
    title: "No-Drive Week",
    category: "transport",
    description: "Leave your private car parked in the garage for the entire week. Rely on transit, walking, and active mobility.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 11.5,
    eligibilityRules: { requiresCar: true }
  },

  // --- ENERGY (21 Challenges) ---
  {
    id: "energy_ac_24",
    title: "The 24°C Comfort Spot",
    category: "energy",
    description: "Set your AC to 24°C or 25°C instead of 21°C. Every degree higher saves 6% cooling electricity.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 5.4,
    eligibilityRules: {}
  },
  {
    id: "energy_plug_off",
    title: "Phantom Load Purge",
    category: "energy",
    description: "Unplug your active laptop chargers, TV set-top box, and microwave switches before going to bed.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.5,
    eligibilityRules: {}
  },
  {
    id: "energy_fridge_temp",
    title: "Fridge Optimization",
    category: "energy",
    description: "Set fridge temperature to 3-4°C and freezer to -18°C. Over-cooling wastes valuable compressor electricity.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.6,
    eligibilityRules: {}
  },
  {
    id: "energy_natural_light",
    title: "Sunlit Desk",
    category: "energy",
    description: "Work or read near a window during daylight hours. Keep overhead bulbs switched off until dusk.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.9,
    eligibilityRules: {}
  },
  {
    id: "energy_ceiling_fan",
    title: "Fan Over AC",
    category: "energy",
    description: "Use a ceiling fan on medium speed alongside a higher AC setting (26°C) to simulate a lower temperature.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.3,
    eligibilityRules: {}
  },
  {
    id: "energy_laptop_sleep",
    title: "Eco Power Settings",
    category: "energy",
    description: "Adjust computer settings to force screen sleep after 2 minutes and computer sleep after 10 minutes.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.8,
    eligibilityRules: {}
  },
  {
    id: "energy_cook_lid",
    title: "Put a Lid on It",
    category: "energy",
    description: "Always cook with a lid on your pots and pans. It traps steam, heating meals 30% faster and saving gas.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.2,
    eligibilityRules: {}
  },
  {
    id: "energy_ac_timer",
    title: "AC Sleep Timer",
    category: "energy",
    description: "Configure your AC's sleep timer to shut off automatically 2 hours before your morning alarm.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.8,
    eligibilityRules: {}
  },
  {
    id: "energy_led_swap",
    title: "Lightbulb Revolution",
    category: "energy",
    description: "Replace one high-use traditional incandescent bulb with a 9W LED bulb (saves up to 85% energy).",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 2.0,
    eligibilityRules: {}
  },
  {
    id: "energy_cold_wash",
    title: "Cold Water Cycle",
    category: "energy",
    description: "Run all washing machine loads on the 'Cold' wash setting. 90% of washer energy goes to heating water.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 1.8,
    eligibilityRules: {}
  },
  {
    id: "energy_ac_filter",
    title: "Clean the AC Filter",
    category: "energy",
    description: "Slide out and wash your split AC unit's plastic air filters. Dust accumulation increases fan load.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 3.2,
    eligibilityRules: {}
  },
  {
    id: "energy_dryer_line",
    title: "Solar Clothes Drying",
    category: "energy",
    description: "Air-dry your washed laundry on a clothesline in the sun instead of running a hot tumbling dryer cycle.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.4,
    eligibilityRules: {}
  },
  {
    id: "energy_water_temp",
    title: "Geyser Calibration",
    category: "energy",
    description: "Lower your geyser's thermostat setting to 48°C. Prevents scalding and saves idle standby gas/power.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 3.1,
    eligibilityRules: {}
  },
  {
    id: "energy_geyser_timer",
    title: "15-Min Geyser Rule",
    category: "energy",
    description: "Turn on the bathroom geyser only 15 minutes before bathing, and turn it off immediately after.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 4.5,
    eligibilityRules: {}
  },
  {
    id: "energy_microwave_use",
    title: "Microwave Defrosting",
    category: "energy",
    description: "Thaw frozen food naturally in the fridge overnight rather than using a high-wattage microwave defrost cycle.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.1,
    eligibilityRules: {}
  },
  {
    id: "energy_peak_hours",
    title: "Peak-Load Shift",
    category: "energy",
    description: "Avoid running washing machines, vacuum cleaners, or irons during local grid peak hours (6 PM - 10 PM).",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 2.2,
    eligibilityRules: {}
  },
  {
    id: "energy_insulate_doors",
    title: "Draft Stopper Setup",
    category: "energy",
    description: "Install weather stripping or door-bottom seals on AC rooms to prevent cool air leakage.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 3.5,
    eligibilityRules: {}
  },
  {
    id: "energy_power_audit",
    title: "Household Power Audit",
    category: "energy",
    description: "Track your electricity meter reading for 7 consecutive days to identify sudden household consumption spikes.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 1.9,
    eligibilityRules: {}
  },
  {
    id: "energy_solar_garden",
    title: "Solar Balcony Light",
    category: "energy",
    description: "Replace one high-use balcony or garden light with a standalone solar sensor light.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Moderate",
    estimatedImpactKg: 6.8,
    eligibilityRules: {}
  },
  {
    id: "energy_led_tubelight",
    title: "T5 LED Tube Retrofit",
    category: "energy",
    description: "Replace one old magnetic-ballast tubelight fixture with a modern energy-efficient T5 LED tubelight.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Moderate",
    estimatedImpactKg: 7.5,
    eligibilityRules: {}
  },
  {
    id: "energy_solar_charger",
    title: "Solar Device Charger",
    category: "energy",
    description: "Use a small portable solar panel charger on your balcony to recharge all home smartphones/tablets.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Moderate",
    estimatedImpactKg: 4.0,
    eligibilityRules: {}
  },

  // --- DIET (21 Challenges) ---
  {
    id: "diet_dairy_alt",
    title: "Plant-Based Tea",
    category: "diet",
    description: "Swap dairy milk for oat, soy, or coconut milk in your morning tea or coffee for the week.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.2,
    eligibilityRules: { dairyEaterOnly: true }
  },
  {
    id: "diet_local_veg",
    title: "Seasonal Mandi Purchase",
    category: "diet",
    description: "Buy fresh local seasonal vegetables from the local mandi rather than imported packaged foods.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.6,
    eligibilityRules: {}
  },
  {
    id: "diet_seasonal_eat",
    title: "Seasonal Salad Bowl",
    category: "diet",
    description: "Eat a salad composed entirely of locally harvested, seasonal items (no greenhouse-grown imports).",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.4,
    eligibilityRules: {}
  },
  {
    id: "diet_oatmeal_break",
    title: "Vegan Breakfast Starter",
    category: "diet",
    description: "Eat oatmeal prepared with water or plant milk and fresh local fruit for breakfast for 4 days.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.1,
    eligibilityRules: {}
  },
  {
    id: "diet_water_pitcher",
    title: "Filtered Water Switch",
    category: "diet",
    description: "Carry a reusable metal bottle filled from home filters instead of buying single-use bottled mineral water.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.5,
    eligibilityRules: {}
  },
  {
    id: "diet_tea_herbal",
    title: "Herbal Infusion Swap",
    category: "diet",
    description: "Drink herbal tea (mint, tulsi, lemongrass) sourced locally instead of imported black/green tea brands.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.7,
    eligibilityRules: {}
  },
  {
    id: "diet_bulk_grains",
    title: "Bulk Grains Selection",
    category: "diet",
    description: "Purchase staples like rice and dal in bulk paper packaging instead of small plastic packets.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.3,
    eligibilityRules: {}
  },
  {
    id: "diet_nut_butter",
    title: "Peanut Butter Protein",
    category: "diet",
    description: "Use home-ground peanut butter as a snack spread instead of dairy butter or processed cheese.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 0.9,
    eligibilityRules: {}
  },
  {
    id: "diet_meatless_mon",
    title: "Meat-Free Monday",
    category: "diet",
    description: "Commit to eating 100% vegetarian or vegan meals (zero meat or fish) for one entire day.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 4.3,
    eligibilityRules: { meatEaterOnly: true }
  },
  {
    id: "diet_poultry_swap",
    title: "Swap Red Meat for Chicken",
    category: "diet",
    description: "Swap red meat (beef, mutton, pork) with poultry (chicken) for all non-vegetarian meals this week.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 6.5,
    eligibilityRules: { meatEaterOnly: true }
  },
  {
    id: "diet_plant_lunch",
    title: "Plant-Powered Lunchbox",
    category: "diet",
    description: "Pack a completely plant-based lunch (dal, sabzi, roti) for your work/school meals for 3 days.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.5,
    eligibilityRules: {}
  },
  {
    id: "diet_no_packaged",
    title: "Zero Packaged Foods",
    category: "diet",
    description: "Avoid processed, packaged convenience snacks (chips, biscuits) for the entire week. Eat fresh fruits/nuts.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 2.1,
    eligibilityRules: {}
  },
  {
    id: "diet_home_cook",
    title: "Kitchen Master Class",
    category: "diet",
    description: "Prepare all your meals at home for 5 days instead of ordering takeout (avoids delivery transit and packaging).",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 3.0,
    eligibilityRules: {}
  },
  {
    id: "diet_organic_mandi",
    title: "Organic Market Visit",
    category: "diet",
    description: "Visit an organic farm market or local cooperative to purchase pesticide-free grains.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.8,
    eligibilityRules: {}
  },
  {
    id: "diet_poultry_dinner",
    title: "Poultry Portion Shift",
    category: "diet",
    description: "Reduce your meat portion sizes by 30%, compensating with extra servings of roasted vegetables or dal.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 3.2,
    eligibilityRules: { meatEaterOnly: true }
  },
  {
    id: "diet_tofu_soy",
    title: "Soy/Tofu Experiment",
    category: "diet",
    description: "Cook one family dinner substituting chicken/paneer with high-protein soy chunks or organic tofu.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 2.4,
    eligibilityRules: {}
  },
  {
    id: "diet_beans_lentils",
    title: "Legume Powerhouse",
    category: "diet",
    description: "Replace meat/cheese with high-protein lentils, chickpeas, or kidney beans for three dinners this week.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 8.2,
    eligibilityRules: {}
  },
  {
    id: "diet_vegan_day",
    title: "The Vegan Test Run",
    category: "diet",
    description: "Eat completely plant-based (vegan - no meat, dairy, eggs, or honey) for one entire day.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 6.0,
    eligibilityRules: {}
  },
  {
    id: "diet_low_dairy_week",
    title: "Dairy Reduction Protocol",
    category: "diet",
    description: "Cut down your dairy consumption (milk, paneer, butter, cheese) by 50% for the next 7 days.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 4.8,
    eligibilityRules: { dairyEaterOnly: true }
  },
  {
    id: "diet_zero_beef",
    title: "Zero Red Meat Week",
    category: "diet",
    description: "Keep red meat (mutton, beef, pork) completely off your plate for the entire week to slash core food emissions.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 15.2,
    eligibilityRules: { meatEaterOnly: true }
  },
  {
    id: "diet_plant_milk_shake",
    title: "Plant Milk Smoothie",
    category: "diet",
    description: "Make a breakfast smoothie using home-blended coconut milk or almond paste instead of cow's milk.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.0,
    eligibilityRules: {}
  },

  // --- WASTE (21 Challenges) ---
  {
    id: "waste_plate_check",
    title: "The 80% Plate Rule",
    category: "waste",
    description: "Serve 20% smaller initial portions during meals. It is easy to take seconds, but prevents scrape waste.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 3.5,
    eligibilityRules: { minFoodWaste: 0.5 }
  },
  {
    id: "waste_first_box",
    title: "Eat-Me-First Fridge Box",
    category: "waste",
    description: "Designate a clear container in your fridge for ingredients close to expiring and use them first.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.5,
    eligibilityRules: { minFoodWaste: 0.5 }
  },
  {
    id: "waste_overbuy_check",
    title: "Inventory Check",
    category: "waste",
    description: "Check your pantry and vegetable crisper before buying groceries to avoid purchasing duplicate items.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.8,
    eligibilityRules: {}
  },
  {
    id: "waste_leftover_lunch",
    title: "Leftover Lunch Swap",
    category: "waste",
    description: "Commit to eating last night's dinner leftovers for today's lunch instead of cooking/ordering fresh food.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.2,
    eligibilityRules: { minFoodWaste: 0.5 }
  },
  {
    id: "waste_dry_herbs",
    title: "Herb Preservation",
    category: "waste",
    description: "Dry out wilting fresh coriander or mint leaves in the shade and store in jars rather than discarding.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.9,
    eligibilityRules: {}
  },
  {
    id: "waste_bread_crumbs",
    title: "Stale Bread Utility",
    category: "waste",
    description: "Convert stale bread ends into homemade breadcrumbs by blending and roasting them in an oven/pan.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.0,
    eligibilityRules: {}
  },
  {
    id: "waste_bulk_bags",
    title: "Reusable Bag Habit",
    category: "waste",
    description: "Place three cloth bags near your door or in your vehicle so you never buy plastic carry bags.",
    difficulty: "Easy",
    estimatedTime: "Under 2 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.8,
    eligibilityRules: {}
  },
  {
    id: "waste_rinse_jars",
    title: "Jar Clean Out",
    category: "waste",
    description: "Rinse and reuse clean glass jars (jam, sauce) to store spices and dry beans in the kitchen.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.7,
    eligibilityRules: {}
  },
  {
    id: "waste_meal_plan",
    title: "Three-Day Meal Plan",
    category: "waste",
    description: "Draft a simple meal list for the next 3 days to buy only the exact produce and greens required.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.0,
    eligibilityRules: {}
  },
  {
    id: "waste_veggie_stock",
    title: "Vegetable Stock Freezer Box",
    category: "waste",
    description: "Save clean vegetable peelings and cut ends in a freezer bag. Boil them once full to make homemade stock.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.5,
    eligibilityRules: {}
  },
  {
    id: "waste_portion_scale",
    title: "Portion Measurement",
    category: "waste",
    description: "Measure dry rice and pasta portions using a measuring cup before cooking to avoid over-preparing.",
    difficulty: "Medium",
    estimatedTime: "Under 2 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.4,
    eligibilityRules: {}
  },
  {
    id: "waste_freeze_produce",
    title: "Smart Freezing",
    category: "waste",
    description: "Dice and freeze near-expiry onions, tomatoes, or ginger. Frozen aromatics cook perfectly in future curries.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.7,
    eligibilityRules: {}
  },
  {
    id: "waste_smart_grocery",
    title: "Ugly Produce Selection",
    category: "waste",
    description: "Purchase slightly imperfect or single bananas/apples. These are usually discarded by markets if unsold.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 2.1,
    eligibilityRules: {}
  },
  {
    id: "waste_recycle_seg",
    title: "Waste Segregation Setup",
    category: "waste",
    description: "Set up separate bins for dry recyclables (paper, plastic) and wet organic scraps in your kitchen.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 1.2,
    eligibilityRules: {}
  },
  {
    id: "waste_banana_peel_water",
    title: "Banana Peel Fertilizer",
    category: "waste",
    description: "Soak banana skins in a jar of water for 48 hours to make a potassium-rich feed for home potted plants.",
    difficulty: "Easy",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 0.6,
    eligibilityRules: {}
  },
  {
    id: "waste_eco_wrap",
    title: "Beeswax Wrap Transition",
    category: "waste",
    description: "Swap disposable aluminium foil and cling-wrap for reusable fabric beeswax sheets to cover food bowls.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 1.1,
    eligibilityRules: {}
  },
  {
    id: "waste_zero_plastic_day",
    title: "Plastic-Free Shopping",
    category: "waste",
    description: "Shop at loose markets and use fabric bags. Do not bring a single piece of soft plastic wrapping home this week.",
    difficulty: "Medium",
    estimatedTime: "Weekly task",
    estimatedCost: "Free",
    estimatedImpactKg: 2.3,
    eligibilityRules: {}
  },
  {
    id: "waste_donation_share",
    title: "Excess Food Share",
    category: "waste",
    description: "If you have unserved excess catering or party food, pack it and distribute it to local workers immediately.",
    difficulty: "Medium",
    estimatedTime: "Under 10 min",
    estimatedCost: "Free",
    estimatedImpactKg: 3.0,
    eligibilityRules: {}
  },
  {
    id: "waste_compost",
    title: "Aerobic Compost Bin",
    category: "waste",
    description: "Start a simple organic waste composting container using soil and kitchen peels. Keeps organic matter out of dumps.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 8.5,
    eligibilityRules: { minFoodWaste: 1.5 }
  },
  {
    id: "waste_compost_worms",
    title: "Vermicomposting Project",
    category: "waste",
    description: "Introduce earthworms to a shaded organic waste bin to accelerate waste-to-humus fertilizer conversion.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Moderate",
    estimatedImpactKg: 9.0,
    eligibilityRules: { minFoodWaste: 2.0 }
  },
  {
    id: "waste_canning_pres",
    title: "Tomato Preservation",
    category: "waste",
    description: "Boil and preserve excess seasonal tomatoes as a jarred puree to prevent rot and secure off-season supply.",
    difficulty: "Advanced",
    estimatedTime: "Weekly task",
    estimatedCost: "Low Cost",
    estimatedImpactKg: 4.2,
    eligibilityRules: {}
  }
];

// Phase 1: Opportunity score calculator
export function calculateOpportunityScores(breakdown, inputs) {
  const safeInputs = inputs || {};
  const transportInputs = safeInputs.transport || {};

  // 1. Transport Opportunity
  const carKm = (parseFloat(transportInputs.petrolCar) || 0) + (parseFloat(transportInputs.dieselCar) || 0);
  const scooterKm = (parseFloat(transportInputs.petrolScooter) || 0) + (parseFloat(transportInputs.motorcycle) || 0);
  const isDriver = carKm > 0 || scooterKm > 0;
  
  let transportOpp = 0;
  if (isDriver) {
    const privateEmissions = parseFloat(breakdown.transport) || 0;
    const ease = carKm > 0 ? 0.7 : 0.8;
    transportOpp = privateEmissions * ease;
  } else {
    transportOpp = (parseFloat(breakdown.transport) || 0) * 0.1;
  }

  // 2. Energy Opportunity
  const energyEmissions = parseFloat(breakdown.energy) || 0;
  const energyEase = 0.9;
  const energyOpp = energyEmissions * energyEase;

  // 3. Diet Opportunity
  const dietType = safeInputs.diet || 'medium_meat';
  let dietPotential = 0;
  let dietEase = 0.8;

  if (dietType === 'high_meat') {
    dietPotential = (7.19 - 3.81) * 7; // potential reduction to vegetarian level
  } else if (dietType === 'medium_meat') {
    dietPotential = (5.63 - 3.81) * 7;
  } else if (dietType === 'low_meat' || dietType === 'fish') {
    dietPotential = (4.67 - 3.81) * 7;
  } else if (dietType === 'vegetarian') {
    dietPotential = (3.81 - 2.89) * 7; // potential reduction to vegan level
    dietEase = 0.6;
  } else {
    dietPotential = 0; // already vegan
    dietEase = 0.1;
  }
  const dietOpp = dietPotential * dietEase;

  // 4. Waste Opportunity
  const wasteEmissions = parseFloat(breakdown.waste) || 0;
  const wasteEase = 0.95;
  const wasteOpp = wasteEmissions * wasteEase;

  return {
    transport: parseFloat(transportOpp.toFixed(1)),
    energy: parseFloat(energyOpp.toFixed(1)),
    diet: parseFloat(dietOpp.toFixed(1)),
    waste: parseFloat(wasteOpp.toFixed(1))
  };
}

// Phase 2: Challenge selection algorithm (1 Easy, 1 Medium, 1 Advanced)
export function selectCuratedChallenges(profile, breakdown, opportunityScores) {
  const inputs = profile?.baselineInputs || {};
  const transportInputs = inputs.transport || {};
  const carKm = (parseFloat(transportInputs.petrolCar) || 0) + (parseFloat(transportInputs.dieselCar) || 0);
  const scooterKm = (parseFloat(transportInputs.petrolScooter) || 0) + (parseFloat(transportInputs.motorcycle) || 0);
  const isCarDriver = carKm > 0;
  const isScooterDriver = scooterKm > 0;
  const dietType = inputs.diet || 'medium_meat';
  const foodWaste = parseFloat(inputs.waste?.foodWasteKgPerWeek) || 0;

  // Filter based on eligibility rules
  const eligible = ALL_CHALLENGES.filter(c => {
    if (c.eligibilityRules) {
      if (c.eligibilityRules.requiresCar && !isCarDriver) return false;
      if (c.eligibilityRules.requiresScooter && !isScooterDriver) return false;
      if (c.eligibilityRules.meatEaterOnly && (dietType === 'vegetarian' || dietType === 'vegan')) return false;
      if (c.eligibilityRules.dairyEaterOnly && dietType === 'vegan') return false;
      if (c.eligibilityRules.minFoodWaste && foodWaste < c.eligibilityRules.minFoodWaste) return false;
    }
    return true;
  });

  // Sort categories by Opportunity Score descending
  const sortedCategories = Object.entries(opportunityScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  const highestOppCategory = sortedCategories[0] || 'energy';
  const secondOppCategory = sortedCategories[1] || highestOppCategory;

  // Filter pools
  let easyPool = eligible.filter(c => c.difficulty === 'Easy' && c.category === highestOppCategory);
  let mediumPool = eligible.filter(c => c.difficulty === 'Medium' && c.category === secondOppCategory);
  let advancedPool = eligible.filter(c => c.difficulty === 'Advanced' && c.category === highestOppCategory);

  // Fallback to random if pools are empty due to strict filtering
  if (!easyPool.length) easyPool = eligible.filter(c => c.difficulty === 'Easy' && (c.category === highestOppCategory || c.category === secondOppCategory));
  if (!easyPool.length) easyPool = eligible.filter(c => c.difficulty === 'Easy');

  if (!mediumPool.length) mediumPool = eligible.filter(c => c.difficulty === 'Medium' && (c.category === secondOppCategory || c.category === highestOppCategory));
  if (!mediumPool.length) mediumPool = eligible.filter(c => c.difficulty === 'Medium');

  if (!advancedPool.length) advancedPool = eligible.filter(c => c.difficulty === 'Advanced' && (c.category === highestOppCategory || c.category === secondOppCategory));
  if (!advancedPool.length) advancedPool = eligible.filter(c => c.difficulty === 'Advanced');

  // Select one random from each pool
  const selectRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const selectedEasy = selectRandom(easyPool);
  
  // Make sure medium is not identical to easy if categories overlap
  let selectedMedium = selectRandom(mediumPool);
  let retries = 0;
  while (selectedMedium && selectedEasy && selectedMedium.id === selectedEasy.id && retries < 10) {
    selectedMedium = selectRandom(mediumPool);
    retries++;
  }

  // Make sure advanced is not identical to others
  let selectedAdvanced = selectRandom(advancedPool);
  retries = 0;
  while (selectedAdvanced && (selectedAdvanced.id === selectedEasy.id || selectedAdvanced.id === selectedMedium?.id) && retries < 10) {
    selectedAdvanced = selectRandom(advancedPool);
    retries++;
  }

  return [selectedEasy, selectedMedium, selectedAdvanced].filter(Boolean);
}

// Phase 3: Rule-based personalization engine (Insight generator)
export function generateSmartCoachInsight({ profile, breakdown, opportunityScores, selectedChallenges }) {
  const name = profile?.name || 'Explorer';
  const inputs = profile?.baselineInputs || {};
  const dietType = inputs.diet || 'medium_meat';
  const routine = profile?.routineDescription || '';
  
  // Sort categories by Opportunity Score descending
  const sortedOpp = Object.entries(opportunityScores).sort((a, b) => b[1] - a[1]);
  const primaryOppCategory = sortedOpp[0][0];
  const primaryOppVal = sortedOpp[0][1];

  let insightParts = [];

  // Paragraph 1: Celebration & Commendation
  let celebration = `Hello ${name}! Let's examine your weekly carbon profile. `;
  
  const dietPraises = {
    vegan: "Your strictly plant-based vegan diet is the gold standard for personal sustainability, saving significant agricultural emissions and water resources. ",
    vegetarian: "Choosing a vegetarian diet is an outstanding choice that keeps your food footprint dramatically lower than standard meat-heavy diets. ",
    low_meat: "By maintaining a low-meat diet, you are already avoiding the most carbon-intensive food categories. "
  };
  
  if (dietPraises[dietType]) {
    celebration += dietPraises[dietType];
  } else {
    celebration += "We've mapped your habits to identify your absolute best carbon leverage points. ";
  }

  // Commend clean transport
  const carKm = (parseFloat(inputs.transport?.petrolCar) || 0) + (parseFloat(inputs.transport?.dieselCar) || 0);
  const scooterKm = (parseFloat(inputs.transport?.petrolScooter) || 0) + (parseFloat(inputs.transport?.motorcycle) || 0);
  if (carKm === 0 && scooterKm === 0) {
    celebration += "Commuting via public transit, walking, or cycling is a major environmental win, keeping your transport footprint exceptionally clean. ";
  }

  insightParts.push(celebration);

  // Paragraph 2: Diagnosis Block
  let diagnosis = "";
  if (primaryOppCategory === 'transport') {
    diagnosis += `Your primary carbon driver and greatest opportunity lies in **transportation** (Opportunity Score: ${primaryOppVal}). Private vehicle commutes, particularly driving a car, release significant tailpipe CO2. `;
    if (routine.toLowerCase().includes('car') || routine.toLowerCase().includes('drive') || routine.toLowerCase().includes('commute')) {
      diagnosis += "Since you drive as part of your regular routine, optimizing how you travel will result in large, immediate carbon savings. ";
    }
  } else if (primaryOppCategory === 'energy') {
    diagnosis += `Your highest leverage point is **home energy** (Opportunity Score: ${primaryOppVal}). Heavy appliance use, standby phantom loads, and water heating represent high-draw electrical loads in Indian grids. `;
    if (routine.toLowerCase().includes('ac') || routine.toLowerCase().includes('air conditioner') || routine.toLowerCase().includes('electricity')) {
      diagnosis += "Since cooling or electricity makes up a significant part of your household profile, adjusting settings will yield large reductions. ";
    }
  } else if (primaryOppCategory === 'diet') {
    diagnosis += `Your greatest carbon opportunity is in your **diet** (Opportunity Score: ${primaryOppVal}). Meat consumption carries a heavy carbon footprint due to animal agriculture. `;
    if (dietType === 'high_meat') {
      diagnosis += "Since your diet is meat-heavy, substituting even a few meals a week with plant-based protein represents a highly actionable and impactful shift. ";
    }
  } else if (primaryOppCategory === 'waste') {
    diagnosis += `Your absolute best target is reducing **food waste** (Opportunity Score: ${primaryOppVal}). Food discarded to landfills decomposes to release methane, a greenhouse gas 28 times more potent than carbon dioxide. `;
    if (parseFloat(inputs.waste?.foodWasteKgPerWeek) > 2) {
      diagnosis += `Your estimated food waste of ${inputs.waste.foodWasteKgPerWeek} kg per week is a key carbon leak that can be easily plugged. `;
    }
  }
  insightParts.push(diagnosis);

  // Paragraph 3: Specific Recommendations & Why they matter
  let recommendationsText = "Based on this opportunity analysis, I've curated three distinct, actionable tasks for you. ";
  if (selectedChallenges && selectedChallenges.length > 0) {
    const easyTitle = selectedChallenges[0]?.title || 'Quick Win';
    const medTitle = selectedChallenges[1]?.title || 'Sustainable Habit';
    const advTitle = selectedChallenges[2]?.title || 'High Impact Action';
    recommendationsText += `We'll start with an easy win: **${easyTitle}**, which requires minimal time or effort. Next, we will introduce a medium-difficulty habit: **${medTitle}** to build consistency. Finally, we challenge you to complete **${advTitle}**, which targets significant, long-term carbon reduction. `;
  }
  
  const totalPotentialSaving = selectedChallenges.reduce((acc, c) => acc + (c?.estimatedImpactKg || 0), 0);
  recommendationsText += `By completing these three habits this week, you have the potential to prevent **${totalPotentialSaving.toFixed(1)} kg of CO2e** from entering the atmosphere. Let's make it happen!`;
  
  insightParts.push(recommendationsText);

  return insightParts.join("\n\n");
}
