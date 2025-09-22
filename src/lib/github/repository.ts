// GitHub repository management and operations

import { 
  GitHubRepository, 
  RepositoryTemplate, 
  RepositoryFile, 
  WorkflowTemplate,
  AssignmentRepository,
  AssignmentTemplate,
  GitHubAPIClient
} from '@/types/github';

export class RepositoryManager {
  private apiClient: GitHubAPIClient;

  constructor(apiClient: GitHubAPIClient) {
    this.apiClient = apiClient;
  }

  /**
   * Create a new repository
   */
  async createRepository(
    name: string,
    description?: string,
    isPrivate: boolean = false,
    isTemplate: boolean = false,
    autoInit: boolean = true,
    gitignoreTemplate?: string,
    licenseTemplate?: string
  ): Promise<GitHubRepository> {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: autoInit,
          gitignore_template: gitignoreTemplate,
          license_template: licenseTemplate,
          template: isTemplate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Repository creation failed: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository creation error:', error);
      throw error;
    }
  }

  /**
   * Create repository from template
   */
  async createRepositoryFromTemplate(
    templateOwner: string,
    templateRepo: string,
    name: string,
    description?: string,
    isPrivate: boolean = false,
    owner?: string
  ): Promise<GitHubRepository> {
    try {
      const url = owner 
        ? `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`
        : `https://api.github.com/user/repos`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          owner: owner || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Template repository creation failed: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Template repository creation error:', error);
      throw error;
    }
  }

  /**
   * Fork a repository
   */
  async forkRepository(
    owner: string,
    repo: string,
    organization?: string,
    name?: string
  ): Promise<GitHubRepository> {
    try {
      const url = organization 
        ? `https://api.github.com/repos/${owner}/${repo}/forks`
        : `https://api.github.com/repos/${owner}/${repo}/forks`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          organization: organization || undefined,
          name: name || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Repository fork failed: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository fork error:', error);
      throw error;
    }
  }

  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.apiClient.getRepository(owner, repo);
  }

  /**
   * Update repository settings
   */
  async updateRepository(
    owner: string,
    repo: string,
    updates: {
      name?: string;
      description?: string;
      homepage?: string;
      private?: boolean;
      visibility?: 'public' | 'private' | 'internal';
      hasIssues?: boolean;
      hasProjects?: boolean;
      hasWiki?: boolean;
      hasDownloads?: boolean;
      allowSquashMerge?: boolean;
      allowMergeCommit?: boolean;
      allowRebaseMerge?: boolean;
      allowAutoMerge?: boolean;
      deleteBranchOnMerge?: boolean;
      archived?: boolean;
      disabled?: boolean;
    }
  ): Promise<GitHubRepository> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Repository update failed: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository update error:', error);
      throw error;
    }
  }

  /**
   * Delete a repository
   */
  async deleteRepository(owner: string, repo: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Repository deletion error:', error);
      return false;
    }
  }

  /**
   * Get repository contents
   */
  async getRepositoryContents(
    owner: string,
    repo: string,
    path: string = '',
    ref?: string
  ): Promise<RepositoryFile[]> {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const params = new URLSearchParams();
      if (ref) params.append('ref', ref);

      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to get repository contents: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository contents fetch error:', error);
      throw error;
    }
  }

  /**
   * Create or update file in repository
   */
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string = 'main',
    sha?: string
  ): Promise<{ commit: any; content: RepositoryFile }> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          message,
          content: btoa(content),
          branch,
          sha: sha || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`File creation/update failed: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('File creation/update error:', error);
      throw error;
    }
  }

  /**
   * Delete file from repository
   */
  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    branch: string = 'main',
    sha: string
  ): Promise<{ commit: any }> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          message,
          branch,
          sha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`File deletion failed: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  }

  /**
   * Get repository languages
   */
  async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to get repository languages: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository languages fetch error:', error);
      throw error;
    }
  }

  /**
   * Get repository topics
   */
  async getRepositoryTopics(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/topics`, {
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.mercy-preview+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to get repository topics: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.names || [];
    } catch (error) {
      console.error('Repository topics fetch error:', error);
      throw error;
    }
  }

  /**
   * Update repository topics
   */
  async updateRepositoryTopics(
    owner: string,
    repo: string,
    topics: string[]
  ): Promise<{ names: string[] }> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/topics`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.mercy-preview+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          names: topics,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to update repository topics: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository topics update error:', error);
      throw error;
    }
  }

  /**
   * Get repository collaborators
   */
  async getRepositoryCollaborators(
    owner: string,
    repo: string,
    affiliation: 'outside' | 'direct' | 'all' = 'all'
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/collaborators?affiliation=${affiliation}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiClient['accessToken']}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CodeTracker-Education-Platform',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to get repository collaborators: ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Repository collaborators fetch error:', error);
      throw error;
    }
  }

  /**
   * Add repository collaborator
   */
  async addRepositoryCollaborator(
    owner: string,
    repo: string,
    username: string,
    permission: 'pull' | 'push' | 'admin' | 'maintain' | 'triage' = 'push'
  ): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
        body: JSON.stringify({
          permission,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Add collaborator error:', error);
      return false;
    }
  }

  /**
   * Remove repository collaborator
   */
  async removeRepositoryCollaborator(
    owner: string,
    repo: string,
    username: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiClient['accessToken']}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Remove collaborator error:', error);
      return false;
    }
  }
}

