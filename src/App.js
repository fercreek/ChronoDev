import React from 'react';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <CustomThemeProvider>
      <div className="App">
        <Dashboard />
      </div>
    </CustomThemeProvider>
  );
}

export default App;
