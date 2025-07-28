import moment from 'moment';
import { ACTIVITY_LEVELS, DEFAULT_CONFIG } from '../constants';

/**
 * Generate a consistent color based on a string hash
 * @param {string} str - String to hash
 * @returns {string} - Hex color
 */
export const getColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Get activity level based on commit frequency
 * @param {number} commitCount - Number of commits
 * @param {number} totalDays - Total days in period
 * @returns {object} - Activity level object
 */
export const getActivityLevel = (commitCount, totalDays) => {
  const commitsPerDay = commitCount / Math.max(totalDays, 1);
  const normalizedActivity = Math.min(commitsPerDay / 2, 1); // Normalize to 0-1 scale
  
  for (const [level, config] of Object.entries(ACTIVITY_LEVELS)) {
    if (normalizedActivity <= config.threshold) {
      return { ...config, level, value: normalizedActivity };
    }
  }
  
  return { ...ACTIVITY_LEVELS.VERY_HIGH, level: 'VERY_HIGH', value: normalizedActivity };
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Moment.js format string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  return date ? moment(date).format(format) : 'N/A';
};

/**
 * Get relative time from now
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  return date ? moment(date).fromNow() : 'Never';
};

/**
 * Calculate date range for analysis
 * @param {number} months - Number of months back
 * @returns {object} - Date range object
 */
export const getDateRange = (months = DEFAULT_CONFIG.DATE_RANGE_MONTHS) => ({
  since: moment().subtract(months, 'months').format('YYYY-MM-DD'),
  until: moment().format('YYYY-MM-DD')
});

/**
 * Validate GitHub repository name format
 * @param {string} repoName - Repository name in format "owner/repo"
 * @returns {boolean} - Is valid format
 */
export const isValidRepoFormat = (repoName) => {
  const regex = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
  return regex.test(repoName);
};

/**
 * Parse repository full name into owner and repo
 * @param {string} fullName - Full repository name "owner/repo"
 * @returns {object} - Object with owner and repo properties
 */
export const parseRepoName = (fullName) => {
  const [owner, repo] = fullName.split('/');
  return { owner, repo };
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
