import { calculateWeeklyFootprint } from './carbonCalculator.js';

// Test profiles matching our user personas
const aditiProfile = {
  transport: { petrolCar: 0, petrolScooter: 0, bus: 45, electricTrain: 0, cycling: 5, walking: 12 },
  energy: { electricityKwhPerWeek: 15, lpgCylindersPerMonth: 0.15 },
  diet: 'vegetarian',
  waste: { foodWasteKgPerWeek: 2.0 },
};

const rohanProfile = {
  transport: { petrolCar: 80, petrolScooter: 40, bus: 0, electricTrain: 0, cycling: 0, walking: 2 },
  energy: { electricityKwhPerWeek: 60, lpgCylindersPerMonth: 0.8 },
  diet: 'medium_meat',
  waste: { foodWasteKgPerWeek: 4.5 },
};

console.log("=========================================");
console.log("CARBONCOMPASS CALCULATION ENGINE VERIFICATION");
console.log("=========================================\n");

// --- ADITI VERIFICATION ---
console.log("1. Running Verification for Aditi (Student Persona)...");
const aditiResults = calculateWeeklyFootprint(aditiProfile);
console.log("Inputs:", JSON.stringify(aditiProfile, null, 2));
console.log("Calculated Breakdown:", JSON.stringify(aditiResults, null, 2));

// Manual calculations check:
// Transport: Bus: 45 * 89g = 4005g = 4.005 kg. Cycling: 5 * 33g = 165g = 0.165 kg. Total = 4.17 kg.
// Energy: Elec: 15 * 0.75 = 11.25 kg. LPG: (0.15 / 4.33) * 42 = 1.45 kg. Total = 12.70 kg.
// Diet: Vegetarian daily factor = 3.81. Weekly = 3.81 * 7 = 26.67 kg.
// Waste: 2.0 * 2.5 = 5.0 kg.
// Grand Total = 4.17 + 12.70 + 26.67 + 5.00 = 48.54 kg CO2e.
console.log("\n--- Aditi Manual Calculation Check ---");
console.log("Expected Transport: 4.17 kg | Actual:", aditiResults.transport);
console.log("Expected Energy: 12.70 kg    | Actual:", aditiResults.energy);
console.log("Expected Diet: 26.67 kg      | Actual:", aditiResults.diet);
console.log("Expected Waste: 5.00 kg      | Actual:", aditiResults.waste);
console.log("Expected Total: 48.54 kg     | Actual:", aditiResults.total);
const aditiCorrect = 
  aditiResults.transport === 4.17 && 
  aditiResults.energy === 12.70 && 
  aditiResults.diet === 26.67 && 
  aditiResults.waste === 5.00 && 
  aditiResults.total === 48.54;
console.log("Result Match status:", aditiCorrect ? "✅ SUCCESS (100% Match)" : "❌ FAILED");

// --- ROHAN VERIFICATION ---
console.log("\n\n2. Running Verification for Rohan (Tech Professional)...");
const rohanResults = calculateWeeklyFootprint(rohanProfile);
console.log("Inputs:", JSON.stringify(rohanProfile, null, 2));
console.log("Calculated Breakdown:", JSON.stringify(rohanResults, null, 2));

// Manual calculations check:
// Transport: Car: 80 * 150g = 12000g = 12 kg. Scooter: 40 * 42.5g = 1700g = 1.7 kg. Total = 13.70 kg.
// Energy: Elec: 60 * 0.75 = 45 kg. LPG: (0.8 / 4.33) * 42 = 7.76 kg. Total = 52.76 kg.
// Diet: Medium Meat daily factor = 5.63. Weekly = 5.63 * 7 = 39.41 kg.
// Waste: 4.5 * 2.5 = 11.25 kg.
// Grand Total = 13.70 + 52.76 + 39.41 + 11.25 = 117.12 kg CO2e.
console.log("\n--- Rohan Manual Calculation Check ---");
console.log("Expected Transport: 13.70 kg | Actual:", rohanResults.transport);
console.log("Expected Energy: 52.76 kg    | Actual:", rohanResults.energy);
console.log("Expected Diet: 39.41 kg      | Actual:", rohanResults.diet);
console.log("Expected Waste: 11.25 kg     | Actual:", rohanResults.waste);
console.log("Expected Total: 117.12 kg    | Actual:", rohanResults.total);
const rohanCorrect = 
  rohanResults.transport === 13.70 && 
  rohanResults.energy === 52.76 && 
  rohanResults.diet === 39.41 && 
  rohanResults.waste === 11.25 && 
  rohanResults.total === 117.12;
console.log("Result Match status:", rohanCorrect ? "✅ SUCCESS (100% Match)" : "❌ FAILED");
console.log("\n=========================================");
