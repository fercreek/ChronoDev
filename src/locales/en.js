export const en = {
  // Dashboard
  dashboard: {
    title: 'ChronoDev Dashboard',
    welcome: 'Welcome to ChronoDev Dashboard',
    welcomeMessage: 'Configure your GitHub repositories and analysis settings to get started.',
    goToConfiguration: 'Go to Configuration',
    loadingRepos: 'Loading Repositories...',
    loadingReposMessage: 'We are loading your GitHub repositories using the configured environment variables.',
    reposLoaded: 'Repositories Loaded',
    reposLoadedMessage: 'Found {count} repository(ies). Go to Configuration to select and analyze repositories.',
    goToConfig: 'Go to Configuration',
    
    // Sections
    searchAndFilters: 'Search & Filters',
    summaryStatistics: 'Summary Statistics',
    weeklyActivityCharts: 'Weekly Activity Charts',
    projectDetails: 'Project Details',
    advancedMetrics: 'Advanced Productivity Metrics',
    
    // Statistics
    totalProjects: 'Total Projects',
    totalCommits: 'Total Commits',
    estimatedHours: 'Estimated Hours',
    avgCommitsPerProject: 'Avg Commits/Project',
    
    // Filters
    searchProjects: 'Search projects',
    language: 'Language',
    all: 'All',
    sortBy: 'Sort by',
    recent: 'Recent',
    stars: 'Stars',
    forks: 'Forks',
    commits: 'Commits',
    hours: 'Hours',
    name: 'Name',
    asc: 'Asc',
    desc: 'Desc',
    showInactiveOnly: 'Show inactive projects only (no activity in 3+ months)',
    totalStars: 'Total Stars',
    totalForks: 'Total Forks',
    projectsCount: '{filtered} of {total} projects',
    topProjectsRankings: 'Top Projects Rankings',
    topByCommits: 'Top by Commits',
    topByHours: 'Top by Hours',
    mostConsistent: 'Most Consistent Projects',
    commitsPerWeek: 'Commits/week',
    frequency: 'Frequency',
  },
  
  // Charts
  charts: {
    weeklyTrend: 'Weekly {metric} Trend',
    hours: 'Hours',
    commits: 'Commits',
    metric: 'Metric',
    projectsToDisplay: 'Projects to Display',
    showingData: 'Showing data from {start} to {end} ({weeks} weeks)',
    total: 'Total',
    showTotalOnly: 'Show Total Only',
    mostActiveProjects: 'Most active projects:',
    noneSelected: 'None selected',
  },
  
  // Project Card
  projectCard: {
    noCommits: 'No commits',
    daysAgo: '{days} days ago',
    activityLevel: 'Activity Level',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    veryLow: 'Very Low',
    commits: 'Commits',
    estimated: 'Estimated',
    lastCommit: 'Last Commit',
  },
  
  // Configuration
  config: {
    title: 'ChronoDev Configuration',
    githubAnalysis: 'GitHub Repository Analysis',
    githubUsername: 'GitHub Username',
    githubToken: 'GitHub Token (Optional)',
    tokenHelper: 'For private repos and higher rate limits',
    loadRepositories: 'Load Repositories',
    repositorySelection: 'Repository Selection',
    analysisSettings: 'Analysis Settings',
    authorFilter: 'Author Filter (Optional)',
    authorHelper: 'Filter commits by author name',
    sinceDate: 'Since Date',
    untilDate: 'Until Date',
    analyzeAndView: 'ANALYZE & VIEW DASHBOARD',
    backToDashboard: 'Back to Dashboard',
    helpAndTips: 'Help & Tips',
    tokenSetup: 'GitHub Token Setup',
    analysisTips: 'Analysis Tips',
  },
  
  // Footer
  footer: {
    description: 'A modern tool to estimate development hours and visualize commit activity across multiple GitHub repositories. Uses Git Hours-like heuristics to group commits into coding sessions and calculate estimated development time.',
    whatDoesItDo: 'What does this tool do?',
    multiRepoAnalysis: 'Multi-Repository Analysis',
    multiRepoDesc: 'Analyze multiple GitHub repositories simultaneously to get a complete view of your development activity.',
    smartHours: 'Smart Hours Estimation',
    smartHoursDesc: 'Groups commits into coding sessions and calculates estimated hours using advanced heuristics based on time intervals between commits.',
    interactiveViz: 'Interactive Visualization',
    interactiveVizDesc: 'Interactive weekly charts, modern project cards, and advanced metrics to better understand your productivity.',
    algorithm: 'Estimation Algorithm:',
    algorithmDetails: '• Commits within 2 hours = Same coding session\n• Gaps greater than 2 hours = New session starts\n• Each session gets base time (2 hours) + time between commits\n• Activity classification: High (≥50h), Medium (20-49h), Low (5-19h), Very Low (<5h)',
    builtWith: 'Built with:',
    copyright: '© {year} ChronoDev. Made with ❤️ for developers.',
  },
};

