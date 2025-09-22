import { 
  UserGoal, 
  GoalType, 
  UserProgress 
} from './achievement-system';

// Goal configuration
export const GOAL_CONFIG = {
  TYPES: {
    DAILY_XP: {
      name: 'Daily XP Goal',
      description: 'Earn a specific amount of XP each day',
      unit: 'XP',
      defaultTarget: 100,
      minTarget: 10,
      maxTarget: 1000,
    },
    WEEKLY_XP: {
      name: 'Weekly XP Goal',
      description: 'Earn a specific amount of XP each week',
      unit: 'XP',
      defaultTarget: 500,
      minTarget: 50,
      maxTarget: 5000,
    },
    MONTHLY_XP: {
      name: 'Monthly XP Goal',
      description: 'Earn a specific amount of XP each month',
      unit: 'XP',
      defaultTarget: 2000,
      minTarget: 200,
      maxTarget: 20000,
    },
    STREAK_DAYS: {
      name: 'Coding Streak',
      description: 'Maintain a coding streak for a specific number of days',
      unit: 'days',
      defaultTarget: 7,
      minTarget: 1,
      maxTarget: 365,
    },
    ASSIGNMENTS_COMPLETED: {
      name: 'Assignments Completed',
      description: 'Complete a specific number of assignments',
      unit: 'assignments',
      defaultTarget: 5,
      minTarget: 1,
      maxTarget: 50,
    },
    LANGUAGE_XP: {
      name: 'Language XP',
      description: 'Earn XP in a specific programming language',
      unit: 'XP',
      defaultTarget: 500,
      minTarget: 50,
      maxTarget: 5000,
    },
    ACHIEVEMENTS_UNLOCKED: {
      name: 'Achievements Unlocked',
      description: 'Unlock a specific number of achievements',
      unit: 'achievements',
      defaultTarget: 3,
      minTarget: 1,
      maxTarget: 20,
    },
    CODE_LINES_WRITTEN: {
      name: 'Lines of Code',
      description: 'Write a specific number of lines of code',
      unit: 'lines',
      defaultTarget: 1000,
      minTarget: 100,
      maxTarget: 10000,
    },
    HOURS_CODING: {
      name: 'Coding Hours',
      description: 'Spend a specific number of hours coding',
      unit: 'hours',
      defaultTarget: 10,
      minTarget: 1,
      maxTarget: 100,
    },
    PEER_HELP_SESSIONS: {
      name: 'Peer Help Sessions',
      description: 'Help peers with their coding problems',
      unit: 'sessions',
      defaultTarget: 5,
      minTarget: 1,
      maxTarget: 50,
    },
  },
  
  DEADLINE_OPTIONS: {
    DAILY_XP: 1, // 1 day
    WEEKLY_XP: 7, // 7 days
    MONTHLY_XP: 30, // 30 days
    STREAK_DAYS: 30, // 30 days
    ASSIGNMENTS_COMPLETED: 14, // 14 days
    LANGUAGE_XP: 30, // 30 days
    ACHIEVEMENTS_UNLOCKED: 30, // 30 days
    CODE_LINES_WRITTEN: 30, // 30 days
    HOURS_CODING: 30, // 30 days
    PEER_HELP_SESSIONS: 14, // 14 days
  },
};

