import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ImpactSimulator from './components/ImpactSimulator';
import AIHabitCoach from './components/AIHabitCoach';
import ProgressTracker from './components/ProgressTracker';
import Methodology from './components/Methodology';

import { 
  getProfile, 
  saveProfile, 
  getProgress, 
  saveProgress, 
  getApiKey, 
  saveApiKey, 
  seedMockHistory, 
  clearAll 
} from './utils/storage';
import { calculateWeeklyFootprint } from './utils/carbonCalculator';

export default function App() {
  const [profile, setProfile] = useState(() => getProfile());
  const [progress, setProgress] = useState(() => getProgress());
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [quotaSafety, setQuotaSafety] = useState(() => {
    const saved = localStorage.getItem('carbon_compass_quota_safety');
    return saved ? JSON.parse(saved) : true;
  });
  const [tempQuotaSafety, setTempQuotaSafety] = useState(true);
  const [apiStats, setApiStats] = useState({
    requests: 0,
    cacheHits: 0,
    lastSuccess: null,
    lastFailure: null
  });

  // Handle onboarding completion
  const handleOnboardingComplete = (newProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    
    // Calculate baseline score
    const scoreBreakdown = calculateWeeklyFootprint(newProfile.baselineInputs);
    
    // Seed history if empty
    const currentProgress = getProgress();
    if (!currentProgress.weeklyHistory || currentProgress.weeklyHistory.length === 0) {
      seedMockHistory(scoreBreakdown.total);
      setProgress(getProgress());
    } else {
      setProgress(currentProgress);
    }
    
    setActiveTab('dashboard');
  };

  // Reset profile to do a clean test run
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all profile data? This will clear your streak and history.')) {
      clearAll();
      setProfile(null);
      setProgress(getProgress());
      setActiveTab('dashboard');
      setShowSettings(false);
    }
  };

  const handleOpenSettings = () => {
    setTempKey(apiKey);
    setTempQuotaSafety(quotaSafety);
    setShowSettings(true);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    saveApiKey(tempKey);
    setApiKey(tempKey);
    localStorage.setItem('carbon_compass_quota_safety', JSON.stringify(tempQuotaSafety));
    setQuotaSafety(tempQuotaSafety);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasProfile={!!profile} 
        onOpenSettings={handleOpenSettings}
      />

      {/* Main Content Area */}
      <main className="flex-grow pb-16">
        {!profile ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <div className="transition-all duration-300">
            {activeTab === 'dashboard' && <Dashboard profile={profile} />}
            {activeTab === 'simulator' && <ImpactSimulator profile={profile} />}
            {activeTab === 'coach' && (
              <AIHabitCoach 
                profile={profile} 
                progress={progress} 
                onUpdateProgress={setProgress} 
                apiKey={apiKey} 
                quotaSafety={quotaSafety}
                apiStats={apiStats}
                onUpdateApiStats={setApiStats}
              />
            )}
            {activeTab === 'progress' && <ProgressTracker progress={progress} />}
            {activeTab === 'methodology' && <Methodology />}
          </div>
        )}
      </main>

      {/* API settings & Reset Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>⚙️</span> Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AI Coach Key (e.g. AIzaSy...)"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-800 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Used purely client-side to enable Cloud AI Coach Mode (Gemini-powered). If left empty, CarbonCompass will run in local Smart Coach Mode, utilizing a privacy-first rule-based expert system.
                </p>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempQuotaSafety}
                    onChange={(e) => setTempQuotaSafety(e.target.checked)}
                    className="rounded text-sage-600 focus:ring-sage-500 w-4 h-4"
                  />
                  <span>Optimize AI Requests</span>
                </label>
                <p className="text-[10px] text-slate-400 mt-1 pl-6">
                  When active, automated requests are paused to conserve resources. Insights will generate when you manually click the refresh button.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  className="w-full py-3 bg-sage-700 hover:bg-sage-800 text-white rounded-xl font-bold transition-all shadow-md shadow-sage-700/20"
                >
                  Save Settings
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Danger Zone</h4>
              <button
                onClick={handleReset}
                className="w-full py-2.5 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl text-sm font-semibold transition-all"
              >
                Reset App & Profile Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-sage-100 bg-white text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} CarbonCompass &middot; PromptWars Hackathon Challenge 3</p>
      </footer>
    </div>
  );
}
