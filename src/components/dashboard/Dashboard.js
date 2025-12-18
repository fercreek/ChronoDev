import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Commit as CommitIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { Star as StarIcon, CallSplit as ForkIcon, Sort as SortIcon, Search as SearchIcon } from '@mui/icons-material';

import { useDashboard } from '../../hooks/useDashboard';
import { ProjectCard } from '../repository';
import { WeeklyChart } from '../charts';
import CollapsibleSection from '../common/CollapsibleSection';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import AdvancedMetrics from './AdvancedMetrics';
import SummaryStatistics from './SummaryStatistics';
import TopProjectsRanking from './TopProjectsRanking';
import { ConfigurationView } from '../configuration';
import Footer from '../common/Footer';
import { ENV } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/i18n';

const Dashboard = () => {
  const { language } = useLanguage();
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [filters, setFilters] = React.useState({
    search: '',
    language: 'all',
    sortBy: 'recent',
    sortOrder: 'desc',
    inactiveOnly: false
  });
  
  const {
    // State
    analysisResults,
    error,
    totalProjects,
    totalCommits,
    totalHours,
    repositories,
    loading,
  } = useDashboard();

  // Calculate average commits per project
  const avgCommitsPerProject = totalProjects > 0 ? Math.round(totalCommits / totalProjects) : 0;

  // Derived filter options and filtered results
  const languages = React.useMemo(() => {
    const set = new Set();
    analysisResults.forEach(r => { if (r.language) set.add(r.language); });
    return Array.from(set).sort();
  }, [analysisResults]);

  const filteredResults = React.useMemo(() => {
    let results = [...analysisResults];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(r => r.repository.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
    }

    if (filters.language !== 'all') {
      results = results.filter(r => (r.language || 'unknown') === filters.language);
    }

    if (filters.inactiveOnly) {
      results = results.filter(r => {
        const ref = r.lastCommitDate || r.pushedAt;
        if (!ref) return true;
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - 3);
        return new Date(ref) < cutoff;
      });
    }

    const dir = filters.sortOrder === 'asc' ? 1 : -1;
    results.sort((a, b) => {
      const by = filters.sortBy;
      const get = (x) => {
        switch (by) {
          case 'stars': return x.stargazersCount || 0;
          case 'forks': return x.forksCount || 0;
          case 'commits': return x.totalCommits || 0;
          case 'hours': return x.estimatedHours || 0;
          case 'name': return (x.repository || '').toLowerCase();
          case 'recent':
          default:
            return new Date(x.lastCommitDate || x.pushedAt || 0).getTime();
        }
      };

      const va = get(a);
      const vb = get(b);
      if (typeof va === 'string' && typeof vb === 'string') {
        return dir * va.localeCompare(vb);
      }
      return dir * (va - vb);
    });

    return results;
  }, [analysisResults, filters]);

  const totals = React.useMemo(() => ({
    stars: analysisResults.reduce((s, r) => s + (r.stargazersCount || 0), 0),
    forks: analysisResults.reduce((s, r) => s + (r.forksCount || 0), 0)
  }), [analysisResults]);

  const handleGoToConfiguration = () => {
    setCurrentView('configuration');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Show configuration view if selected
  if (currentView === 'configuration') {
    return <ConfigurationView onBackToDashboard={handleBackToDashboard} />;
  }

  return (
    <>
      {/* Dashboard App Bar */}
      <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <GitHubIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChronoDev Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleGoToConfiguration}
            startIcon={<SettingsIcon />}
            sx={{ mr: 1 }}
          >
            {t('dashboard.goToConfiguration', language)}
          </Button>
          <LanguageToggle />
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Filters Bar */}
        {analysisResults.length > 0 && (
          <CollapsibleSection 
            title={t('dashboard.searchAndFilters', language)} 
            icon={<SearchIcon />} 
            defaultExpanded={false}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label={t('dashboard.searchProjects', language)}
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    InputProps={{
                      startAdornment: (<SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('dashboard.language', language)}</InputLabel>
                    <Select
                      label={t('dashboard.language', language)}
                      value={filters.language}
                      onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                    >
                      <MenuItem value="all">{t('dashboard.all', language)}</MenuItem>
                      {languages.map(lang => (
                        <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('dashboard.sortBy', language)}</InputLabel>
                    <Select
                      label={t('dashboard.sortBy', language)}
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    >
                      <MenuItem value="recent">{t('dashboard.recent', language)}</MenuItem>
                      <MenuItem value="stars">{t('dashboard.stars', language)}</MenuItem>
                      <MenuItem value="forks">{t('dashboard.forks', language)}</MenuItem>
                      <MenuItem value="commits">{t('dashboard.commits', language)}</MenuItem>
                      <MenuItem value="hours">{t('dashboard.hours', language)}</MenuItem>
                      <MenuItem value="name">{t('dashboard.name', language)}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={filters.sortOrder}
                    onChange={(e, v) => v && setFilters(prev => ({ ...prev, sortOrder: v }))}
                    fullWidth
                  >
                    <ToggleButton value="asc">{t('dashboard.asc', language)}</ToggleButton>
                    <ToggleButton value="desc">{t('dashboard.desc', language)}</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <FormControlLabel
                    control={<Switch checked={filters.inactiveOnly} onChange={(e) => setFilters(prev => ({ ...prev, inactiveOnly: e.target.checked }))} />}
                    label={t('dashboard.showInactiveOnly', language)}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip icon={<StarIcon />} label={`${t('dashboard.totalStars', language)}: ${totals.stars}`} />
                <Chip icon={<ForkIcon />} label={`${t('dashboard.totalForks', language)}: ${totals.forks}`} />
                <Chip icon={<SortIcon />} label={t('dashboard.projectsCount', language, { filtered: filteredResults.length, total: analysisResults.length })} />
              </Box>
              </CardContent>
            </Card>
          </CollapsibleSection>
        )}
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Show message if no analysis results */}
        {analysisResults.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            {/* If we have env vars, show different message */}
            {(ENV.GITHUB_USERNAME || ENV.GITHUB_TOKEN) && repositories.length > 0 ? (
              <>
                <GitHubIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="text.secondary">
                  {t('dashboard.reposLoaded', language)}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {t('dashboard.reposLoadedMessage', language, { count: repositories.length })}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleGoToConfiguration}
                  startIcon={<SettingsIcon />}
                >
                  {t('dashboard.goToConfig', language)}
                </Button>
              </>
            ) : (ENV.GITHUB_USERNAME || ENV.GITHUB_TOKEN) && loading ? (
              <>
                <CircularProgress size={64} sx={{ mb: 2 }} />
                <Typography variant="h5" gutterBottom color="text.secondary">
                  {t('dashboard.loadingRepos', language)}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {t('dashboard.loadingReposMessage', language)}
                </Typography>
              </>
            ) : (
              <>
                <GitHubIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="text.secondary">
                  {t('dashboard.welcome', language)}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {t('dashboard.welcomeMessage', language)}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleGoToConfiguration}
                  startIcon={<SettingsIcon />}
                >
                  {t('dashboard.goToConfiguration', language)}
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Loading state when auto-loading with env vars */}
        {loading && analysisResults.length === 0 && (ENV.GITHUB_USERNAME || ENV.GITHUB_TOKEN) && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={64} sx={{ mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              {t('dashboard.loadingRepos', language)}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('dashboard.loadingReposMessage', language)}
            </Typography>
          </Box>
        )}

        {/* Advanced Metrics */}
        {analysisResults.length > 0 && (
          <CollapsibleSection 
            title={t('dashboard.advancedMetrics', language)} 
            icon={<AssessmentIcon />}
            defaultExpanded={false}
          >
            <AdvancedMetrics analysisResults={analysisResults} />
          </CollapsibleSection>
        )}

      {/* Summary Statistics */}
      {analysisResults.length > 0 && (
        <CollapsibleSection 
          title={t('dashboard.summaryStatistics', language)} 
          icon={<CommitIcon />}
          defaultExpanded={true}
        >
          <Box sx={{ mb: 4 }}>
            <SummaryStatistics
              totalProjects={totalProjects}
              totalCommits={totalCommits}
              totalHours={totalHours}
              avgCommitsPerProject={avgCommitsPerProject}
            />
          </Box>
        </CollapsibleSection>
      )}

      {/* Top Projects Rankings */}
      {analysisResults.length > 0 && (
        <CollapsibleSection 
          title={t('dashboard.topProjectsRankings', language)} 
          icon={<TrophyIcon />}
          defaultExpanded={true}
        >
          <TopProjectsRanking analysisResults={analysisResults} />
        </CollapsibleSection>
      )}

      {/* Charts Section */}
      {filteredResults.length > 0 && (
        <CollapsibleSection 
          title={t('dashboard.weeklyActivityCharts', language)} 
          icon={<TimelineIcon />}
          defaultExpanded={true}
        >
          <WeeklyChart data={filteredResults} projects={filteredResults} />
        </CollapsibleSection>
      )}

      {/* Project Details */}
      {filteredResults.length > 0 && (
        <CollapsibleSection 
          title={t('dashboard.projectDetails', language)} 
          icon={<CalendarIcon />}
          defaultExpanded={true}
        >
          <Grid container spacing={3}>
            {filteredResults.map((project, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </CollapsibleSection>
      )}

      {/* Footer */}
      <Footer />
    </Container>
    </>
  );
};

export default Dashboard;
