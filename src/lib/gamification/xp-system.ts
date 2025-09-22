import { UserProgress } from './achievement-system';

// XP Activity types
export interface XPActivity {
  id: string;
  type: XPActivityType;
  points: number;
  multiplier?: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type XPActivityType = 
  | 'ASSIGNMENT_COMPLETED'
  | 'ASSIGNMENT_PERFECT_SCORE'
  | 'DAILY_STREAK'
  | 'WEEKLY_STREAK'
  | 'HELP_PEER'
  | 'CODE_REVIEW'
  | 'COLLABORATION'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'CHALLENGE_COMPLETED'
  | 'FIRST_SUBMISSION'
  | 'LANGUAGE_MASTERY'
  | 'CLEAN_CODE'
  | 'EFFICIENT_SOLUTION'
  | 'MENTORING'
  | 'HACKATHON_PARTICIPATION'
  | 'COMPETITION_WIN'
  | 'DAILY_CHALLENGE'
  | 'WEEKLY_CHALLENGE'
  | 'MONTHLY_CHALLENGE';

export interface Level {
  level: number;
  xpRequired: number;
  xpTotal: number;
  title: string;
  description: string;
  badge?: string;
  rewards?: string[];
}

// XP Configuration
export const XP_CONFIG = {
  // Base XP values for different activities
  ACTIVITIES: {
    ASSIGNMENT_COMPLETED: 50,
    ASSIGNMENT_PERFECT_SCORE: 100,
    DAILY_STREAK: 25,
    WEEKLY_STREAK: 100,
    HELP_PEER: 30,
    CODE_REVIEW: 20,
    COLLABORATION: 40,
    ACHIEVEMENT_UNLOCKED: 25,
    CHALLENGE_COMPLETED: 75,
    FIRST_SUBMISSION: 10,
    LANGUAGE_MASTERY: 200,
    CLEAN_CODE: 15,
    EFFICIENT_SOLUTION: 20,
    MENTORING: 50,
    HACKATHON_PARTICIPATION: 150,
    COMPETITION_WIN: 300,
    DAILY_CHALLENGE: 30,
    WEEKLY_CHALLENGE: 100,
    MONTHLY_CHALLENGE: 250,
  },
  
  // Multipliers
  MULTIPLIERS: {
    STREAK_BONUS: 0.1, // 10% bonus per streak day (max 100%)
    PERFECT_SCORE: 2.0,
    FIRST_TIME: 1.5,
    DIFFICULTY: {
      EASY: 1.0,
      MEDIUM: 1.2,
      HARD: 1.5,
      EXPERT: 2.0,
    },
    LANGUAGE_BONUS: {
      NEW_LANGUAGE: 1.3,
      MASTERED_LANGUAGE: 0.8,
    },
  },
  
  // Level progression (exponential growth)
  LEVEL_BASE_XP: 1000,
  LEVEL_GROWTH_RATE: 1.2,
};

// Level definitions
export const LEVELS: Level[] = [
  { level: 1, xpRequired: 0, xpTotal: 0, title: "Code Newbie", description: "Welcome to your coding journey!" },
  { level: 2, xpRequired: 1000, xpTotal: 1000, title: "Script Kiddie", description: "You're getting the hang of it!" },
  { level: 3, xpRequired: 1200, xpTotal: 2200, title: "Bug Hunter", description: "Finding and fixing bugs like a pro!" },
  { level: 4, xpRequired: 1440, xpTotal: 3640, title: "Code Warrior", description: "Battling through complex problems!" },
  { level: 5, xpRequired: 1728, xpTotal: 5368, title: "Algorithm Master", description: "Mastering the art of algorithms!" },
  { level: 6, xpRequired: 2074, xpTotal: 7442, title: "Data Structure Ninja", description: "Manipulating data like a ninja!" },
  { level: 7, xpRequired: 2488, xpTotal: 9930, title: "System Architect", description: "Designing systems that scale!" },
  { level: 8, xpRequired: 2986, xpTotal: 12916, title: "Code Wizard", description: "Casting spells with code!" },
  { level: 9, xpRequired: 3583, xpTotal: 16499, title: "Tech Guru", description: "Leading the way in technology!" },
  { level: 10, xpRequired: 4300, xpTotal: 20799, title: "Legendary Coder", description: "A legend in the coding world!" },
  // Continue with more levels...
];

// Calculate XP for an activity
export function calculateXP(
  activityType: XPActivityType,
  metadata: Record<string, any> = {}
): number {
  let baseXP = XP_CONFIG.ACTIVITIES[activityType] || 0;
  let multiplier = 1.0;

  // Apply multipliers based on activity type and metadata
  switch (activityType) {
    case 'ASSIGNMENT_COMPLETED':
      if (metadata.perfectScore) {
        multiplier *= XP_CONFIG.MULTIPLIERS.PERFECT_SCORE;
      }
      if (metadata.difficulty) {
        multiplier *= XP_CONFIG.MULTIPLIERS.DIFFICULTY[metadata.difficulty] || 1.0;
      }
      if (metadata.firstTime) {
        multiplier *= XP_CONFIG.MULTIPLIERS.FIRST_TIME;
      }
      break;

    case 'LANGUAGE_MASTERY':
      if (metadata.isNewLanguage) {
        multiplier *= XP_CONFIG.MULTIPLIERS.LANGUAGE_BONUS.NEW_LANGUAGE;
      }
      break;

    case 'DAILY_STREAK':
    case 'WEEKLY_STREAK':
      // Streak bonus is applied in the streak calculation
      break;
  }

  return Math.round(baseXP * multiplier);
}

// Calculate streak bonus
export function calculateStreakBonus(streak: number): number {
  const maxBonus = 1.0; // 100% max bonus
  const bonusPerDay = XP_CONFIG.MULTIPLIERS.STREAK_BONUS;
  return Math.min(streak * bonusPerDay, maxBonus);
}

// Get level information
export function getLevelInfo(totalXP: number): Level {
  let currentLevel = 1;
  let xpForCurrentLevel = 0;
  let xpRequiredForNext = 0;

  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXP >= LEVELS[i].xpTotal) {
      currentLevel = LEVELS[i].level;
      xpForCurrentLevel = totalXP - LEVELS[i].xpTotal;
      
      if (i + 1 < LEVELS.length) {
        xpRequiredForNext = LEVELS[i + 1].xpRequired;
      } else {
        // Max level reached
        xpRequiredForNext = 0;
      }
    } else {
      break;
    }
  }

  return {
    level: currentLevel,
    xpRequired: xpRequiredForNext,
    xpTotal: totalXP,
    title: LEVELS[currentLevel - 1]?.title || 'Unknown',
    description: LEVELS[currentLevel - 1]?.description || '',
  };
}