// Create a new goal
export function createGoal(
  userId: string,
  type: GoalType,
  target: number,
  title?: string,
  description?: string,
  deadline?: Date,
  language?: string
): UserGoal {
  const config = GOAL_CONFIG.TYPES[type];
  const defaultDeadline = deadline || new Date(Date.now() + GOAL_CONFIG.DEADLINE_OPTIONS[type] * 24 * 60 * 60 * 1000);
  
  return {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    title: title || config.name,
    description: description || config.description,
    type,
    target: Math.max(config.minTarget, Math.min(config.maxTarget, target)),
    current: 0,
    unit: config.unit,
    deadline: defaultDeadline,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Update goal progress
export function updateGoalProgress(
  goal: UserGoal,
  userProgress: UserProgress,
  additionalProgress?: number
): UserGoal {
  const updatedGoal = { ...goal };
  
  // Calculate current progress based on goal type
  let currentProgress = 0;
  
  switch (goal.type) {
    case 'DAILY_XP':
      // Calculate daily XP from weekly XP (approximation)
      currentProgress = Math.floor(userProgress.weeklyXP / 7);
      break;
      
    case 'WEEKLY_XP':
      currentProgress = userProgress.weeklyXP;
      break;
      
    case 'MONTHLY_XP':
      currentProgress = userProgress.monthlyXP;
      break;
      
    case 'STREAK_DAYS':
      currentProgress = userProgress.streak;
      break;
      
    case 'ASSIGNMENTS_COMPLETED':
      // Count completed assignments from achievements
      currentProgress = userProgress.achievements.filter(
        achievement => achievement.achievement.category === 'ASSIGNMENT_COMPLETION'
      ).length;
      break;
      
    case 'LANGUAGE_XP':
      // Get XP for specific language (would need language parameter)
      currentProgress = Object.values(userProgress.languageXP).reduce((sum, xp) => sum + xp, 0);
      break;
      
    case 'ACHIEVEMENTS_UNLOCKED':
      currentProgress = userProgress.achievements.length;
      break;
      
    case 'CODE_LINES_WRITTEN':
      // Mock calculation based on assignments completed
      currentProgress = userProgress.achievements.length * 100;
      break;
      
    case 'HOURS_CODING':
      // Mock calculation based on total XP
      currentProgress = Math.floor(userProgress.totalXP / 50);
      break;
      
    case 'PEER_HELP_SESSIONS':
      // Mock calculation based on collaboration achievements
      currentProgress = userProgress.achievements.filter(
        achievement => achievement.achievement.category === 'COLLABORATION'
      ).length;
      break;
  }
  
  // Add additional progress if provided
  if (additionalProgress) {
    currentProgress += additionalProgress;
  }
  
  updatedGoal.current = Math.min(currentProgress, goal.target);
  updatedGoal.updatedAt = new Date();
  
  // Check if goal is completed
  if (updatedGoal.current >= goal.target && !updatedGoal.isCompleted) {
    updatedGoal.isCompleted = true;
    updatedGoal.completedAt = new Date();
  }
  
  return updatedGoal;
}

// Get goal progress percentage
export function getGoalProgressPercentage(goal: UserGoal): number {
  if (goal.target === 0) return 0;
  return Math.min((goal.current / goal.target) * 100, 100);
}

// Get goal status
export function getGoalStatus(goal: UserGoal): {
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  daysRemaining: number;
  progressPercentage: number;
} {
  const now = new Date();
  const progressPercentage = getGoalProgressPercentage(goal);
  
  let status: 'not_started' | 'in_progress' | 'completed' | 'overdue' = 'not_started';
  let daysRemaining = 0;
  
  if (goal.isCompleted) {
    status = 'completed';
  } else if (goal.deadline) {
    const timeDiff = goal.deadline.getTime() - now.getTime();
    daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      status = 'overdue';
    } else if (goal.current > 0) {
      status = 'in_progress';
    } else {
      status = 'not_started';
    }
  } else if (goal.current > 0) {
    status = 'in_progress';
  }
  
  return {
    status,
    daysRemaining: Math.max(0, daysRemaining),
    progressPercentage,
  };
}

// Get active goals
export function getActiveGoals(goals: UserGoal[]): UserGoal[] {
  return goals.filter(goal => !goal.isCompleted);
}

// Get completed goals
export function getCompletedGoals(goals: UserGoal[]): UserGoal[] {
  return goals.filter(goal => goal.isCompleted);
}

// Get overdue goals
export function getOverdueGoals(goals: UserGoal[]): UserGoal[] {
  const now = new Date();
  return goals.filter(goal => 
    !goal.isCompleted && 
    goal.deadline && 
    goal.deadline < now
  );
}

// Get goals by type
export function getGoalsByType(goals: UserGoal[], type: GoalType): UserGoal[] {
  return goals.filter(goal => goal.type === type);
}

// Get goals due soon
export function getGoalsDueSoon(goals: UserGoal[], daysThreshold: number = 3): UserGoal[] {
  const now = new Date();
  const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
  
  return goals.filter(goal => 
    !goal.isCompleted && 
    goal.deadline && 
    goal.deadline <= thresholdDate &&
    goal.deadline > now
  );
}

// Calculate goal completion rate
export function calculateGoalCompletionRate(goals: UserGoal[]): number {
  if (goals.length === 0) return 0;
  const completedGoals = getCompletedGoals(goals).length;
  return (completedGoals / goals.length) * 100;
}

// Get goal statistics
export function getGoalStats(goals: UserGoal[]): {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  completionRate: number;
  averageProgress: number;
  byType: Record<GoalType, number>;
} {
  const activeGoals = getActiveGoals(goals);
  const completedGoals = getCompletedGoals(goals);
  const overdueGoals = getOverdueGoals(goals);
  
  const byType: Record<GoalType, number> = {} as any;
  goals.forEach(goal => {
    byType[goal.type] = (byType[goal.type] || 0) + 1;
  });
  
  const averageProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + getGoalProgressPercentage(goal), 0) / goals.length
    : 0;
  
  return {
    total: goals.length,
    active: activeGoals.length,
    completed: completedGoals.length,
    overdue: overdueGoals.length,
    completionRate: calculateGoalCompletionRate(goals),
    averageProgress,
    byType,
  };
}

