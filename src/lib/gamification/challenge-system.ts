import { 
  Challenge, 
  ChallengeType, 
  ChallengeParticipant, 
  UserChallenge,
  UserProgress 
} from './achievement-system';

// Challenge configuration
export const CHALLENGE_CONFIG = {
  TYPES: {
    DAILY_CODING: {
      name: 'Daily Coding Challenge',
      description: 'Complete coding tasks every day',
      duration: 24 * 60 * 60 * 1000, // 24 hours
      xpReward: 50,
      maxParticipants: null,
    },
    WEEKLY_THEME: {
      name: 'Weekly Theme Challenge',
      description: 'Work on themed coding projects',
      duration: 7 * 24 * 60 * 60 * 1000, // 7 days
      xpReward: 200,
      maxParticipants: 100,
    },
    MONTHLY_HACKATHON: {
      name: 'Monthly Hackathon',
      description: 'Build complete projects in a month',
      duration: 30 * 24 * 60 * 60 * 1000, // 30 days
      xpReward: 500,
      maxParticipants: 50,
    },
    PEER_TO_PEER: {
      name: 'Peer-to-Peer Challenge',
      description: 'Compete directly with another user',
      duration: 3 * 24 * 60 * 60 * 1000, // 3 days
      xpReward: 100,
      maxParticipants: 2,
    },
    TEACHER_CUSTOM: {
      name: 'Custom Challenge',
      description: 'Teacher-created custom challenge',
      duration: 14 * 24 * 60 * 60 * 1000, // 14 days
      xpReward: 300,
      maxParticipants: null,
    },
  },
  
  DIFFICULTY_MULTIPLIERS: {
    EASY: 1.0,
    MEDIUM: 1.5,
    HARD: 2.0,
    EXPERT: 3.0,
  },
  
  PARTICIPATION_LIMITS: {
    DAILY: 1,
    WEEKLY: 3,
    MONTHLY: 1,
    PEER_TO_PEER: 5,
    TEACHER_CUSTOM: 10,
  },
};

// Create a new challenge
export function createChallenge(
  title: string,
  description: string,
  type: ChallengeType,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT',
  createdBy: string,
  customConfig?: Partial<Challenge>
): Challenge {
  const config = CHALLENGE_CONFIG.TYPES[type];
  const duration = customConfig?.duration || config.duration;
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration);
  
  const baseXP = config.xpReward;
  const difficultyMultiplier = CHALLENGE_CONFIG.DIFFICULTY_MULTIPLIERS[difficulty];
  const xpReward = Math.round(baseXP * difficultyMultiplier);
  
  return {
    id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    type,
    difficulty,
    xpReward,
    startDate,
    endDate,
    maxParticipants: config.maxParticipants,
    requirements: [],
    rewards: [
      {
        type: 'XP',
        value: xpReward,
        description: `${xpReward} XP for completion`,
      },
    ],
    isActive: true,
    createdBy,
    participants: [],
    ...customConfig,
  };
}

// Join a challenge
export function joinChallenge(
  challenge: Challenge,
  userId: string
): { success: boolean; message: string; participant?: ChallengeParticipant } {
  // Check if challenge is active
  if (!challenge.isActive) {
    return { success: false, message: 'Challenge is not active' };
  }
  
  // Check if challenge has started
  if (new Date() < challenge.startDate) {
    return { success: false, message: 'Challenge has not started yet' };
  }
  
  // Check if challenge has ended
  if (new Date() > challenge.endDate) {
    return { success: false, message: 'Challenge has ended' };
  }
  
  // Check if user is already participating
  const existingParticipant = challenge.participants.find(p => p.userId === userId);
  if (existingParticipant) {
    return { success: false, message: 'You are already participating in this challenge' };
  }
  
  // Check participant limit
  if (challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants) {
    return { success: false, message: 'Challenge is full' };
  }
  
  // Create participant
  const participant: ChallengeParticipant = {
    userId,
    joinedAt: new Date(),
    score: 0,
    submissions: 0,
    completed: false,
  };
  
  return {
    success: true,
    message: 'Successfully joined challenge',
    participant,
  };
}

// Submit challenge solution
export function submitChallengeSolution(
  challenge: Challenge,
  userId: string,
  solution: string,
  language: string
): { success: boolean; message: string; score?: number } {
  const participant = challenge.participants.find(p => p.userId === userId);
  
  if (!participant) {
    return { success: false, message: 'You are not participating in this challenge' };
  }
  
  if (new Date() > challenge.endDate) {
    return { success: false, message: 'Challenge has ended' };
  }
  
  // Mock scoring logic - in real implementation, this would run actual tests
  const score = calculateChallengeScore(solution, language, challenge.difficulty);
  
  participant.submissions += 1;
  participant.score = Math.max(participant.score, score);
  
  // Check if challenge is completed (score >= 80%)
  if (score >= 80) {
    participant.completed = true;
    participant.completedAt = new Date();
  }
  
  return {
    success: true,
    message: 'Solution submitted successfully',
    score,
  };
}

// Calculate challenge score (mock implementation)
function calculateChallengeScore(
  solution: string,
  language: string,
  difficulty: string
): number {
  // Mock scoring based on code length, complexity, etc.
  const baseScore = Math.random() * 100;
  const languageBonus = language === 'python' ? 5 : 0;
  const difficultyPenalty = difficulty === 'EXPERT' ? -10 : 0;
  
  return Math.min(100, Math.max(0, baseScore + languageBonus + difficultyPenalty));
}

