import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Commit as CommitIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import moment from 'moment';
import ProjectDetailsModal from './ProjectDetailsModal';

function ProjectCard({ project }) {
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getLastCommitStatus = () => {
    if (!project.lastCommit) return { color: 'error', text: 'No commits', icon: <WarningIcon /> };
    
    const lastCommitDate = moment(project.lastCommit.date);
    const daysSince = moment().diff(lastCommitDate, 'days');
    
    if (daysSince <= 7) {
      return { color: 'success', text: `${daysSince} days ago`, icon: <AccessTimeIcon /> };
    } else if (daysSince <= 30) {
      return { color: 'warning', text: `${daysSince} days ago`, icon: <AccessTimeIcon /> };
    } else {
      return { color: 'error', text: `${daysSince} days ago`, icon: <WarningIcon /> };
    }
  };

  const getActivityLevel = () => {
    const hours = project.estimatedHours || 0;
    if (hours >= 50) return { level: 'High', color: 'success', progress: 100 };
    if (hours >= 20) return { level: 'Medium', color: 'warning', progress: 70 };
    if (hours >= 5) return { level: 'Low', color: 'info', progress: 40 };
    return { level: 'Very Low', color: 'error', progress: 20 };
  };

  const getProjectColor = () => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f'];
    const hash = project.repository.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const lastCommitStatus = getLastCommitStatus();
  const activityLevel = getActivityLevel();
  const projectColor = getProjectColor();

  return (
    <>
      <Card 
        onClick={handleCardClick}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
      {/* Header with gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${projectColor}22 0%, ${projectColor}11 100%)`,
          p: 2,
          borderBottom: `3px solid ${projectColor}`,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            sx={{ 
              bgcolor: projectColor, 
              width: 40, 
              height: 40,
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            <CodeIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {project.repository.split('/').pop()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {project.repository.split('/')[0]}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={lastCommitStatus.text}
            color={lastCommitStatus.color}
            icon={lastCommitStatus.icon}
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Activity Level */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon fontSize="small" />
              Activity Level
            </Typography>
            <Typography variant="body2" fontWeight={600} color={activityLevel.color + '.main'}>
              {activityLevel.level}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={activityLevel.progress}
            color={activityLevel.color}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4
              }
            }}
          />
        </Box>

        {/* Stats Grid */}
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.100',
                textAlign: 'center'
              }}
            >
              <CommitIcon sx={{ color: 'primary.main', mb: 0.5 }} />
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {project.totalCommits || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Commits
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'success.50',
                border: '1px solid',
                borderColor: 'success.100',
                textAlign: 'center'
              }}
            >
              <ScheduleIcon sx={{ color: 'success.main', mb: 0.5 }} />
              <Typography variant="h6" fontWeight={700} color="success.main">
                {Math.round(project.estimatedHours || 0)}h
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Estimated
              </Typography>
            </Box>
          </Box>
          
          {/* Last Commit Info */}
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CalendarIcon fontSize="small" color="action" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                Last Commit
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {project.lastCommit ? moment(project.lastCommit.date).format('MMM D, YYYY') : 'No commits'}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
    
    <ProjectDetailsModal
      open={modalOpen}
      onClose={handleModalClose}
      project={project}
      analysis={project}
    />
  </>
  );
}

export default ProjectCard;
