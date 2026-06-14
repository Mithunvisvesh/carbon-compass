import React from 'react';

export default function Navigation({ activeTab, setActiveTab, hasProfile, onOpenSettings }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', subtitle: 'Understand', icon: '📊' },
    { id: 'simulator', label: 'Simulator', subtitle: 'Simulate', icon: '⚡' },
    { id: 'coach', label: 'Habit Coach', subtitle: 'Act', icon: '🧭' },
    { id: 'progress', label: 'My Progress', subtitle: 'Sustain', icon: '📈' },
    { id: 'methodology', label: 'Methodology', subtitle: 'Learn', icon: '📚' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass px-4 py-3 shadow-sm border-b border-sage-100 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => hasProfile && setActiveTab('dashboard')}>
          <span className="text-3xl">🧭</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-sage-900 m-0 leading-none">CarbonCompass</h1>
            <p className="text-xs text-sage-600 font-medium tracking-wide uppercase mt-1">Not just measure. Guide.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {hasProfile && (
          <nav className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center px-3 md:px-4 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-sage-700 text-white shadow-md shadow-sage-700/25'
                      : 'text-slate-600 hover:text-sage-800 hover:bg-sage-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm font-semibold tracking-wide">{tab.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      isActive ? 'text-sage-200' : 'text-slate-400'
                    }`}
                  >
                    {tab.subtitle}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* API Settings Gear */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-500 hover:text-sage-800 hover:bg-sage-50 rounded-xl transition-colors self-end md:self-auto"
          title="AI Coach Settings"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
