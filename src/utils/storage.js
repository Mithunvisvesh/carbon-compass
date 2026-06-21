const KEYS = {
  PROFILE: 'carbon_compass_profile',
  PROGRESS: 'carbon_compass_progress',
};

// Default profile for Rohan (Tech Pro) or Aditi (Student)
export const DEFAULT_PROFILES = {
  aditi: {
    name: 'Aditi',
    location: 'Chennai',
    baselineInputs: {
      transport: { petrolCar: 0, dieselCar: 0, petrolScooter: 0, motorcycle: 0, bus: 45, electricTrain: 0, cycling: 5, walking: 12 },
      energy: { electricityKwhPerWeek: 15, lpgCylindersPerMonth: 0.15 }, // live in hostel room, low energy
      diet: 'vegetarian',
      waste: { foodWasteKgPerWeek: 2.0 },
    },
    routineDescription: 'I walk to college most days, sometimes take the bus. I eat vegetarian food in the hostel mess, but we often have leftover food that goes to waste. I turn off lights when leaving the room.',
  },
  rohan: {
    name: 'Rohan',
    location: 'Bengaluru',
    baselineInputs: {
      transport: { petrolCar: 80, dieselCar: 0, petrolScooter: 40, motorcycle: 0, bus: 0, electricTrain: 0, cycling: 0, walking: 2 },
      energy: { electricityKwhPerWeek: 60, lpgCylindersPerMonth: 0.8 }, // 2BHK with AC
      diet: 'medium_meat',
      waste: { foodWasteKgPerWeek: 4.5 }, // online food orders
    },
    routineDescription: 'I commute to my tech job by car or scooter. I work in an air-conditioned office. I eat chicken or eggs most days and order takeout via Swiggy/Zomato on weekends. I leave the fridge open sometimes.',
  }
};

export function getProfile() {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function getProgress() {
  const data = localStorage.getItem(KEYS.PROGRESS);
  if (data) {
    const progress = JSON.parse(data);
    
    // Recalculate and decay streak if broken (last completed date is 2 or more days ago)
    if (progress.currentStreak > 0 && progress.lastCompletedDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastDate = new Date(progress.lastCompletedDate);
      const todayDate = new Date(todayStr);
      lastDate.setHours(0,0,0,0);
      todayDate.setHours(0,0,0,0);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 2) {
        progress.currentStreak = 0;
        localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
      }
    }
    
    return progress;
  }
  
  // Return standard empty structure if none exists
  return {
    currentStreak: 0,
    lastCompletedDate: null,
    unlockedBadges: [],
    weeklyHistory: [],
    activeChallenges: [],
  };
}

export function saveProgress(progress) {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export function clearAll() {
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.PROGRESS);
}

/**
 * Initializes a mock 3-week progress log history when onboarding is completed.
 * This ensures the progress chart has visual content right away.
 * 
 * @param {number} baselineFootprint - User's calculated baseline footprint in kg CO2e
 */
export function seedMockHistory(baselineFootprint) {
  const progress = getProgress();
  
  // Create history going back 3 weeks, showing a downward trend
  // Week 3 ago: baseline + 12%
  // Week 2 ago: baseline + 5%
  // Current Week: baseline
  const history = [
    { date: getPastDateString(21), footprint: parseFloat((baselineFootprint * 1.12).toFixed(1)) },
    { date: getPastDateString(14), footprint: parseFloat((baselineFootprint * 1.05).toFixed(1)) },
    { date: getPastDateString(7), footprint: baselineFootprint },
  ];
  
  progress.weeklyHistory = history;
  progress.currentStreak = 3; // Seed a starter streak for gamification
  progress.lastCompletedDate = getPastDateString(1); // Seed yesterday to keep streak active
  progress.unlockedBadges = ['eco_aware', 'streak_3'];
  saveProgress(progress);
}

function getPastDateString(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}
