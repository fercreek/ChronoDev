import React, { useMemo } from 'react';
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
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Commit as CommitIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/i18n';

const TopProjectsRanking = ({ analysisResults = [] }) => {
  const { language } = useLanguage();
  const theme = useTheme();

  // Colores para posiciones
  const positionColors = {
    1: '#FFD700', // Gold
    2: '#C0C0C0', // Silver
    3: '#CD7F32', // Bronze
    4: theme.palette.primary.main,
    5: theme.palette.info.main,
  };

  // Calcular top por commits
  const topByCommits = useMemo(() => {
    return analysisResults
      .filter(p => p.totalCommits > 0 && !p.error)
      .sort((a, b) => (b.totalCommits || 0) - (a.totalCommits || 0))
      .slice(0, 5);
  }, [analysisResults]);

  // Calcular top por horas
  const topByHours = useMemo(() => {
    return analysisResults
      .filter(p => p.estimatedHours > 0 && !p.error)
      .sort((a, b) => (b.estimatedHours || 0) - (a.estimatedHours || 0))
      .slice(0, 5);
  }, [analysisResults]);

  // Calcular constancia (frecuencia promedio de commits por semana)
  const calculateConsistency = (project) => {
    if (!project.weeklyStats || Object.keys(project.weeklyStats).length === 0) return 0;
    const weeksWithActivity = Object.keys(project.weeklyStats).length;
    const totalCommits = project.totalCommits || 0;
    return weeksWithActivity > 0 ? totalCommits / weeksWithActivity : 0;
  };

  const topByConsistency = useMemo(() => {
    return analysisResults
      .map(p => ({ ...p, consistencyScore: calculateConsistency(p) }))
      .filter(p => p.consistencyScore > 0 && !p.error)
      .sort((a, b) => b.consistencyScore - a.consistencyScore)
      .slice(0, 5);
  }, [analysisResults]);

  const RankingCard = ({ title, icon, projects, getValue, getLabel, formatValue }) => {
    if (projects.length === 0) {
      return (
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              {icon}
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {language === 'es' ? 'No hay datos suficientes' : 'Not enough data'}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            {icon}
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              {title}
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            {projects.map((project, index) => {
              const position = index + 1;
              const value = getValue(project);
              const label = getLabel(project);
              const maxValue = getValue(projects[0]); // Valor máximo para la barra de progreso

              return (
                <Box
                  key={project.repository}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.04)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {/* Badge de posición */}
                  <Avatar
                    sx={{
                      width: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      bgcolor: positionColors[position] || theme.palette.grey[500],
                      color: position <= 3 ? '#fff' : theme.palette.getContrastText(positionColors[position] || theme.palette.grey[500]),
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      flexShrink: 0,
                    }}
                  >
                    {position}
                  </Avatar>

                  {/* Información del proyecto */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.5,
                      }}
                    >
                      {project.repository.split('/').pop()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {project.repository.split('/')[0]}
                    </Typography>
                  </Box>

                  {/* Valor y barra de progreso */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: { xs: 70, md: 80 }, flexShrink: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={position <= 3 ? positionColors[position] : 'primary.main'}
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      {formatValue(value)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', md: '0.65rem' } }}>
                      {label}
                    </Typography>
                    {/* Barra de progreso visual */}
                    <Box
                      sx={{
                        width: { xs: 50, md: 60 },
                        height: 4,
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        mt: 0.5,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(value / maxValue) * 100}%`,
                          height: '100%',
                          bgcolor: positionColors[position] || theme.palette.primary.main,
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
      {/* Top por Commits */}
      <Grid item xs={12} sm={12} md={4}>
        <RankingCard
          title={t('dashboard.topByCommits', language)}
          icon={<CommitIcon sx={{ color: 'primary.main', fontSize: { xs: 20, md: 24 } }} />}
          projects={topByCommits}
          getValue={(p) => p.totalCommits || 0}
          getLabel={() => t('dashboard.totalCommits', language)}
          formatValue={(val) => val.toLocaleString()}
        />
      </Grid>

      {/* Top por Horas */}
      <Grid item xs={12} sm={12} md={4}>
        <RankingCard
          title={t('dashboard.topByHours', language)}
          icon={<ScheduleIcon sx={{ color: 'warning.main', fontSize: { xs: 20, md: 24 } }} />}
          projects={topByHours}
          getValue={(p) => p.estimatedHours || 0}
          getLabel={() => t('dashboard.estimatedHours', language)}
          formatValue={(val) => {
            if (val < 1) return `${Math.round(val * 60)}m`;
            if (val < 24) return `${Math.round(val * 10) / 10}h`;
            const days = Math.floor(val / 24);
            const hours = Math.round((val % 24) * 10) / 10;
            return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
          }}
        />
      </Grid>

      {/* Top por Constancia */}
      <Grid item xs={12} sm={12} md={4}>
        <RankingCard
          title={t('dashboard.mostConsistent', language)}
          icon={<TrendingUpIcon sx={{ color: 'success.main', fontSize: { xs: 20, md: 24 } }} />}
          projects={topByConsistency}
          getValue={(p) => p.consistencyScore || 0}
          getLabel={() => t('dashboard.commitsPerWeek', language)}
          formatValue={(val) => Math.round(val * 10) / 10}
        />
      </Grid>
    </Grid>
  );
};

export default TopProjectsRanking;

