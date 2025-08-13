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
  Stack,
  AppBar,
  Toolbar
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
  Switch,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Code,
  Schedule,
  GitHub as GitHubIcon,
  Commit as CommitIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { Star as StarIcon, CallSplit as ForkIcon, Sort as SortIcon, Search as SearchIcon } from '@mui/icons-material';

import { useDashboard } from '../../hooks/useDashboard';
import { ProjectCard } from '../repository';
import { WeeklyChart } from '../charts';
import CollapsibleSection from '../common/CollapsibleSection';
import ThemeToggle from '../common/ThemeToggle';
import AdvancedMetrics from './AdvancedMetrics';
import { ConfigurationView } from '../configuration';

const Dashboard = () => {
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
            Configuration
          </Button>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Filters Bar */}
        {analysisResults.length > 0 && (
          <CollapsibleSection 
            title="Search & Filters" 
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
                    label="Search projects"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    InputProps={{
                      startAdornment: (<SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Language</InputLabel>
                    <Select
                      label="Language"
                      value={filters.language}
                      onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                    >
                      <MenuItem value="all">All</MenuItem>
                      {languages.map(lang => (
                        <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      label="Sort by"
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    >
                      <MenuItem value="recent">Recent</MenuItem>
                      <MenuItem value="stars">Stars</MenuItem>
                      <MenuItem value="forks">Forks</MenuItem>
                      <MenuItem value="commits">Commits</MenuItem>
                      <MenuItem value="hours">Hours</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
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
                    <ToggleButton value="asc">Asc</ToggleButton>
                    <ToggleButton value="desc">Desc</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <FormControlLabel
                    control={<Switch checked={filters.inactiveOnly} onChange={(e) => setFilters(prev => ({ ...prev, inactiveOnly: e.target.checked }))} />}
                    label="Show inactive projects only (no activity in 3+ months)"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip icon={<StarIcon />} label={`Total Stars: ${totals.stars}`} />
                <Chip icon={<ForkIcon />} label={`Total Forks: ${totals.forks}`} />
                <Chip icon={<SortIcon />} label={`${filteredResults.length} of ${analysisResults.length} projects`} />
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
        {analysisResults.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <GitHubIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              Welcome to ChronoDev Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Configure your GitHub repositories and analysis settings to get started.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleGoToConfiguration}
              startIcon={<SettingsIcon />}
            >
              Go to Configuration
            </Button>
          </Box>
        )}

        {/* Advanced Metrics */}
        {analysisResults.length > 0 && (
          <CollapsibleSection 
            title="Advanced Productivity Metrics" 
            icon={<AssessmentIcon />}
            defaultExpanded={false}
          >
            <AdvancedMetrics analysisResults={analysisResults} />
          </CollapsibleSection>
        )}

      {/* Summary Statistics */}
      {analysisResults.length > 0 && (
        <CollapsibleSection 
          title="Summary Statistics" 
          icon={<CommitIcon />}
          defaultExpanded={true}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Code color="primary" />
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalProjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Projects
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TrendingUp color="primary" />
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalCommits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Commits
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Schedule color="primary" />
                  <Box>
                    <Typography variant="h4" component="div">
                      {Math.round(totalHours)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Hours
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TrendingUp color="success" />
                  <Box>
                    <Typography variant="h4" component="div">
                      {avgCommitsPerProject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Commits/Project
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </CollapsibleSection>
      )}

      {/* Charts Section */}
      {filteredResults.length > 0 && (
        <CollapsibleSection 
          title="Weekly Activity Charts" 
          icon={<TimelineIcon />}
          defaultExpanded={true}
        >
          <WeeklyChart data={filteredResults} projects={filteredResults} />
        </CollapsibleSection>
      )}

      {/* Project Details */}
      {filteredResults.length > 0 && (
        <CollapsibleSection 
          title="Project Details" 
          icon={<CalendarIcon />}
          defaultExpanded={true}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Project Details
          </Typography>
          <Grid container spacing={3}>
            {filteredResults.map((project, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </CollapsibleSection>
      )}
    </Container>
    </>
  );
};

export default Dashboard;
