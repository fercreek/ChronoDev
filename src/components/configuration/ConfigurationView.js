import React from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';

import { useDashboard } from '../../hooks/useDashboard';
import { RepositorySelector } from '../repository';
import CollapsibleSection from '../common/CollapsibleSection';
import ThemeToggle from '../common/ThemeToggle';
import Footer from '../common/Footer';
import { ENV } from '../../constants';

const ConfigurationView = ({ onBackToDashboard }) => {
  const {
    // State
    githubUsername,
    githubToken,
    repositories,
    selectedRepos,
    author,
    dateRange,
    loading,
    error,
    
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

  const handleAnalyzeAndReturn = async () => {
    await analyzeRepositories();
    onBackToDashboard();
  };

  return (
    <>
      {/* Configuration App Bar */}
      <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Tooltip title="Back to Dashboard">
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={onBackToDashboard}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <SettingsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChronoDev Configuration
          </Typography>
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

        {/* GitHub Configuration */}
        <CollapsibleSection 
          title="GitHub Repository Analysis" 
          icon={<GitHubIcon />}
          defaultExpanded={true}
        >
          {/* Environment Variables Indicator */}
          {(ENV.GITHUB_USERNAME || ENV.GITHUB_TOKEN) && (
            <Alert 
              severity="info" 
              icon={<VpnKeyIcon />}
              sx={{ mb: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Variables de entorno detectadas:
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                {ENV.GITHUB_USERNAME && (
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label={`Username: ${ENV.GITHUB_USERNAME}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {ENV.GITHUB_TOKEN && (
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label="Token configurado"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {ENV.DEFAULT_REPOS.length > 0 && (
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label={`${ENV.DEFAULT_REPOS.length} repositorio(s) por defecto`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Stack>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Los valores de las variables de entorno se cargan automáticamente. Puedes modificarlos aquí si lo deseas.
              </Typography>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub Username"
                value={githubUsername}
                onChange={handleFieldChange('githubUsername')}
                margin="normal"
                helperText={
                  ENV.GITHUB_USERNAME 
                    ? `Cargado desde REACT_APP_GITHUB_USERNAME: ${ENV.GITHUB_USERNAME}` 
                    : 'Ingresa tu nombre de usuario de GitHub'
                }
                InputProps={{
                  endAdornment: ENV.GITHUB_USERNAME && githubUsername === ENV.GITHUB_USERNAME ? (
                    <Tooltip title="Valor desde variable de entorno">
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    </Tooltip>
                  ) : null,
                }}
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
                helperText={
                  ENV.GITHUB_TOKEN
                    ? "Token cargado desde REACT_APP_GITHUB_TOKEN (oculto por seguridad)"
                    : "Para repos privados y límites de rate más altos"
                }
                InputProps={{
                  endAdornment: ENV.GITHUB_TOKEN && githubToken === ENV.GITHUB_TOKEN ? (
                    <Tooltip title="Token desde variable de entorno">
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    </Tooltip>
                  ) : null,
                }}
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
        </CollapsibleSection>

        {/* Repository Selector */}
        {repositories.length > 0 && (
          <CollapsibleSection 
            title="Repository Selection" 
            icon={<GitHubIcon />}
            defaultExpanded={true}
          >
            <RepositorySelector
              repositories={repositories}
              selectedRepos={selectedRepos}
              onSelectionChange={handleRepositorySelection}
            />
          </CollapsibleSection>
        )}

        {/* Analysis Settings */}
        {selectedRepos.length > 0 && (
          <CollapsibleSection 
            title="Analysis Settings" 
            icon={<AnalyticsIcon />}
            defaultExpanded={true}
          >
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAnalyzeAndReturn}
                    disabled={loading || selectedRepos.length === 0}
                    size="large"
                  >
                    {loading ? <CircularProgress size={24} /> : 'ANALYZE & VIEW DASHBOARD'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={onBackToDashboard}
                    size="large"
                  >
                    Back to Dashboard
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CollapsibleSection>
        )}

        {/* Help Section */}
        <CollapsibleSection 
          title="Help & Tips" 
          icon={<SettingsIcon />}
          defaultExpanded={false}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                🔑 GitHub Token Setup
              </Typography>
              <Typography variant="body2" paragraph>
                1. Go to GitHub Settings → Developer settings → Personal access tokens
              </Typography>
              <Typography variant="body2" paragraph>
                2. Generate a new token with 'repo' scope for private repos or 'public_repo' for public repos
              </Typography>
              <Typography variant="body2" paragraph>
                3. Copy and paste the token above for higher rate limits and private repo access
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                📊 Analysis Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Select multiple repositories to compare productivity across projects
              </Typography>
              <Typography variant="body2" paragraph>
                • Use author filter to focus on specific contributors
              </Typography>
              <Typography variant="body2" paragraph>
                • Adjust date range to analyze specific time periods
              </Typography>
            </Grid>
          </Grid>
        </CollapsibleSection>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ConfigurationView;
