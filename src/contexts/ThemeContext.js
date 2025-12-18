import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('chronodev-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('chronodev-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
        light: darkMode ? '#bbdefb' : '#42a5f5',
        dark: darkMode ? '#64b5f6' : '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
        light: darkMode ? '#f8bbd0' : '#ff5983',
        dark: darkMode ? '#c2185b' : '#9a0036',
      },
      background: {
        default: darkMode ? '#0a0e27' : '#f8fafc',
        paper: darkMode ? '#1a1f3a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e2e8f0' : '#1e293b',
        secondary: darkMode ? '#94a3b8' : '#64748b',
      },
      success: {
        main: darkMode ? '#4ade80' : '#22c55e',
        light: darkMode ? '#86efac' : '#4ade80',
        dark: darkMode ? '#16a34a' : '#15803d',
      },
      warning: {
        main: darkMode ? '#fbbf24' : '#f59e0b',
        light: darkMode ? '#fcd34d' : '#fbbf24',
        dark: darkMode ? '#d97706' : '#d97706',
      },
      error: {
        main: darkMode ? '#f87171' : '#ef4444',
        light: darkMode ? '#fca5a5' : '#f87171',
        dark: darkMode ? '#dc2626' : '#dc2626',
      },
      info: {
        main: darkMode ? '#60a5fa' : '#3b82f6',
        light: darkMode ? '#93c5fd' : '#60a5fa',
        dark: darkMode ? '#2563eb' : '#2563eb',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '0em',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 500,
        letterSpacing: '0.02em',
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0,0,0,0.3)' 
              : '0 2px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode 
                ? '0 8px 30px rgba(0,0,0,0.4)' 
                : '0 4px 20px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
    },
  });

  const value = {
    darkMode,
    toggleDarkMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