// Assignment Repository Management
export class AssignmentRepositoryManager {
  private repositoryManager: RepositoryManager;

  constructor(repositoryManager: RepositoryManager) {
    this.repositoryManager = repositoryManager;
  }

  /**
   * Create assignment repository for student
   */
  async createAssignmentRepository(
    assignmentTemplate: AssignmentTemplate,
    studentId: string,
    studentGitHubUsername: string,
    repositoryName: string
  ): Promise<AssignmentRepository> {
    try {
      // Create repository from template
      const repository = await this.repositoryManager.createRepositoryFromTemplate(
        'assignment-templates', // Template owner
        assignmentTemplate.repositoryTemplateId,
        repositoryName,
        `Assignment: ${assignmentTemplate.name}`,
        true, // Private repository
        studentGitHubUsername
      );

      // Add starter code files
      for (const file of assignmentTemplate.starterCode) {
        await this.repositoryManager.createOrUpdateFile(
          studentGitHubUsername,
          repositoryName,
          file.path,
          file.content,
          'Add starter code',
          'main'
        );
      }

      // Add test files
      for (const file of assignmentTemplate.testFiles) {
        await this.repositoryManager.createOrUpdateFile(
          studentGitHubUsername,
          repositoryName,
          file.path,
          file.content,
          'Add test files',
          'main'
        );
      }

      // Add workflow files
      for (const workflow of assignmentTemplate.workflowFiles) {
        await this.repositoryManager.createOrUpdateFile(
          studentGitHubUsername,
          repositoryName,
          `.github/workflows/${workflow.name}`,
          workflow.content,
          'Add CI/CD workflow',
          'main'
        );
      }

      // Create README with instructions
      await this.repositoryManager.createOrUpdateFile(
        studentGitHubUsername,
        repositoryName,
        'README.md',
        assignmentTemplate.readmeContent,
        'Add assignment instructions',
        'main'
      );

      // Set repository topics
      await this.repositoryManager.updateRepositoryTopics(
        studentGitHubUsername,
        repositoryName,
        ['assignment', 'education', assignmentTemplate.assignmentId]
      );

      const assignmentRepo: AssignmentRepository = {
        id: `assignment_${Date.now()}`,
        assignmentId: assignmentTemplate.assignmentId,
        repositoryId: repository.id,
        repositoryName: repository.name,
        studentId,
        studentGitHubId: 0, // Will be set after fetching user info
        templateRepositoryId: parseInt(assignmentTemplate.repositoryTemplateId),
        isTemplate: false,
        visibility: 'private',
        status: 'active',
        submissionType: 'pull_request',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return assignmentRepo;
    } catch (error) {
      console.error('Assignment repository creation error:', error);
      throw error;
    }
  }

  /**
   * Create assignment template repository
   */
  async createAssignmentTemplate(
    template: AssignmentTemplate,
    teacherGitHubUsername: string
  ): Promise<GitHubRepository> {
    try {
      const repository = await this.repositoryManager.createRepository(
        `${template.name}-template`,
        `Template for ${template.name}`,
        false, // Public template
        true, // Is template
        true // Auto init
      );

      // Add template files
      for (const file of template.starterCode) {
        await this.repositoryManager.createOrUpdateFile(
          teacherGitHubUsername,
          `${template.name}-template`,
          file.path,
          file.content,
          'Add template file',
          'main'
        );
      }

      // Add test files
      for (const file of template.testFiles) {
        await this.repositoryManager.createOrUpdateFile(
          teacherGitHubUsername,
          `${template.name}-template`,
          file.path,
          file.content,
          'Add test file',
          'main'
        );
      }

      // Add workflow files
      for (const workflow of template.workflowFiles) {
        await this.repositoryManager.createOrUpdateFile(
          teacherGitHubUsername,
          `${template.name}-template`,
          `.github/workflows/${workflow.name}`,
          workflow.content,
          'Add workflow',
          'main'
        );
      }

      // Create template README
      const templateReadme = `# ${template.name} - Assignment Template

${template.description}

## Instructions

${template.instructions}

## Getting Started

1. Fork this repository
2. Clone your fork
3. Complete the assignment
4. Submit via pull request

## Grading Criteria

${template.gradingCriteria.map(criteria => `- ${criteria.name}: ${criteria.description}`).join('\n')}
`;

      await this.repositoryManager.createOrUpdateFile(
        teacherGitHubUsername,
        `${template.name}-template`,
        'README.md',
        templateReadme,
        'Add template README',
        'main'
      );

      // Set repository topics
      await this.repositoryManager.updateRepositoryTopics(
        teacherGitHubUsername,
        `${template.name}-template`,
        ['template', 'assignment', 'education', template.assignmentId]
      );

      return repository;
    } catch (error) {
      console.error('Assignment template creation error:', error);
      throw error;
    }
  }

  /**
   * Archive assignment repository
   */
  async archiveAssignmentRepository(
    owner: string,
    repo: string
  ): Promise<boolean> {
    try {
      await this.repositoryManager.updateRepository(owner, repo, {
        archived: true,
        description: 'Archived assignment repository',
      });

      return true;
    } catch (error) {
      console.error('Repository archiving error:', error);
      return false;
    }
  }

  /**
   * Get assignment repository status
   */
  async getAssignmentRepositoryStatus(
    owner: string,
    repo: string
  ): Promise<{
    hasSubmissions: boolean;
    lastCommit: string;
    pullRequestCount: number;
    issueCount: number;
    isUpToDate: boolean;
  }> {
    try {
      const [commits, pullRequests, issues] = await Promise.all([
        this.repositoryManager['apiClient'].getRepositoryCommits(owner, repo, 1, 1),
        this.repositoryManager['apiClient'].getRepositoryPullRequests(owner, repo, 'all', undefined, undefined, 'updated', 'desc', 1, 1),
        this.repositoryManager['apiClient'].getRepositoryIssues(owner, repo, 'all', undefined, 'updated', 'desc', 1, 1),
      ]);

      return {
        hasSubmissions: commits.length > 0,
        lastCommit: commits[0]?.commit.author.date || '',
        pullRequestCount: pullRequests.length,
        issueCount: issues.length,
        isUpToDate: commits.length > 0,
      };
    } catch (error) {
      console.error('Repository status fetch error:', error);
      throw error;
    }
  }
}
