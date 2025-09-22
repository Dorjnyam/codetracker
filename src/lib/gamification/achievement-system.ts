// Achievement types
export type AchievementCategory = 
  | 'STREAK'
  | 'LANGUAGE_MASTERY'
  | 'ASSIGNMENT_COMPLETION'
  | 'COLLABORATION'
  | 'CODE_QUALITY'
  | 'MENTORING'
  | 'CHALLENGE'
  | 'SPECIAL_EVENT'
  | 'HIDDEN'
  | 'SOCIAL';

export type AchievementRarity = 
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY';

export interface AchievementRequirement {
  type: string;
  condition: Record<string, any>;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  requirements: AchievementRequirement[];
  isHidden: boolean;
  isActive: boolean;
  unlockConditions: Record<string, any>;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: Record<string, any>;
  isNotified: boolean;
  achievement: Achievement;
}

export interface UserProgress {
  userId: string;
  currentLevel: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  lastActiveDate: Date;
  weeklyXP: number;
  monthlyXP: number;
  languageXP: Record<string, number>;
  skillLevels: Record<string, SkillLevel>;
  achievements: UserAchievement[];
  goals: UserGoal[];
  challenges: UserChallenge[];
}

export interface SkillLevel {
  language: string;
  level: number;
  xp: number;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  badges: string[];
  milestones: SkillMilestone[];
}

export interface SkillMilestone {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  achieved: boolean;
  achievedAt?: Date;
}

export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 
  | 'DAILY_XP'
  | 'WEEKLY_XP'
  | 'MONTHLY_XP'
  | 'STREAK_DAYS'
  | 'ASSIGNMENTS_COMPLETED'
  | 'LANGUAGE_XP'
  | 'ACHIEVEMENTS_UNLOCKED'
  | 'CODE_LINES_WRITTEN'
  | 'HOURS_CODING'
  | 'PEER_HELP_SESSIONS';

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  joinedAt: Date;
  score: number;
  submissions: number;
  rank?: number;
  completed: boolean;
  completedAt?: Date;
  progress: Record<string, any>;
  challenge: Challenge;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  xpReward: number;
  startDate: Date;
  endDate: Date;
  maxParticipants?: number;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  isActive: boolean;
  createdBy: string;
  participants: ChallengeParticipant[];
  leaderboard?: Leaderboard;
}

export type ChallengeType = 
  | 'DAILY_CODING'
  | 'WEEKLY_THEME'
  | 'MONTHLY_HACKATHON'
  | 'PEER_TO_PEER'
  | 'TEACHER_CUSTOM'
  | 'SKILL_BUILDING'
  | 'SPEED_CODING'
  | 'ALGORITHM_CHALLENGE'
  | 'PROJECT_BUILDING';

export interface ChallengeRequirement {
  type: string;
  description: string;
  criteria: Record<string, any>;
}

export interface ChallengeReward {
  type: 'XP' | 'BADGE' | 'ACHIEVEMENT' | 'CUSTOM';
  value: any;
  description: string;
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: Date;
  score: number;
  submissions: number;
  rank?: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: LeaderboardType;
  scope: LeaderboardScope;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  lastUpdated: Date;
  filters?: LeaderboardFilters;
}

export type LeaderboardType = 
  | 'TOTAL_XP'
  | 'WEEKLY_XP'
  | 'MONTHLY_XP'
  | 'STREAK'
  | 'ACHIEVEMENTS'
  | 'ASSIGNMENTS_COMPLETED'
  | 'LANGUAGE_SPECIFIC'
  | 'CLASS_RANKING'
  | 'CHALLENGE_SCORE';

export type LeaderboardScope = 
  | 'GLOBAL'
  | 'CLASS'
  | 'SCHOOL'
  | 'REGION'
  | 'CUSTOM';

export type LeaderboardPeriod = 
  | 'ALL_TIME'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'DAILY';

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
    level: number;
    xp: number;
    streak: number;
  };
  score: number;
  change?: number;
  metadata?: Record<string, any>;
}

