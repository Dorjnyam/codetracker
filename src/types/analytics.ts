// Comprehensive analytics types and interfaces

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type TimeRange = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
export type ChartType = 'LINE' | 'BAR' | 'PIE' | 'RADAR' | 'HEATMAP' | 'SCATTER' | 'AREA' | 'DONUT';
export type MetricType = 'COUNT' | 'PERCENTAGE' | 'DURATION' | 'SCORE' | 'RATE' | 'TREND';
export type AlertLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';

// Base analytics interfaces
export interface BaseMetric {
  id: string;
  name: string;
  value: number;
  type: MetricType;
  unit?: string;
  trend?: number; // percentage change
  target?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  lastUpdated: Date;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

export interface ChartData {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  config?: ChartConfig;
}

export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  animation?: boolean;
  plugins?: Record<string, any>;
  scales?: Record<string, any>;
  legend?: {
    display: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
}

// Student Analytics
export interface StudentAnalytics {
  userId: string;
  timeRange: TimeRange;
  period: {
    start: Date;
    end: Date;
  };
  
  // Personal Progress
  progress: {
    currentLevel: number;
    totalXP: number;
    levelProgress: number;
    streak: number;
    achievements: number;
    skills: SkillProgress[];
  };
  
  // Coding Activity
  activity: {
    totalSessions: number;
    totalTimeSpent: number; // in minutes
    averageSessionLength: number;
    mostActiveDay: string;
    mostActiveHour: number;
    heatmapData: ActivityHeatmapEntry[];
  };
  
  // Assignment Performance
  assignments: {
    totalAssigned: number;
    completed: number;
    completionRate: number;
    averageGrade: number;
    gradeTrend: TimeSeriesData[];
    difficultyBreakdown: Record<string, number>;
    languageBreakdown: Record<string, number>;
  };
  
  // Learning Insights
  insights: {
    strengths: string[];
    weaknesses: string[];
    learningVelocity: number;
    improvementAreas: string[];
    recommendations: string[];
    studyHabits: StudyHabitInsights;
  };
  
  // Peer Comparison (anonymized)
  peerComparison: {
    percentile: number;
    averageClassPerformance: number;
    topPerformersCount: number;
    improvementRanking: number;
  };
  
  // Goals and Milestones
  goals: {
    active: Goal[];
    completed: Goal[];
    upcoming: Goal[];
    progressRate: number;
  };
}

export interface SkillProgress {
  skill: string;
  level: number;
  xp: number;
  proficiency: number; // 0-100
  trend: number; // percentage change
  lastPracticed: Date;
  exercisesCompleted: number;
  averageScore: number;
}

export interface ActivityHeatmapEntry {
  date: string; // YYYY-MM-DD format
  count: number;
  intensity: number; // 0-4 for color intensity
  activities: string[];
}

export interface StudyHabitInsights {
  preferredStudyTime: string;
  averageStudyDuration: number;
  consistencyScore: number;
  breakPatterns: string[];
  productivityPeaks: number[];
  recommendations: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'SKILL' | 'ASSIGNMENT' | 'STREAK' | 'ACHIEVEMENT' | 'CUSTOM';
  target: number;
  current: number;
  progress: number;
  deadline?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'OVERDUE';
  createdAt: Date;
  completedAt?: Date;
}

// Teacher Analytics
export interface TeacherAnalytics {
  teacherId: string;
  timeRange: TimeRange;
  period: {
    start: Date;
    end: Date;
  };
  
  // Class Overview
  classOverview: {
    totalClasses: number;
    totalStudents: number;
    activeStudents: number;
    averageClassSize: number;
    studentEngagement: number;
    overallPerformance: number;
  };
  
  // Individual Student Monitoring
  studentProgress: {
    topPerformers: StudentSummary[];
    strugglingStudents: StudentSummary[];
    atRiskStudents: AtRiskStudent[];
    improvementTrends: StudentTrend[];
  };
  
  // Assignment Analysis
  assignmentAnalysis: {
    totalAssignments: number;
    averageCompletionRate: number;
    averageGrade: number;
    difficultyEffectiveness: Record<string, number>;
    commonErrors: ErrorPattern[];
    gradingDistribution: GradeDistribution;
  };
  
