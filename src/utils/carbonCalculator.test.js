import test from 'node:test';
import assert from 'node:assert';
import { 
  calculateWeeklyFootprint, 
  getCarbonEquivalents, 
  EMISSION_FACTORS, 
  REGIONAL_AVERAGES 
} from './carbonCalculator.js';

test('CarbonCompass - Emission Factors & Regional Averages Verification', () => {
  // Validate emission factor constants
  assert.strictEqual(EMISSION_FACTORS.electricity, 0.75);
  assert.strictEqual(EMISSION_FACTORS.lpg_cylinder, 42.0);
  assert.strictEqual(EMISSION_FACTORS.foodWaste, 2.5);
  
  // Validate transport factors
  assert.strictEqual(EMISSION_FACTORS.transport.petrolCar, 150.0);
  assert.strictEqual(EMISSION_FACTORS.transport.dieselCar, 190.0);
  assert.strictEqual(EMISSION_FACTORS.transport.petrolScooter, 42.5);
  assert.strictEqual(EMISSION_FACTORS.transport.motorcycle, 35.0);
  assert.strictEqual(EMISSION_FACTORS.transport.bus, 89.0);
  assert.strictEqual(EMISSION_FACTORS.transport.electricTrain, 12.5);
  assert.strictEqual(EMISSION_FACTORS.transport.cycling, 33.0);
  assert.strictEqual(EMISSION_FACTORS.transport.walking, 0.0);
  
  // Validate diet factors
  assert.strictEqual(EMISSION_FACTORS.diet.high_meat, 7.19);
  assert.strictEqual(EMISSION_FACTORS.diet.medium_meat, 5.63);
  assert.strictEqual(EMISSION_FACTORS.diet.low_meat, 4.67);
  assert.strictEqual(EMISSION_FACTORS.diet.fish, 3.91);
  assert.strictEqual(EMISSION_FACTORS.diet.vegetarian, 3.81);
  assert.strictEqual(EMISSION_FACTORS.diet.vegan, 2.89);

  // Validate regional averages
  assert.strictEqual(REGIONAL_AVERAGES.total, 96.0);
  assert.strictEqual(REGIONAL_AVERAGES.transport, 25.0);
  assert.strictEqual(REGIONAL_AVERAGES.energy, 30.0);
  assert.strictEqual(REGIONAL_AVERAGES.diet, 31.0);
  assert.strictEqual(REGIONAL_AVERAGES.waste, 10.0);
});

test('CarbonCompass - Aditi (Student) Persona Footprint Calculation', () => {
  const aditiProfile = {
    transport: { petrolCar: 0, petrolScooter: 0, bus: 45, electricTrain: 0, cycling: 5, walking: 12 },
    energy: { electricityKwhPerWeek: 15, lpgCylindersPerMonth: 0.15 },
    diet: 'vegetarian',
    waste: { foodWasteKgPerWeek: 2.0 },
  };

  const results = calculateWeeklyFootprint(aditiProfile);

  assert.strictEqual(results.transport, 4.17); // (45 * 89 + 5 * 33) / 1000 = 4.17
  assert.strictEqual(results.energy, 12.70);   // 15 * 0.75 + (0.15 / 4.33) * 42 = 12.70
  assert.strictEqual(results.diet, 26.67);     // 3.81 * 7 = 26.67
  assert.strictEqual(results.waste, 5.00);      // 2.0 * 2.5 = 5.00
  assert.strictEqual(results.total, 48.54);      // 4.17 + 12.70 + 26.67 + 5.00 = 48.54
});

test('CarbonCompass - Rohan (Tech Professional) Persona Footprint Calculation', () => {
  const rohanProfile = {
    transport: { petrolCar: 80, petrolScooter: 40, bus: 0, electricTrain: 0, cycling: 0, walking: 2 },
    energy: { electricityKwhPerWeek: 60, lpgCylindersPerMonth: 0.8 },
    diet: 'medium_meat',
    waste: { foodWasteKgPerWeek: 4.5 },
  };

  const results = calculateWeeklyFootprint(rohanProfile);

  assert.strictEqual(results.transport, 13.70); // (80 * 150 + 40 * 42.5) / 1000 = 13.70
  assert.strictEqual(results.energy, 52.76);   // 60 * 0.75 + (0.8 / 4.33) * 42 = 52.76
  assert.strictEqual(results.diet, 39.41);     // 5.63 * 7 = 39.41
  assert.strictEqual(results.waste, 11.25);    // 4.5 * 2.5 = 11.25
  assert.strictEqual(results.total, 117.12);    // 13.70 + 52.76 + 39.41 + 11.25 = 117.12
});

test('CarbonCompass - Carbon Equivalents Check', () => {
  const eq = getCarbonEquivalents(100.0);
  assert.strictEqual(eq.trees, 238.1);          // 100 / 0.42 = 238.1
  assert.strictEqual(eq.phonesCharged, 12500);  // 100 / 0.008 = 12500
  assert.strictEqual(eq.carKm, 667);            // 100 / 0.150 = 667
  
  // Test lower bound safety
  const negativeEq = getCarbonEquivalents(-5.0);
  assert.strictEqual(negativeEq.trees, 0.0);
  assert.strictEqual(negativeEq.phonesCharged, 0);
  assert.strictEqual(negativeEq.carKm, 0);
});

test('CarbonCompass - Edge Cases & Defaults Handling', () => {
  // Graceful recovery from empty input object
  const emptyResults = calculateWeeklyFootprint({});
  assert.strictEqual(emptyResults.transport, 0.0);
  assert.strictEqual(emptyResults.energy, 0.0);
  assert.strictEqual(emptyResults.diet, 26.67); // defaults to vegetarian (3.81 * 7)
  assert.strictEqual(emptyResults.waste, 0.0);
  assert.strictEqual(emptyResults.total, 26.67);

  // Graceful recovery from null input
  const nullResults = calculateWeeklyFootprint(null);
  assert.strictEqual(nullResults.transport, 0.0);
  assert.strictEqual(nullResults.energy, 0.0);
  assert.strictEqual(nullResults.diet, 26.67); // defaults to vegetarian (3.81 * 7)
  assert.strictEqual(nullResults.waste, 0.0);
  assert.strictEqual(nullResults.total, 26.67);
  
  // String input parser coercion testing
  const stringInputs = {
    transport: { petrolCar: '80', petrolScooter: '40' },
    energy: { electricityKwhPerWeek: '60', lpgCylindersPerMonth: '0.8' },
    diet: 'medium_meat',
    waste: { foodWasteKgPerWeek: '4.5' },
  };
  const results = calculateWeeklyFootprint(stringInputs);
  assert.strictEqual(results.total, 117.12);
  
  // Malformed field inputs recovery
  const malformedInputs = {
    transport: { petrolCar: 'invalid_number', bus: undefined },
    energy: { electricityKwhPerWeek: null },
  };
  const malformedResults = calculateWeeklyFootprint(malformedInputs);
  assert.strictEqual(malformedResults.transport, 0.0);
  assert.strictEqual(malformedResults.energy, 0.0);
  assert.strictEqual(malformedResults.total, 26.67); // diet default
});