// Get active challenges
export function getActiveChallenges(challenges: Challenge[]): Challenge[] {
  const now = new Date();
  return challenges.filter(challenge => 
    challenge.isActive && 
    challenge.startDate <= now && 
    challenge.endDate > now
  );
}

// Get upcoming challenges
export function getUpcomingChallenges(challenges: Challenge[]): Challenge[] {
  const now = new Date();
  return challenges.filter(challenge => 
    challenge.isActive && 
    challenge.startDate > now
  );
}

// Get user's challenges
export function getUserChallenges(
  challenges: Challenge[],
  userId: string
): UserChallenge[] {
  return challenges
    .filter(challenge => 
      challenge.participants.some(p => p.userId === userId)
    )
    .map(challenge => {
      const participant = challenge.participants.find(p => p.userId === userId)!;
      return {
        id: `uc_${challenge.id}_${userId}`,
        userId,
        challengeId: challenge.id,
        joinedAt: participant.joinedAt,
        score: participant.score,
        submissions: participant.submissions,
        rank: getParticipantRank(challenge, userId),
        completed: participant.completed,
        completedAt: participant.completedAt,
        progress: calculateChallengeProgress(participant),
        challenge,
      };
    });
}

// Get participant rank in challenge
function getParticipantRank(challenge: Challenge, userId: string): number {
  const sortedParticipants = challenge.participants
    .sort((a, b) => b.score - a.score);
  
  const rank = sortedParticipants.findIndex(p => p.userId === userId);
  return rank >= 0 ? rank + 1 : -1;
}

// Calculate challenge progress
function calculateChallengeProgress(participant: ChallengeParticipant): Record<string, any> {
  return {
    submissions: participant.submissions,
    score: participant.score,
    completed: participant.completed,
    completionPercentage: participant.completed ? 100 : (participant.score / 100) * 100,
  };
}

// Get challenge leaderboard
export function getChallengeLeaderboard(challenge: Challenge): ChallengeParticipant[] {
  return challenge.participants
    .sort((a, b) => b.score - a.score)
    .map((participant, index) => ({
      ...participant,
      rank: index + 1,
    }));
}

// Check if user can join challenge
export function canUserJoinChallenge(
  challenge: Challenge,
  userId: string,
  userChallenges: UserChallenge[]
): { canJoin: boolean; reason?: string } {
  // Check if already participating
  if (challenge.participants.some(p => p.userId === userId)) {
    return { canJoin: false, reason: 'Already participating' };
  }
  
  // Check participation limits
  const userChallengeCount = userChallenges.filter(uc => 
    uc.challenge.type === challenge.type && 
    !uc.completed
  ).length;
  
  const limit = CHALLENGE_CONFIG.PARTICIPATION_LIMITS[challenge.type] || 10;
  if (userChallengeCount >= limit) {
    return { canJoin: false, reason: `Maximum ${limit} ${challenge.type.toLowerCase()} challenges allowed` };
  }
  
  // Check if challenge is full
  if (challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants) {
    return { canJoin: false, reason: 'Challenge is full' };
  }
  
  // Check if challenge is active
  if (!challenge.isActive) {
    return { canJoin: false, reason: 'Challenge is not active' };
  }
  
  // Check time constraints
  const now = new Date();
  if (now < challenge.startDate) {
    return { canJoin: false, reason: 'Challenge has not started yet' };
  }
  
  if (now > challenge.endDate) {
    return { canJoin: false, reason: 'Challenge has ended' };
  }
  
  return { canJoin: true };
}

// Award XP for challenge completion
export function awardChallengeXP(
  userProgress: UserProgress,
  challenge: Challenge,
  score: number
): UserProgress {
  const updatedProgress = { ...userProgress };
  
  // Calculate XP based on score and challenge difficulty
  const baseXP = challenge.xpReward;
  const scoreMultiplier = score / 100;
  const earnedXP = Math.round(baseXP * scoreMultiplier);
  
  // Add XP to user progress
  updatedProgress.currentXP += earnedXP;
  updatedProgress.totalXP += earnedXP;
  
  // Update weekly/monthly XP
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  if (now >= weekStart) {
    updatedProgress.weeklyXP += earnedXP;
  }
  
  if (now >= monthStart) {
    updatedProgress.monthlyXP += earnedXP;
  }
  
  return updatedProgress;
}

// Get challenge statistics
export function getChallengeStats(challenge: Challenge): {
  totalParticipants: number;
  completedParticipants: number;
  averageScore: number;
  topScore: number;
  completionRate: number;
} {
  const participants = challenge.participants;
  const completedParticipants = participants.filter(p => p.completed).length;
  const totalScore = participants.reduce((sum, p) => sum + p.score, 0);
  const averageScore = participants.length > 0 ? totalScore / participants.length : 0;
  const topScore = Math.max(...participants.map(p => p.score), 0);
  const completionRate = participants.length > 0 ? (completedParticipants / participants.length) * 100 : 0;
  
  return {
    totalParticipants: participants.length,
    completedParticipants,
    averageScore,
    topScore,
    completionRate,
  };
}