  // Engagement Metrics
  engagement: {
    participationRate: number;
    collaborationActivity: number;
    forumParticipation: number;
    helpSeekingBehavior: number;
    resourceUsage: ResourceUsage[];
  };
  
  // Predictive Analytics
  predictions: {
    atRiskStudents: AtRiskPrediction[];
    performanceForecasts: PerformanceForecast[];
    interventionRecommendations: InterventionRecommendation[];
  };
}

export interface StudentSummary {
  id: string;
  name: string;
  performance: number;
  engagement: number;
  improvement: number;
  lastActive: Date;
  assignmentsCompleted: number;
  averageGrade: number;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: string[];
  lastActive: Date;
  assignmentsOverdue: number;
  gradeTrend: 'DECLINING' | 'STABLE' | 'IMPROVING';
  interventionNeeded: boolean;
}

export interface StudentTrend {
  studentId: string;
  metric: string;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  changeRate: number;
  period: string;
}

export interface ErrorPattern {
  error: string;
  frequency: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedStudents: number;
  commonSolutions: string[];
  preventionTips: string[];
}

export interface GradeDistribution {
  excellent: number; // 90-100
  good: number; // 80-89
  satisfactory: number; // 70-79
  needsImprovement: number; // 60-69
  failing: number; // 0-59
}

export interface ResourceUsage {
  resource: string;
  usageCount: number;
  effectiveness: number;
  studentSatisfaction: number;
  recommendations: string[];
}

export interface AtRiskPrediction {
  studentId: string;
  probability: number;
  timeframe: string;
  factors: string[];
  confidence: number;
}

export interface PerformanceForecast {
  studentId: string;
  currentPerformance: number;
  predictedPerformance: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export interface InterventionRecommendation {
  studentId: string;
  type: 'SUPPORT' | 'CHALLENGE' | 'RESOURCE' | 'COLLABORATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description: string;
  expectedOutcome: string;
  resources: string[];
}

// Class-Level Analytics
export interface ClassAnalytics {
  classId: string;
  timeRange: TimeRange;
  period: {
    start: Date;
    end: Date;
  };
  
  // Performance Metrics
  performance: {
    averageGrade: number;
    completionRate: number;
    engagementScore: number;
    collaborationIndex: number;
    skillDevelopment: SkillDevelopmentMetrics;
  };
  
  // Assignment Analysis
  assignments: {
    totalAssigned: number;
    averageDifficulty: number;
    effectivenessScore: number;
    completionTrends: TimeSeriesData[];
    difficultyAnalysis: DifficultyAnalysis;
  };
  
  // Participation Trends
  participation: {
    dailyActiveUsers: TimeSeriesData[];
    weeklyEngagement: TimeSeriesData[];
    collaborationActivity: CollaborationMetrics;
    helpSeekingPatterns: HelpSeekingMetrics;
  };
  
  // Learning Outcomes
  outcomes: {
    skillAchievements: SkillAchievement[];
    competencyProgress: CompetencyProgress[];
    learningObjectives: ObjectiveProgress[];
  };
  
