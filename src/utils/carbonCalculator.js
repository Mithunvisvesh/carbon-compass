// Sourced emission factors
export const EMISSION_FACTORS = {
  // Electricity: kg CO2 per kWh
  electricity: 0.75, // Source: CEA CO2 Baseline Database, India
  
  // LPG: kg CO2 per 14.2kg cylinder
  lpg_cylinder: 42.0, // Source: CarbonCrux / Indian household LPG data (~3 kg CO2/kg LPG)
  
  // Transport modes (g CO2/km) -> converted to kg CO2/km in calculation
  transport: {
    petrolCar: 150,      // Range: 120-180 g CO2/km
    dieselCar: 190,      // Range: 170-220 g CO2/km (India specific average)
    petrolScooter: 42.5, // Range: 35-50 g CO2/km
    motorcycle: 35.0,    // Range: 30-40 g CO2/km (India specific average)
    bus: 89,             // ~89 g CO2/passenger-km
    electricTrain: 12.5, // Range: 10-15 g CO2/passenger-km
    cycling: 33.0,       // Range: 16-50 g CO2/km
    walking: 0.0,        // Negligible
  },
  
  // Diet options (kg CO2e/day) -> multiplied by 7 for weekly footprint
  diet: {
    high_meat: 7.19,    // High meat (>=100g/day)
    medium_meat: 5.63,  // Medium meat (50-99g/day)
    low_meat: 4.67,     // Low meat (<50g/day)
    fish: 3.91,         // Fish-eater
    vegetarian: 3.81,   // Vegetarian
    vegan: 2.89,        // Vegan
  },
  
  // Food waste (kg CO2 per kg food wasted)
  foodWaste: 2.5, // Source: New Food Magazine / Poore & Nemecek (2018)
};

// Regional weekly average carbon footprint per person (in kg CO2e)
// Based on ~5 tons CO2e/year typical urban Indian footprint (urban averages are higher than national averages)
export const REGIONAL_AVERAGES = {
  total: 96.0,
  transport: 25.0,
  energy: 30.0,
  diet: 31.0,
  waste: 10.0,
};

/**
 * Calculates a detailed weekly carbon footprint in kg CO2e.
 * Handles missing fields and null/undefined values gracefully.
 * 
 * @param {Object} inputs
 * @param {Object} inputs.transport - weekly km by travel mode
 * @param {number} [inputs.transport.petrolCar=0]
 * @param {number} [inputs.transport.dieselCar=0]
 * @param {number} [inputs.transport.petrolScooter=0]
 * @param {number} [inputs.transport.motorcycle=0]
 * @param {number} [inputs.transport.bus=0]
 * @param {number} [inputs.transport.electricTrain=0]
 * @param {number} [inputs.transport.cycling=0]
 * @param {number} [inputs.transport.walking=0]
 * 
 * @param {Object} inputs.energy
 * @param {number} [inputs.energy.electricityKwhPerWeek=0]
 * @param {number} [inputs.energy.lpgCylindersPerMonth=0]
 * 
 * @param {string} inputs.diet - 'high_meat' | 'medium_meat' | 'low_meat' | 'fish' | 'vegetarian' | 'vegan'
 * 
 * @param {Object} inputs.waste
 * @param {number} [inputs.waste.foodWasteKgPerWeek=0]
 * 
 * @returns {Object} result
 * @returns {number} result.total - Total weekly footprint in kg CO2e
 * @returns {number} result.transport - Transport subtotal in kg CO2e
 * @returns {number} result.energy - Energy subtotal in kg CO2e
 * @returns {number} result.diet - Diet subtotal in kg CO2e
 * @returns {number} result.waste - Waste subtotal in kg CO2e
 */