// Suggest goals based on user progress
export function suggestGoals(userProgress: UserProgress): UserGoal[] {
  const suggestions: UserGoal[] = [];
  
  // Suggest daily XP goal if user is active
  if (userProgress.weeklyXP > 0) {
    const dailyXPGoal = createGoal(
      userProgress.userId,
      'DAILY_XP',
      Math.max(50, Math.floor(userProgress.weeklyXP / 7) + 25)
    );
    suggestions.push(dailyXPGoal);
  }
  
  // Suggest streak goal if user has a streak
  if (userProgress.streak > 0) {
    const streakGoal = createGoal(
      userProgress.userId,
      'STREAK_DAYS',
      Math.min(userProgress.streak + 7, 30)
    );
    suggestions.push(streakGoal);
  }
  
  // Suggest achievement goal
  if (userProgress.achievements.length < 10) {
    const achievementGoal = createGoal(
      userProgress.userId,
      'ACHIEVEMENTS_UNLOCKED',
      Math.min(userProgress.achievements.length + 3, 10)
    );
    suggestions.push(achievementGoal);
  }
  
  // Suggest language-specific goal for highest XP language
  const topLanguage = Object.entries(userProgress.languageXP)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topLanguage && topLanguage[1] > 0) {
    const languageGoal = createGoal(
      userProgress.userId,
      'LANGUAGE_XP',
      Math.min(topLanguage[1] + 500, 2000)
    );
    suggestions.push(languageGoal);
  }
  
  return suggestions;
}

// Validate goal target
export function validateGoalTarget(type: GoalType, target: number): {
  isValid: boolean;
  message?: string;
  suggestedTarget?: number;
} {
  const config = GOAL_CONFIG.TYPES[type];
  
  if (target < config.minTarget) {
    return {
      isValid: false,
      message: `Minimum target is ${config.minTarget} ${config.unit}`,
      suggestedTarget: config.minTarget,
    };
  }
  
  if (target > config.maxTarget) {
    return {
      isValid: false,
      message: `Maximum target is ${config.maxTarget} ${config.unit}`,
      suggestedTarget: config.maxTarget,
    };
  }
  
  return { isValid: true };
}