  // Comparative Analysis
  comparison: {
    vsOtherClasses: ClassComparison[];
    vsHistoricalData: HistoricalComparison;
    benchmarkAnalysis: BenchmarkAnalysis;
  };
}

export interface SkillDevelopmentMetrics {
  programmingLanguages: Record<string, number>;
  problemSolving: number;
  collaboration: number;
  communication: number;
  criticalThinking: number;
  creativity: number;
}

export interface DifficultyAnalysis {
  easy: AssignmentMetrics;
  medium: AssignmentMetrics;
  hard: AssignmentMetrics;
  expert: AssignmentMetrics;
}

export interface AssignmentMetrics {
  count: number;
  averageGrade: number;
  completionRate: number;
  timeToComplete: number;
  commonErrors: string[];
}

export interface CollaborationMetrics {
  pairProgramming: number;
  groupProjects: number;
  peerReviews: number;
  knowledgeSharing: number;
  mentorship: number;
}

export interface HelpSeekingMetrics {
  forumPosts: number;
  directQuestions: number;
  resourceUsage: number;
  peerSupport: number;
  teacherSupport: number;
}

export interface SkillAchievement {
  skill: string;
  studentsAchieved: number;
  averageTimeToAchieve: number;
  difficulty: number;
  prerequisites: string[];
}

export interface CompetencyProgress {
  competency: string;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  studentsOnTrack: number;
}

export interface ObjectiveProgress {
  objective: string;
  completionRate: number;
  averageScore: number;
  studentsAchieved: number;
  improvementAreas: string[];
}

export interface ClassComparison {
  metric: string;
  thisClass: number;
  otherClass: number;
  difference: number;
  percentile: number;
}

export interface HistoricalComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

export interface BenchmarkAnalysis {
  metric: string;
  current: number;
  benchmark: number;
  status: 'ABOVE' | 'AT' | 'BELOW';
  gap: number;
}

// Administrative Analytics
export interface AdminAnalytics {
  timeRange: TimeRange;
  period: {
    start: Date;
    end: Date;
  };
  
  // Platform Usage
  usage: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
    retentionRate: number;
    sessionDuration: number;
    pageViews: number;
  };
  
  // Feature Adoption
  features: {
    assignments: FeatureUsage;
    collaboration: FeatureUsage;
    gamification: FeatureUsage;
    analytics: FeatureUsage;
    forums: FeatureUsage;
  };
  
  // System Performance
  performance: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
    resourceUtilization: ResourceUtilization;
  };
  
  // Content Effectiveness
  content: {
    mostPopularAssignments: ContentMetrics[];
    mostEffectiveResources: ContentMetrics[];
    userSatisfaction: number;
    contentEngagement: number;
  };
  
  // User Satisfaction
  satisfaction: {
    overallRating: number;
    npsScore: number;
    feedbackTrends: FeedbackTrend[];
    supportTickets: SupportMetrics;
  };
  
  // Security & Compliance
  security: {
    securityIncidents: number;
    complianceScore: number;
    dataBreaches: number;
    auditTrail: AuditEntry[];
  };
  
  // Financial (if applicable)
  financial?: {
    revenue: number;
    costs: number;
    profit: number;
    userLifetimeValue: number;
    acquisitionCost: number;
  };
}

export interface FeatureUsage {
  adoptionRate: number;
  usageFrequency: number;
  userSatisfaction: number;
  retentionImpact: number;
  growthTrend: number;
}

export interface ResourceUtilization {
  cpu: number;
  memory: number;
  storage: number;
  bandwidth: number;
  database: number;
}

export interface ContentMetrics {
  id: string;
  title: string;
  usage: number;
  effectiveness: number;
  satisfaction: number;
  completionRate: number;
}

export interface FeedbackTrend {
  category: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  count: number;
  trend: number;
  period: string;
}

export interface SupportMetrics {
  totalTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  satisfactionScore: number;
  commonIssues: string[];
}

export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAILURE';
}

// Dashboard Configuration
export interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  role: UserRole;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refreshInterval: number; // in seconds
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  grid: GridItem[];
}

