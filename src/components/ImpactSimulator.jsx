import React, { useState, useEffect } from 'react';
import { calculateWeeklyFootprint, getCarbonEquivalents, EMISSION_FACTORS } from '../utils/carbonCalculator';

export default function ImpactSimulator({ profile }) {
  // If no profile (should not happen due to guard, but safe fallback)
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center bg-white rounded-3xl shadow-sm">
        <p className="text-slate-600">Please complete onboarding first.</p>
      </div>
    );
  }

  const baseline = profile.baselineInputs;
  const baselineBreakdown = calculateWeeklyFootprint(baseline);

  // Identify transport base values
  const hasMotorized = (
    (baseline.transport.petrolCar || 0) + 
    (baseline.transport.dieselCar || 0) + 
    (baseline.transport.petrolScooter || 0) + 
    (baseline.transport.motorcycle || 0)
  ) > 0;
  
  const maxCommuteSwap = hasMotorized 
    ? (
        (baseline.transport.petrolCar || 0) + 
        (baseline.transport.dieselCar || 0) + 
        (baseline.transport.petrolScooter || 0) + 
        (baseline.transport.motorcycle || 0)
      )
    : (baseline.transport.bus || 10);

  // States for Simulator Sliders
  const [commuteSwapKm, setCommuteSwapKm] = useState(0); // km swapped to active (cycling/walking)
  const [applianceHoursSaved, setApplianceHoursSaved] = useState(0); // AC/geyser hours saved per week
  const [dietMealsSwapped, setDietMealsSwapped] = useState(0); // meals swapped to lower carbon per week (max 14)
  const [wasteReductionPercent, setWasteReductionPercent] = useState(0); // percent waste avoided (0 to 100)

  // Auto-reset sliders if profile changes
  useEffect(() => {
    setCommuteSwapKm(0);
    setApplianceHoursSaved(0);
    setDietMealsSwapped(0);
    setWasteReductionPercent(0);
  }, [profile]);

  // Compute simulated inputs dynamically
  const getSimulatedInputs = () => {
    const sim = {
      transport: { ...baseline.transport },
      energy: { ...baseline.energy },
      diet: baseline.diet,
      waste: { ...baseline.waste }
    };

    // 1. Commute Swap
    if (commuteSwapKm > 0) {
      let remainingSwap = commuteSwapKm;
      
      if (hasMotorized) {
        // Swap high emission vehicles first: Diesel car, Petrol car, Petrol scooter, Motorcycle
        const dieselCarVal = baseline.transport.dieselCar || 0;
        const carVal = baseline.transport.petrolCar || 0;
        const scooterVal = baseline.transport.petrolScooter || 0;
        const motorcycleVal = baseline.transport.motorcycle || 0;
        
        if (dieselCarVal >= remainingSwap) {
          sim.transport.dieselCar = dieselCarVal - remainingSwap;
          remainingSwap = 0;
        } else {
          sim.transport.dieselCar = 0;
          remainingSwap -= dieselCarVal;
          
          if (carVal >= remainingSwap) {
            sim.transport.petrolCar = carVal - remainingSwap;
            remainingSwap = 0;
          } else {
            sim.transport.petrolCar = 0;
            remainingSwap -= carVal;
            
            if (scooterVal >= remainingSwap) {
              sim.transport.petrolScooter = scooterVal - remainingSwap;
              remainingSwap = 0;
            } else {
              sim.transport.petrolScooter = 0;
              remainingSwap -= scooterVal;
              
              if (motorcycleVal >= remainingSwap) {
                sim.transport.motorcycle = motorcycleVal - remainingSwap;
                remainingSwap = 0;
              } else {
                sim.transport.motorcycle = 0;
                remainingSwap -= motorcycleVal;
              }
            }
          }
        }
      } else {
        // Swap bus
        const busVal = baseline.transport.bus;
        if (busVal >= remainingSwap) {
          sim.transport.bus = busVal - remainingSwap;
          remainingSwap = 0;
        } else {
          sim.transport.bus = 0;
          remainingSwap -= busVal;
        }
      }

      // Add the swapped distance to cycling
      sim.transport.cycling = (baseline.transport.cycling || 0) + (commuteSwapKm - remainingSwap);
    }

    // 2. Appliance Energy Reduction (1 hour AC/geyser ~ 1.2 kWh electricity saved)
    if (applianceHoursSaved > 0) {
      const kwhSaved = applianceHoursSaved * 1.2;
      sim.energy.electricityKwhPerWeek = Math.max(0, baseline.energy.electricityKwhPerWeek - kwhSaved);
    }

    // 3. Diet Swaps
    // Math: We estimate 14 main meals a week (lunch/dinner). 
    // Swapping meals reduces diet score proportionally toward vegetarian (if meat eater) or vegan (if veg).
    // Delta is (current_diet_daily - target_diet_daily) * 7. Swap fraction is meals / 14.
    let targetDietFactor = EMISSION_FACTORS.diet.vegetarian;
    if (baseline.diet === 'vegetarian') {
      targetDietFactor = EMISSION_FACTORS.diet.vegan;
    } else if (baseline.diet === 'vegan') {
      targetDietFactor = EMISSION_FACTORS.diet.vegan - 0.4; // Local produce factor bonus
    }

    const currentDietFactor = EMISSION_FACTORS.diet[baseline.diet] || EMISSION_FACTORS.diet.vegetarian;
    const weeklyDeltaMax = (currentDietFactor - targetDietFactor) * 7;
    const dietSavings = (dietMealsSwapped / 14) * weeklyDeltaMax;

    // 4. Waste Reduction
    if (wasteReductionPercent > 0) {
      const fraction = (100 - wasteReductionPercent) / 100;
      sim.waste.foodWasteKgPerWeek = baseline.waste.foodWasteKgPerWeek * fraction;
    }

    // Return inputs and raw diet savings offset
    return { sim, dietSavings };
  };

  const { sim, dietSavings } = getSimulatedInputs();
  const rawSimBreakdown = calculateWeeklyFootprint(sim);
  
  // Apply the custom diet savings calculation
  const simulatedBreakdown = {
    ...rawSimBreakdown,
    diet: parseFloat(Math.max(EMISSION_FACTORS.diet.vegan * 7 - 3, rawSimBreakdown.diet - dietSavings).toFixed(2))
  };
  
  // Recompute total with manual diet savings adjustment
  simulatedBreakdown.total = parseFloat(
    (simulatedBreakdown.transport + simulatedBreakdown.energy + simulatedBreakdown.diet + simulatedBreakdown.waste).toFixed(2)
  );

  const kgSaved = parseFloat((baselineBreakdown.total - simulatedBreakdown.total).toFixed(1));
  const percentReduction = baselineBreakdown.total > 0 
    ? Math.round((kgSaved / baselineBreakdown.total) * 100) 
    : 0;

  const equivalents = getCarbonEquivalents(kgSaved);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">Impact Simulator</h2>
        <p className="text-slate-600 mt-1">
          Adjust the sliders to simulate personal changes and watch your projected weekly footprint change in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slider 1: Commute Swapping */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🚲</span> Active Commuting Swap
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasMotorized 
                    ? "Swap car/scooter distance for cycling/walking" 
                    : "Swap bus commute distance for cycling/walking"}
                </p>
              </div>
              <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                {commuteSwapKm} km / week
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={maxCommuteSwap}
              step="1"
              value={commuteSwapKm}
              onChange={(e) => setCommuteSwapKm(Number(e.target.value))}
              className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>0 km</span>
              <span>Swap up to {maxCommuteSwap} km</span>
            </div>
          </div>

          {/* Slider 2: Energy Reduction */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>💡</span> Appliance Run-time Reduction
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reduce run-time of high-power items (AC, geyser, heaters)
                </p>
              </div>
              <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                {applianceHoursSaved} hours / week
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={applianceHoursSaved}
              onChange={(e) => setApplianceHoursSaved(Number(e.target.value))}
              className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>0 hours</span>
              <span>Save 30 hours (~36 kWh/week saved)</span>
            </div>
          </div>

          {/* Slider 3: Diet Swap */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🥦</span> Meal Swaps
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {baseline.diet === 'vegan' 
                    ? "Commit to organic local produce swaps (meals/week)"
                    : baseline.diet === 'vegetarian'
                    ? "Swap vegetarian meals to fully plant-based vegan meals"
                    : "Swap meat/fish meals for vegetarian meals"}
                </p>
              </div>
              <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                {dietMealsSwapped} meals / week
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={dietMealsSwapped}
              onChange={(e) => setDietMealsSwapped(Number(e.target.value))}
              className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>0 meals</span>
              <span>14 meals (Complete shift)</span>
            </div>
          </div>

          {/* Slider 4: Food Waste */}
          {baseline.waste.foodWasteKgPerWeek > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🗑️</span> Prevent Food Waste
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Avoid throwing out edible food through better planning
                  </p>
                </div>
                <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                  {wasteReductionPercent}% reduction
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wasteReductionPercent}
                onChange={(e) => setWasteReductionPercent(Number(e.target.value))}
                className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>0% (No change)</span>
                <span>50% (Halve waste)</span>
                <span>100% (Zero waste)</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Comparison Metrics */}
          <div className="bg-gradient-to-br from-sage-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sage-300">Simulated Results</h3>
            
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-sage-200 block">Baseline Footprint</span>
                  <span className="text-2xl font-bold">{baselineBreakdown.total} kg</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-sage-200 block">Projected Footprint</span>
                  <span className="text-3xl font-extrabold text-emerald-400">{simulatedBreakdown.total} kg</span>
                </div>
              </div>

              {kgSaved > 0 ? (
                <div className="text-center py-2">
                  <div className="text-4xl font-extrabold text-emerald-400">-{percentReduction}%</div>
                  <div className="text-xs text-sage-200 uppercase font-bold tracking-widest mt-1">
                    Reduces weekly footprint by {kgSaved} kg CO2e
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-sage-300 py-4 italic">
                  Move the sliders to see carbon reduction!
                </p>
              )}
            </div>

            {/* SVG Comparison Chart */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-around items-end h-28 pt-4">
                {/* Baseline bar */}
                <div className="flex flex-col items-center w-12 group">
                  <div className="text-[10px] font-bold mb-1 text-slate-300">{baselineBreakdown.total}</div>
                  <div className="w-8 bg-slate-600 rounded-t-lg transition-all duration-300" style={{ height: '70px' }} />
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-2">Base</span>
                </div>

                {/* Projected bar */}
                <div className="flex flex-col items-center w-12 group">
                  <div className="text-[10px] font-bold mb-1 text-emerald-400">{simulatedBreakdown.total}</div>
                  <div 
                    className="w-8 bg-emerald-500 rounded-t-lg transition-all duration-300 shadow-md shadow-emerald-500/20" 
                    style={{ 
                      height: `${Math.max(10, Math.round((simulatedBreakdown.total / baselineBreakdown.total) * 70))}px` 
                    }} 
                  />
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 mt-2">Proj</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wow equivalents card */}
          {kgSaved > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                What does this reduction mean?
              </h4>
              
              <div className="space-y-4">
                {/* Trees equivalent */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-emerald-50 p-2 rounded-xl">🌳</span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">
                      {equivalents.trees} trees planted
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Absorbing this carbon output for a whole year.
                    </p>
                  </div>
                </div>

                {/* Smartphone equivalent */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-sky-50 p-2 rounded-xl">📱</span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">
                      {equivalents.phonesCharged.toLocaleString()} charges
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Equivalent to charging smartphone batteries.
                    </p>
                  </div>
                </div>

                {/* Driving distance equivalent */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-amber-50 p-2 rounded-xl">🚗</span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">
                      {equivalents.carKm.toLocaleString()} km avoided
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Equivalent to driving an average petrol car.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
