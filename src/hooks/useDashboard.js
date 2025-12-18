import { useState, useEffect, useCallback } from 'react';
import { ENV, DEFAULT_CONFIG } from '../constants';
import { getDateRange } from '../utils';
import { GitHubService } from '../services/GitHubService';

/**
 * Custom hook for managing dashboard state and operations
 */
export const useDashboard = () => {
  // Environment-based defaults
  const defaultRepos = ENV.DEFAULT_REPOS.length > 0 
    ? ENV.DEFAULT_REPOS.map(repo => `${ENV.GITHUB_USERNAME}/${repo}`)
    : [];

  // State management
  const [state, setState] = useState({
    repositories: [],
    selectedRepos: defaultRepos,
    githubToken: ENV.GITHUB_TOKEN,
    githubUsername: ENV.GITHUB_USERNAME,
    author: ENV.GITHUB_USERNAME,
    dateRange: getDateRange(DEFAULT_CONFIG.DATE_RANGE_MONTHS),
    analysisResults: [],
    loading: false,
    error: null,
    autoLoaded: false,
    autoAnalyzed: false
  });

  // GitHub service instance
  const [githubService] = useState(() => new GitHubService(state.githubToken));

  // Update GitHub service token when it changes
  useEffect(() => {
    githubService.updateToken(state.githubToken);
  }, [state.githubToken, githubService]);

  /**
   * Load GitHub repositories for the current user
   */
  const loadGitHubRepositories = useCallback(async () => {
    if (!state.githubUsername) {
      setState(prev => ({ ...prev, error: 'GitHub username is required' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const repos = await githubService.getUserRepositories(state.githubUsername);
      setState(prev => ({ 
        ...prev, 
        repositories: repos, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: false 
      }));
    }
  }, [state.githubUsername, githubService]);

  /**
   * Analyze selected repositories
   */
  const analyzeRepositories = useCallback(async () => {
    if (state.selectedRepos.length === 0) {
      setState(prev => ({ ...prev, error: 'Please select at least one repository' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const results = await Promise.all(
        state.selectedRepos.map(async (repoFullName) => {
          const [owner, repo] = repoFullName.split('/');
          
          const result = await githubService.analyzeRepository(
            owner,
            repo,
            state.author || null,
            state.dateRange.since,
            state.dateRange.until
          );
          
          return result;
        })
      );
      
      setState(prev => ({ 
        ...prev, 
        analysisResults: results, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: false 
      }));
    }
  }, [state.selectedRepos, state.author, state.dateRange, githubService]);

  // Auto-load repositories on mount if username is available
  useEffect(() => {
    if (ENV.GITHUB_USERNAME && !state.autoLoaded) {
      setState(prev => ({ ...prev, autoLoaded: true }));
      loadGitHubRepositories();
      
      // Auto-analyze if we have default repos
      if (defaultRepos.length > 0) {
        setTimeout(() => {
          analyzeRepositories();
          setState(prev => ({ ...prev, autoAnalyzed: true }));
        }, 2000);
      }
    }
  }, [ENV.GITHUB_USERNAME, state.autoLoaded, loadGitHubRepositories, analyzeRepositories, defaultRepos.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-analyze repositories when they're loaded and we have env vars but no analysis yet
  useEffect(() => {
    const shouldAutoAnalyze = 
      ENV.GITHUB_USERNAME && 
      state.repositories.length > 0 && 
      state.analysisResults.length === 0 &&
      !state.loading &&
      state.selectedRepos.length > 0 &&
      !state.autoAnalyzed &&
      state.autoLoaded;

    if (shouldAutoAnalyze) {
      // If we have selected repos but no analysis, try to analyze
      const timer = setTimeout(() => {
        analyzeRepositories();
        setState(prev => ({ ...prev, autoAnalyzed: true }));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [state.repositories.length, state.analysisResults.length, state.loading, state.selectedRepos.length, state.autoAnalyzed, state.autoLoaded, analyzeRepositories]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Update a specific state field
   */
  const updateField = useCallback((field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Update multiple state fields at once
   */
  const updateFields = useCallback((fields) => {
    setState(prev => ({ ...prev, ...fields }));
  }, []);

  /**
   * Reset analysis results
   */
  const resetAnalysis = useCallback(() => {
    setState(prev => ({ ...prev, analysisResults: [], error: null }));
  }, []);

  /**
   * Get inactive projects based on cutoff date
   */
  const getInactiveProjects = useCallback((months = 3) => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    return state.analysisResults.filter(result => 
      result.lastCommit && new Date(result.lastCommit.date) < cutoffDate
    );
  }, [state.analysisResults]);

  return {
    // State
    ...state,
    
    // Actions
    loadGitHubRepositories,
    analyzeRepositories,
    updateField,
    updateFields,
    resetAnalysis,
    
    // Computed values
    inactiveProjects: getInactiveProjects(),
    totalProjects: state.analysisResults.length,
    totalCommits: state.analysisResults.reduce((sum, result) => sum + result.totalCommits, 0),
    totalHours: state.analysisResults.reduce((sum, result) => sum + result.estimatedHours, 0)
  };
};
