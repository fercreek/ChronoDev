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
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  CallSplit as CallSplitIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import moment from 'moment';
import ProjectDetailsModal from './ProjectDetailsModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/i18n';

function ProjectCard({ project }) {
  const { language } = useLanguage();
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getLastCommitStatus = () => {
    if (!project.lastCommit) return { color: 'error', text: t('projectCard.noCommits', language), icon: <WarningIcon /> };
    
    const lastCommitDate = moment(project.lastCommit.date);
    const daysSince = moment().diff(lastCommitDate, 'days');
    
    if (daysSince <= 7) {
      return { color: 'success', text: t('projectCard.daysAgo', language, { days: daysSince }), icon: <AccessTimeIcon /> };
    } else if (daysSince <= 30) {
      return { color: 'warning', text: t('projectCard.daysAgo', language, { days: daysSince }), icon: <AccessTimeIcon /> };
    } else {
      return { color: 'error', text: t('projectCard.daysAgo', language, { days: daysSince }), icon: <WarningIcon /> };
    }
  };

  const getActivityLevel = () => {
    const hours = project.estimatedHours || 0;
    if (hours >= 50) return { level: t('projectCard.high', language), color: 'success', progress: 100 };
    if (hours >= 20) return { level: t('projectCard.medium', language), color: 'warning', progress: 70 };
    if (hours >= 5) return { level: t('projectCard.low', language), color: 'info', progress: 40 };
    return { level: t('projectCard.veryLow', language), color: 'error', progress: 20 };
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
        {/* Meta Badges */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {project.language && (
            <Chip
              size="small"
              icon={<LanguageIcon fontSize="small" />}
              label={project.language}
              variant="outlined"
            />
          )}
          <Chip
            size="small"
            icon={<StarIcon fontSize="small" />}
            label={`${project.stargazersCount || 0}`}
            variant="outlined"
          />
          <Chip
            size="small"
            icon={<CallSplitIcon fontSize="small" />}
            label={`${project.forksCount || 0}`}
            variant="outlined"
          />
        </Stack>

        {/* Activity Level */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
              <TrendingUpIcon fontSize="small" />
              {t('projectCard.activityLevel', language)}
            </Typography>
            <Chip 
              label={activityLevel.level} 
              size="small" 
              color={activityLevel.color}
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={activityLevel.progress}
            color={activityLevel.color}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5
              }
            }}
          />
        </Box>

        {/* Stats Grid - Compacto */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Commits, Estimated y Last Commit en una sola fila */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Commits */}
            <Box 
              sx={{ 
                flex: 1,
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.15)' : 'primary.50',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.3)' : 'primary.100',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CommitIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
                  {project.totalCommits || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                  {t('projectCard.commits', language)}
                </Typography>
              </Box>
            </Box>
            
            {/* Estimated */}
            <Box 
              sx={{ 
                flex: 1,
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'success.50',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'success.100',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ScheduleIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} color="success.main" sx={{ lineHeight: 1.2 }}>
                  {Math.round(project.estimatedHours || 0)}h
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                  {t('projectCard.estimated', language)}
                </Typography>
              </Box>
            </Box>
            
            {/* Last Commit */}
            <Box 
              sx={{ 
                flex: 1,
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.50',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.200',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CalendarIcon sx={{ fontSize: 18 }} color="action" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1, display: 'block' }}>
                  {t('projectCard.lastCommit', language)}
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.2, fontSize: '0.75rem' }}>
                  {project.lastCommit ? moment(project.lastCommit.date).format('MMM D, YYYY') : t('projectCard.noCommits', language)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
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
