import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/i18n';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Mejores colores para mejor contraste y legibilidad
const COLORS = [
  '#1976d2', // Primary blue
  '#2e7d32', // Green
  '#ed6c02', // Orange
  '#9c27b0', // Purple
  '#d32f2f', // Red
  '#0288d1', // Light blue
  '#388e3c', // Dark green
  '#f57c00', // Dark orange
  '#7b1fa2', // Dark purple
  '#c62828', // Dark red
];

function WeeklyChart({ data = [], projects = [] }) {
  const { language } = useLanguage();
  const [chartType, setChartType] = useState('line');
  const [metric, setMetric] = useState('hours');
  const [showTotalOnly, setShowTotalOnly] = useState(true);
  
  // Calcular proyectos más activos para mostrar por defecto
  const topProjects = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data
      .map(project => ({
        repository: project.repository,
        totalHours: project.estimatedHours || 0,
        totalCommits: project.totalCommits || 0
      }))
      .sort((a, b) => (metric === 'hours' ? b.totalHours - a.totalHours : b.totalCommits - a.totalCommits))
      .slice(0, 5)
      .map(p => p.repository);
  }, [data, metric]);

  const [selectedProjects, setSelectedProjects] = useState(
    showTotalOnly ? [] : topProjects
  );

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  const handleProjectSelection = (event) => {
    setSelectedProjects(event.target.value);
    setShowTotalOnly(false);
  };

  const handleShowTotalOnly = (event) => {
    const checked = event.target.checked;
    setShowTotalOnly(checked);
    if (checked) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(topProjects);
    }
  };

  const handleAddProject = (projectName) => {
    if (!selectedProjects.includes(projectName)) {
      setSelectedProjects([...selectedProjects, projectName]);
      setShowTotalOnly(false);
    }
  };

  const getChartData = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    // Transform analysisResults into weekly chart data
    const weeklyMap = new Map();
    
    data.forEach(projectResult => {
      if (projectResult.weeklyStats) {
        Object.entries(projectResult.weeklyStats).forEach(([week, stats]) => {
          if (!weeklyMap.has(week)) {
            weeklyMap.set(week, {
              week,
              date: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              totalHours: 0,
              totalCommits: 0,
              projects: {}
            });
          }
          
          const weekData = weeklyMap.get(week);
          weekData.totalHours += stats.hours || 0;
          weekData.totalCommits += stats.commits || 0;
          weekData.projects[projectResult.repository] = {
            hours: stats.hours || 0,
            commits: stats.commits || 0
          };
        });
      }
    });
    
    // Convert to array and sort by date
    const sortedWeeklyData = Array.from(weeklyMap.values())
      .sort((a, b) => new Date(a.week) - new Date(b.week));
    
    // Transform to chart format
    return sortedWeeklyData.map(weekData => {
      const chartPoint = {
        week: weekData.week,
        date: weekData.date,
        total: metric === 'hours' ? weekData.totalHours : weekData.totalCommits
      };

      // Add individual project data
      selectedProjects.forEach(projectName => {
        const projectData = weekData.projects && weekData.projects[projectName];
        if (projectData) {
          chartPoint[projectName] = metric === 'hours' ? projectData.hours : projectData.commits;
        } else {
          chartPoint[projectName] = 0;
        }
      });

      return chartPoint;
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Ordenar por valor descendente para mostrar los más importantes primero
      const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));
      
      return (
        <Card sx={{ p: 2, maxWidth: 320, boxShadow: 4, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Stack spacing={0.5}>
            {sortedPayload.map((entry, index) => {
              const isTotal = entry.dataKey === 'total';
              const projectName = isTotal ? t('charts.total', language) : entry.dataKey.split('/').pop();
              const value = Math.round(entry.value * 100) / 100;
              
              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: entry.color,
                      border: isTotal ? '2px solid' : 'none',
                      borderColor: entry.color,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: isTotal ? 600 : 500, flex: 1 }}>
                    {projectName}:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: entry.color }}>
                    {value} {metric === 'hours' ? t('charts.hours', language) : t('charts.commits', language)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Card>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartData = getChartData();
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 20, left: 10, bottom: 10 }
    };

    // Simplificar nombres de proyectos en la leyenda
    const formatLegendName = (name) => {
      if (name === 'total') return t('charts.total', language);
      return name.split('/').pop();
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={formatLegendName}
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Bar 
              dataKey="total" 
              fill="#1976d2" 
              name="total"
              radius={[4, 4, 0, 0]}
            />
            {selectedProjects.map((project, index) => (
              <Bar
                key={project}
                dataKey={project}
                fill={COLORS[(index + 1) % COLORS.length]}
                name={project}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={formatLegendName}
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stackId="1"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.6}
              name="total"
            />
            {selectedProjects.map((project, index) => (
              <Area
                key={project}
                type="monotone"
                dataKey={project}
                stackId="1"
                stroke={COLORS[(index + 1) % COLORS.length]}
                fill={COLORS[(index + 1) % COLORS.length]}
                fillOpacity={0.4}
                name={project}
              />
            ))}
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={formatLegendName}
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#1976d2"
              strokeWidth={4}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="total"
            />
            {selectedProjects.map((project, index) => (
              <Line
                key={project}
                type="monotone"
                dataKey={project}
                stroke={COLORS[(index + 1) % COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name={project}
              />
            ))}
          </LineChart>
        );
    }
  };

  const chartData = getChartData();

  return (
    <Card sx={{ p: 3, mb: 4, boxShadow: 2 }}>
      <Stack spacing={3}>
        {/* Header con controles */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('charts.weeklyTrend', language, { metric: metric === 'hours' ? t('charts.hours', language) : t('charts.commits', language) })}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('charts.metric', language)}</InputLabel>
              <Select value={metric} onChange={handleMetricChange} label={t('charts.metric', language)}>
                <MenuItem value="hours">{t('charts.hours', language)}</MenuItem>
                <MenuItem value="commits">{t('charts.commits', language)}</MenuItem>
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
            >
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="area">Area</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Opción para mostrar solo Total */}
        <FormControlLabel
          control={
            <Checkbox
              checked={showTotalOnly}
              onChange={handleShowTotalOnly}
            />
          }
          label={t('charts.showTotalOnly', language)}
        />

        {/* Selector de proyectos (solo si no está en modo Total Only) */}
        {!showTotalOnly && (
          <FormControl fullWidth>
            <InputLabel>{t('charts.projectsToDisplay', language)}</InputLabel>
            <Select
              multiple
              value={selectedProjects}
              onChange={handleProjectSelection}
              label={t('charts.projectsToDisplay', language)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('charts.noneSelected', language)}
                    </Typography>
                  ) : (
                    selected.map((value) => (
                      <Chip key={value} label={value.split('/').pop()} size="small" />
                    ))
                  )}
                </Box>
              )}
            >
              {projects.map((project) => (
                <MenuItem key={project.repository} value={project.repository}>
                  {project.repository}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Botones rápidos para agregar proyectos top */}
        {!showTotalOnly && topProjects.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('charts.mostActiveProjects', language)}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topProjects.slice(0, 5).map((project) => (
                <Button
                  key={project}
                  size="small"
                  variant={selectedProjects.includes(project) ? 'contained' : 'outlined'}
                  onClick={() => handleAddProject(project)}
                  sx={{ textTransform: 'none' }}
                >
                  {project.split('/').pop()}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Gráfico */}
        <Box sx={{ height: 450, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', p: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </Box>

        {chartData.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('charts.showingData', language, { 
              start: chartData[0]?.date, 
              end: chartData[chartData.length - 1]?.date, 
              weeks: chartData.length 
            })}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

export default WeeklyChart;