export interface GridItem {
  id: string;
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface DashboardWidget {
  id: string;
  type: 'CHART' | 'METRIC' | 'TABLE' | 'TEXT' | 'IMAGE' | 'IFRAME';
  title: string;
  description?: string;
  config: WidgetConfig;
  dataSource: DataSource;
  refreshInterval?: number;
  filters?: WidgetFilter[];
  actions?: WidgetAction[];
}

export interface WidgetConfig {
  chartType?: ChartType;
  showLegend?: boolean;
  showTooltips?: boolean;
  showDataLabels?: boolean;
  colors?: string[];
  size?: 'SMALL' | 'MEDIUM' | 'LARGE';
  position?: 'TOP' | 'CENTER' | 'BOTTOM';
}

export interface DataSource {
  type: 'API' | 'DATABASE' | 'CALCULATED' | 'STATIC';
  endpoint?: string;
  query?: string;
  parameters?: Record<string, any>;
  cache?: boolean;
  cacheDuration?: number;
}

export interface WidgetFilter {
  id: string;
  name: string;
  type: 'SELECT' | 'DATE_RANGE' | 'NUMBER_RANGE' | 'MULTI_SELECT';
  options?: string[];
  defaultValue?: any;
  required?: boolean;
}

export interface WidgetAction {
  id: string;
  name: string;
  type: 'NAVIGATE' | 'EXPORT' | 'REFRESH' | 'FILTER' | 'CUSTOM';
  config: Record<string, any>;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'DATE_RANGE' | 'SELECT' | 'MULTI_SELECT' | 'NUMBER_RANGE';
  options?: string[];
  defaultValue?: any;
  required?: boolean;
}

// Reports
export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'ANALYTICS' | 'PERFORMANCE' | 'ENGAGEMENT' | 'CUSTOM';
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  template: ReportTemplate;
  schedule?: ReportSchedule;
  recipients: string[];
  filters: ReportFilter[];
  generatedAt?: Date;
  status: 'DRAFT' | 'SCHEDULED' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  createdBy: string;
  createdAt: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  sections: ReportSection[];
  styling: ReportStyling;
  branding?: ReportBranding;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'CHART' | 'TABLE' | 'METRIC' | 'TEXT' | 'IMAGE';
  content: any;
  order: number;
  visible: boolean;
}

export interface ReportStyling {
  theme: 'LIGHT' | 'DARK' | 'CUSTOM';
  colors: string[];
  fonts: {
    primary: string;
    secondary: string;
  };
  layout: 'SINGLE_COLUMN' | 'TWO_COLUMN' | 'CUSTOM';
}

export interface ReportBranding {
  logo?: string;
  companyName?: string;
  contactInfo?: string;
  website?: string;
}

export interface ReportSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  timezone: string;
  enabled: boolean;
}

export interface ReportFilter {
  id: string;
  name: string;
  type: 'DATE_RANGE' | 'SELECT' | 'MULTI_SELECT' | 'NUMBER_RANGE';
  value: any;
  required: boolean;
}

// Alerts and Notifications
export interface Alert {
  id: string;
  title: string;
  message: string;
  type: AlertLevel;
  category: 'PERFORMANCE' | 'ENGAGEMENT' | 'SYSTEM' | 'SECURITY' | 'CUSTOM';
  source: string;
  data: Record<string, any>;
  timestamp: Date;
  read: boolean;
  acknowledged: boolean;
  actions?: AlertAction[];
}

export interface AlertAction {
  id: string;
  name: string;
  type: 'NAVIGATE' | 'DISMISS' | 'ACKNOWLEDGE' | 'CUSTOM';
  config: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  threshold: number;
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  enabled: boolean;
  recipients: string[];
  createdBy: string;
  createdAt: Date;
}

export interface AlertCondition {
  metric: string;
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS';
  value: any;
  timeWindow?: number; // in minutes
}

// Real-time Data
export interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RealTimeUpdate {
  type: 'METRIC_UPDATE' | 'ALERT' | 'STATUS_CHANGE' | 'NEW_DATA';
  data: any;
  timestamp: Date;
  source: string;
}

// Export and Sharing
export interface ExportRequest {
  id: string;
  type: 'DASHBOARD' | 'REPORT' | 'DATA';
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'PNG' | 'SVG';
  filters: Record<string, any>;
  options: ExportOptions;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface ExportOptions {
  includeCharts: boolean;
  includeData: boolean;
  includeMetadata: boolean;
  compression: boolean;
  password?: string;
  watermark?: string;
}

export interface ShareRequest {
  id: string;
  resourceType: 'DASHBOARD' | 'REPORT' | 'ANALYTICS';
  resourceId: string;
  permissions: SharePermission[];
  expiresAt?: Date;
  password?: string;
  createdAt: Date;
  createdBy: string;
}

export interface SharePermission {
  userId: string;
  role: 'VIEWER' | 'EDITOR' | 'ADMIN';
  grantedAt: Date;
  grantedBy: string;
}
