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
  seedMockHistory, 
  clearAll 
} from './utils/storage';
import { calculateWeeklyFootprint } from './utils/carbonCalculator';

export default function App() {
  const [profile, setProfile] = useState(() => getProfile());
  const [progress, setProgress] = useState(() => getProgress());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);

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
    setShowSettings(true);
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
            {activeTab === 'coach' && <AIHabitCoach profile={profile} progress={progress} onUpdateProgress={setProgress} />}
            {activeTab === 'progress' && <ProgressTracker progress={progress} />}
            {activeTab === 'methodology' && <Methodology />}
          </div>
        )}
      </main>

      {/* Settings & Reset Modal */}
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

            <div className="space-y-6">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <span>🔒</span> Server-Side AI Active
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The AI Habit Coach is securely pre-configured on our backend using Gemini 2.0 Flash. No client-side API key is required.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6">
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
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-sage-100 bg-white text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} CarbonCompass &middot; PromptWars Hackathon Challenge 3</p>
      </footer>
    </div>
  );
}
