'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Settings,
  BarChart3,
  GitBranch,
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Activity,
  TrendingUp,
  Users,
  Timer,
  Target,
  Shield,
  Code,
  Package,
  Globe
} from 'lucide-react';
import { 
  GitHubWorkflow,
  GitHubWorkflowRun,
  GitHubJob,
  CICDConfiguration,
  CICDExecution,
  CICDMetrics,
  getWorkflows,
  getWorkflowRuns,
  getWorkflowRunJobs,
  getCICDConfigurations,
  getCICDExecutions,
  getCICDMetrics,
  getStatusColor,
  getStatusIcon,
  formatDuration,
  formatDate
} from '@/lib/github/cicd';
import { cn } from '@/lib/utils';

interface CICDDashboardProps {
  repositoryId: number;
  owner: string;
  repo: string;
  accessToken: string;
  className?: string;
}

export function CICDDashboard({ repositoryId, owner, repo, accessToken, className }: CICDDashboardProps) {
  const [workflows, setWorkflows] = useState<GitHubWorkflow[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<GitHubWorkflowRun[]>([]);
  const [jobs, setJobs] = useState<GitHubJob[]>([]);
  const [configurations, setConfigurations] = useState<CICDConfiguration[]>([]);
  const [executions, setExecutions] = useState<CICDExecution[]>([]);
  const [metrics, setMetrics] = useState<CICDMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<GitHubWorkflow | null>(null);

  // Mock data for demonstration
  const mockWorkflows: GitHubWorkflow[] = [
    {
      id: 1,
      nodeId: 'W_kwDOABC123',
      name: 'CI/CD Pipeline',
      path: '.github/workflows/ci.yml',
      state: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      url: 'https://api.github.com/repos/owner/repo/actions/workflows/1',
      htmlUrl: 'https://github.com/owner/repo/actions/workflows/ci.yml',
      badgeUrl: 'https://github.com/owner/repo/workflows/CI/badge.svg',
    },
    {
      id: 2,
      nodeId: 'W_kwDODEF456',
      name: 'Deploy to Production',
      path: '.github/workflows/deploy.yml',
      state: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      url: 'https://api.github.com/repos/owner/repo/actions/workflows/2',
      htmlUrl: 'https://github.com/owner/repo/actions/workflows/deploy.yml',
      badgeUrl: 'https://github.com/owner/repo/workflows/Deploy/badge.svg',
    },
  ];

  const mockWorkflowRuns: GitHubWorkflowRun[] = [
    {
      id: 1,
      name: 'CI/CD Pipeline',
      headBranch: 'main',
      headSha: 'abc123def456',
      path: '.github/workflows/ci.yml',
      displayTitle: 'Update authentication system',
      runNumber: 42,
      event: 'push',
      status: 'completed',
      conclusion: 'success',
      workflowId: 1,
      url: 'https://api.github.com/repos/owner/repo/actions/runs/1',
      htmlUrl: 'https://github.com/owner/repo/actions/runs/1',
      pullRequests: [],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      jobsUrl: 'https://api.github.com/repos/owner/repo/actions/runs/1/jobs',
      logsUrl: 'https://api.github.com/repos/owner/repo/actions/runs/1/logs',
      checkSuiteUrl: 'https://api.github.com/repos/owner/repo/check-suites/1',
      artifactsUrl: 'https://api.github.com/repos/owner/repo/actions/runs/1/artifacts',
      cancelUrl: 'https://api.github.com/repos/owner/repo/actions/runs/1/cancel',
      rerunUrl: 'https://api.github.com/repos/owner/repo/actions/runs/1/rerun',
      workflowUrl: 'https://api.github.com/repos/owner/repo/actions/workflows/1',
      headCommit: {
        id: 'abc123def456',
        treeId: 'def456ghi789',
        message: 'feat: implement user authentication system',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: { name: 'Alice Johnson', email: 'alice@example.com' },
        committer: { name: 'Alice Johnson', email: 'alice@example.com' },
      },
      repository: {} as any,
      headRepository: {} as any,
    },
    {
      id: 2,
      name: 'CI/CD Pipeline',
      headBranch: 'feature/auth',
      headSha: 'def456ghi789',
      path: '.github/workflows/ci.yml',
      displayTitle: 'Fix authentication bug',
      runNumber: 41,
      event: 'pull_request',
      status: 'completed',
      conclusion: 'failure',
      workflowId: 1,
      url: 'https://api.github.com/repos/owner/repo/actions/runs/2',
      htmlUrl: 'https://github.com/owner/repo/actions/runs/2',
      pullRequests: [],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      jobsUrl: 'https://api.github.com/repos/owner/repo/actions/runs/2/jobs',
      logsUrl: 'https://api.github.com/repos/owner/repo/actions/runs/2/logs',
      checkSuiteUrl: 'https://api.github.com/repos/owner/repo/check-suites/2',
      artifactsUrl: 'https://api.github.com/repos/owner/repo/actions/runs/2/artifacts',
      cancelUrl: 'https://api.github.com/repos/owner/repo/actions/runs/2/cancel',
      rerunUrl: 'https://api.github.com/repos/owner/repo/actions/runs/2/rerun',
      workflowUrl: 'https://api.github.com/repos/owner/repo/actions/workflows/1',
      headCommit: {
        id: 'def456ghi789',
        treeId: 'ghi789jkl012',
        message: 'fix: resolve authentication bug in login flow',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        author: { name: 'Bob Smith', email: 'bob@example.com' },
        committer: { name: 'Bob Smith', email: 'bob@example.com' },
      },
      repository: {} as any,
      headRepository: {} as any,
    },
  ];

  const mockMetrics: CICDMetrics = {
    totalExecutions: 156,
    successRate: 87.5,
    averageDuration: 420, // seconds
    failureRate: 12.5,
    byStatus: {
      success: 137,
      failure: 19,
      cancelled: 0,
    },
    byTrigger: {
      push: 98,
      pull_request: 45,
      manual: 13,
    },
    byDay: [
      { date: '2024-01-01', executions: 5, successRate: 100 },
      { date: '2024-01-02', executions: 8, successRate: 87.5 },
      { date: '2024-01-03', executions: 12, successRate: 91.7 },
    ],
    topFailingSteps: [
      { stepName: 'Run Tests', failureCount: 8, failureRate: 5.1 },
      { stepName: 'Build Application', failureCount: 6, failureRate: 3.8 },
      { stepName: 'Deploy to Staging', failureCount: 5, failureRate: 3.2 },
    ],
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWorkflows(mockWorkflows);
        setWorkflowRuns(mockWorkflowRuns);
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to load CI/CD data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [repositoryId]);

  const getStatusBadge = (status: string, conclusion?: string | null) => {
    const color = getStatusColor(status, conclusion);
    const icon = getStatusIcon(status, conclusion);
    
    return (
      <Badge className={cn('flex items-center gap-1', color)}>
        <span>{icon}</span>
        <span className="capitalize">{conclusion || status}</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading CI/CD data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CI/CD Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor builds, deployments, and automation
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Metrics Summary */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.totalExecutions}</div>
                  <div className="text-sm text-muted-foreground">Total Runs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <Timer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatDuration(metrics.averageDuration)}</div>
                  <div className="text-sm text-muted-foreground">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics.failureRate}%</div>
                  <div className="text-sm text-muted-foreground">Failure Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="runs">Recent Runs</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Workflows */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                GitHub Actions Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">{workflow.path}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={workflow.state === 'active' ? 'default' : 'secondary'}>
                            {workflow.state}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Updated {formatDate(workflow.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={workflow.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Runs */}
        <TabsContent value="runs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Workflow Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getStatusBadge(run.status, run.conclusion)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{run.displayTitle}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            <span>{run.headBranch}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(run.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>#{run.runNumber}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          Commit: {run.headCommit.message}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={run.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      
                      {run.status === 'completed' && run.conclusion === 'failure' && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Rerun
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurations */}
        <TabsContent value="configurations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Custom CI/CD Configurations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Custom Configurations</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom CI/CD configurations for advanced automation
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Execution Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Executions</span>
                    <span className="font-medium">{metrics?.totalExecutions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{metrics?.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Duration</span>
                    <span className="font-medium">{formatDuration(metrics?.averageDuration || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Failure Rate</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{metrics?.failureRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Failing Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.topFailingSteps.map((step, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{step.stepName}</div>
                        <div className="text-xs text-muted-foreground">{step.failureCount} failures</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">
                          {step.failureRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
