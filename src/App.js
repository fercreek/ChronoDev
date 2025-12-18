import React from 'react';
import { Box } from '@mui/material';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <CustomThemeProvider>
        <Box 
          className="App"
          sx={{
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflowX: 'hidden',
          }}
        >
          <Dashboard />
        </Box>
      </CustomThemeProvider>
    </LanguageProvider>
  );
}

export default App;
