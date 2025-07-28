import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Schedule,
  Commit,
  Star,
  Timeline,
  Assessment,
  EmojiEvents,
  Speed,
} from '@mui/icons-material';
import moment from 'moment';

const AdvancedMetrics = ({ analysisResults = [] }) => {
  const theme = useTheme();

  // Calculate advanced metrics
  const calculateMetrics = () => {
    if (!analysisResults.length) return null;

    const totalCommits = analysisResults.reduce((sum, repo) => sum + (repo.totalCommits || 0), 0);
    const totalHours = analysisResults.reduce((sum, repo) => sum + (repo.estimatedHours || 0), 0);
    
    // Most productive project
    const mostProductiveProject = analysisResults.reduce((max, repo) => 
      (repo.estimatedHours || 0) > (max?.estimatedHours || 0) ? repo : max, null);
    
    // Most active project (by commits)
    const mostActiveProject = analysisResults.reduce((max, repo) => 
      (repo.totalCommits || 0) > (max?.totalCommits || 0) ? repo : max, null);
    
    // Calculate averages
    const avgHoursPerProject = totalHours / analysisResults.length;
    const avgCommitsPerProject = totalCommits / analysisResults.length;
    const avgCommitsPerHour = totalHours > 0 ? totalCommits / totalHours : 0;
    
    // Calculate productivity trends
    const activeProjects = analysisResults.filter(repo => (repo.totalCommits || 0) > 0);
    const inactiveProjects = analysisResults.length - activeProjects.length;
    
    // Find most recent activity
    const mostRecentActivity = analysisResults.reduce((latest, repo) => {
      const repoDate = repo.lastCommitDate || repo.repository?.pushedAt;
      const latestDate = latest?.lastCommitDate || latest?.repository?.pushedAt;
      return moment(repoDate).isAfter(moment(latestDate)) ? repo : latest;
    }, null);

    return {
      totalCommits,
      totalHours,
      mostProductiveProject,
      mostActiveProject,
      avgHoursPerProject,
      avgCommitsPerProject,
      avgCommitsPerHour,
      activeProjects: activeProjects.length,
      inactiveProjects,
      mostRecentActivity,
      projectCount: analysisResults.length,
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Advanced Metrics
          </Typography>
          <Typography color="text.secondary">
            No data available. Analyze some repositories to see advanced metrics.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours * 10) / 10}h`;
    return `${Math.round(hours / 24 * 10) / 10}d`;
  };

  const getProductivityLevel = (hours) => {
    if (hours >= 100) return { level: 'Expert', color: 'success', progress: 100 };
    if (hours >= 50) return { level: 'Advanced', color: 'info', progress: 75 };
    if (hours >= 20) return { level: 'Intermediate', color: 'warning', progress: 50 };
    return { level: 'Beginner', color: 'error', progress: 25 };
  };

  const productivity = getProductivityLevel(metrics.totalHours);

  return (
    <Grid container spacing={3}>
      {/* Overall Productivity */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Assessment />
              </Avatar>
              <Typography variant="h6">Overall Productivity</Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip 
                  label={productivity.level} 
                  color={productivity.color} 
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  {formatDuration(metrics.totalHours)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={productivity.progress} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
                color={productivity.color}
              />
              <Typography variant="body2" color="text.secondary">
                Total estimated development time across {metrics.projectCount} projects
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="info.main" sx={{ fontWeight: 600 }}>
                    {metrics.totalCommits}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Commits
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 600 }}>
                    {Math.round(metrics.avgCommitsPerHour * 100) / 100}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Commits/Hour
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Performers */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <EmojiEvents />
              </Avatar>
              <Typography variant="h6">Top Performers</Typography>
            </Box>

            <List dense>
              <ListItem>
                <ListItemIcon><TrendingUp color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Most Productive Project" 
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metrics.mostProductiveProject?.repository || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDuration(metrics.mostProductiveProject?.estimatedHours || 0)} estimated
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon><Speed color="info" /></ListItemIcon>
                <ListItemText 
                  primary="Most Active Project" 
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metrics.mostActiveProject?.repository || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {metrics.mostActiveProject?.totalCommits || 0} commits
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon><Schedule color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Most Recent Activity" 
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metrics.mostRecentActivity?.repository || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {metrics.mostRecentActivity?.lastCommitDate 
                          ? moment(metrics.mostRecentActivity.lastCommitDate).fromNow()
                          : 'No recent activity'
                        }
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Project Distribution */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Timeline />
              </Avatar>
              <Typography variant="h6">Project Distribution</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'success.contrastText' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {metrics.activeProjects}
                  </Typography>
                  <Typography variant="body2">
                    Active
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2, color: 'warning.contrastText' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {metrics.inactiveProjects}
                  </Typography>
                  <Typography variant="body2">
                    Inactive
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {metrics.projectCount}
                  </Typography>
                  <Typography variant="body2">
                    Total
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Project Activity Rate
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(metrics.activeProjects / metrics.projectCount) * 100} 
                sx={{ height: 6, borderRadius: 3 }}
                color="success"
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {Math.round((metrics.activeProjects / metrics.projectCount) * 100)}% of projects have commits
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Averages */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <Star />
              </Avatar>
              <Typography variant="h6">Average Metrics</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                    {formatDuration(metrics.avgHoursPerProject)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Hours/Project
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h5" color="info.main" sx={{ fontWeight: 600 }}>
                    {Math.round(metrics.avgCommitsPerProject)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Commits/Project
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                💡 <strong>Productivity Insight:</strong>
              </Typography>
              <Typography variant="body2">
                {metrics.avgCommitsPerHour > 2 
                  ? "You're making frequent commits! This suggests good development practices with small, incremental changes."
                  : metrics.avgCommitsPerHour > 1
                  ? "Your commit frequency is moderate. Consider making more frequent commits for better version control."
                  : "Consider making more frequent commits to better track your development progress."
                }
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdvancedMetrics;
