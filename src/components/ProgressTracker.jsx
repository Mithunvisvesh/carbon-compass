import React from 'react';

export default function ProgressTracker({ progress }) {
  const { currentStreak = 0, unlockedBadges = [], weeklyHistory = [] } = progress || {};

  const badges = [
    { id: 'eco_aware', title: 'Eco Aware', desc: 'Completed onboarding quiz', icon: '🧭', color: 'from-sage-400 to-sage-600' },
    { id: 'first_challenge', title: 'Eco Active', desc: 'Completed first challenge', icon: '🌱', color: 'from-emerald-400 to-teal-600' },
    // Changed "Maintained" to "Achieved" to reflect an all-time unlock
    { id: 'streak_3', title: 'Habit Builder', desc: 'Achieved a 3-day streak', icon: '🔥', color: 'from-amber-400 to-orange-600' },
  ];

  const renderTrendChart = () => {
    if (!weeklyHistory || weeklyHistory.length === 0) {
      return (
        <div className="h-40 flex items-center justify-center text-slate-400 text-xs italic">
          No historical data available. Complete challenges to start tracking progress!
        </div>
      );
    }

    const width = 500;
    const height = 200;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const values = weeklyHistory.map(h => h.footprint);
    const maxVal = Math.max(...values, 100) * 1.1;
    const minVal = Math.min(...values, 0);

    const getX = (index) => {
      if (weeklyHistory.length <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (index / (weeklyHistory.length - 1)) * chartWidth;
    };

    const getY = (val) => {
      const scale = maxVal - minVal;
      if (scale === 0) return paddingTop + chartHeight / 2;
      return paddingTop + chartHeight - ((val - minVal) / scale) * chartHeight;
    };

    let pathD = '';
    let areaD = `M ${getX(0)} ${paddingTop + chartHeight}`;

    weeklyHistory.forEach((h, index) => {
      const x = getX(index);
      const y = getY(h.footprint);

      if (index === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
      areaD += ` L ${x} ${y}`;
    });

    areaD += ` L ${getX(weeklyHistory.length - 1)} ${paddingTop + chartHeight} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + ratio * chartHeight;
          const gridVal = Math.round(maxVal - ratio * (maxVal - minVal));
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                className="text-[10px] fill-slate-400 font-bold text-right"
                style={{ textAnchor: 'end' }}
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {weeklyHistory.length > 1 && (
          <path d={areaD} fill="url(#areaGrad)" />
        )}

        {weeklyHistory.length > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {weeklyHistory.map((h, index) => {
          const x = getX(index);
          const y = getY(h.footprint);

          return (
            <g key={index} className="group cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="3"
                className="transition-all duration-150 hover:r-8 hover:fill-emerald-600"
              />
              <text
                x={x}
                y={y < paddingTop + 20 ? y + 16 : y - 12}
                className="text-[10px] font-extrabold fill-slate-700 text-center"
                style={{ textAnchor: 'middle' }}
              >
                {h.footprint} kg
              </text>

              <text
                x={x}
                y={paddingTop + chartHeight + 18}
                className="text-[9px] font-bold fill-slate-400"
                style={{ textAnchor: 'middle' }}
              >
                {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">My Progress</h2>
        <p className="text-slate-600 mt-1">
          Monitor your footprint progression, Accept and Complete challenges to build habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">Current Streak</span>
            <h3 className="text-4xl font-extrabold mt-2 tracking-tight">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </h3>
            <p className="text-xs text-amber-100 mt-2 leading-relaxed">
              {currentStreak > 0
                ? "Excellent! You are building carbon-saving habits. Keep completing challenges!"
                : "No streak yet. Accept a challenge in the Habit Coach tab and mark it completed to start!"}
            </p>
          </div>
          <span className="text-6xl animate-soft-pulse select-none">🔥</span>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>📈</span> Weekly Footprint Trend (kg CO2e)
          </h3>
          <div className="px-2">
            {renderTrendChart()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>🏅</span> Badges Unlocked
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked =
              (badge.id === 'eco_aware' && (unlockedBadges.includes('eco_aware') || weeklyHistory?.length > 0)) ||
              (badge.id === 'first_challenge' && (unlockedBadges.includes('first_challenge') || progress?.activeChallenges?.some(c => c.completed))) ||
              (badge.id === 'streak_3' && currentStreak >= 3);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${isUnlocked
                    ? 'border-sage-100 bg-sage-50/20'
                    : 'border-slate-100 bg-slate-50/50 opacity-40 grayscale'
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-gradient-to-br ${isUnlocked ? badge.color : 'from-slate-200 to-slate-300'
                  }`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{badge.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1.5 ${isUnlocked ? 'text-sage-700' : 'text-slate-400'
                    }`}>
                    {isUnlocked ? '✦ Unlocked' : '🔒 Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}