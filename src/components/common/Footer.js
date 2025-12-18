import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
  Palette as PaletteIcon,
  BarChart as BarChartIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 4,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Main Footer Content */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              ChronoDev - Git Development Hours Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Una herramienta moderna para estimar horas de desarrollo y visualizar actividad de commits 
              en múltiples repositorios de GitHub. Utiliza algoritmos heurísticos similares a Git Hours 
              para agrupar commits en sesiones de codificación y calcular el tiempo estimado de desarrollo.
            </Typography>
          </Box>

          <Divider />

          {/* Features Grid */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              ¿Qué hace esta herramienta?
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <AnalyticsIcon color="primary" fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    Análisis Multi-Repositorio
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                  Analiza múltiples repositorios de GitHub simultáneamente para obtener una vista 
                  completa de tu actividad de desarrollo.
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <ScheduleIcon color="primary" fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    Estimación Inteligente de Horas
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                  Agrupa commits en sesiones de codificación y calcula horas estimadas usando 
                  heurísticas avanzadas basadas en intervalos de tiempo entre commits.
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <CodeIcon color="primary" fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    Visualización Interactiva
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                  Gráficos semanales interactivos, tarjetas de proyecto modernas y métricas 
                  avanzadas para entender mejor tu productividad.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Algorithm Info */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Algoritmo de Estimación:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              • Commits dentro de 2 horas = Misma sesión de codificación<br />
              • Gaps mayores a 2 horas = Nueva sesión inicia<br />
              • Cada sesión recibe tiempo base (2 horas) + tiempo entre commits<br />
              • Clasificación de actividad: Alta (≥50h), Media (20-49h), Baja (5-19h), Muy Baja (&lt;5h)
            </Typography>
          </Box>

          <Divider />

          {/* Technologies & Implementation */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              <BuildIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />
              Tecnologías y Características Implementadas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  <PaletteIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1rem' }} />
                  Frontend & UI
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" sx={{ pl: 3 }}>
                  • React 19.1.0 con Hooks modernos<br />
                  • Material-UI (MUI) v7 para componentes<br />
                  • Sistema de temas claro/oscuro<br />
                  • Diseño responsive y accesible<br />
                  • Animaciones y transiciones suaves<br />
                  • Tipografía Inter optimizada
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  <BarChartIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1rem' }} />
                  Visualización & Datos
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" sx={{ pl: 3 }}>
                  • Recharts para gráficos interactivos<br />
                  • Gráficos semanales (línea, barra, área)<br />
                  • Tarjetas de proyecto con métricas<br />
                  • Filtros avanzados y búsqueda<br />
                  • Estadísticas en tiempo real
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  <CodeIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1rem' }} />
                  Backend & API
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" sx={{ pl: 3 }}>
                  • Integración con GitHub REST API v3<br />
                  • Axios para peticiones HTTP<br />
                  • Autenticación con Bearer tokens<br />
                  • Manejo de rate limits<br />
                  • Paginación automática de commits
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  <SecurityIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1rem' }} />
                  Características Técnicas
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" sx={{ pl: 3 }}>
                  • Algoritmo Git Hours personalizado<br />
                  • Agrupación inteligente de sesiones<br />
                  • Cálculo de horas heurístico<br />
                  • Manejo de estado con React Hooks<br />
                  • Persistencia en localStorage<br />
                  • Variables de entorno configurables
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Footer Links */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {currentYear} ChronoDev. Hecho con ❤️ para desarrolladores.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Construido con:
              </Typography>
              <Tooltip title="React">
                <IconButton size="small" disabled>
                  <CodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Material-UI">
                <IconButton size="small" disabled>
                  <AnalyticsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="GitHub API">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                >
                  <IconButton size="small">
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                </Link>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

