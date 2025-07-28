import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Stack,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  TrendingUp,
  Code,
  Schedule,
  Warning,
  GitHub as GitHubIcon,
  Analytics as AnalyticsIcon,
  Commit as CommitIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

import { useDashboard } from '../../hooks/useDashboard';
import { RepositorySelector, ProjectCard } from '../repository';
import { WeeklyChart } from '../charts';
import CollapsibleSection from '../common/CollapsibleSection';
import ThemeToggle from '../common/ThemeToggle';
import AdvancedMetrics from './AdvancedMetrics';

const Dashboard = () => {
  const {
    // State
    repositories,
    selectedRepos,
    githubToken,
    githubUsername,
    author,
    dateRange,
    analysisResults,
    loading,
    error,
    totalProjects,
    totalCommits,
    totalHours,
    inactiveProjects,
    
    // Actions
    loadGitHubRepositories,
    analyzeRepositories,
    updateField,
    updateFields
  } = useDashboard();

  // Handler functions for UI interactions
  const handleFieldChange = (field) => (event) => {
    updateField(field, event.target.value);
  };

  const handleDateRangeChange = (field) => (event) => {
    updateFields({
      dateRange: {
        ...dateRange,
        [field]: event.target.value
      }
    });
  };

  const handleRepositorySelection = (repos) => {
    updateField('selectedRepos', repos);
  };

  return (
    <>
      {/* App Bar with Theme Toggle */}
      <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <GitHubIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChronoDev - Git Development Hours Tracker
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* GitHub Configuration */}
      <CollapsibleSection 
        title="GitHub Repository Analysis" 
        icon={<SettingsIcon />}
        defaultExpanded={true}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GitHub Username"
              value={githubUsername}
              onChange={handleFieldChange('githubUsername')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GitHub Token (Optional)"
              type="password"
              value={githubToken}
              onChange={handleFieldChange('githubToken')}
              margin="normal"
              helperText="For private repos and higher rate limits"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={loadGitHubRepositories}
              disabled={loading || !githubUsername}
            >
              {loading ? <CircularProgress size={24} /> : 'Load Repositories'}
            </Button>
          </Grid>
        </Grid>
      </CollapsibleSection>

      {/* Repository Selector */}
      {repositories.length > 0 && (
        <CollapsibleSection 
          title="Repository Selection" 
          icon={<GitHubIcon />}
          defaultExpanded={true}
        >
          <RepositorySelector
            repositories={repositories}
            selectedRepos={selectedRepos}
            onSelectionChange={handleRepositorySelection}
          />
        </CollapsibleSection>
      )}

      {/* Analysis Settings */}
      <CollapsibleSection 
        title="Analysis Settings" 
        icon={<AnalyticsIcon />}
        defaultExpanded={selectedRepos.length > 0}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Author Filter (Optional)"
              value={author}
              onChange={handleFieldChange('author')}
              helperText="Filter commits by author name"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Since Date"
              type="date"
              value={dateRange.since}
              onChange={handleDateRangeChange('since')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Until Date"
              type="date"
              value={dateRange.until}
              onChange={handleDateRangeChange('until')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={analyzeRepositories}
              disabled={loading || selectedRepos.length === 0}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'ANALYZE SELECTED REPOSITORIES'}
            </Button>
          </Grid>
        </Grid>
      </CollapsibleSection>

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
                  <Warning color="warning" />
                  <Box>
                    <Typography variant="h4" component="div">
                      {inactiveProjects.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactive Projects
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
      {analysisResults.length > 0 && (
        <CollapsibleSection 
          title="Weekly Activity Charts" 
          icon={<TimelineIcon />}
          defaultExpanded={true}
        >
          <WeeklyChart data={analysisResults} projects={analysisResults} />
        </CollapsibleSection>
      )}

      {/* Project Details */}
      {analysisResults.length > 0 && (
        <CollapsibleSection 
          title="Project Details" 
          icon={<CalendarIcon />}
          defaultExpanded={true}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Project Details
          </Typography>
          <Grid container spacing={3}>
            {analysisResults.map((project, index) => (
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
