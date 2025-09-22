// Comprehensive GitHub integration types and interfaces

export type GitHubScope = 'repo' | 'user' | 'read:org' | 'read:user' | 'user:email' | 'workflow';
export type RepositoryVisibility = 'public' | 'private' | 'internal';
export type RepositoryPermission = 'read' | 'write' | 'admin';
export type PullRequestState = 'open' | 'closed' | 'merged';
export type IssueState = 'open' | 'closed';
export type CommitStatus = 'pending' | 'success' | 'error' | 'failure';
export type WebhookEvent = 'push' | 'pull_request' | 'issues' | 'commit_comment' | 'repository' | 'workflow_run';

// GitHub OAuth and Authentication
export interface GitHubToken {
  accessToken: string;
  refreshToken?: string;
  tokenType: 'bearer';
  scope: GitHubScope[];
  expiresAt?: Date;
  createdAt: Date;
  userId: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  email?: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  twitterUsername?: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: GitHubScope[];
  state?: string;
}

// Repository Management
export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
  language?: string;
  languages?: Record<string, number>;
  stargazersCount: number;
  forksCount: number;
  watchersCount: number;
  openIssuesCount: number;
  size: number;
  defaultBranch: string;
  visibility: RepositoryVisibility;
  isPrivate: boolean;
  isFork: boolean;
  isTemplate: boolean;
  hasIssues: boolean;
  hasProjects: boolean;
  hasWiki: boolean;
  hasPages: boolean;
  hasDownloads: boolean;
  allowSquashMerge: boolean;
  allowMergeCommit: boolean;
  allowRebaseMerge: boolean;
  allowAutoMerge: boolean;
  deleteBranchOnMerge: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt?: string;
  owner: GitHubUser;
  topics?: string[];
  license?: GitHubLicense;
  permissions?: RepositoryPermissions;
}

export interface RepositoryPermissions {
  admin: boolean;
  maintain: boolean;
  push: boolean;
  triage: boolean;
  pull: boolean;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdxId?: string;
  url?: string;
  nodeId: string;
}

export interface RepositoryTemplate {
  id: string;
  name: string;
  description: string;
  repositoryId: number;
  assignmentId?: string;
  isPublic: boolean;
  defaultBranch: string;
  topics: string[];
  files: RepositoryFile[];
  workflows: WorkflowTemplate[];
  createdAt: Date;
  createdBy: string;
}

export interface RepositoryFile {
  path: string;
  content: string;
  encoding: 'base64' | 'utf-8';
  size: number;
  sha: string;
  url: string;
  downloadUrl?: string;
  type: 'file' | 'dir';
  mode: string;
}

export interface WorkflowTemplate {
  name: string;
  path: string;
  content: string;
  description: string;
  triggers: string[];
  jobs: WorkflowJob[];
}

export interface WorkflowJob {
  name: string;
  runsOn: string;
  steps: WorkflowStep[];
  needs?: string[];
  if?: string;
}

export interface WorkflowStep {
  name: string;
  uses?: string;
  run?: string;
  with?: Record<string, any>;
  env?: Record<string, string>;
  if?: string;
}

// Commit and Branch Management
export interface GitHubCommit {
  sha: string;
  nodeId: string;
  commit: CommitDetails;
  author?: GitHubUser;
  committer?: GitHubUser;
  parents: CommitParent[];
  stats?: CommitStats;
  files?: CommitFile[];
  htmlUrl: string;
  commentsUrl: string;
  verification?: CommitVerification;
}

export interface CommitDetails {
  author: CommitAuthor;
  committer: CommitAuthor;
  message: string;
  tree: CommitTree;
  url: string;
  commentCount: number;
  verification?: CommitVerification;
}

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface CommitTree {
  sha: string;
  url: string;
}

export interface CommitParent {
  sha: string;
  url: string;
  htmlUrl: string;
}

export interface CommitStats {
  additions: number;
  deletions: number;
  total: number;
}

export interface CommitFile {
  sha: string;
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
  blobUrl: string;
  rawUrl: string;
  contentsUrl: string;
  patch?: string;
  previousFilename?: string;
}

export interface CommitVerification {
  verified: boolean;
  reason: string;
  signature?: string;
  payload?: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: BranchProtection;
}

export interface BranchProtection {
  enabled: boolean;
  requiredStatusChecks?: RequiredStatusChecks;
  enforceAdmins?: boolean;
  requiredPullRequestReviews?: RequiredPullRequestReviews;
  restrictions?: BranchRestrictions;
}

export interface RequiredStatusChecks {
  enforcementLevel: 'off' | 'non_admins' | 'everyone';
  contexts: string[];
  strict: boolean;
}

