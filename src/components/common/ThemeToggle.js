import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton 
        onClick={toggleDarkMode} 
        color="inherit"
        sx={{
          ml: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
