import { User, Class } from '@prisma/client';

export type ProgrammingLanguage = 
  | 'python' 
  | 'javascript' 
  | 'typescript' 
  | 'java' 
  | 'cpp' 
  | 'c' 
  | 'csharp' 
  | 'go' 
  | 'rust' 
  | 'php' 
  | 'ruby' 
  | 'swift' 
  | 'kotlin' 
  | 'scala' 
  | 'r' 
  | 'matlab';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';

export type TestCaseType = 'INPUT_OUTPUT' | 'FUNCTIONAL' | 'PERFORMANCE' | 'SECURITY';

export type GradingCriteria = {
  id: string;
  name: string;
  description: string;
  points: number;
  weight: number;
};

export type Rubric = {
  id: string;
  name: string;
  description: string;
  criteria: GradingCriteria[];
  totalPoints: number;
};

export type TestCase = {
  id: string;
  name: string;
  description: string;
  type: TestCaseType;
  input: string;
  expectedOutput: string;
  timeout: number; // in milliseconds
  points: number;
  isHidden: boolean;
  order: number;
};

export type StarterCode = {
  language: ProgrammingLanguage;
  code: string;
  fileName: string;
};

export type AssignmentTemplate = {
  id: string;
  name: string;
  description: string;
  language: ProgrammingLanguage;
  difficulty: DifficultyLevel;
  category: string;
  tags: string[];
  starterCode: StarterCode[];
  testCases: TestCase[];
  rubric: Rubric;
};

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  language: ProgrammingLanguage;
  difficulty: DifficultyLevel;
  status: AssignmentStatus;
  dueDate: Date;
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  points: number;
  rubric: Rubric;
  starterCode: StarterCode[];
  testCases: TestCase[];
  resources: AssignmentResource[];
  classId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  archivedAt?: Date;
  
  // Relations
  class?: Class;
  teacher?: User;
  submissions?: AssignmentSubmission[];
  analytics?: AssignmentAnalytics;
}

export type AssignmentResource = {
  id: string;
  name: string;
  type: 'FILE' | 'URL' | 'TEXT';
  url?: string;
  content?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
};

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  code: string;
  language: ProgrammingLanguage;
  status: SubmissionStatus;
  score?: number;
  maxScore: number;
  attempts: number;
  submittedAt: Date;
  gradedAt?: Date;
  feedback?: string;
  testResults: TestResult[];
  executionTime?: number;
  memoryUsage?: number;
  plagiarismScore?: number;
  
  // Relations
  assignment?: Assignment;
  student?: User;
}

export type TestResult = {
  testCaseId: string;
  testCaseName: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  memoryUsage: number;
  errorMessage?: string;
  points: number;
  maxPoints: number;
};

export type AssignmentAnalytics = {
  id: string;
  assignmentId: string;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  averageExecutionTime: number;
  commonErrors: string[];
  difficultyRating: number;
  studentFeedback: number[];
  lastUpdated: Date;
};

export type CodeExecutionRequest = {
  code: string;
  language: ProgrammingLanguage;
  testCases: TestCase[];
  timeout: number;
  memoryLimit: number;
};

export type CodeExecutionResult = {
  success: boolean;
  results: TestResult[];
  executionTime: number;
  memoryUsage: number;
  error?: string;
  output?: string;
};

export type AssignmentFilter = {
  language?: ProgrammingLanguage[];
  difficulty?: DifficultyLevel[];
  status?: AssignmentStatus[];
  classId?: string;
  teacherId?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  points?: {
    min?: number;
    max?: number;
  };
  search?: string;
};

export type AssignmentSort = {
  field: 'title' | 'dueDate' | 'points' | 'difficulty' | 'createdAt';
  direction: 'asc' | 'desc';
};

export type AssignmentListParams = {
  page?: number;
  limit?: number;
  filter?: AssignmentFilter;
  sort?: AssignmentSort;
};

export type AssignmentStats = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  averageScore: number;
  completionRate: number;
  totalSubmissions: number;
};

export type CollaborationSession = {
  id: string;
  assignmentId: string;
  participants: string[];
  activeUsers: string[];
  sharedCode: string;
  language: ProgrammingLanguage;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
};

export type CodeReview = {
  id: string;
  submissionId: string;
  reviewerId: string;
  revieweeId: string;
  comments: CodeComment[];
  score: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CodeComment = {
  id: string;
  lineNumber: number;
  content: string;
  type: 'SUGGESTION' | 'QUESTION' | 'ISSUE' | 'PRAISE';
  resolved: boolean;
  createdAt: Date;
  authorId: string;
};

export type PlagiarismReport = {
  id: string;
  submissionId: string;
  similarityScore: number;
  matches: PlagiarismMatch[];
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
};

export type PlagiarismMatch = {
  source: string;
  similarity: number;
  lines: number[];
  description: string;
};

// Form types
export type CreateAssignmentForm = {
  title: string;
  description: string;
  instructions: string;
  language: ProgrammingLanguage;
  difficulty: DifficultyLevel;
  dueDate: Date;
  timeLimit?: number;
  maxAttempts?: number;
  points: number;
  classId: string;
  starterCode: StarterCode[];
  testCases: TestCase[];
  resources: AssignmentResource[];
};

export type UpdateAssignmentForm = Partial<CreateAssignmentForm> & {
  id: string;
};

export type SubmitAssignmentForm = {
  assignmentId: string;
  code: string;
  language: ProgrammingLanguage;
};

export type GradeAssignmentForm = {
  submissionId: string;
  score: number;
  feedback: string;
  testResults: TestResult[];
};

// API Response types
export type AssignmentListResponse = {
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type AssignmentDetailResponse = Assignment & {
  submissions?: AssignmentSubmission[];
  analytics?: AssignmentAnalytics;
};

export type SubmissionListResponse = {
  submissions: AssignmentSubmission[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type CodeExecutionResponse = {
  success: boolean;
  result: CodeExecutionResult;
  executionId: string;
};
