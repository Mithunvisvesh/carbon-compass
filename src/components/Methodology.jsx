import React from 'react';

export default function Methodology() {
  const sources = [
    {
      category: 'Electricity (India Grid)',
      factor: '0.75 kg CO2/kWh',
      source: 'CEA CO2 Baseline Database for the Indian Power Sector',
      details: 'Calculates the operating margin carbon intensity of the national grid, reflecting coal-dominant power generation.'
    },
    {
      category: 'LPG Cooking Cylinders',
      factor: '42.0 kg CO2 per 14.2kg cylinder',
      source: 'CarbonCrux / Indian LPG consumption data',
      details: 'Based on standard LPG combustion values of ~2.96 kg CO2 per kg of Liquefied Petroleum Gas.'
    },
    {
      category: 'Petrol Passenger Car',
      factor: '150 g CO2/km (range: 120–180 g)',
      source: 'CarbonCrux (India Vehicle Fleet Mix)',
      details: 'Represents average tailpipe emissions for small and mid-sized gasoline-powered passenger cars in urban traffic.'
    },
    {
      category: 'Diesel Passenger Car',
      factor: '190 g CO2/km (range: 170–220 g)',
      source: 'CarbonCrux (India Vehicle Fleet Mix)',
      details: 'Represents typical diesel passenger vehicle emissions in standard urban commuting conditions.'
    },
    {
      category: 'Petrol Scooter / 2-Wheeler',
      factor: '42.5 g CO2/km (range: 35–50 g)',
      source: 'CarbonCrux (India Vehicle Fleet Mix)',
      details: 'Represents average emissions for common commuter single-cylinder 100-125cc gasoline scooters.'
    },
    {
      category: 'Motorcycle/Bike',
      factor: '35.0 g CO2/km (range: 30–40 g)',
      source: 'CarbonCrux (India Vehicle Fleet Mix)',
      details: 'Represents average emissions for geared 110-150cc commuter motorcycles.'
    },
    {
      category: 'Bus Transit',
      factor: '89 g CO2/passenger-km',
      source: 'Defra-based UK Greenhouse Gas Reporting (Indian proxy)',
      details: 'Passenger carbon share calculated assuming typical double/single decker city bus occupancy.'
    },
    {
      category: 'Electric Train',
      factor: '12.5 g CO2/passenger-km (range: 10–15 g)',
      source: 'Indian Railways Electric Routes baseline',
      details: 'Averages line emissions for electric passenger rail powered by the national grid.'
    },
    {
      category: 'Cycling',
      factor: '33.0 g CO2/km (range: 16–50 g)',
      source: 'Our World in Data (Dietary metabolic offset)',
      details: 'Calculates additional dietary calories consumed and digested to fuel active transport.'
    },
    {
      category: 'Diet — High Meat (≥100g/day)',
      factor: '7.19 kg CO2e/day',
      source: 'Scarborough et al. 2014 (UK dietary lifecycle study)',
      details: 'Comprehensive food lifecycle emissions including production, transport, refrigeration, and packing.'
    },
    {
      category: 'Diet — Medium Meat (50–99g/day)',
      factor: '5.63 kg CO2e/day',
      source: 'Scarborough et al. 2014',
      details: 'Includes lifecycle inputs. Note: Dietary data is UK-based and serves as a proxy for urban meat-eaters.'
    },
    {
      category: 'Diet — Low Meat (<50g/day)',
      factor: '4.67 kg CO2e/day',
      source: 'Scarborough et al. 2014',
      details: 'Reflects lifecycle inputs for light meat consumers.'
    },
    {
      category: 'Diet — Pescatarian (Fish)',
      factor: '3.91 kg CO2e/day',
      source: 'Scarborough et al. 2014',
      details: 'Lifecycle footprints for individuals eating fish/seafood but avoiding land animal meats.'
    },
    {
      category: 'Diet — Vegetarian',
      factor: '3.81 kg CO2e/day',
      source: 'Scarborough et al. 2014',
      details: 'Lifecycle footprints for egg/dairy/plant consumers. Standard urban Indian proxy.'
    },
    {
      category: 'Diet — Vegan',
      factor: '2.89 kg CO2e/day',
      source: 'Scarborough et al. 2014',
      details: 'Strictly plant-based lifecycle footprint. In the Impact Simulator, vegan-to-vegan swaps apply a further local-sourcing offset of -0.4 kg CO2e/day.'
    },
    {
      category: 'Food Waste',
      factor: '2.5 kg CO2 per kg wasted',
      source: 'Poore & Nemecek (Science, 2018) / New Food Magazine',
      details: 'Calculates agricultural production footprint + methane decomposition emissions in landfill sites.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">Methodology & Sources</h2>
        <p className="text-slate-600 mt-1">
          Transparent scientific foundations behind CarbonCompass calculations and recommendations.
        </p>
      </div>

      {/* Grid: Formulas & Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Formula Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>🧮</span> Math & Calculations
          </h3>
          
          <p className="text-sm text-slate-600 leading-relaxed">
            Your weekly carbon footprint is computed dynamically from your onboarding choices using four primary sector equations:
          </p>

          <div className="space-y-4 font-sans text-xs sm:text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed">
            <div>
              <span className="font-bold text-sage-800 block mb-1">1. Weekly Transport Footprint (kg CO2e):</span>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-slate-600 text-xs sm:text-sm">
                Transport = Sum(km travelled × vehicle emission factor) ÷ 1000
              </div>
            </div>
            
            <div>
              <span className="font-bold text-sage-800 block mb-1">2. Weekly Home Energy Footprint (kg CO2e):</span>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-slate-600 text-xs sm:text-sm">
                Energy = (Weekly kWh × 0.75) + (Monthly LPG cylinders ÷ 4.33 × 42)
              </div>
            </div>

            <div>
              <span className="font-bold text-sage-800 block mb-1">3. Weekly Dietary Choice Footprint (kg CO2e):</span>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-slate-600 text-xs sm:text-sm">
                Diet = Daily diet factor × 7
              </div>
            </div>

            <div>
              <span className="font-bold text-sage-800 block mb-1">4. Weekly Food Waste Footprint (kg CO2e):</span>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-slate-600 text-xs sm:text-sm">
                Waste = Weekly food waste (kg) × 2.5
              </div>
            </div>
          </div>
        </div>

        {/* Note on data */}
        <div className="bg-gradient-to-br from-sage-50 to-emerald-50/20 rounded-3xl p-6 shadow-md border border-sage-100 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sage-900 text-md flex items-center gap-1.5">
              <span>⚠️</span> Scientific Honesty
            </h4>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              These factors are sourced from real published carbon studies. 
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              While the electricity baseline is specific to the <strong>Indian national grid (CEA)</strong> and vehicle statistics use <strong>regional urban estimates (CarbonCrux)</strong>, the dietary lifecycle calculations are derived from a <strong>UK study (Scarborough et al. 2014)</strong>. 
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Dietary footprints serve as a comparative baseline proxy for urban Indian dietary habits, but they are not exact regional measurements.
            </p>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-4">
            Last Updated: June 2026
          </div>
        </div>
      </div>

      {/* Citations Data Table */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>📚</span> Emission Factor Database
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 px-4">Factor</th>
                <th className="pb-3 px-4">Primary Source</th>
                <th className="pb-3 pl-4 hidden sm:table-cell">Details / Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {sources.map((src, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 pr-4 font-bold text-slate-800">{src.category}</td>
                  <td className="py-3 px-4 font-mono text-sage-800 font-semibold">{src.factor}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium italic">{src.source}</td>
                  <td className="py-3 pl-4 hidden sm:table-cell text-slate-400 max-w-xs">{src.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
