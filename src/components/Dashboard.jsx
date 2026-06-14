import React from 'react';
import { calculateWeeklyFootprint, REGIONAL_AVERAGES } from '../utils/carbonCalculator';

export default function Dashboard({ profile }) {
  const breakdown = calculateWeeklyFootprint(profile?.baselineInputs);
  
  // Calculate relative difference vs regional average
  const differencePercent = Math.round(((breakdown.total - REGIONAL_AVERAGES.total) / REGIONAL_AVERAGES.total) * 100);
  const isLess = differencePercent <= 0;
  const absDifference = Math.abs(differencePercent);

  // Identify highest impact category programmatically
  const categories = [
    { key: 'transport', label: 'Transport', value: breakdown.transport, avg: REGIONAL_AVERAGES.transport, icon: '🚗' },
    { key: 'energy', label: 'Home Energy', value: breakdown.energy, avg: REGIONAL_AVERAGES.energy, icon: '🔌' },
    { key: 'diet', label: 'Dietary Choice', value: breakdown.diet, avg: REGIONAL_AVERAGES.diet, icon: '🍽️' },
    { key: 'waste', label: 'Food Waste', value: breakdown.waste, avg: REGIONAL_AVERAGES.waste, icon: '🗑️' }
  ];

  // Highest positive delta vs average, or highest absolute value
  const sortedByImpact = [...categories].sort((a, b) => {
    const deltaA = a.value - a.avg;
    const deltaB = b.value - b.avg;
    return deltaB - deltaA; // Highest delta first
  });
  
  const highestImpact = sortedByImpact[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Comparative Headline Card */}
      <div className={`rounded-3xl p-6 sm:p-8 mb-6 shadow-lg border transition-all ${
        isLess 
          ? 'bg-gradient-to-br from-sage-50 to-emerald-50/50 border-sage-200' 
          : 'bg-gradient-to-br from-amber-50/50 to-orange-50/20 border-amber-200'
      }`}>
        <span className="text-xs uppercase font-extrabold tracking-wider text-sage-800">Your Sustainability Summary</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
          {profile?.name}, you emit <span className={isLess ? 'text-emerald-700' : 'text-amber-700'}>
            {absDifference}% {isLess ? 'less' : 'more'}
          </span> than the average Indian urban resident.
        </h2>
        
        {/* Footprint Numbers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6 pt-6 border-t border-slate-200/50">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 block tracking-wider">Your Weekly Footprint</span>
            <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{breakdown.total}</span>
            <span className="text-sm font-semibold text-slate-500 ml-1">kg CO2e</span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200" />
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 block tracking-wider">National Urban Average</span>
            <span className="text-2xl font-bold text-slate-600">{REGIONAL_AVERAGES.total}</span>
            <span className="text-xs font-semibold text-slate-500 ml-1">kg CO2e / week</span>
          </div>
        </div>
      </div>

      {/* Grid: Breakdown & Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category breakdown (Custom SVG Bar-style) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>📊</span> Category Breakdown
          </h3>
          
          <div className="space-y-6">
            {categories.map((cat) => {
              const maxVal = Math.max(...categories.map(c => Math.max(c.value, c.avg)));
              const userWidth = (cat.value / maxVal) * 100;
              const avgWidth = (cat.avg / maxVal) * 100;

              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>{cat.icon}</span> {cat.label}
                    </span>
                    <span className="font-semibold text-slate-500">
                      <strong className="text-slate-800">{cat.value}</strong> vs {cat.avg} kg CO2e
                    </span>
                  </div>
                  
                  {/* Custom CSS Dual-Bar Chart */}
                  <div className="space-y-1.5 pt-1">
                    {/* User bar */}
                    <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-sage-600 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(3, userWidth)}%` }}
                      />
                    </div>
                    {/* Average bar */}
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-slate-300 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(3, avgWidth)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>You</span>
                    <span>Indian Average</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opportunity Card */}
        <div className="bg-gradient-to-br from-sage-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sage-300">Habit Coach Insight</span>
            <h3 className="text-xl font-bold mt-2">Your Biggest Opportunity</h3>
            
            <div className="mt-6 flex items-center gap-4 bg-white/10 rounded-2xl p-4">
              <span className="text-4xl">{highestImpact.icon}</span>
              <div>
                <h4 className="font-bold text-white text-md">{highestImpact.label}</h4>
                <p className="text-xs text-sage-200 mt-0.5">
                  Emits {highestImpact.value} kg CO2e/week
                </p>
              </div>
            </div>

            <p className="text-xs text-sage-200 mt-6 leading-relaxed">
              Your footprint in <strong className="text-white">{highestImpact.label}</strong> is the primary area to target. The AI Habit Coach can help you design bite-sized, low-cost habits to reduce this emissions block.
            </p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-sage-300">
            <span>Formula: Sourced from CEA & Scarborough</span>
            <span>🧭 Coach Compass</span>
          </div>
        </div>
      </div>
    </div>
  );
}
