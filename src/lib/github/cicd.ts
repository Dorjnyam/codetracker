import { GitHubUser, GitHubRepository } from '@/types/github';

export interface GitHubWorkflow {
  id: number;
  nodeId: string;
  name: string;
  path: string;
  state: 'active' | 'deleted' | 'disabled_fork' | 'disabled_inactivity' | 'disabled_manually';
  createdAt: string;
  updatedAt: string;
  url: string;
  htmlUrl: string;
  badgeUrl: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  headBranch: string;
  headSha: string;
  path: string;
  displayTitle: string;
  runNumber: number;
  event: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  workflowId: number;
  url: string;
  htmlUrl: string;
  pullRequests: any[];
  createdAt: string;
  updatedAt: string;
  jobsUrl: string;
  logsUrl: string;
  checkSuiteUrl: string;
  artifactsUrl: string;
  cancelUrl: string;
  rerunUrl: string;
  workflowUrl: string;
  headCommit: {
    id: string;
    treeId: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
    };
    committer: {
      name: string;
      email: string;
    };
  };
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
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  startedAt: string;
  completedAt: string | null;
  name: string;
  steps: GitHubJobStep[];
  checkRunUrl: string;
  labels: string[];
  runnerId: number | null;
  runnerName: string | null;
  runnerGroupId: number | null;
  runnerGroupName: string | null;
  workflowName: string | null;
}

export interface GitHubJobStep {
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  number: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface GitHubCheckSuite {
  id: number;
  nodeId: string;
  headBranch: string;
  headSha: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  url: string;
  before: string;
  after: string;
  pullRequests: any[];
  app: {
    id: number;
    slug: string;
    nodeId: string;
    owner: GitHubUser;
    name: string;
    description: string;
    externalUrl: string;
    htmlUrl: string;
    createdAt: string;
    updatedAt: string;
    permissions: Record<string, string>;
    events: string[];
  };
  repository: GitHubRepository;
  createdAt: string;
  updatedAt: string;
  headCommit: {
    id: string;
    treeId: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
    };
    committer: {
      name: string;
      email: string;
    };
  };
  latestCheckRunsCount: number;
  checkRunsUrl: string;
}

export interface GitHubCheckRun {
  id: number;
  headSha: string;
  nodeId: string;
  externalId: string;
  url: string;
  htmlUrl: string;
  detailsUrl: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  startedAt: string;
  completedAt: string | null;
  output: {
    title: string | null;
    summary: string | null;
    text: string | null;
    annotationsCount: number;
    annotationsUrl: string;
  };
  name: string;
  checkSuite: GitHubCheckSuite;
  app: {
    id: number;
    slug: string;
    nodeId: string;
    owner: GitHubUser;
    name: string;
    description: string;
    externalUrl: string;
    htmlUrl: string;
    createdAt: string;
    updatedAt: string;
    permissions: Record<string, string>;
    events: string[];
  };
  pullRequests: any[];
  deployment: any | null;
}

export interface CICDConfiguration {
  id: string;
  repositoryId: number;
  name: string;
  description: string;
  enabled: boolean;
  triggers: {
    push: boolean;
    pullRequest: boolean;
    schedule: string[];
    manual: boolean;
  };
  steps: CICDStep[];
  environment: {
    variables: Record<string, string>;
    secrets: string[];
  };
  notifications: {
    email: string[];
    slack: string[];
    webhook: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CICDStep {
  id: string;
  name: string;
  type: 'test' | 'build' | 'deploy' | 'lint' | 'security' | 'custom';
  command: string;
  workingDirectory: string;
  environment: Record<string, string>;
  timeout: number;
  retryCount: number;
  condition: string;
  parallel: boolean;
}

export interface CICDExecution {
  id: string;
  configurationId: string;
  repositoryId: number;
  status: 'pending' | 'running' | 'success' | 'failure' | 'cancelled';
  trigger: 'push' | 'pull_request' | 'schedule' | 'manual';
  branch: string;
  commit: string;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  steps: CICDStepExecution[];
  logs: string;
  artifacts: CICDArtifact[];
  notifications: CICDNotification[];
}

export interface CICDStepExecution {
  id: string;
  stepId: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failure' | 'skipped';
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  logs: string;
  exitCode: number | null;
}

export interface CICDArtifact {
  id: string;
  name: string;
  type: 'file' | 'directory' | 'archive';
  path: string;
  size: number;
  url: string;
  expiresAt: string;
}

export interface CICDNotification {
  id: string;
  type: 'email' | 'slack' | 'webhook';
  status: 'pending' | 'sent' | 'failed';
  recipient: string;
  message: string;
  sentAt: string | null;
  error: string | null;
}

export interface CICDMetrics {
  totalExecutions: number;
  successRate: number;
  averageDuration: number;
  failureRate: number;
  byStatus: Record<string, number>;
  byTrigger: Record<string, number>;
  byDay: Array<{
    date: string;
    executions: number;
    successRate: number;
  }>;
  topFailingSteps: Array<{
    stepName: string;
    failureCount: number;
    failureRate: number;
  }>;
}

// GitHub Actions API functions
export async function getWorkflows(
  owner: string,
  repo: string,
  accessToken: string
): Promise<GitHubWorkflow[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.workflows;
  } catch (error) {
    console.error('Failed to fetch workflows:', error);
    throw error;
  }
}

export async function getWorkflowRuns(
  owner: string,
  repo: string,
  workflowId: number,
  accessToken: string,
  options: {
    perPage?: number;
    page?: number;
    status?: string;
    conclusion?: string;
  } = {}
): Promise<{ workflowRuns: GitHubWorkflowRun[]; totalCount: number }> {
  try {
    const params = new URLSearchParams();
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.status) params.append('status', options.status);
    if (options.conclusion) params.append('conclusion', options.conclusion);

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      workflowRuns: data.workflow_runs,
      totalCount: data.total_count,
    };
  } catch (error) {
    console.error('Failed to fetch workflow runs:', error);
    throw error;
  }
}

