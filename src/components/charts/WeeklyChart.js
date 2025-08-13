import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
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

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#0088fe', '#ff8042', '#ffbb28', '#8dd1e1', '#d084d0'
];

function WeeklyChart({ data = [], projects = [] }) {
  const [chartType, setChartType] = useState('line');
  const [metric, setMetric] = useState('hours');
  const [selectedProjects, setSelectedProjects] = useState(
    projects && projects.length > 0 ? projects.map(p => p.repository || p.name || 'Unknown') : []
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
      return (
        <Paper sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Week of {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.dataKey === 'total' ? 'Total' : entry.dataKey}: {' '}
              {Math.round(entry.value * 100) / 100} {metric === 'hours' ? 'hours' : 'commits'}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartData = getChartData();
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" name="Total" />
            {selectedProjects.map((project, index) => (
              <Bar
                key={project}
                dataKey={project}
                fill={COLORS[index % COLORS.length]}
                name={project}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedProjects.map((project, index) => (
              <Area
                key={project}
                type="monotone"
                dataKey={project}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                name={project}
              />
            ))}
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              strokeWidth={3}
              name="Total"
            />
            {selectedProjects.map((project, index) => (
              <Line
                key={project}
                type="monotone"
                dataKey={project}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                name={project}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Weekly {metric === 'hours' ? 'Hours' : 'Commits'} Trend
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Metric</InputLabel>
            <Select value={metric} onChange={handleMetricChange} label="Metric">
              <MenuItem value="hours">Hours</MenuItem>
              <MenuItem value="commits">Commits</MenuItem>
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

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Projects to Display</InputLabel>
          <Select
            multiple
            value={selectedProjects}
            onChange={handleProjectSelection}
            label="Projects to Display"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value.split('/').pop()} size="small" />
                ))}
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
      </Box>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          {(() => {
            const chartData = getChartData();
            if (chartData.length === 0) return null;
            return (
              <>
                Showing data from {chartData[0]?.date} to {chartData[chartData.length - 1]?.date} ({chartData.length} weeks)
              </>
            );
          })()}
        </Typography>
      </Box>
    </Paper>
  );
}

export default WeeklyChart;
