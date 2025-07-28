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

import { useDashboard } from '../../hooks/useDashboard';
import { ProjectCard } from '../repository';
import { WeeklyChart } from '../charts';
import CollapsibleSection from '../common/CollapsibleSection';
import ThemeToggle from '../common/ThemeToggle';
import AdvancedMetrics from './AdvancedMetrics';
import { ConfigurationView } from '../configuration';

const Dashboard = () => {
  const [currentView, setCurrentView] = React.useState('dashboard');
  
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