export async function getWorkflowRun(
  owner: string,
  repo: string,
  runId: number,
  accessToken: string
): Promise<GitHubWorkflowRun> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch workflow run:', error);
    throw error;
  }
}

export async function getWorkflowRunJobs(
  owner: string,
  repo: string,
  runId: number,
  accessToken: string
): Promise<{ jobs: GitHubJob[]; totalCount: number }> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      jobs: data.jobs,
      totalCount: data.total_count,
    };
  } catch (error) {
    console.error('Failed to fetch workflow run jobs:', error);
    throw error;
  }
}

export async function getCheckSuites(
  owner: string,
  repo: string,
  ref: string,
  accessToken: string
): Promise<{ checkSuites: GitHubCheckSuite[]; totalCount: number }> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${ref}/check-suites`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      checkSuites: data.check_suites,
      totalCount: data.total_count,
    };
  } catch (error) {
    console.error('Failed to fetch check suites:', error);
    throw error;
  }
}

export async function getCheckRuns(
  owner: string,
  repo: string,
  ref: string,
  accessToken: string
): Promise<{ checkRuns: GitHubCheckRun[]; totalCount: number }> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${ref}/check-runs`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      checkRuns: data.check_runs,
      totalCount: data.total_count,
    };
  } catch (error) {
    console.error('Failed to fetch check runs:', error);
    throw error;
  }
}

export async function rerunWorkflow(
  owner: string,
  repo: string,
  runId: number,
  accessToken: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/rerun`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to rerun workflow:', error);
    throw error;
  }
}

export async function cancelWorkflow(
  owner: string,
  repo: string,
  runId: number,
  accessToken: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to cancel workflow:', error);
    throw error;
  }
}

// Custom CI/CD configuration management
export async function createCICDConfiguration(
  repositoryId: number,
  configuration: Omit<CICDConfiguration, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CICDConfiguration> {
  try {
    const response = await fetch('/api/github/cicd/configurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repositoryId,
        ...configuration,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create CI/CD configuration: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to create CI/CD configuration:', error);
    throw error;
  }
}

export async function getCICDConfigurations(
  repositoryId: number
): Promise<CICDConfiguration[]> {
  try {
    const response = await fetch(`/api/github/cicd/configurations?repositoryId=${repositoryId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch CI/CD configurations: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch CI/CD configurations:', error);
    throw error;
  }
}

export async function updateCICDConfiguration(
  configurationId: string,
  updates: Partial<CICDConfiguration>
): Promise<CICDConfiguration> {
  try {
    const response = await fetch(`/api/github/cicd/configurations/${configurationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update CI/CD configuration: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to update CI/CD configuration:', error);
    throw error;
  }
}

export async function deleteCICDConfiguration(
  configurationId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/github/cicd/configurations/${configurationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete CI/CD configuration: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete CI/CD configuration:', error);
    throw error;
  }
}

export async function triggerCICDExecution(
  configurationId: string,
  trigger: 'manual' | 'push' | 'pull_request',
  branch: string,
  commit: string
): Promise<CICDExecution> {
  try {
    const response = await fetch(`/api/github/cicd/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        configurationId,
        trigger,
        branch,
        commit,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger CI/CD execution: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to trigger CI/CD execution:', error);
    throw error;
  }
}

export async function getCICDExecutions(
  configurationId: string,
  options: {
    limit?: number;
    offset?: number;
    status?: string;
  } = {}
): Promise<{ executions: CICDExecution[]; totalCount: number }> {
  try {
    const params = new URLSearchParams();
    params.append('configurationId', configurationId);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.status) params.append('status', options.status);

    const response = await fetch(`/api/github/cicd/executions?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch CI/CD executions: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch CI/CD executions:', error);
    throw error;
  }
}

export async function getCICDMetrics(
  repositoryId: number,
  timeRange: {
    start: string;
    end: string;
  }
): Promise<CICDMetrics> {
  try {
    const params = new URLSearchParams();
    params.append('repositoryId', repositoryId.toString());
    params.append('start', timeRange.start);
    params.append('end', timeRange.end);

    const response = await fetch(`/api/github/cicd/metrics?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch CI/CD metrics: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch CI/CD metrics:', error);
    throw error;
  }
}

// Utility functions
export function getStatusColor(status: string, conclusion?: string | null): string {
  if (conclusion) {
    switch (conclusion) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failure':
        return 'text-red-600 dark:text-red-400';
      case 'cancelled':
        return 'text-gray-600 dark:text-gray-400';
      case 'skipped':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'timed_out':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400';
    case 'in_progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'queued':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export function getStatusIcon(status: string, conclusion?: string | null) {
  if (conclusion) {
    switch (conclusion) {
      case 'success':
        return '✅';
      case 'failure':
        return '❌';
      case 'cancelled':
        return '⏹️';
      case 'skipped':
        return '⏭️';
      case 'timed_out':
        return '⏰';
      default:
        return '❓';
    }
  }

  switch (status) {
    case 'completed':
      return '✅';
    case 'in_progress':
      return '🔄';
    case 'queued':
      return '⏳';
    default:
      return '❓';
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  
  return date.toLocaleDateString();
}
