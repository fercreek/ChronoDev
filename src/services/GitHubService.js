import axios from 'axios';
import moment from 'moment';

// Git Hours estimation algorithm - client-side implementation
class GitHoursEstimator {
  constructor(options = {}) {
    this.maxCommitDiff = options.maxCommitDiff || 2 * 60 * 60 * 1000; // 2 hours in ms
    this.firstCommitAdd = options.firstCommitAdd || 2 * 60 * 60 * 1000; // 2 hours in ms
  }

  estimateHours(commits) {
    if (!commits || commits.length === 0) return { hours: 0, sessions: 0 };

    // Sort commits by date (oldest first)
    const sortedCommits = commits.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let totalHours = 0;
    let sessions = 0;
    let currentSessionStart = null;
    let lastCommitTime = null;

    for (const commit of sortedCommits) {
      const commitTime = new Date(commit.date);
      
      if (!currentSessionStart) {
        // Start new session
        currentSessionStart = commitTime;
        lastCommitTime = commitTime;
        sessions++;
        // Add initial time for the session
        totalHours += this.firstCommitAdd / (1000 * 60 * 60);
      } else {
        const timeDiff = commitTime - lastCommitTime;
        
        if (timeDiff > this.maxCommitDiff) {
          // End current session and start new one
          currentSessionStart = commitTime;
          sessions++;
          // Add initial time for the new session
          totalHours += this.firstCommitAdd / (1000 * 60 * 60);
        } else {
          // Continue current session - add time between commits
          totalHours += timeDiff / (1000 * 60 * 60);
        }
        
        lastCommitTime = commitTime;
      }
    }

    return {
      hours: Math.round(totalHours * 100) / 100,
      sessions,
      commits: commits.length
    };
  }

  getWeeklyStats(commits) {
    const weeklyData = {};
    
    commits.forEach(commit => {
      const week = moment(commit.date).startOf('isoWeek').format('YYYY-MM-DD');
      if (!weeklyData[week]) {
        weeklyData[week] = [];
      }
      weeklyData[week].push(commit);
    });

    const weeklyStats = {};
    Object.keys(weeklyData).forEach(week => {
      const weekCommits = weeklyData[week];
      const estimation = this.estimateHours(weekCommits);
      weeklyStats[week] = {
        commits: weekCommits.length,
        hours: estimation.hours,
        sessions: estimation.sessions
      };
    });

    return weeklyStats;
  }
}

// GitHub API service - client-side implementation
class GitHubService {
  constructor(token = null) {
    this.token = token;
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    this.estimator = new GitHoursEstimator();
  }

  updateToken(token) {
    this.token = token;
    this.api.defaults.headers['Authorization'] = token ? `Bearer ${token}` : '';
    if (!token) {
      delete this.api.defaults.headers['Authorization'];
    }
  }

  async getUserRepositories(username) {
    try {
      const response = await this.api.get(`/users/${username}/repos`, {
        params: {
          type: 'owner',
          sort: 'pushed', // Sort by last push date
          direction: 'desc', // Most recent first
          per_page: 100
        }
      });

      // Map and ensure client-side sorting by pushed_at date (most recent first)
      const repositories = response.data.map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        updatedAt: repo.updated_at,
        createdAt: repo.created_at,
        pushedAt: repo.pushed_at, // Last push date
        private: repo.private,
        url: repo.html_url,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count
      }));

      // Additional client-side sorting to ensure most recent first
      return repositories.sort((a, b) => {
        const dateA = new Date(a.pushedAt || a.updatedAt);
        const dateB = new Date(b.pushedAt || b.updatedAt);
        return dateB - dateA; // Most recent first
      });
    } catch (error) {
      console.error(`Error fetching repositories for ${username}:`, error.message);
      throw new Error(`Failed to fetch repositories: ${error.response?.data?.message || error.message}`);
    }
  }

  async getRepositoryDetails(owner, repo) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      const repoData = response.data;
      return {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stargazersCount: repoData.stargazers_count,
        forksCount: repoData.forks_count,
        openIssuesCount: repoData.open_issues_count,
        defaultBranch: repoData.default_branch,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        url: repoData.html_url
      };
    } catch (error) {
      // Non-fatal: analysis can proceed without repo details
      return null;
    }
  }

  async getRepositoryCommits(owner, repo, author = null, since = null, until = null) {
    try {
      const params = {
        per_page: 100,
        page: 1
      };
      
      if (author) params.author = author;
      if (since) params.since = since;
      if (until) params.until = until;

      let allCommits = [];
      let hasMore = true;

      while (hasMore && params.page <= 10) { // Limit to 10 pages (1000 commits) for performance
        const response = await this.api.get(`/repos/${owner}/${repo}/commits`, { params });
        
        const commits = response.data.map(commit => ({
          sha: commit.sha,
          date: commit.commit.author.date,
          message: commit.commit.message,
          author: commit.commit.author.name,
          url: commit.html_url
        }));

        allCommits = allCommits.concat(commits);

        // Check if there are more pages
        hasMore = commits.length === 100;
        params.page++;
      }

      return allCommits;
    } catch (error) {
      throw new Error(`Failed to fetch commits: ${error.response?.data?.message || error.message}`);
    }
  }

  async analyzeRepository(owner, repo, author = null, since = null, until = null) {
    try {
      const [commits, repoDetails] = await Promise.all([
        this.getRepositoryCommits(owner, repo, author, since, until),
        this.getRepositoryDetails(owner, repo)
      ]);
      const estimation = this.estimator.estimateHours(commits);
      const weeklyStats = this.estimator.getWeeklyStats(commits);
      
      const lastCommit = commits.length > 0 ? 
        commits.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;

      return {
        repository: `${owner}/${repo}`,
        repositoryDetails: repoDetails,
        language: repoDetails?.language || null,
        stargazersCount: repoDetails?.stargazersCount || 0,
        forksCount: repoDetails?.forksCount || 0,
        description: repoDetails?.description || null,
        pushedAt: repoDetails?.pushedAt || null,
        totalCommits: commits.length,
        estimatedHours: estimation.hours,
        sessions: estimation.sessions,
        lastCommitDate: lastCommit ? lastCommit.date : null,
        lastCommit: lastCommit ? {
          date: lastCommit.date,
          message: lastCommit.message,
          url: lastCommit.url
        } : null,
        weeklyStats,
        commits: commits.slice(0, 10) // Include latest 10 commits for reference
      };
    } catch (error) {
      return {
        repository: `${owner}/${repo}`,
        error: error.message
      };
    }
  }

  async analyzeMultipleRepositories(repositories, author = null, since = null, until = null) {
    const results = [];
    
    for (const repoFullName of repositories) {
      try {
        const [owner, repo] = repoFullName.split('/');
        const result = await this.analyzeRepository(owner, repo, author, since, until);
        results.push(result);
      } catch (error) {
        results.push({
          repository: repoFullName,
          error: error.message
        });
      }
    }

    return results;
  }

  // Get rate limit info
  async getRateLimit() {
    try {
      const response = await this.api.get('/rate_limit');
      return response.data;
    } catch (error) {
      console.error('Error fetching rate limit:', error.message);
      return null;
    }
  }
}

export { GitHubService, GitHoursEstimator };