export interface RequiredPullRequestReviews {
  dismissalRestrictions?: BranchRestrictions;
  dismissStaleReviews: boolean;
  requireCodeOwnerReviews: boolean;
  requiredApprovingReviewCount: number;
}

export interface BranchRestrictions {
  users: string[];
  teams: string[];
  apps: string[];
}

// Pull Requests and Issues
export interface GitHubPullRequest {
  id: number;
  nodeId: string;
  number: number;
  state: PullRequestState;
  locked: boolean;
  title: string;
  body?: string;
  user: GitHubUser;
  assignees: GitHubUser[];
  requestedReviewers: GitHubUser[];
  requestedTeams: GitHubTeam[];
  labels: GitHubLabel[];
  milestone?: GitHubMilestone;
  draft: boolean;
  merged: boolean;
  mergeable?: boolean;
  rebaseable?: boolean;
  mergeableState: 'clean' | 'dirty' | 'unstable' | 'blocked';
  mergedBy?: GitHubUser;
  mergeCommitSha?: string;
  head: PullRequestRef;
  base: PullRequestRef;
  commits: number;
  additions: number;
  deletions: number;
  changedFiles: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  mergedAt?: string;
  htmlUrl: string;
  diffUrl: string;
  patchUrl: string;
  issueUrl: string;
  reviewCommentsUrl: string;
  commentsUrl: string;
  statusesUrl: string;
  authorAssociation: string;
  autoMerge?: AutoMerge;
}

export interface PullRequestRef {
  label: string;
  ref: string;
  sha: string;
  user: GitHubUser;
  repo: GitHubRepository;
}

export interface AutoMerge {
  enabledBy: GitHubUser;
  mergeMethod: 'merge' | 'squash' | 'rebase';
  commitTitle: string;
  commitMessage: string;
}

export interface GitHubIssue {
  id: number;
  nodeId: string;
  number: number;
  state: IssueState;
  title: string;
  body?: string;
  user: GitHubUser;
  assignees: GitHubUser[];
  labels: GitHubLabel[];
  milestone?: GitHubMilestone;
  locked: boolean;
  activeLockReason?: string;
  comments: number;
  pullRequest?: {
    url: string;
    htmlUrl: string;
    diffUrl: string;
    patchUrl: string;
  };
  closedBy?: GitHubUser;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  htmlUrl: string;
  commentsUrl: string;
  eventsUrl: string;
  timelineUrl: string;
  authorAssociation: string;
}

export interface GitHubLabel {
  id: number;
  nodeId: string;
  url: string;
  name: string;
  description?: string;
  color: string;
  default: boolean;
}

export interface GitHubMilestone {
  id: number;
  nodeId: string;
  url: string;
  htmlUrl: string;
  labelsUrl: string;
  number: number;
  state: 'open' | 'closed';
  title: string;
  description?: string;
  creator: GitHubUser;
  openIssues: number;
  closedIssues: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  dueOn?: string;
}

export interface GitHubTeam {
  id: number;
  nodeId: string;
  url: string;
  htmlUrl: string;
  name: string;
  slug: string;
  description?: string;
  privacy: 'closed' | 'secret';
  permission: 'pull' | 'push' | 'admin';
  membersUrl: string;
  repositoriesUrl: string;
  parent?: GitHubTeam;
}

// Code Reviews and Comments
export interface GitHubReview {
  id: number;
  nodeId: string;
  user: GitHubUser;
  body?: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
  htmlUrl: string;
  pullRequestUrl: string;
  submittedAt?: string;
  commitId: string;
  authorAssociation: string;
}

export interface GitHubComment {
  id: number;
  nodeId: string;
  url: string;
  htmlUrl: string;
  body: string;
  user: GitHubUser;
  createdAt: string;
  updatedAt: string;
  authorAssociation: string;
}

export interface GitHubCommitComment extends GitHubComment {
  commitId: string;
  position?: number;
  line?: number;
  path?: string;
}

// Webhooks and Events
export interface GitHubWebhook {
  id: number;
  url: string;
  pingUrl: string;
  deliveriesUrl: string;
  name: string;
  events: WebhookEvent[];
  active: boolean;
  config: WebhookConfig;
  updatedAt: string;
  createdAt: string;
  lastResponse?: WebhookResponse;
}

export interface WebhookConfig {
  url: string;
  contentType: 'json' | 'form';
  secret?: string;
  insecureSsl: boolean;
}

export interface WebhookResponse {
  code: number;
  status: string;
  message: string;
}

export interface WebhookPayload {
  action?: string;
  repository: GitHubRepository;
  sender: GitHubUser;
  installation?: GitHubInstallation;
  [key: string]: any;
}

