import React, { useState, useEffect } from 'react';
import { calculateWeeklyFootprint, REGIONAL_AVERAGES } from '../utils/carbonCalculator';
import { STATIC_FALLBACKS } from '../utils/mockData';
import { saveProgress } from '../utils/storage';

export default function AIHabitCoach({ profile, progress, onUpdateProgress }) {
  const [loading, setLoading] = useState(false);
  const [completedAnimationId, setCompletedAnimationId] = useState(null);

  const breakdown = calculateWeeklyFootprint(profile?.baselineInputs);

  // Identify highest impact category
  const categories = [
    { key: 'transport', value: breakdown.transport, avg: REGIONAL_AVERAGES.transport },
    { key: 'energy', value: breakdown.energy, avg: REGIONAL_AVERAGES.energy },
    { key: 'diet', value: breakdown.diet, avg: REGIONAL_AVERAGES.diet },
    { key: 'waste', value: breakdown.waste, avg: REGIONAL_AVERAGES.waste },
  ];
  const sorted = [...categories].sort((a, b) => (b.value - b.avg) - (a.value - a.avg));
  const highestImpact = sorted[0].key;

  // Initialize challenges and insights
  useEffect(() => {
    const hasNoInsight = !progress.coachInsight;
    const hasNoChallenges = !progress.activeChallenges || progress.activeChallenges.length === 0;
    const categoryMismatch = progress.activeChallenges && progress.activeChallenges.length > 0 && progress.activeChallenges[0].category !== highestImpact;

    if (profile && (hasNoInsight || hasNoChallenges || categoryMismatch)) {
      generateCoaching();
    }
  }, [profile, highestImpact]);

  const generateCoaching = async () => {
    setLoading(true);

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API call timed out after 30 seconds.")), 30000)
      );

      const prompt = `You are CarbonCompass, an encouraging personal sustainability coach.
Analyze this user's profile and recommend actions.

INPUT DATA:
- Weekly Carbon Footprint: ${breakdown.total} kg CO2e
- Breakdown: Transport: ${breakdown.transport} kg, Energy: ${breakdown.energy} kg, Diet: ${breakdown.diet} kg, Waste: ${breakdown.waste} kg
- Highest Impact Category: ${highestImpact}
- Routine description: "${profile.routineDescription || ''}"

CONSTRAINTS:
1. DO NOT perform any carbon calculations. Rely entirely on the INPUT DATA.
2. Provide a 2-3 sentence explanation of their biggest opportunity in plain, encouraging language. Mention specific facts from their routine description if applicable.
3. Suggest exactly 3 weekly challenges.
4. Every challenge MUST be a "Small Win":
   - Setup/completion time: Under 10 minutes.
   - Cost: Under Rs. 500 per month (ideally Free).
   - Weighted directly toward the user's highest-impact category: ${highestImpact}.
5. Return your response in this exact JSON structure:
{
  "coachInsight": "Your feedback here...",
  "challenges": [
    {
      "id": "unique_id_1",
      "title": "Challenge Title",
      "category": "${highestImpact}",
      "description": "Short explanation",
      "timeRequirement": "e.g., 5 mins/day",
      "cost": "e.g., Free or ₹100",
      "impactSavedKg": 2.5
    }
  ]
}`;

      const apiPromise = fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      }).then(res => {
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        return res.text();
      });

      const responseText = await Promise.race([apiPromise, timeoutPromise]);

      let cleanText = responseText.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleanText);

      if (!parsed.coachInsight || !parsed.challenges || parsed.challenges.length !== 3) {
        throw new SyntaxError("Parsed JSON matches format but does not contain the 3 required challenges.");
      }

      const processedChallenges = parsed.challenges.map(c => ({
        ...c,
        accepted: false,
        completed: false
      }));

      const updatedProgress = {
        ...progress,
        coachInsight: parsed.coachInsight,
        activeChallenges: processedChallenges,
        isFallback: false
      };

      saveProgress(updatedProgress);
      onUpdateProgress(updatedProgress);
      setLoading(false);

    } catch (err) {
      loadFallback();
    }
  };

  const loadFallback = () => {
    const fallbackSet = STATIC_FALLBACKS[highestImpact] || STATIC_FALLBACKS.energy;

    const processedChallenges = fallbackSet.challenges.map(c => {
      const existing = progress.activeChallenges?.find(ex => ex.id === c.id);
      return {
        ...c,
        accepted: existing ? existing.accepted : false,
        completed: existing ? existing.completed : false
      };
    });

    const updatedProgress = {
      ...progress,
      coachInsight: fallbackSet.coachInsight,
      activeChallenges: processedChallenges,
      isFallback: true
    };

    saveProgress(updatedProgress);
    onUpdateProgress(updatedProgress);
    setLoading(false);
  };

  const handleAcceptChallenge = (challengeId) => {
    const updatedChallenges = progress.activeChallenges.map(c =>
      c.id === challengeId ? { ...c, accepted: true } : c
    );

    const updatedProgress = {
      ...progress,
      activeChallenges: updatedChallenges
    };

    saveProgress(updatedProgress);
    onUpdateProgress(updatedProgress);
  };

  const handleCompleteChallenge = (challengeId) => {
    setCompletedAnimationId(challengeId);

    setTimeout(() => {
      let challengeSavedImpact = 0;

      const updatedChallenges = progress.activeChallenges.map(c => {
        if (c.id === challengeId) {
          challengeSavedImpact = c.impactSavedKg;
          return { ...c, completed: true };
        }
        return c;
      });

      // Local Timezone Fix for Accurate Streaks
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      let newStreak = progress.currentStreak || 0;

      if (progress.lastCompletedDate !== todayStr) {
        if (!progress.lastCompletedDate) {
          newStreak = 1;
        } else {
          // Parse as local midnight
          const lastDate = new Date(progress.lastCompletedDate + 'T00:00:00');
          const todayDate = new Date(todayStr + 'T00:00:00');
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays >= 2) {
            newStreak = 1; // Streak broken
          }
        }
      }

      // Permanent Badge Unlocks
      const badges = [...(progress.unlockedBadges || [])];
      if (!badges.includes('first_challenge')) {
        badges.push('first_challenge');
      }
      if (newStreak >= 3 && !badges.includes('streak_3')) {
        badges.push('streak_3');
      }

      const history = [...(progress.weeklyHistory || [])];
      if (history.length > 0) {
        const lastEntryIndex = history.length - 1;
        history[lastEntryIndex].footprint = parseFloat(
          Math.max(0, history[lastEntryIndex].footprint - challengeSavedImpact).toFixed(1)
        );
      }

      const updatedProgress = {
        ...progress,
        currentStreak: newStreak,
        lastCompletedDate: todayStr,
        unlockedBadges: badges,
        activeChallenges: updatedChallenges,
        weeklyHistory: history
      };

      saveProgress(updatedProgress);
      onUpdateProgress(updatedProgress);
      setCompletedAnimationId(null);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">AI Habit Coach</h2>
        <p className="text-slate-600 mt-1">
          Personalized insights and small weekly habits weighted to address your highest carbon impact.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 animate-pulse space-y-4 h-48" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-sage-50 to-emerald-50/20 rounded-3xl p-6 sm:p-8 shadow-md border border-sage-100 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 text-9xl pointer-events-none select-none">🧭</div>
            <div className="text-4xl">🦉</div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sage-700">Coach Insight</span>
              <h3 className="text-lg font-bold text-slate-800 mt-1">Your Opportunity Analysis</h3>
              <p className="text-slate-700 text-sm mt-3 leading-relaxed">
                {progress.coachInsight}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🎯</span> Weekly Challenges ("Small Wins")
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {progress.activeChallenges && progress.activeChallenges.map((item) => {
                const isCompleted = item.completed;
                const isAccepted = item.accepted;
                const isAnimating = completedAnimationId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl p-6 shadow-md border transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden ${isCompleted
                        ? 'border-emerald-200 bg-emerald-50/20 opacity-70'
                        : isAnimating
                          ? 'border-emerald-400 bg-emerald-50 scale-95'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        ⚡ Quick Win
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                        -{item.impactSavedKg} kg CO2
                      </span>
                    </div>

                    <div className="mb-6">
                      <h4 className={`font-bold text-slate-800 text-md ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-slate-500 font-semibold">
                        <span className="bg-slate-100 px-2 py-1 rounded">⏱️ {item.timeRequirement}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded">💰 {item.cost}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      {isCompleted ? (
                        <div className="w-full text-center py-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1">
                          <span>✓</span> Completed
                        </div>
                      ) : isAccepted ? (
                        <button
                          onClick={() => handleCompleteChallenge(item.id)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1"
                        >
                          {isAnimating ? 'Completing...' : 'Mark Completed'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAcceptChallenge(item.id)}
                          className="w-full py-2.5 border border-sage-200 hover:border-sage-500 text-sage-800 hover:bg-sage-50 rounded-xl font-bold text-xs transition-all"
                        >
                          Accept Challenge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}