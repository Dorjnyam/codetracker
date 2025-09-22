import { 
  Leaderboard, 
  LeaderboardEntry, 
  LeaderboardType, 
  LeaderboardScope, 
  LeaderboardPeriod,
  LeaderboardFilters,
  UserProgress 
} from './achievement-system';

// Leaderboard configuration
export const LEADERBOARD_CONFIG = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_ENTRIES: 100,
  UPDATE_INTERVAL: 60 * 1000, // 1 minute
};

// Generate leaderboard entries
export function generateLeaderboardEntries(
  users: UserProgress[],
  type: LeaderboardType,
  filters?: LeaderboardFilters
): LeaderboardEntry[] {
  // Apply filters
  let filteredUsers = users;
  
  if (filters) {
    if (filters.classId) {
      // Filter by class (would need class membership data)
      // filteredUsers = filteredUsers.filter(user => user.classes.includes(filters.classId));
    }
    
    if (filters.language) {
      // Filter users who have XP in the specified language
      filteredUsers = filteredUsers.filter(user => 
        user.languageXP[filters.language!] > 0
      );
    }
    
    if (filters.role) {
      // Filter by role (would need user role data)
      // filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    if (filters.minLevel || filters.maxLevel) {
      filteredUsers = filteredUsers.filter(user => {
        if (filters.minLevel && user.currentLevel < filters.minLevel) return false;
        if (filters.maxLevel && user.currentLevel > filters.maxLevel) return false;
        return true;
      });
    }
  }
  
  // Calculate scores based on leaderboard type
  const entries: LeaderboardEntry[] = filteredUsers.map((user, index) => {
    let score = 0;
    let metadata: Record<string, any> = {};
    
    switch (type) {
      case 'TOTAL_XP':
        score = user.totalXP;
        metadata = { level: user.currentLevel };
        break;
        
      case 'WEEKLY_XP':
        score = user.weeklyXP;
        metadata = { totalXP: user.totalXP };
        break;
        
      case 'MONTHLY_XP':
        score = user.monthlyXP;
        metadata = { totalXP: user.totalXP };
        break;
        
      case 'STREAK':
        score = user.streak;
        metadata = { totalXP: user.totalXP, level: user.currentLevel };
        break;
        
      case 'ACHIEVEMENTS':
        score = user.achievements.length;
        metadata = { totalXP: user.totalXP, level: user.currentLevel };
        break;
        
      case 'ASSIGNMENTS_COMPLETED':
        // This would need assignment completion data
        score = user.achievements.filter(a => 
          a.achievement.category === 'ASSIGNMENT_COMPLETION'
        ).length;
        metadata = { totalXP: user.totalXP };
        break;
        
      case 'LANGUAGE_SPECIFIC':
        if (filters?.language) {
          score = user.languageXP[filters.language] || 0;
          metadata = { 
            language: filters.language,
            proficiency: user.skillLevels[filters.language]?.proficiency || 'BEGINNER'
          };
        }
        break;
        
      case 'CHALLENGE_SCORE':
        score = user.challenges.reduce((sum, challenge) => sum + challenge.score, 0);
        metadata = { 
          challengesCompleted: user.challenges.filter(c => c.completed).length,
          totalChallenges: user.challenges.length
        };
        break;
    }
    
    return {
      rank: 0, // Will be set after sorting
      user: {
        id: user.userId,
        name: `User ${user.userId}`, // Would need actual user data
        username: `user_${user.userId}`,
        image: undefined,
        level: user.currentLevel,
        xp: user.totalXP,
        streak: user.streak,
      },
      score,
      metadata,
    };
  });
  
  // Sort by score (descending)
  entries.sort((a, b) => b.score - a.score);
  
  // Set ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  // Limit entries
  return entries.slice(0, LEADERBOARD_CONFIG.MAX_ENTRIES);
}