export interface GitHubInstallation {
  id: number;
  account: GitHubUser;
  repositorySelection: 'all' | 'selected';
  accessTokensUrl: string;
  repositoriesUrl: string;
  htmlUrl: string;
  appId: number;
  appSlug: string;
  targetId: number;
  targetType: string;
  permissions: Record<string, string>;
  events: string[];
  createdAt: string;
  updatedAt: string;
  singleFileName?: string;
}

// Actions and Workflows
export interface GitHubAction {
  id: number;
  name: string;
  path: string;
  state: 'active' | 'disabled';
  created: string;
  updated: string;
  url: string;
  htmlUrl: string;
  badgeUrl: string;
}

export interface GitHubWorkflow {
  id: number;
  nodeId: string;
  name: string;
  path: string;
  state: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
  url: string;
  htmlUrl: string;
  badgeUrl: string;
}

export interface GitHubWorkflowRun {
  id: number;
  nodeId: string;
  headBranch: string;
  headSha: string;
  runNumber: number;
  event: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  workflowId: number;
  checkSuiteId: number;
  checkSuiteNodeId: string;
  url: string;
  htmlUrl: string;
  pullRequests: GitHubPullRequest[];
  createdAt: string;
  updatedAt: string;
  runAttempt: number;
  runStartedAt: string;
  jobsUrl: string;
  logsUrl: string;
  artifactsUrl: string;
  cancelUrl: string;
  rerunUrl: string;
  workflowUrl: string;
  headCommit: GitHubCommit;
  repository: GitHubRepository;
  headRepository: GitHubRepository;
}

export interface GitHubJob {
  id: number;
  runId: number;
  runUrl: string;
  nodeId: string;
  headSha: string;
  url: string;
  htmlUrl: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  createdAt: string;
  startedAt: string;
  completedAt?: string;
  name: string;
  steps: GitHubStep[];
  checkRunUrl: string;
  labels: string[];
  runnerId?: number;
  runnerName?: string;
  runnerGroupId?: number;
  runnerGroupName?: string;
}

export interface GitHubStep {
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  number: number;
  startedAt?: string;
  completedAt?: string;
  log?: string;
}

// Analytics and Metrics
export interface RepositoryAnalytics {
  repositoryId: number;
  period: {
    start: Date;
    end: Date;
  };
  commits: CommitAnalytics;
  contributors: ContributorAnalytics[];
  pullRequests: PullRequestAnalytics;
  issues: IssueAnalytics;
  codeFrequency: CodeFrequencyData[];
  participation: ParticipationData;
  traffic: TrafficData;
  clones: CloneData;
  views: ViewData;
}

export interface CommitAnalytics {
  total: number;
  additions: number;
  deletions: number;
  authors: CommitAuthorAnalytics[];
  weekly: WeeklyCommitData[];
  daily: DailyCommitData[];
}

export interface CommitAuthorAnalytics {
  author: GitHubUser;
  total: number;
  weeks: WeeklyCommitData[];
}

export interface WeeklyCommitData {
  week: number;
  total: number;
  additions: number;
  deletions: number;
}

export interface DailyCommitData {
  date: string;
  total: number;
  additions: number;
  deletions: number;
}

export interface ContributorAnalytics {
  author: GitHubUser;
  total: number;
  weeks: WeeklyCommitData[];
  additions: number;
  deletions: number;
  commits: number;
}

export interface PullRequestAnalytics {
  total: number;
  open: number;
  closed: number;
  merged: number;
  averageTimeToMerge: number;
  averageTimeToClose: number;
  byAuthor: PullRequestAuthorAnalytics[];
}

export interface PullRequestAuthorAnalytics {
  author: GitHubUser;
  total: number;
  open: number;
  closed: number;
  merged: number;
  averageTimeToMerge: number;
}

export interface IssueAnalytics {
  total: number;
  open: number;
  closed: number;
  averageTimeToClose: number;
  byAuthor: IssueAuthorAnalytics[];
}

export interface IssueAuthorAnalytics {
  author: GitHubUser;
  total: number;
  open: number;
  closed: number;
}

export interface CodeFrequencyData {
  week: number;
  additions: number;
  deletions: number;
}

export interface ParticipationData {
  all: number[];
  owner: number[];
}

export interface TrafficData {
  count: number;
  uniques: number;
  clones: CloneData[];
  views: ViewData[];
}

export interface CloneData {
  timestamp: string;
  count: number;
  uniques: number;
}

export interface ViewData {
  timestamp: string;
  count: number;
  uniques: number;
}