// Calculate progress to next level
export function getLevelProgress(totalXP: number): {
  currentLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercentage: number;
  xpToNextLevel: number;
} {
  const levelInfo = getLevelInfo(totalXP);
  const currentLevelXP = totalXP - (LEVELS[levelInfo.level - 1]?.xpTotal || 0);
  const nextLevelXP = levelInfo.xpRequired;
  const progressPercentage = nextLevelXP > 0 ? (currentLevelXP / nextLevelXP) * 100 : 100;
  const xpToNextLevel = Math.max(0, nextLevelXP - currentLevelXP);

  return {
    currentLevel: levelInfo.level,
    currentLevelXP,
    nextLevelXP,
    progressPercentage,
    xpToNextLevel,
  };
}

// Update user progress
export function updateUserProgress(
  currentProgress: UserProgress,
  newActivity: XPActivity
): UserProgress {
  const updatedProgress = { ...currentProgress };
  
  // Add XP
  updatedProgress.currentXP += newActivity.points;
  updatedProgress.totalXP += newActivity.points;
  
  // Update level
  const newLevelInfo = getLevelInfo(updatedProgress.totalXP);
  updatedProgress.currentLevel = newLevelInfo.level;
  
  // Update streak if it's a streak activity
  if (newActivity.type === 'DAILY_STREAK') {
    updatedProgress.streak += 1;
  } else if (newActivity.type === 'WEEKLY_STREAK') {
    // Weekly streak milestone
    updatedProgress.streak = Math.max(updatedProgress.streak, 7);
  }
  
  // Update last active date
  updatedProgress.lastActiveDate = new Date();
  
  // Update weekly/monthly XP
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  if (newActivity.createdAt >= weekStart) {
    updatedProgress.weeklyXP += newActivity.points;
  }
  
  if (newActivity.createdAt >= monthStart) {
    updatedProgress.monthlyXP += newActivity.points;
  }
  
  // Update language-specific XP
  if (newActivity.metadata?.language) {
    const language = newActivity.metadata.language;
    updatedProgress.languageXP[language] = (updatedProgress.languageXP[language] || 0) + newActivity.points;
    
    // Update skill level for this language
    const languageXP = updatedProgress.languageXP[language];
    const skillLevel = updatedProgress.skillLevels[language] || {
      language,
      level: 1,
      xp: 0,
      proficiency: 'BEGINNER' as const,
      badges: [],
      milestones: [],
    };
    
    skillLevel.xp = languageXP;
    skillLevel.level = Math.floor(languageXP / 1000) + 1;
    
    // Update proficiency based on XP
    if (languageXP >= 10000) {
      skillLevel.proficiency = 'EXPERT';
    } else if (languageXP >= 5000) {
      skillLevel.proficiency = 'ADVANCED';
    } else if (languageXP >= 2000) {
      skillLevel.proficiency = 'INTERMEDIATE';
    } else {
      skillLevel.proficiency = 'BEGINNER';
    }
    
    updatedProgress.skillLevels[language] = skillLevel;
  }
  
  return updatedProgress;
}

// Generate XP activity
export function createXPActivity(
  type: XPActivityType,
  points: number,
  description: string,
  metadata: Record<string, any> = {}
): XPActivity {
  return {
    id: `xp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    points,
    description,
    metadata,
    createdAt: new Date(),
  };
}

// Calculate daily XP goal
export function calculateDailyXPGoal(userLevel: number): number {
  // Base goal increases with level
  const baseGoal = 100;
  const levelMultiplier = 1 + (userLevel - 1) * 0.1;
  return Math.round(baseGoal * levelMultiplier);
}

// Calculate weekly XP goal
export function calculateWeeklyXPGoal(userLevel: number): number {
  const dailyGoal = calculateDailyXPGoal(userLevel);
  return dailyGoal * 7;
}

// Check if user met daily/weekly goals
export function checkGoalCompletion(
  userProgress: UserProgress,
  goalType: 'DAILY' | 'WEEKLY'
): { met: boolean; progress: number; target: number } {
  const target = goalType === 'DAILY' 
    ? calculateDailyXPGoal(userProgress.currentLevel)
    : calculateWeeklyXPGoal(userProgress.currentLevel);
  
  const progress = goalType === 'DAILY' 
    ? userProgress.weeklyXP / 7 // Approximate daily from weekly
    : userProgress.weeklyXP;
  
  return {
    met: progress >= target,
    progress: Math.min(progress, target),
    target,
  };
}
