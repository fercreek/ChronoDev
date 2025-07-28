// Environment variables
export const ENV = {
  GITHUB_USERNAME: process.env.REACT_APP_GITHUB_USERNAME || '',
  GITHUB_TOKEN: process.env.REACT_APP_GITHUB_TOKEN || '',
  DEFAULT_REPOS: process.env.REACT_APP_DEFAULT_REPOS 
    ? process.env.REACT_APP_DEFAULT_REPOS.split(',').map(repo => repo.trim())
    : []
};

// Default configuration
export const DEFAULT_CONFIG = {
  DATE_RANGE_MONTHS: 6,
  COMMITS_PER_PAGE: 100,
  MAX_PAGES: 10,
  SESSION_GAP_HOURS: 2,
  MIN_SESSION_MINUTES: 30,
  MAX_SESSION_HOURS: 8
};

// Activity levels
export const ACTIVITY_LEVELS = {
  VERY_LOW: { threshold: 0.2, color: '#f44336', label: 'Very Low' },
  LOW: { threshold: 0.4, color: '#ff9800', label: 'Low' },
  MEDIUM: { threshold: 0.6, color: '#ffeb3b', label: 'Medium' },
  HIGH: { threshold: 0.8, color: '#4caf50', label: 'High' },
  VERY_HIGH: { threshold: 1.0, color: '#2196f3', label: 'Very High' }
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3'
};
