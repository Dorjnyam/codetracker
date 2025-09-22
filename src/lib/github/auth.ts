// GitHub OAuth authentication and token management

import { GitHubToken, GitHubUser, GitHubOAuthConfig, RateLimitInfo } from '@/types/github';

export class GitHubAuthService {
  private config: GitHubOAuthConfig;
  private baseUrl = 'https://github.com';
  private apiUrl = 'https://api.github.com';

  constructor(config: GitHubOAuthConfig) {
    this.config = config;
  }

  /**
   * Generate GitHub OAuth authorization URL
   */
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: state || this.config.state || this.generateState(),
    });

    return `${this.baseUrl}/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, state?: string): Promise<GitHubToken> {
    try {
      const response = await fetch(`${this.baseUrl}/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
          redirect_uri: this.config.redirectUri,
          state,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
      }

      const token: GitHubToken = {
        accessToken: data.access_token,
        tokenType: data.token_type,
        scope: data.scope?.split(' ') || [],
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
        createdAt: new Date(),
        userId: '', // Will be set after fetching user info
      };

      return token;
    } catch (error) {
      console.error('GitHub token exchange error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token (if refresh token is available)
   */
  async refreshToken(refreshToken: string): Promise<GitHubToken> {
    try {
      const response = await fetch(`${this.baseUrl}/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
      }

      const token: GitHubToken = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope?.split(' ') || [],
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
        createdAt: new Date(),
        userId: '', // Will be set after fetching user info
      };

      return token;
    } catch (error) {
      console.error('GitHub token refresh error:', error);
      throw error;
    }
  }

  /**
   * Fetch GitHub user information
   */
  async fetchUserInfo(accessToken: string): Promise<GitHubUser> {
    try {
      const response = await fetch(`${this.apiUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
      }

      const userData = await response.json();

      const user: GitHubUser = {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog,
        twitterUsername: userData.twitter_username,
        publicRepos: userData.public_repos,
        publicGists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      };

      return user;
    } catch (error) {
      console.error('GitHub user info fetch error:', error);
      throw error;
    }
  }

  /**
   * Validate access token
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(accessToken: string): Promise<RateLimitInfo> {
    try {
      const response = await fetch(`${this.apiUrl}/rate_limit`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rate limit: ${response.statusText}`);
      }

      const data = await response.json();
      const core = data.resources.core;

      return {
        limit: core.limit,
        remaining: core.remaining,
        reset: core.reset,
        used: core.used,
      };
    } catch (error) {
      console.error('Rate limit fetch error:', error);
      throw error;
    }
  }

  /**
   * Revoke access token
   */
  async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/applications/${this.config.clientId}/token`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeTracker-Education-Platform',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token revocation error:', error);
      return false;
    }
  }

  /**
   * Generate secure state parameter
   */
  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify state parameter
   */
  verifyState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState;
  }
}

// Token storage and management utilities
export class TokenManager {
  private static readonly TOKEN_KEY = 'github_token';
  private static readonly USER_KEY = 'github_user';

  /**
   * Store token in secure storage
   */
  static async storeToken(token: GitHubToken): Promise<void> {
    try {
      // In a real application, you would encrypt the token before storing
      const encryptedToken = await this.encryptToken(token);
      localStorage.setItem(this.TOKEN_KEY, encryptedToken);
    } catch (error) {
      console.error('Token storage error:', error);
      throw error;
    }
  }

  /**
   * Retrieve token from storage
   */
  static async getToken(): Promise<GitHubToken | null> {
    try {
      const encryptedToken = localStorage.getItem(this.TOKEN_KEY);
      if (!encryptedToken) {
        return null;
      }

      const token = await this.decryptToken(encryptedToken);
      
      // Check if token is expired
      if (token.expiresAt && token.expiresAt < new Date()) {
        await this.removeToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Token retrieval error:', error);
      return null;
    }
  }

  /**
   * Remove token from storage
   */
  static async removeToken(): Promise<void> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Token removal error:', error);
    }
  }

  /**
   * Store user information
   */
  static async storeUser(user: GitHubUser): Promise<void> {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('User storage error:', error);
    }
  }

  /**
   * Retrieve user information
   */
  static async getUser(): Promise<GitHubUser | null> {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      if (!userData) {
        return null;
      }

      return JSON.parse(userData);
    } catch (error) {
      console.error('User retrieval error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  /**
   * Encrypt token for storage (placeholder implementation)
   */
  private static async encryptToken(token: GitHubToken): Promise<string> {
    // In a real application, you would use proper encryption
    // For now, we'll use base64 encoding (not secure for production)
    return btoa(JSON.stringify(token));
  }

  /**
   * Decrypt token from storage (placeholder implementation)
   */
  private static async decryptToken(encryptedToken: string): Promise<GitHubToken> {
    // In a real application, you would use proper decryption
    // For now, we'll use base64 decoding (not secure for production)
    return JSON.parse(atob(encryptedToken));
  }
}

// GitHub API client with authentication
export class GitHubAPIClient {
  private accessToken: string;
  private baseUrl = 'https://api.github.com';
  private userAgent = 'CodeTracker-Education-Platform';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Make authenticated request to GitHub API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': this.userAgent,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`
      );
    }

    return response.json();
  }

  /**
   * Get user information
   */
  async getUser(): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>('/user');
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(
    page = 1,
    perPage = 30,
    type: 'all' | 'owner' | 'public' | 'private' | 'member' = 'all',
    sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'updated',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<GitHubRepository[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      type,
      sort,
      direction,
    });

    return this.makeRequest<GitHubRepository[]>(`/user/repos?${params.toString()}`);
  }

  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  /**
   * Get repository commits
   */
  async getRepositoryCommits(
    owner: string,
    repo: string,
    page = 1,
    perPage = 30,
    sha?: string,
    path?: string,
    author?: string,
    since?: string,
    until?: string
  ): Promise<GitHubCommit[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (sha) params.append('sha', sha);
    if (path) params.append('path', path);
    if (author) params.append('author', author);
    if (since) params.append('since', since);
    if (until) params.append('until', until);

    return this.makeRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?${params.toString()}`);
  }

  /**
   * Get repository branches
   */
  async getRepositoryBranches(
    owner: string,
    repo: string,
    page = 1,
    perPage = 30
  ): Promise<GitHubBranch[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    return this.makeRequest<GitHubBranch[]>(`/repos/${owner}/${repo}/branches?${params.toString()}`);
  }

  /**
   * Get repository pull requests
   */
  async getRepositoryPullRequests(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open',
    head?: string,
    base?: string,
    sort: 'created' | 'updated' | 'popularity' = 'created',
    direction: 'asc' | 'desc' = 'desc',
    page = 1,
    perPage = 30
  ): Promise<GitHubPullRequest[]> {
    const params = new URLSearchParams({
      state,
      sort,
      direction,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (head) params.append('head', head);
    if (base) params.append('base', base);

    return this.makeRequest<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls?${params.toString()}`);
  }

  /**
   * Get repository issues
   */
  async getRepositoryIssues(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open',
    labels?: string,
    sort: 'created' | 'updated' | 'comments' = 'created',
    direction: 'asc' | 'desc' = 'desc',
    page = 1,
    perPage = 30
  ): Promise<GitHubIssue[]> {
    const params = new URLSearchParams({
      state,
      sort,
      direction,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (labels) params.append('labels', labels);

    return this.makeRequest<GitHubIssue[]>(`/repos/${owner}/${repo}/issues?${params.toString()}`);
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(): Promise<RateLimitInfo> {
    const data = await this.makeRequest<any>('/rate_limit');
    return data.resources.core;
  }
}

// Export types for use in other modules
export type { GitHubToken, GitHubUser, GitHubOAuthConfig, RateLimitInfo };
