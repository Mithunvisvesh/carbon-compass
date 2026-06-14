export const STATIC_FALLBACKS = {
  transport: {
    coachInsight: "Your transport choices represent your biggest opportunity. Small adjustments in how you commute—like swapping a couple of solo scooter/car trips for public transit or cycling—will dramatically lower your weekly emissions without requiring an expensive electric vehicle transition.",
    challenges: [
      {
        id: "trans_bus_day",
        title: "Transit Tuesday",
        category: "transport",
        description: "Swap your private scooter or car commute for the public bus or electric train just one day this week.",
        timeRequirement: "10 min setup",
        cost: "Saves money",
        impactSavedKg: 4.5,
      },
      {
        id: "trans_cycle_short",
        title: "Active Commute",
        category: "transport",
        description: "Cycle or walk for short errand trips (under 2 km) instead of using a motor vehicle.",
        timeRequirement: "5 min action",
        cost: "Free",
        impactSavedKg: 2.2,
      },
      {
        id: "trans_tire_pressure",
        title: "Tire Pressure Check",
        category: "transport",
        description: "Check and inflate your vehicle's tires to correct specifications. Under-inflated tires waste up to 3% fuel.",
        timeRequirement: "5 min action",
        cost: "Under ₹100",
        impactSavedKg: 1.8,
      }
    ]
  },
  energy: {
    coachInsight: "Home energy use is your primary carbon driver. By optimizing high-draw appliances like ACs and geysers and eliminating standby power ('phantom loads'), you can make a major impact while reducing your electricity bills.",
    challenges: [
      {
        id: "energy_ac_24",
        title: "The 24°C Sweet Spot",
        category: "energy",
        description: "Set your AC temperature to 24°C or higher instead of 21°C. Every degree higher saves about 6% of electricity.",
        timeRequirement: "10 sec action",
        cost: "Saves money",
        impactSavedKg: 5.4,
      },
      {
        id: "energy_phantom",
        title: "Unplug Phantom Loads",
        category: "energy",
        description: "Unplug active chargers, TV, microwave, and computer routers overnight or when not in use.",
        timeRequirement: "2 min action",
        cost: "Free",
        impactSavedKg: 1.5,
      },
      {
        id: "energy_led_swap",
        title: "LED Upgrade",
        category: "energy",
        description: "Replace one high-use traditional incandescent bulb with a 9W LED bulb (saves up to 85% energy).",
        timeRequirement: "5 min setup",
        cost: "Under ₹150",
        impactSavedKg: 2.0,
      }
    ]
  },
  diet: {
    coachInsight: "Dietary footprint is a powerful lever. You don't need to go fully vegan overnight—simply replacing high-impact meat meals with plant-based protein or vegetarian options a few times a week yields significant carbon reductions.",
    challenges: [
      {
        id: "diet_green_monday",
        title: "Meatless Day",
        category: "diet",
        description: "Eat completely plant-based (vegan) or vegetarian for one full day this week.",
        timeRequirement: "10 min planning",
        cost: "Saves money",
        impactSavedKg: 4.3,
      },
      {
        id: "diet_dairy_swap",
        title: "Dairy Alternative",
        category: "diet",
        description: "Swap dairy milk for oat, soy, or coconut milk in your morning tea or coffee for the week.",
        timeRequirement: "2 min action",
        cost: "Under ₹200",
        impactSavedKg: 1.2,
      },
      {
        id: "diet_local_produce",
        title: "Local Plate",
        category: "diet",
        description: "Buy locally grown vegetables from a local market (mandi) instead of imported packaged foods.",
        timeRequirement: "10 min visit",
        cost: "Free/Saves money",
        impactSavedKg: 1.6,
      }
    ]
  },
  waste: {
    coachInsight: "Food waste represents a massive carbon leak. When food decomposes in landfills, it releases methane (a potent greenhouse gas). Managing portions and planning meals can easily plug this leak.",
    challenges: [
      {
        id: "waste_portion_control",
        title: "Plate Check",
        category: "waste",
        description: "Serve 20% smaller portions initially during meals. You can always take seconds, but this prevents leftover waste.",
        timeRequirement: "1 min action",
        cost: "Free",
        impactSavedKg: 3.5,
      },
      {
        id: "waste_fridge_audit",
        title: "Eat-Me-First Box",
        category: "waste",
        description: "Designate a container in your fridge for ingredients close to expiring and commit to using them first.",
        timeRequirement: "5 min setup",
        cost: "Free",
        impactSavedKg: 2.5,
      },
      {
        id: "waste_banana_peels",
        title: "Portion Planning",
        category: "waste",
        description: "Write down a meal plan for the next 3 days before grocery shopping to avoid over-buying fresh greens.",
        timeRequirement: "8 min action",
        cost: "Saves money",
        impactSavedKg: 2.0,
      }
    ]
  }
};