// Create leaderboard
export function createLeaderboard(
  name: string,
  type: LeaderboardType,
  scope: LeaderboardScope,
  period: LeaderboardPeriod,
  entries: LeaderboardEntry[],
  filters?: LeaderboardFilters
): Leaderboard {
  return {
    id: `lb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    scope,
    period,
    entries,
    totalParticipants: entries.length,
    lastUpdated: new Date(),
    filters,
  };
}

// Get leaderboard by type and scope
export function getLeaderboard(
  users: UserProgress[],
  type: LeaderboardType,
  scope: LeaderboardScope = 'GLOBAL',
  period: LeaderboardPeriod = 'ALL_TIME',
  filters?: LeaderboardFilters
): Leaderboard {
  const entries = generateLeaderboardEntries(users, type, filters);
  
  const name = generateLeaderboardName(type, scope, period);
  
  return createLeaderboard(name, type, scope, period, entries, filters);
}

// Generate leaderboard name
function generateLeaderboardName(
  type: LeaderboardType,
  scope: LeaderboardScope,
  period: LeaderboardPeriod
): string {
  const typeNames = {
    TOTAL_XP: 'Total XP',
    WEEKLY_XP: 'Weekly XP',
    MONTHLY_XP: 'Monthly XP',
    STREAK: 'Coding Streak',
    ACHIEVEMENTS: 'Achievements',
    ASSIGNMENTS_COMPLETED: 'Assignments Completed',
    LANGUAGE_SPECIFIC: 'Language Mastery',
    CLASS_RANKING: 'Class Ranking',
    CHALLENGE_SCORE: 'Challenge Score',
  };
  
  const scopeNames = {
    GLOBAL: 'Global',
    CLASS: 'Class',
    SCHOOL: 'School',
    REGION: 'Region',
    CUSTOM: 'Custom',
  };
  
  const periodNames = {
    ALL_TIME: 'All Time',
    MONTHLY: 'This Month',
    WEEKLY: 'This Week',
    DAILY: 'Today',
  };
  
  return `${scopeNames[scope]} ${typeNames[type]} - ${periodNames[period]}`;
}

// Get user's rank in leaderboard
export function getUserRank(
  leaderboard: Leaderboard,
  userId: string
): { rank: number; entry: LeaderboardEntry | null } {
  const entry = leaderboard.entries.find(e => e.user.id === userId);
  
  if (!entry) {
    return { rank: -1, entry: null };
  }
  
  return { rank: entry.rank, entry };
}

// Get leaderboard around user's position
export function getLeaderboardAroundUser(
  leaderboard: Leaderboard,
  userId: string,
  contextSize: number = 5
): LeaderboardEntry[] {
  const userEntry = leaderboard.entries.find(e => e.user.id === userId);
  
  if (!userEntry) {
    return leaderboard.entries.slice(0, contextSize * 2 + 1);
  }
  
  const startIndex = Math.max(0, userEntry.rank - contextSize - 1);
  const endIndex = Math.min(
    leaderboard.entries.length,
    userEntry.rank + contextSize
  );
  
  return leaderboard.entries.slice(startIndex, endIndex);
}

// Calculate rank change
export function calculateRankChange(
  currentRank: number,
  previousRank: number
): number {
  if (previousRank === -1) return 0; // New entry
  return previousRank - currentRank; // Positive means moved up
}

// Get top performers
export function getTopPerformers(
  leaderboard: Leaderboard,
  count: number = 10
): LeaderboardEntry[] {
  return leaderboard.entries.slice(0, count);
}

// Get leaderboard statistics
export function getLeaderboardStats(leaderboard: Leaderboard): {
  totalParticipants: number;
  averageScore: number;
  medianScore: number;
  topScore: number;
  scoreDistribution: Record<string, number>;
} {
  const scores = leaderboard.entries.map(e => e.score);
  const totalParticipants = leaderboard.totalParticipants;
  
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const medianScore = scores.length > 0 
    ? scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
    : 0;
  const topScore = Math.max(...scores);
  
  // Score distribution (percentiles)
  const scoreDistribution = {
    'top_10': scores.filter(s => s >= scores[Math.floor(scores.length * 0.1)]).length,
    'top_25': scores.filter(s => s >= scores[Math.floor(scores.length * 0.25)]).length,
    'top_50': scores.filter(s => s >= scores[Math.floor(scores.length * 0.5)]).length,
    'top_75': scores.filter(s => s >= scores[Math.floor(scores.length * 0.75)]).length,
    'top_90': scores.filter(s => s >= scores[Math.floor(scores.length * 0.9)]).length,
  };
  
  return {
    totalParticipants,
    averageScore,
    medianScore,
    topScore,
    scoreDistribution,
  };
}

// Compare leaderboards (for rank changes)
export function compareLeaderboards(
  current: Leaderboard,
  previous: Leaderboard
): LeaderboardEntry[] {
  const previousRanks = new Map(
    previous.entries.map(e => [e.user.id, e.rank])
  );
  
  return current.entries.map(entry => {
    const previousRank = previousRanks.get(entry.user.id) || -1;
    const change = calculateRankChange(entry.rank, previousRank);
    
    return {
      ...entry,
      change,
    };
  });
}

// Get multiple leaderboards
export function getMultipleLeaderboards(
  users: UserProgress[],
  types: LeaderboardType[],
  scope: LeaderboardScope = 'GLOBAL',
  period: LeaderboardPeriod = 'ALL_TIME'
): Leaderboard[] {
  return types.map(type => 
    getLeaderboard(users, type, scope, period)
  );
}

// Filter leaderboard entries
export function filterLeaderboardEntries(
  leaderboard: Leaderboard,
  filters: {
    minScore?: number;
    maxScore?: number;
    minLevel?: number;
    maxLevel?: number;
    language?: string;
  }
): LeaderboardEntry[] {
  return leaderboard.entries.filter(entry => {
    if (filters.minScore && entry.score < filters.minScore) return false;
    if (filters.maxScore && entry.score > filters.maxScore) return false;
    if (filters.minLevel && entry.user.level < filters.minLevel) return false;
    if (filters.maxLevel && entry.user.level > filters.maxLevel) return false;
    if (filters.language && entry.metadata?.language !== filters.language) return false;
    
    return true;
  });
}

// Export leaderboard data
export function exportLeaderboardData(
  leaderboard: Leaderboard,
  format: 'json' | 'csv' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(leaderboard, null, 2);
  }
  
  // CSV format
  const headers = ['Rank', 'Name', 'Username', 'Level', 'XP', 'Streak', 'Score'];
  const rows = leaderboard.entries.map(entry => [
    entry.rank,
    entry.user.name,
    entry.user.username,
    entry.user.level,
    entry.user.xp,
    entry.user.streak,
    entry.score,
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}
