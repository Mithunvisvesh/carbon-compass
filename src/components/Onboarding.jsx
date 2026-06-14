import React, { useState } from 'react';
import { DEFAULT_PROFILES } from '../utils/storage';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Quiz states
  const [diet, setDiet] = useState('vegetarian');
  const [foodWaste, setFoodWaste] = useState(2.0); // kg/week
  
  const [electricityBill, setElectricityBill] = useState(1500); // INR per month
  const [lpgCylindersYear, setLpgCylindersYear] = useState(8); // cylinders per year
  
  const [carKm, setCarKm] = useState(0);
  const [dieselCarKm, setDieselCarKm] = useState(0);
  const [scooterKm, setScooterKm] = useState(0);
  const [motorcycleKm, setMotorcycleKm] = useState(0);
  const [busKm, setBusKm] = useState(30);
  const [trainKm, setTrainKm] = useState(0);
  const [cyclingKm, setCyclingKm] = useState(5);
  const [walkingKm, setWalkingKm] = useState(10);
  
  const [routineText, setRoutineText] = useState('');

  // Auto-fill profiles for testing/demoing
  const handleAutoFill = (profileKey) => {
    const profile = DEFAULT_PROFILES[profileKey];
    if (!profile) return;
    
    setName(profile.name);
    setDiet(profile.baselineInputs.diet);
    setFoodWaste(profile.baselineInputs.waste.foodWasteKgPerWeek);
    
    // Reverse engineer electricity bill: (kwh_per_week * 4.33) * 7 = bill
    const weeklyKwh = profile.baselineInputs.energy.electricityKwhPerWeek;
    const approxMonthlyBill = Math.round(weeklyKwh * 4.33 * 7);
    setElectricityBill(approxMonthlyBill);
    
    // Reverse engineer LPG cylinders per year: cyl_per_month * 12
    const cylMonth = profile.baselineInputs.energy.lpgCylindersPerMonth;
    setLpgCylindersYear(Math.round(cylMonth * 12));
    
    // Transport
    const t = profile.baselineInputs.transport;
    setCarKm(t.petrolCar || 0);
    setDieselCarKm(t.dieselCar || 0);
    setScooterKm(t.petrolScooter || 0);
    setMotorcycleKm(t.motorcycle || 0);
    setBusKm(t.bus || 0);
    setTrainKm(t.electricTrain || 0);
    setCyclingKm(t.cycling || 0);
    setWalkingKm(t.walking || 0);
    
    setRoutineText(profile.routineDescription || '');
    
    // Instantly compile and complete
    const finalInputs = {
      name: profile.name,
      location: profile.location,
      baselineInputs: {
        transport: {
          petrolCar: t.petrolCar || 0,
          dieselCar: t.dieselCar || 0,
          petrolScooter: t.petrolScooter || 0,
          motorcycle: t.motorcycle || 0,
          bus: t.bus || 0,
          electricTrain: t.electricTrain || 0,
          cycling: t.cycling || 0,
          walking: t.walking || 0,
        },
        energy: {
          electricityKwhPerWeek: weeklyKwh,
          lpgCylindersPerMonth: cylMonth,
        },
        diet: profile.baselineInputs.diet,
        waste: {
          foodWasteKgPerWeek: profile.baselineInputs.waste.foodWasteKgPerWeek,
        }
      },
      routineDescription: profile.routineDescription
    };
    onComplete(finalInputs);
  };

  const handleNextStep = () => {
    // Priority 2 - Validate Name before proceeding from Step 1
    if (step === 1) {
      if (name.trim() === '') {
        setNameError('Please enter your name to personalize your coach experience.');
        return;
      }
      setNameError('');
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete quiz
      // Convert monthly electric bill to weekly kwh: Bill / 7 INR per kWh = Monthly kWh. Monthly / 4.33 = Weekly kWh.
      const weeklyElectricityKwh = parseFloat(((electricityBill / 7) / 4.33).toFixed(2));
      const monthlyLpgCylinders = parseFloat((lpgCylindersYear / 12).toFixed(2));
      
      const baselineInputs = {
        transport: {
          petrolCar: Number(carKm),
          dieselCar: Number(dieselCarKm),
          petrolScooter: Number(scooterKm),
          motorcycle: Number(motorcycleKm),
          bus: Number(busKm),
          electricTrain: Number(trainKm),
          cycling: Number(cyclingKm),
          walking: Number(walkingKm),
        },
        energy: {
          electricityKwhPerWeek: weeklyElectricityKwh,
          lpgCylindersPerMonth: monthlyLpgCylinders,
        },
        diet: diet,
        waste: {
          foodWasteKgPerWeek: Number(foodWaste),
        }
      };
      
      onComplete({
        name: name.trim(),
        location: 'India',
        baselineInputs,
        routineDescription: routineText,
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const dietOptions = [
    { id: 'high_meat', label: 'High Meat', desc: 'Frequent meat meals (≥100g daily)', emoji: '🥩' },
    { id: 'medium_meat', label: 'Medium Meat', desc: 'Moderate meat meals (50–99g daily)', emoji: '🍗' },
    { id: 'low_meat', label: 'Low Meat', desc: 'Occasional meat (<50g daily)', emoji: '🥓' },
    { id: 'fish', label: 'Pescatarian', desc: 'Fish and plant diet, no red meat', emoji: '🐟' },
    { id: 'vegetarian', label: 'Vegetarian', desc: 'Egg, dairy, plant diet, no meat', emoji: '🧀' },
    { id: 'vegan', label: 'Vegan', desc: 'Purely plant-based diet', emoji: '🌱' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Onboarding Header */}
      <div className="text-center mb-8">
        <span className="text-5xl mb-2 block">🧭</span>
        <h2 className="text-3xl font-extrabold text-slate-800">Welcome to CarbonCompass</h2>
        <p className="text-slate-600 mt-2 text-md">
          A personal sustainability coach designed to guide you from footprint measurement to small, impactful habits.
        </p>
      </div>

      {/* Auto-fill Shortcuts for Judges */}
      {step === 1 && (
        <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5 mb-8 text-center shadow-sm">
          <h3 className="text-sm font-bold text-sage-800 uppercase tracking-wider mb-3">
            ⚡ Quick Demo Setup (For Judges / Evaluators)
          </h3>
          <p className="text-xs text-sage-700 mb-4">
            Skip the manual onboarding and instantly test the app with one of our user personas:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleAutoFill('aditi')}
              className="px-4 py-2 bg-white border border-sage-300 hover:border-sage-500 rounded-xl text-sm font-semibold text-sage-800 shadow-sm transition-all"
            >
              👩‍🎓 Load Aditi (Student Persona)
            </button>
            <button
              onClick={() => handleAutoFill('rohan')}
              className="px-4 py-2 bg-white border border-sage-300 hover:border-sage-500 rounded-xl text-sm font-semibold text-sage-800 shadow-sm transition-all"
            >
              🧑‍💻 Load Rohan (Tech Pro Persona)
            </button>
          </div>
        </div>
      )}

      {/* Progress Wizard Indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= num ? 'bg-sage-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {num}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider hidden sm:inline ${
                  step === num ? 'text-sage-800' : 'text-slate-400'
                }`}
              >
                {num === 1 ? 'Diet & Waste' : num === 2 ? 'Home Energy' : 'Commute & Routine'}
              </span>
            </div>
            {num < 3 && <div className={`flex-1 h-0.5 mx-4 ${step > num ? 'bg-sage-600' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🍽️</span> Step 1: Diet & Food Waste
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                What is your name? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim() !== '') setNameError('');
                }}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-800 ${
                  nameError ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {nameError && (
                <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1">
                  <span>⚠</span> {nameError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Which describes your diet best?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dietOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDiet(opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                      diet === opt.id
                        ? 'border-sage-600 bg-sage-50/50 ring-1 ring-sage-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{opt.label}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700">Estimated Food Waste per Week</label>
                <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                  {foodWaste} kg / week
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={foodWaste}
                onChange={(e) => setFoodWaste(Number(e.target.value))}
                className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0 kg (Zero Waste)</span>
                <span>5 kg (Average household)</span>
                <span>10 kg (High waste)</span>
              </div>
              
              {/* Priority 4 - Onboarding Helper Guidance for Food Waste */}
              <div className="mt-4 bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-150">
                <span className="font-bold text-slate-700 block mb-1">💡 Guidance - Estimating Food Waste:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li><strong>Small (&lt;1 kg/week):</strong> Minimal leftovers, scraps only (peels/cores).</li>
                  <li><strong>Average (1-3 kg/week):</strong> Occasional spoiled produce, some uneaten meal leftovers.</li>
                  <li><strong>High (&gt;3 kg/week):</strong> Regular clearing of expired fridge items, frequent plate waste.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🔌</span> Step 2: Household Energy
            </h3>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-700 block">Monthly Electricity Bill</label>
                  <span className="text-xs text-slate-400">Approx. weekly kWh is calculated dynamically</span>
                </div>
                <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                  ₹ {electricityBill.toLocaleString('en-IN')} / month
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8000"
                step="100"
                value={electricityBill}
                onChange={(e) => setElectricityBill(Number(e.target.value))}
                className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>₹0 (Minimal/Hostel)</span>
                <span>₹2,000 (Medium flat)</span>
                <span>₹8,000+ (High AC usage)</span>
              </div>
              
              <div className="mt-3 bg-sage-50/50 rounded-xl p-2.5 text-xs text-slate-600 flex justify-between border border-sage-100/50">
                <span>Estimated weekly power consumption:</span>
                <span className="font-bold text-sage-800">
                  {parseFloat(((electricityBill / 7) / 4.33).toFixed(1))} kWh
                </span>
              </div>

              {/* Priority 4 - Onboarding Helper Guidance for Electricity */}
              <div className="mt-4 bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-150">
                <span className="font-bold text-slate-700 block mb-1">💡 Guidance - Estimating Electricity:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li><strong>Light (10-20 kWh/week / ~₹300-₹600):</strong> Shared hostel room, fan/lights, charging only.</li>
                  <li><strong>Average (20-40 kWh/week / ~₹600-₹1200):</strong> Apartment with fridge, TV, fans, geyser, no AC.</li>
                  <li><strong>Heavy (40+ kWh/week / ~₹1200+):</strong> Multi-room home with regular AC usage, washing machine.</li>
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-700 block">Household LPG Cooking Cylinders</label>
                  <span className="text-xs text-slate-400">Standard 14.2kg cylinders used per year</span>
                </div>
                <span className="text-sm font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-lg">
                  {lpgCylindersYear} cylinders / year
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                step="1"
                value={lpgCylindersYear}
                onChange={(e) => setLpgCylindersYear(Number(e.target.value))}
                className="w-full accent-sage-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0 cylinders (Electric cooking)</span>
                <span>8 cylinders (Standard family)</span>
                <span>18 cylinders (Heavy cooking)</span>
              </div>

              {/* Priority 4 - Onboarding Helper Guidance for LPG */}
              <div className="mt-4 bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-150">
                <span className="font-bold text-slate-700 block mb-1">💡 Guidance - Estimating LPG:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li><strong>Light (4-6 cylinders/year):</strong> Shared flat, cooks occasionally or single burner.</li>
                  <li><strong>Average (8-12 cylinders/year):</strong> Standard family home, cooks hot meals daily.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🚗</span> Step 3: Weekly Commute & Routine
            </h3>
            
            <p className="text-xs text-slate-500 mb-4">
              Enter your average travel distance in kilometers per week for each transport type:
            </p>

            <div className="space-y-4 mb-6">
              {/* Cars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🚗 Petrol Car (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={carKm === 0 ? '' : carKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCarKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🚙 Diesel Car (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={dieselCarKm === 0 ? '' : dieselCarKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setDieselCarKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
              </div>

              {/* Two Wheelers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🛵 Petrol Scooter (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={scooterKm === 0 ? '' : scooterKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setScooterKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🏍️ Motorcycle/Bike (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={motorcycleKm === 0 ? '' : motorcycleKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setMotorcycleKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
              </div>

              {/* Bus & Train */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🚌 Bus transit (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={busKm === 0 ? '' : busKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setBusKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🚆 Electric Train (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={trainKm === 0 ? '' : trainKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setTrainKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
              </div>

              {/* Cycling & Walking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🚲 Cycling (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={cyclingKm === 0 ? '' : cyclingKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCyclingKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">🚶 Walking (km/week)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    placeholder="0"
                    value={walkingKm === 0 ? '' : walkingKm}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setWalkingKm(e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Tell us about your daily routine (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="E.g., I walk to college, work in a shared office with AC, eat vegetarian meals, and rarely use a private vehicle. I turn off lights when leaving a room..."
                value={routineText}
                onChange={(e) => setRoutineText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-800 text-sm resize-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your AI coach uses this text to personalize your challenges. It will never change your numeric score.
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8 border-t border-slate-100 pt-6">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 border border-slate-200 hover:border-slate-400 rounded-xl text-slate-600 font-semibold transition-all hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNextStep}
            className="px-8 py-3 bg-sage-700 hover:bg-sage-800 text-white rounded-xl font-bold shadow-md shadow-sage-700/20 transition-all ml-auto"
          >
            {step === 3 ? 'Calculate Baseline' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
