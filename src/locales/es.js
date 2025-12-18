export const es = {
  // Dashboard
  dashboard: {
    title: 'ChronoDev Dashboard',
    welcome: 'Bienvenido a ChronoDev Dashboard',
    welcomeMessage: 'Configura tus repositorios de GitHub y ajustes de análisis para comenzar.',
    goToConfiguration: 'Ir a Configuración',
    loadingRepos: 'Cargando Repositorios...',
    loadingReposMessage: 'Estamos cargando tus repositorios de GitHub usando las variables de entorno configuradas.',
    reposLoaded: 'Repositorios Cargados',
    reposLoadedMessage: 'Se encontraron {count} repositorio(s). Ve a Configuración para seleccionar y analizar repositorios.',
    goToConfig: 'Ir a Configuración',
    
    // Sections
    searchAndFilters: 'Búsqueda y Filtros',
    summaryStatistics: 'Estadísticas Resumidas',
    weeklyActivityCharts: 'Gráficos de Actividad Semanal',
    projectDetails: 'Detalles del Proyecto',
    advancedMetrics: 'Métricas Avanzadas de Productividad',
    
    // Statistics
    totalProjects: 'Total de Proyectos',
    totalCommits: 'Total de Commits',
    estimatedHours: 'Horas Estimadas',
    avgCommitsPerProject: 'Promedio Commits/Proyecto',
    
    // Filters
    searchProjects: 'Buscar proyectos',
    language: 'Idioma',
    all: 'Todos',
    sortBy: 'Ordenar por',
    recent: 'Reciente',
    stars: 'Estrellas',
    forks: 'Forks',
    commits: 'Commits',
    hours: 'Horas',
    name: 'Nombre',
    asc: 'Asc',
    desc: 'Desc',
    showInactiveOnly: 'Mostrar solo proyectos inactivos (sin actividad en 3+ meses)',
    totalStars: 'Total de Estrellas',
    totalForks: 'Total de Forks',
    projectsCount: '{filtered} de {total} proyectos',
    topProjectsRankings: 'Rankings de Proyectos Top',
    topByCommits: 'Top por Commits',
    topByHours: 'Top por Horas',
    mostConsistent: 'Proyectos Más Constantes',
    commitsPerWeek: 'Commits/semana',
    frequency: 'Frecuencia',
  },
  
  // Charts
  charts: {
    weeklyTrend: 'Tendencia Semanal de {metric}',
    hours: 'Horas',
    commits: 'Commits',
    metric: 'Métrica',
    projectsToDisplay: 'Proyectos a Mostrar',
    showingData: 'Mostrando datos del {start} al {end} ({weeks} semanas)',
    total: 'Total',
    showTotalOnly: 'Mostrar solo Total',
    mostActiveProjects: 'Proyectos más activos:',
    noneSelected: 'Ninguno seleccionado',
  },
  
  // Project Card
  projectCard: {
    noCommits: 'Sin commits',
    daysAgo: 'Hace {days} días',
    activityLevel: 'Nivel de Actividad',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    veryLow: 'Muy Bajo',
    commits: 'Commits',
    estimated: 'Estimado',
    lastCommit: 'Último Commit',
  },
  
  // Configuration
  config: {
    title: 'Configuración de ChronoDev',
    githubAnalysis: 'Análisis de Repositorios de GitHub',
    githubUsername: 'Nombre de Usuario de GitHub',
    githubToken: 'Token de GitHub (Opcional)',
    tokenHelper: 'Para repos privados y límites de rate más altos',
    loadRepositories: 'Cargar Repositorios',
    repositorySelection: 'Selección de Repositorios',
    analysisSettings: 'Configuración de Análisis',
    authorFilter: 'Filtro de Autor (Opcional)',
    authorHelper: 'Filtrar commits por nombre de autor',
    sinceDate: 'Fecha Desde',
    untilDate: 'Fecha Hasta',
    analyzeAndView: 'ANALIZAR Y VER DASHBOARD',
    backToDashboard: 'Volver al Dashboard',
    helpAndTips: 'Ayuda y Consejos',
    tokenSetup: 'Configuración de Token de GitHub',
    analysisTips: 'Consejos de Análisis',
  },
  
  // Footer
  footer: {
    description: 'Una herramienta moderna para estimar horas de desarrollo y visualizar actividad de commits en múltiples repositorios de GitHub. Utiliza algoritmos heurísticos similares a Git Hours para agrupar commits en sesiones de codificación y calcular el tiempo estimado de desarrollo.',
    whatDoesItDo: '¿Qué hace esta herramienta?',
    multiRepoAnalysis: 'Análisis Multi-Repositorio',
    multiRepoDesc: 'Analiza múltiples repositorios de GitHub simultáneamente para obtener una vista completa de tu actividad de desarrollo.',
    smartHours: 'Estimación Inteligente de Horas',
    smartHoursDesc: 'Agrupa commits en sesiones de codificación y calcula horas estimadas usando heurísticas avanzadas basadas en intervalos de tiempo entre commits.',
    interactiveViz: 'Visualización Interactiva',
    interactiveVizDesc: 'Gráficos semanales interactivos, tarjetas de proyecto modernas y métricas avanzadas para entender mejor tu productividad.',
    algorithm: 'Algoritmo de Estimación:',
    algorithmDetails: '• Commits dentro de 2 horas = Misma sesión de codificación\n• Gaps mayores a 2 horas = Nueva sesión inicia\n• Cada sesión recibe tiempo base (2 horas) + tiempo entre commits\n• Clasificación de actividad: Alta (≥50h), Media (20-49h), Baja (5-19h), Muy Baja (<5h)',
    builtWith: 'Construido con:',
    copyright: '© {year} ChronoDev. Hecho con ❤️ para desarrolladores.',
  },
};