export interface LeaderboardFilters {
  language?: string;
  classId?: string;
  role?: any;
  minLevel?: number;
  maxLevel?: number;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

export interface ActivityHeatmapEntry {
  date: string;
  count: number;
  xp: number;
  activities: string[];
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day coding streak',
    icon: '🔥',
    category: 'STREAK',
    rarity: 'COMMON',
    xpReward: 100,
    requirements: [{ type: 'streak', condition: { days: 7 }, description: 'Code for 7 consecutive days' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { streak: 7 },
    createdAt: new Date(),
  },
  {
    id: 'streak_30',
    name: 'Month Master',
    description: 'Maintain a 30-day coding streak',
    icon: '⚡',
    category: 'STREAK',
    rarity: 'UNCOMMON',
    xpReward: 500,
    requirements: [{ type: 'streak', condition: { days: 30 }, description: 'Code for 30 consecutive days' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { streak: 30 },
    createdAt: new Date(),
  },
  {
    id: 'streak_100',
    name: 'Century Coder',
    description: 'Maintain a 100-day coding streak',
    icon: '💎',
    category: 'STREAK',
    rarity: 'LEGENDARY',
    xpReward: 2000,
    requirements: [{ type: 'streak', condition: { days: 100 }, description: 'Code for 100 consecutive days' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { streak: 100 },
    createdAt: new Date(),
  },

  // Assignment Achievements
  {
    id: 'first_assignment',
    name: 'First Steps',
    description: 'Complete your first assignment',
    icon: '🎯',
    category: 'ASSIGNMENT_COMPLETION',
    rarity: 'COMMON',
    xpReward: 50,
    requirements: [{ type: 'assignments_completed', condition: { count: 1 }, description: 'Complete 1 assignment' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { assignmentsCompleted: 1 },
    createdAt: new Date(),
  },
  {
    id: 'assignment_master_10',
    name: 'Assignment Apprentice',
    description: 'Complete 10 assignments',
    icon: '📚',
    category: 'ASSIGNMENT_COMPLETION',
    rarity: 'COMMON',
    xpReward: 200,
    requirements: [{ type: 'assignments_completed', condition: { count: 10 }, description: 'Complete 10 assignments' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { assignmentsCompleted: 10 },
    createdAt: new Date(),
  },
  {
    id: 'assignment_master_50',
    name: 'Assignment Expert',
    description: 'Complete 50 assignments',
    icon: '🏆',
    category: 'ASSIGNMENT_COMPLETION',
    rarity: 'RARE',
    xpReward: 1000,
    requirements: [{ type: 'assignments_completed', condition: { count: 50 }, description: 'Complete 50 assignments' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { assignmentsCompleted: 50 },
    createdAt: new Date(),
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on an assignment',
    icon: '💯',
    category: 'ASSIGNMENT_COMPLETION',
    rarity: 'UNCOMMON',
    xpReward: 100,
    requirements: [{ type: 'perfect_score', condition: { count: 1 }, description: 'Get 100% on 1 assignment' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { perfectScores: 1 },
    createdAt: new Date(),
  },

  // Language Mastery Achievements
  {
    id: 'python_novice',
    name: 'Python Novice',
    description: 'Earn 1000 XP in Python',
    icon: '🐍',
    category: 'LANGUAGE_MASTERY',
    rarity: 'COMMON',
    xpReward: 150,
    requirements: [{ type: 'language_xp', condition: { language: 'python', xp: 1000 }, description: 'Earn 1000 XP in Python' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { languageXP: { python: 1000 } },
    createdAt: new Date(),
  },
  {
    id: 'javascript_ninja',
    name: 'JavaScript Ninja',
    description: 'Earn 5000 XP in JavaScript',
    icon: '⚡',
    category: 'LANGUAGE_MASTERY',
    rarity: 'RARE',
    xpReward: 500,
    requirements: [{ type: 'language_xp', condition: { language: 'javascript', xp: 5000 }, description: 'Earn 5000 XP in JavaScript' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { languageXP: { javascript: 5000 } },
    createdAt: new Date(),
  },
  {
    id: 'polyglot',
    name: 'Polyglot Programmer',
    description: 'Master 3 different programming languages',
    icon: '🌍',
    category: 'LANGUAGE_MASTERY',
    rarity: 'EPIC',
    xpReward: 1000,
    requirements: [{ type: 'languages_mastered', condition: { count: 3 }, description: 'Master 3 programming languages' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { languagesMastered: 3 },
    createdAt: new Date(),
  },

  // Collaboration Achievements
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Complete 5 collaborative assignments',
    icon: '🤝',
    category: 'COLLABORATION',
    rarity: 'UNCOMMON',
    xpReward: 300,
    requirements: [{ type: 'collaborations', condition: { count: 5 }, description: 'Complete 5 collaborative assignments' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { collaborations: 5 },
    createdAt: new Date(),
  },
  {
    id: 'mentor',
    name: 'Code Mentor',
    description: 'Help 10 peers with their code',
    icon: '👨‍🏫',
    category: 'MENTORING',
    rarity: 'RARE',
    xpReward: 500,
    requirements: [{ type: 'peer_help', condition: { count: 10 }, description: 'Help 10 peers with their code' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { peerHelp: 10 },
    createdAt: new Date(),
  },

  // Code Quality Achievements
  {
    id: 'clean_coder',
    name: 'Clean Coder',
    description: 'Write clean, efficient code 10 times',
    icon: '✨',
    category: 'CODE_QUALITY',
    rarity: 'UNCOMMON',
    xpReward: 200,
    requirements: [{ type: 'clean_code', condition: { count: 10 }, description: 'Write clean code 10 times' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { cleanCode: 10 },
    createdAt: new Date(),
  },
  {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Write efficient solutions 5 times',
    icon: '⚡',
    category: 'CODE_QUALITY',
    rarity: 'RARE',
    xpReward: 300,
    requirements: [{ type: 'efficient_solution', condition: { count: 5 }, description: 'Write efficient solutions 5 times' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { efficientSolutions: 5 },
    createdAt: new Date(),
  },

  // Challenge Achievements
  {
    id: 'challenge_champion',
    name: 'Challenge Champion',
    description: 'Complete 10 challenges',
    icon: '🏅',
    category: 'CHALLENGE',
    rarity: 'RARE',
    xpReward: 400,
    requirements: [{ type: 'challenges_completed', condition: { count: 10 }, description: 'Complete 10 challenges' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { challengesCompleted: 10 },
    createdAt: new Date(),
  },
  {
    id: 'daily_warrior',
    name: 'Daily Warrior',
    description: 'Complete 7 daily challenges',
    icon: '🗓️',
    category: 'CHALLENGE',
    rarity: 'UNCOMMON',
    xpReward: 250,
    requirements: [{ type: 'daily_challenges', condition: { count: 7 }, description: 'Complete 7 daily challenges' }],
    isHidden: false,
    isActive: true,
    unlockConditions: { dailyChallenges: 7 },
    createdAt: new Date(),
  },

  // Hidden Achievements (Easter Eggs)
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Code at 3 AM',
    icon: '🦉',
    category: 'HIDDEN',
    rarity: 'RARE',
    xpReward: 100,
    requirements: [{ type: 'night_coding', condition: { hour: 3 }, description: 'Code at 3 AM' }],
    isHidden: true,
    isActive: true,
    unlockConditions: { nightCoding: true },
    createdAt: new Date(),
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Code at 6 AM',
    icon: '🐦',
    category: 'HIDDEN',
    rarity: 'RARE',
    xpReward: 100,
    requirements: [{ type: 'early_coding', condition: { hour: 6 }, description: 'Code at 6 AM' }],
    isHidden: true,
    isActive: true,
    unlockConditions: { earlyCoding: true },
    createdAt: new Date(),
  },
];

// Check if user qualifies for an achievement
export function checkAchievementEligibility(
  achievement: Achievement,
  userProgress: UserProgress,
  recentActivity?: XPActivity[]
): boolean {
  const conditions = achievement.unlockConditions;
  
  // Check if user already has this achievement
  const hasAchievement = userProgress.achievements.some(
    ua => ua.achievementId === achievement.id
  );
  
  if (hasAchievement) return false;
  
  // Check each condition
  for (const [key, value] of Object.entries(conditions)) {
    switch (key) {
      case 'streak':
        if (userProgress.streak < value) return false;
        break;
        
      case 'assignmentsCompleted':
        const completedAssignments = userProgress.achievements.filter(
          ua => ua.achievement.category === 'ASSIGNMENT_COMPLETION'
        ).length;
        if (completedAssignments < value) return false;
        break;
        
      case 'perfectScores':
        const perfectScores = recentActivity?.filter(
          activity => activity.type === 'ASSIGNMENT_PERFECT_SCORE'
        ).length || 0;
        if (perfectScores < value) return false;
        break;
        
      case 'languageXP':
        for (const [language, requiredXP] of Object.entries(value)) {
          const languageXP = userProgress.languageXP[language] || 0;
          if (languageXP < requiredXP) return false;
        }
        break;
        
      case 'languagesMastered':
        const masteredLanguages = Object.values(userProgress.skillLevels).filter(
          skill => skill.proficiency === 'EXPERT'
        ).length;
        if (masteredLanguages < value) return false;
        break;
        
      case 'collaborations':
        const collaborations = recentActivity?.filter(
          activity => activity.type === 'COLLABORATION'
        ).length || 0;
        if (collaborations < value) return false;
        break;
        
      case 'peerHelp':
        const peerHelp = recentActivity?.filter(
          activity => activity.type === 'HELP_PEER'
        ).length || 0;
        if (peerHelp < value) return false;
        break;
        
      case 'cleanCode':
        const cleanCode = recentActivity?.filter(
          activity => activity.type === 'CLEAN_CODE'
        ).length || 0;
        if (cleanCode < value) return false;
        break;
        
      case 'efficientSolutions':
        const efficientSolutions = recentActivity?.filter(
          activity => activity.type === 'EFFICIENT_SOLUTION'
        ).length || 0;
        if (efficientSolutions < value) return false;
        break;
        
      case 'challengesCompleted':
        const challengesCompleted = userProgress.challenges.filter(
          challenge => challenge.completed
        ).length;
        if (challengesCompleted < value) return false;
        break;
        
      case 'dailyChallenges':
        const dailyChallenges = userProgress.challenges.filter(
          challenge => challenge.challenge.type === 'DAILY_CODING' && challenge.completed
        ).length;
        if (dailyChallenges < value) return false;
        break;
        
      case 'nightCoding':
        const nightCoding = recentActivity?.some(
          activity => new Date(activity.createdAt).getHours() === 3
        ) || false;
        if (!nightCoding) return false;
        break;
        
      case 'earlyCoding':
        const earlyCoding = recentActivity?.some(
          activity => new Date(activity.createdAt).getHours() === 6
        ) || false;
        if (!earlyCoding) return false;
        break;
    }
  }
  
  return true;
}

// Unlock achievement for user
export function unlockAchievement(
  userId: string,
  achievement: Achievement
): UserAchievement {
  return {
    id: `ua_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    achievementId: achievement.id,
    unlockedAt: new Date(),
    progress: {},
    isNotified: false,
    achievement,
  };
}

// Get achievements by category
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
}

// Get achievements by rarity
export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity);
}

// Get user's achievement progress
export function getUserAchievementProgress(
  userProgress: UserProgress,
  achievement: Achievement
): { progress: number; total: number; percentage: number } {
  const conditions = achievement.unlockConditions;
  let progress = 0;
  let total = 1;
  
  // Calculate progress based on achievement type
  for (const [key, value] of Object.entries(conditions)) {
    switch (key) {
      case 'streak':
        progress = userProgress.streak;
        total = value;
        break;
        
      case 'assignmentsCompleted':
        const completedAssignments = userProgress.achievements.filter(
          ua => ua.achievement.category === 'ASSIGNMENT_COMPLETION'
        ).length;
        progress = completedAssignments;
        total = value;
        break;
        
      case 'languageXP':
        // Use the first language requirement
        const firstLanguage = Object.keys(value)[0];
        const requiredXP = value[firstLanguage];
        progress = userProgress.languageXP[firstLanguage] || 0;
        total = requiredXP;
        break;
    }
  }
  
  const percentage = Math.min((progress / total) * 100, 100);
  
  return { progress, total, percentage };
}

// Get next achievable achievements
export function getNextAchievements(
  userProgress: UserProgress,
  recentActivity?: XPActivity[],
  limit: number = 5
): Achievement[] {
  const availableAchievements = ACHIEVEMENTS.filter(achievement => 
    achievement.isActive && 
    !userProgress.achievements.some(ua => ua.achievementId === achievement.id)
  );
  
  const eligibleAchievements = availableAchievements.filter(achievement =>
    checkAchievementEligibility(achievement, userProgress, recentActivity)
  );
  
  // Sort by rarity (easier achievements first)
  const rarityOrder = { COMMON: 1, UNCOMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5 };
  eligibleAchievements.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  
  return eligibleAchievements.slice(0, limit);
}

// Get achievement statistics
export function getAchievementStats(userProgress: UserProgress): {
  total: number;
  unlocked: number;
  percentage: number;
  byCategory: Record<AchievementCategory, number>;
  byRarity: Record<AchievementRarity, number>;
} {
  const unlockedAchievements = userProgress.achievements;
  const totalAchievements = ACHIEVEMENTS.filter(a => a.isActive).length;
  
  const byCategory: Record<AchievementCategory, number> = {} as any;
  const byRarity: Record<AchievementRarity, number> = {} as any;
  
  // Initialize counters
  Object.values(AchievementCategory).forEach(category => {
    byCategory[category] = 0;
  });
  Object.values(AchievementRarity).forEach(rarity => {
    byRarity[rarity] = 0;
  });
  
  // Count unlocked achievements
  unlockedAchievements.forEach(ua => {
    byCategory[ua.achievement.category]++;
    byRarity[ua.achievement.rarity]++;
  });
  
  return {
    total: totalAchievements,
    unlocked: unlockedAchievements.length,
    percentage: (unlockedAchievements.length / totalAchievements) * 100,
    byCategory,
    byRarity,
  };
}
