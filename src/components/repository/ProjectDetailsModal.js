import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  Code,
  Schedule,
  Commit,
  TrendingUp,
  CalendarToday,
  Language,
  Star,
  ForkRight,
  Close,
} from '@mui/icons-material';
import moment from 'moment';

const ProjectDetailsModal = ({ open, onClose, project, analysis }) => {
  const theme = useTheme();

  if (!project || !analysis) return null;

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours * 10) / 10}h`;
    return `${Math.round(hours / 24 * 10) / 10}d`;
  };

  const getActivityLevel = (commits, hours) => {
    if (commits > 50 && hours > 20) return { level: 'Very High', color: 'success' };
    if (commits > 20 && hours > 10) return { level: 'High', color: 'info' };
    if (commits > 10 && hours > 5) return { level: 'Medium', color: 'warning' };
    return { level: 'Low', color: 'error' };
  };

  const activity = getActivityLevel(analysis.totalCommits, analysis.estimatedHours);

  // Calculate weekly averages
  const weeklyData = analysis.weeklyData || [];
  const avgCommitsPerWeek = weeklyData.length > 0 
    ? weeklyData.reduce((sum, week) => sum + week.commits, 0) / weeklyData.length 
    : 0;
  const avgHoursPerWeek = weeklyData.length > 0 
    ? weeklyData.reduce((sum, week) => sum + week.hours, 0) / weeklyData.length 
    : 0;

  // Find most productive week
  const mostProductiveWeek = weeklyData.reduce((max, week) => 
    week.hours > (max?.hours || 0) ? week : max, null);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Code />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.description || 'No description available'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Key Metrics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp /> Key Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  {analysis.totalCommits}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Commits
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                  {formatDuration(analysis.estimatedHours)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estimated Hours
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 600 }}>
                  {Math.round(avgCommitsPerWeek * 10) / 10}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Commits/Week
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                  {formatDuration(avgHoursPerWeek)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Hours/Week
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Activity Level */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Activity Level
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip 
              label={activity.level} 
              color={activity.color} 
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            <LinearProgress 
              variant="determinate" 
              value={Math.min((analysis.totalCommits / 100) * 100, 100)} 
              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              color={activity.color}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Project Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Language /></ListItemIcon>
                <ListItemText 
                  primary="Language" 
                  secondary={project.language || 'Not specified'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CalendarToday /></ListItemIcon>
                <ListItemText 
                  primary="Created" 
                  secondary={moment(project.createdAt).format('MMM DD, YYYY')} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Schedule /></ListItemIcon>
                <ListItemText 
                  primary="Last Activity" 
                  secondary={moment(project.pushedAt || project.updatedAt).fromNow()} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Star /></ListItemIcon>
                <ListItemText 
                  primary="Stars" 
                  secondary={project.stargazersCount || 0} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><ForkRight /></ListItemIcon>
                <ListItemText 
                  primary="Forks" 
                  secondary={project.forksCount || 0} 
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Productivity Insights
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><TrendingUp /></ListItemIcon>
                <ListItemText 
                  primary="Most Productive Week" 
                  secondary={mostProductiveWeek 
                    ? `${mostProductiveWeek.week} (${formatDuration(mostProductiveWeek.hours)})` 
                    : 'No data available'
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Commit /></ListItemIcon>
                <ListItemText 
                  primary="Commits per Hour" 
                  secondary={analysis.estimatedHours > 0 
                    ? Math.round((analysis.totalCommits / analysis.estimatedHours) * 100) / 100
                    : 'N/A'
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Schedule /></ListItemIcon>
                <ListItemText 
                  primary="Active Weeks" 
                  secondary={`${weeklyData.filter(w => w.commits > 0).length} of ${weeklyData.length} weeks`} 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          startIcon={<Close />}
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailsModal;
