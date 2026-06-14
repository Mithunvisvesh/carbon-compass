import React, { useState, useEffect, useRef } from 'react';
import { calculateWeeklyFootprint, REGIONAL_AVERAGES } from '../utils/carbonCalculator';
import { calculateOpportunityScores, selectCuratedChallenges, generateSmartCoachInsight } from '../utils/challengeLibrary';
import { saveProgress } from '../utils/storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIHabitCoach({ 
  profile, 
  progress, 
  onUpdateProgress, 
  apiKey, 
  quotaSafety, 
  apiStats, 
  onUpdateApiStats 
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [usingFallback, setUsingFallback] = useState(() => {
    if (progress && progress.isFallback !== undefined) {
      return progress.isFallback;
    }
    return !apiKey;
  });
  const [completedAnimationId, setCompletedAnimationId] = useState(null);
  const [debugStatus, setDebugStatus] = useState(() => {
    if (!apiKey) return 'Missing Key';
    return progress.isFallback ? 'Smart Coach Active' : 'Gemini Success';
  });

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

  // Compute profile hash
  const currentHash = JSON.stringify({
    baselineInputs: profile?.baselineInputs || {},
    routineDescription: profile?.routineDescription || '',
    name: profile?.name || ''
  });

  const [isBlockedBySafety, setIsBlockedBySafety] = useState(() => {
    if (!profile) return false;
    const hasNoInsight = !progress.coachInsight;
    const hasNoChallenges = !progress.activeChallenges || progress.activeChallenges.length === 0;
    const categoryMismatch = progress.activeChallenges && progress.activeChallenges.length > 0 && progress.activeChallenges[0].category !== highestImpact;
    const keyChanged = progress.generatedWithKey !== apiKey;
    const hashMismatch = progress.profileHash !== currentHash;

    const isCacheMiss = hasNoInsight || hasNoChallenges || categoryMismatch || keyChanged || hashMismatch;
    return isCacheMiss && quotaSafety;
  });

  const cacheCountedRef = useRef(null);

  // Initialize challenges and insights
  useEffect(() => {
    if (!profile) return;

    const hasNoInsight = !progress.coachInsight;
    const hasNoChallenges = !progress.activeChallenges || progress.activeChallenges.length === 0;
    const categoryMismatch = progress.activeChallenges && progress.activeChallenges.length > 0 && progress.activeChallenges[0].category !== highestImpact;
    const keyChanged = progress.generatedWithKey !== apiKey;
    const hashMismatch = progress.profileHash !== currentHash;

    const isCacheMiss = hasNoInsight || hasNoChallenges || categoryMismatch || keyChanged || hashMismatch;

    if (isCacheMiss) {
      if (quotaSafety) {
        console.log("Quota Safety Mode: Blocked automatic generation on cache miss.");
        setIsBlockedBySafety(true);
      } else {
        setIsBlockedBySafety(false);
        generateCoaching();
      }
    } else {
      // Cache hit
      setIsBlockedBySafety(false);
      // Increment cache hit count only once per unique cache configuration
      const trackingKey = `${currentHash}_${apiKey}`;
      if (cacheCountedRef.current !== trackingKey) {
        cacheCountedRef.current = trackingKey;
        if (onUpdateApiStats) {
          onUpdateApiStats(prev => ({
            ...prev,
            cacheHits: prev.cacheHits + 1
          }));
        }
      }
    }
  }, [profile, highestImpact, apiKey, quotaSafety, currentHash]);

  const generateCoaching = async () => {
    setLoading(true);
    setErrorMsg('');
    setUsingFallback(false);
    setIsBlockedBySafety(false);
    
    console.log("=== [Gemini API Diagnostic Audit] ===");
    console.log("1. API Key Detection Status:", apiKey ? `Detected (Length: ${apiKey.length}, Prefix: ${apiKey.substring(0, 6)}...)` : "Missing Key");
    console.log("2. Profile Name:", profile?.name);
    console.log("3. Highest Impact Category:", highestImpact);
    console.log("4. Calculated Footprint Breakdown:", breakdown);

    if (!apiKey) {
      console.log("5. Fallback Trigger Reason: No API key provided.");
      setDebugStatus('Missing Key (Smart Coach Active)');
      loadFallback();
      return;
    }

    if (onUpdateApiStats) {
      onUpdateApiStats(prev => ({
        ...prev,
        requests: prev.requests + 1
      }));
    }

    setDebugStatus('Loading...');
    console.log("5. Request Start: Initializing GoogleGenerativeAI client and prompt payload...");
    
    let startTime;
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      // Set API timeout of 30 seconds
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

      console.log("6. Request Payload Prompt:\n", prompt);
      
      const requestStartTimestamp = new Date().toISOString();
      startTime = performance.now();
      console.log(`7. Sending API call request to Google Gemini at: ${requestStartTimestamp}`);
      
      const apiPromise = model.generateContent(prompt);
      const result = await Promise.race([apiPromise, timeoutPromise]);
      
      const firstResponseTimestamp = new Date().toISOString();
      const endTime = performance.now();
      const durationSec = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`8. Response Status: RECEIVED successfully at ${firstResponseTimestamp}.`);
      console.log(`8b. Full Request Duration: ${durationSec} seconds.`);
      
      const responseText = result.response.text();
      console.log("9. Raw Response Content:\n", responseText);
      
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      }

      console.log("10. Attempting JSON parsing of clean text...");
      const parsed = JSON.parse(cleanText);
      console.log("11. JSON Parsing Result: SUCCESS", parsed);
      
      if (!parsed.coachInsight || !parsed.challenges || parsed.challenges.length !== 3) {
        throw new SyntaxError("Parsed JSON matches format but does not contain the 3 required challenges.");
      }

      // Map accepted state
      const processedChallenges = parsed.challenges.map(c => ({
        ...c,
        accepted: false,
        completed: false
      }));

      const updatedProgress = {
        ...progress,
        coachInsight: parsed.coachInsight,
        activeChallenges: processedChallenges,
        isFallback: false,
        generatedWithKey: apiKey,
        generatedAt: new Date().toISOString(),
        profileHash: currentHash
      };

      saveProgress(updatedProgress);
      onUpdateProgress(updatedProgress);
      setUsingFallback(false);
      setDebugStatus('Gemini Success');
      setLoading(false);

      if (onUpdateApiStats) {
        onUpdateApiStats(prev => ({
          ...prev,
          lastSuccess: new Date().toISOString()
        }));
      }

    } catch (err) {
      const firstResponseTimestamp = new Date().toISOString();
      const durationSec = startTime ? ((performance.now() - startTime) / 1000).toFixed(2) : 'N/A';
      
      console.error(`12. Diagnostic Failure Point: Error encountered during execution at ${firstResponseTimestamp} (Duration: ${durationSec}s).`);
      console.error("Error Detail:", err);
      
      let triggerReason = 'API Error';
      if (err instanceof SyntaxError) {
        triggerReason = 'Parsing Error';
      }

      if (onUpdateApiStats) {
        onUpdateApiStats(prev => ({
          ...prev,
          lastFailure: new Date().toISOString()
        }));
      }
      
      console.log(`13. Fallback Trigger Reason: ${triggerReason} (Loading fallbacks instead)`);
      setDebugStatus(`${triggerReason} (Smart Coach Active)`);
      setErrorMsg(err.message || String(err));
      loadFallback();
    }
  };

  const loadFallback = () => {
    // Generate opportunity scores
    const oppScores = calculateOpportunityScores(breakdown, profile?.baselineInputs);
    // Select curated challenges
    const selected = selectCuratedChallenges(profile, breakdown, oppScores);
    
    // Map processed challenges (preserving state if they already match by id)
    const processedChallenges = selected.map(c => {
      const existing = progress.activeChallenges?.find(ex => ex.id === c.id);
      return {
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description,
        timeRequirement: c.estimatedTime,
        cost: c.estimatedCost,
        impactSavedKg: c.estimatedImpactKg,
        accepted: existing ? existing.accepted : false,
        completed: existing ? existing.completed : false
      };
    });

    // Generate personalized insight text
    const insightText = generateSmartCoachInsight({
      profile,
      breakdown,
      opportunityScores: oppScores,
      selectedChallenges: selected
    });

    const updatedProgress = {
      ...progress,
      coachInsight: insightText,
      activeChallenges: processedChallenges,
      isFallback: true,
      generatedWithKey: apiKey,
      generatedAt: new Date().toISOString(),
      profileHash: currentHash
    };

    saveProgress(updatedProgress);
    onUpdateProgress(updatedProgress);
    setUsingFallback(true);
    setLoading(false);
    setIsBlockedBySafety(false);
  };

  // Toggle Challenge Accepted Status
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

  // Mark Challenge Completed
  const handleCompleteChallenge = (challengeId) => {
    setCompletedAnimationId(challengeId);

    // After animation, trigger state updates
    setTimeout(() => {
      let challengeSavedImpact = 0;
      
      const updatedChallenges = progress.activeChallenges.map(c => {
        if (c.id === challengeId) {
          challengeSavedImpact = c.impactSavedKg;
          return { ...c, completed: true };
        }
        return c;
      });

      // Calculate new streak based on real dates
      const todayStr = new Date().toISOString().split('T')[0];
      let newStreak = progress.currentStreak || 0;
      
      if (progress.lastCompletedDate !== todayStr) {
        if (!progress.lastCompletedDate) {
          newStreak = 1;
        } else {
          const lastDate = new Date(progress.lastCompletedDate);
          const todayDate = new Date(todayStr);
          lastDate.setHours(0,0,0,0);
          todayDate.setHours(0,0,0,0);
          const diffTime = todayDate - lastDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays >= 2) {
            newStreak = 1; // Streak broken, reset to 1
          }
        }
      }

      // Unlocked badges checks
      const badges = [...(progress.unlockedBadges || [])];
      if (!badges.includes('first_challenge')) {
        badges.push('first_challenge');
      }
      if (newStreak >= 3 && !badges.includes('streak_3')) {
        badges.push('streak_3');
      }

      // Add to history
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
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">AI Habit Coach</h2>
          <p className="text-slate-600 mt-1">
            Personalized insights and small weekly habits weighted to address your highest carbon impact.
          </p>
        </div>
        <button
          onClick={generateCoaching}
          disabled={loading}
          className="px-4 py-2 bg-sage-50 hover:bg-sage-100 disabled:bg-slate-100 text-sage-800 font-bold border border-sage-200 rounded-xl transition-all text-xs"
        >
          {loading ? 'Consulting Coach...' : '🔄 Refresh Insight'}
        </button>
      </div>

      {/* Coach Mode Status Indicator */}
      {!isBlockedBySafety && (
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-100 mb-6 flex items-start gap-4">
          <div className="text-3xl">{usingFallback ? '⚡' : '🦉'}</div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">
              {usingFallback ? 'Smart Coach Mode Active' : 'Cloud AI Coach Active'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {usingFallback 
                ? "Personalized sustainability insights powered by CarbonCompass's local intelligence engine."
                : "Personalized sustainability insights powered by Cloud AI."}
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
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
      ) : isBlockedBySafety ? (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 text-center max-w-xl mx-auto my-8 space-y-6">
          <div className="text-5xl">🧭</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Coaching Insight Ready</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Click the button below to generate your personalized coaching analysis and weekly sustainability challenges.
            </p>
          </div>
          <div>
            <button
              onClick={generateCoaching}
              className="px-6 py-3 bg-sage-700 hover:bg-sage-800 text-white rounded-xl font-bold transition-all shadow-md shadow-sage-700/20 text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <span>🔄</span> Load Coach Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Coach Advice Card */}
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

          {/* Challenge System */}
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
                    className={`bg-white rounded-3xl p-6 shadow-md border transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden ${
                      isCompleted 
                        ? 'border-emerald-200 bg-emerald-50/20 opacity-70' 
                        : isAnimating 
                        ? 'border-emerald-400 bg-emerald-50 scale-95'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Header badge tags */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                        ⚡ Quick Win
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                        -{item.impactSavedKg} kg CO2
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <h4 className={`font-bold text-slate-800 text-md ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Meta requirements */}
                      <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-slate-500 font-semibold">
                        <span className="bg-slate-100 px-2 py-1 rounded">⏱️ {item.timeRequirement}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded">💰 {item.cost}</span>
                      </div>
                    </div>

                    {/* Action button */}
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