export function calculateWeeklyFootprint(inputs) {
  // Safety guard against undefined inputs
  const safeInputs = inputs || {};
  const transportInputs = safeInputs.transport || {};
  const energyInputs = safeInputs.energy || {};
  const wasteInputs = safeInputs.waste || {};
  
  // 1. Calculate Transport Footprint (g CO2/km * km/week / 1000)
  const carKm = parseFloat(transportInputs.petrolCar) || 0;
  const dieselCarKm = parseFloat(transportInputs.dieselCar) || 0;
  const scooterKm = parseFloat(transportInputs.petrolScooter) || 0;
  const motorcycleKm = parseFloat(transportInputs.motorcycle) || 0;
  const busKm = parseFloat(transportInputs.bus) || 0;
  const trainKm = parseFloat(transportInputs.electricTrain) || 0;
  const cycleKm = parseFloat(transportInputs.cycling) || 0;
  const walkKm = parseFloat(transportInputs.walking) || 0;
  
  const transportScore = (
    (carKm * EMISSION_FACTORS.transport.petrolCar) +
    (dieselCarKm * EMISSION_FACTORS.transport.dieselCar) +
    (scooterKm * EMISSION_FACTORS.transport.petrolScooter) +
    (motorcycleKm * EMISSION_FACTORS.transport.motorcycle) +
    (busKm * EMISSION_FACTORS.transport.bus) +
    (trainKm * EMISSION_FACTORS.transport.electricTrain) +
    (cycleKm * EMISSION_FACTORS.transport.cycling) +
    (walkKm * EMISSION_FACTORS.transport.walking)
  ) / 1000;
  
  // 2. Calculate Energy Footprint
  // electricity: kwh_per_week * 0.75
  // lpg: (lpg_cylinders_per_month / 4.33) * 42
  const elecKwh = parseFloat(energyInputs.electricityKwhPerWeek) || 0;
  const lpgCyl = parseFloat(energyInputs.lpgCylindersPerMonth) || 0;
  
  const electricityScore = elecKwh * EMISSION_FACTORS.electricity;
  const lpgScore = (lpgCyl / 4.33) * EMISSION_FACTORS.lpg_cylinder;
  const energyScore = electricityScore + lpgScore;
  
  // 3. Calculate Diet Footprint (daily_kg_co2e[diet_type] * 7)
  const dietType = safeInputs.diet || 'vegetarian';
  const dietDailyFactor = EMISSION_FACTORS.diet[dietType] || EMISSION_FACTORS.diet.vegetarian;
  const dietScore = dietDailyFactor * 7;
  
  // 4. Calculate Waste Footprint (kg_food_wasted_per_week * 2.5)
  const foodWasteKg = parseFloat(wasteInputs.foodWasteKgPerWeek) || 0;
  const wasteScore = foodWasteKg * EMISSION_FACTORS.foodWaste;
  
  // Grand Total
  const totalScore = transportScore + energyScore + dietScore + wasteScore;
  
  return {
    total: parseFloat(totalScore.toFixed(2)),
    transport: parseFloat(transportScore.toFixed(2)),
    energy: parseFloat(energyScore.toFixed(2)),
    diet: parseFloat(dietScore.toFixed(2)),
    waste: parseFloat(wasteScore.toFixed(2)),
  };
}

/**
 * Returns dynamic equivalent metrics for a given CO2 saving.
 * E.g., translates "X kg CO2 saved" into trees planted, phone charges, etc.
 * 
 * @param {number} kgSaved - Carbon saved in kg CO2e
 * @returns {Object} equivalents
 */
export function getCarbonEquivalents(kgSaved) {
  const safeKg = Math.max(0, kgSaved);
  return {
    // 1 tree absorbs ~22 kg CO2 per year, so ~0.42 kg per week
    trees: parseFloat((safeKg / 0.42).toFixed(1)),
    
    // Charging a typical smartphone emits ~0.008 kg CO2
    phonesCharged: Math.round(safeKg / 0.008),
    
    // Average petrol car emits 0.150 kg CO2/km, so distance avoided:
    carKm: Math.round(safeKg / 0.150),
  };
}
