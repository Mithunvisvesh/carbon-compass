import { calculateWeeklyFootprint } from './carbonCalculator.js';
import { calculateOpportunityScores, selectCuratedChallenges, generateSmartCoachInsight } from './challengeLibrary.js';

// Test profiles matching our user personas
const aditiProfile = {
  name: "Aditi",
  routineDescription: "I walk to the local college, take the electric train on weekends, eat a strict vegetarian diet, and compost minimal waste.",
  baselineInputs: {
    transport: { petrolCar: 0, dieselCar: 0, petrolScooter: 0, motorcycle: 0, bus: 45, electricTrain: 20, cycling: 5, walking: 12 },
    energy: { electricityKwhPerWeek: 15, lpgCylindersPerMonth: 0.15 },
    diet: 'vegetarian',
    waste: { foodWasteKgPerWeek: 0.5 },
  }
};

const rohanProfile = {
  name: "Rohan",
  routineDescription: "I drive my diesel car to work (120 km/week), run the AC heavily at home in the evening, eat mutton and chicken, and throw away left-over meals.",
  baselineInputs: {
    transport: { petrolCar: 0, dieselCar: 120, petrolScooter: 40, motorcycle: 0, bus: 0, electricTrain: 0, cycling: 0, walking: 2 },
    energy: { electricityKwhPerWeek: 80, lpgCylindersPerMonth: 0.8 },
    diet: 'high_meat',
    waste: { foodWasteKgPerWeek: 4.0 },
  }
};

const mithunvisveshProfile = {
  name: "Mithunvisvesh",
  routineDescription: "I commute by scooter to my office, eat a medium-meat diet, use average electricity, but have a lot of kitchen waste.",
  baselineInputs: {
    transport: { petrolCar: 0, dieselCar: 0, petrolScooter: 60, motorcycle: 0, bus: 0, electricTrain: 0, cycling: 0, walking: 1 },
    energy: { electricityKwhPerWeek: 45, lpgCylindersPerMonth: 0.4 },
    diet: 'medium_meat',
    waste: { foodWasteKgPerWeek: 3.0 },
  }
};

console.log("=========================================");
console.log("CARBONCOMPASS LOCAL SMART COACH ENGINE VERIFICATION");
console.log("=========================================\n");

const profiles = [aditiProfile, rohanProfile, mithunvisveshProfile];

profiles.forEach((p, idx) => {
  console.log(`--- RUNNING TEST ${idx + 1}: ${p.name.toUpperCase()} ---`);
  
  // 1. Calculate footprint breakdown
  const breakdown = calculateWeeklyFootprint(p.baselineInputs);
  console.log(`\n1. Footprint Breakdown (Total: ${breakdown.total.toFixed(1)} kg):`);
  console.log(`   Transport: ${breakdown.transport.toFixed(1)} kg`);
  console.log(`   Energy:    ${breakdown.energy.toFixed(1)} kg`);
  console.log(`   Diet:      ${breakdown.diet.toFixed(1)} kg`);
  console.log(`   Waste:     ${breakdown.waste.toFixed(1)} kg`);

  // 2. Calculate Opportunity Scores
  const oppScores = calculateOpportunityScores(breakdown, p.baselineInputs);
  console.log(`\n2. Opportunity Scores:`);
  console.log(`   Transport: ${oppScores.transport}`);
  console.log(`   Energy:    ${oppScores.energy}`);
  console.log(`   Diet:      ${oppScores.diet}`);
  console.log(`   Waste:     ${oppScores.waste}`);

  // 3. Select curated challenges
  const challenges = selectCuratedChallenges(p, breakdown, oppScores);
  console.log(`\n3. Selected Challenges:`);
  challenges.forEach(c => {
    console.log(`   - [${c.difficulty}] ${c.title} (-${c.estimatedImpactKg} kg, Cost: ${c.estimatedCost}, Time: ${c.estimatedTime})`);
  });

  // 4. Generate Personalized Insight
  const insight = generateSmartCoachInsight({
    profile: p,
    breakdown,
    opportunityScores: oppScores,
    selectedChallenges: challenges
  });
  console.log(`\n4. Generated personalized Coach Insight:\n`);
  console.log(insight);
  console.log("\n=========================================\n");
});