// Assignment Integration
export interface AssignmentRepository {
  id: string;
  assignmentId: string;
  repositoryId: number;
  repositoryName: string;
  studentId: string;
  studentGitHubId: number;
  templateRepositoryId?: number;
  isTemplate: boolean;
  visibility: RepositoryVisibility;
  status: 'active' | 'submitted' | 'graded' | 'archived';
  submissionType: 'pull_request' | 'commit' | 'branch';
  submissionBranch?: string;
  submissionCommit?: string;
  submissionPullRequest?: number;
  dueDate?: Date;
  submittedAt?: Date;
  gradedAt?: Date;
  grade?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentTemplate {
  id: string;
  name: string;
  description: string;
  repositoryTemplateId: string;
  assignmentId: string;
  isPublic: boolean;
  defaultBranch: string;
  starterCode: RepositoryFile[];
  testFiles: RepositoryFile[];
  workflowFiles: WorkflowTemplate[];
  readmeContent: string;
  instructions: string;
  gradingCriteria: GradingCriteria[];
  createdAt: Date;
  createdBy: string;
}

export interface GradingCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  type: 'automated' | 'manual' | 'peer_review';
  automatedTests?: AutomatedTest[];
  manualChecks?: ManualCheck[];
}

export interface AutomatedTest {
  name: string;
  command: string;
  expectedOutput?: string;
  timeout: number;
  weight: number;
}

export interface ManualCheck {
  name: string;
  description: string;
  instructions: string;
  weight: number;
}

// Student Portfolio
export interface StudentPortfolio {
  userId: string;
  githubUserId: number;
  repositories: PortfolioRepository[];
  contributions: ContributionData[];
  skills: SkillData[];
  achievements: PortfolioAchievement[];
  statistics: PortfolioStatistics;
  lastUpdated: Date;
}

export interface PortfolioRepository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stargazersCount: number;
  forksCount: number;
  isPublic: boolean;
  isFork: boolean;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt?: string;
  topics: string[];
  contributionCount: number;
  lastContribution: string;
  isShowcased: boolean;
  showcaseOrder?: number;
}

export interface ContributionData {
  date: string;
  count: number;
  repositories: number[];
  pullRequests: number;
  issues: number;
  commits: number;
}

export interface SkillData {
  language: string;
  percentage: number;
  repositories: number[];
  commits: number;
  linesOfCode: number;
  lastUsed: string;
}

export interface PortfolioAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  repositoryId?: number;
  pullRequestId?: number;
  issueId?: number;
}

export interface PortfolioStatistics {
  totalRepositories: number;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalStars: number;
  totalForks: number;
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
  languages: Record<string, number>;
  mostActiveRepository: number;
  mostContributedLanguage: string;
  accountAge: number;
}

// Teacher Dashboard
export interface TeacherGitHubDashboard {
  teacherId: string;
  repositories: TeacherRepository[];
  assignments: AssignmentRepository[];
  students: StudentGitHubData[];
  analytics: TeacherAnalytics;
  lastUpdated: Date;
}

export interface TeacherRepository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  isTemplate: boolean;
  assignmentId?: string;
  studentRepositories: number;
  totalCommits: number;
  totalPullRequests: number;
  averageGrade: number;
  lastActivity: string;
  createdAt: string;
}

export interface StudentGitHubData {
  userId: string;
  githubUserId: number;
  username: string;
  repositories: AssignmentRepository[];
  totalCommits: number;
  totalPullRequests: number;
  averageGrade: number;
  lastActivity: string;
  isActive: boolean;
  needsAttention: boolean;
}

export interface TeacherAnalytics {
  totalRepositories: number;
  totalStudents: number;
  totalAssignments: number;
  totalCommits: number;
  totalPullRequests: number;
  averageGrade: number;
  submissionRate: number;
  onTimeSubmissionRate: number;
  collaborationRate: number;
  codeQualityScore: number;
  engagementScore: number;
}

// Learning Tools
export interface GitTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  topics: string[];
  steps: TutorialStep[];
  exercises: TutorialExercise[];
  prerequisites: string[];
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'exercise';
  order: number;
  estimatedTime: number;
  resources: TutorialResource[];
  quiz?: TutorialQuiz;
}

export interface TutorialExercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  expectedOutcome: string;
  hints: string[];
  solution?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}

export interface TutorialResource {
  title: string;
  url: string;
  type: 'documentation' | 'video' | 'article' | 'tool';
}

export interface TutorialQuiz {
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

// Error Handling and API Management
export interface GitHubAPIError {
  message: string;
  documentationUrl?: string;
  errors?: GitHubAPIErrorDetail[];
  status: number;
}

export interface GitHubAPIErrorDetail {
  resource: string;
  field: string;
  code: string;
  message: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface GitHubAPIConfig {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  rateLimitBuffer: number;
}

// Webhook Security
export interface WebhookSecurity {
  secret: string;
  signature: string;
  payload: string;
  algorithm: 'sha1' | 'sha256';
}

export interface WebhookValidation {
  isValid: boolean;
  signature: string;
  payload: string;
  timestamp: string;
  event: string;
  deliveryId: string;
}
