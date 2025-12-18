import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/i18n';

const StatCard = ({ icon, value, label, color, gradient }) => {
  const theme = useTheme();
  
  return (
    <Grid item xs={6} sm={3} md={3} lg={3} sx={{ flex: { sm: '1 1 0', md: '1 1 0' }, minWidth: 0 }}>
      <Card
        sx={{
          height: '100%',
          background: gradient 
            ? `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`
            : 'background.paper',
          border: `1px solid ${color}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
            borderColor: `${color}60`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: `${color}20`,
                color: color,
                width: { xs: 48, sm: 52, md: 56 },
                height: { xs: 48, sm: 52, md: 56 },
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                  lineHeight: 1.3,
                }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

const SummaryStatistics = ({ totalProjects, totalCommits, totalHours, avgCommitsPerProject }) => {
  const { language } = useLanguage();
  const theme = useTheme();

  const formatHours = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours * 10) / 10}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round((hours % 24) * 10) / 10;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  return (
    <Grid 
      container 
      spacing={{ xs: 1.5, sm: 2, md: 3 }}
      sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      <StatCard
        icon={<CodeIcon />}
        value={totalProjects}
        label={t('dashboard.totalProjects', language)}
        color={theme.palette.primary.main}
        gradient
      />
      <StatCard
        icon={<TrendingUpIcon />}
        value={totalCommits.toLocaleString()}
        label={t('dashboard.totalCommits', language)}
        color={theme.palette.success.main}
        gradient
      />
      <StatCard
        icon={<ScheduleIcon />}
        value={formatHours(totalHours)}
        label={t('dashboard.estimatedHours', language)}
        color={theme.palette.warning.main}
        gradient
      />
      <StatCard
        icon={<AssessmentIcon />}
        value={avgCommitsPerProject}
        label={t('dashboard.avgCommitsPerProject', language)}
        color={theme.palette.info.main}
        gradient
      />
    </Grid>
  );
};

export default SummaryStatistics;

