import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  Code,
  Schedule,
  Warning
} from '@mui/icons-material';

import { useDashboard } from '../../hooks/useDashboard';
import { RepositorySelector, ProjectCard } from '../repository';
import { WeeklyChart } from '../charts';

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        ChronoDev - Git Development Hours Tracker
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* GitHub Configuration */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          GitHub Repository Analysis
        </Typography>
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
      </Paper>

      {/* Repository Selector */}
      {repositories.length > 0 && (
        <RepositorySelector
          repositories={repositories}
          selectedRepos={selectedRepos}
          onSelectionChange={handleRepositorySelection}
        />
      )}

      {/* Analysis Settings */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Analysis Settings
        </Typography>
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
      </Paper>

      {/* Summary Statistics */}
      {analysisResults.length > 0 && (
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
      )}

      {/* Charts Section */}
      {analysisResults.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Activity
          </Typography>
          <WeeklyChart data={analysisResults} projects={analysisResults} />
        </Paper>
      )}

      {/* Project Details */}
      {analysisResults.length > 0 && (
        <Box>
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
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
