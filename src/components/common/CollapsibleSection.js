import React, { useState } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
} from '@mui/icons-material';

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultExpanded = true,
  icon = null,
  sx = {},
  ...props 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: 'pointer',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.04)',
          },
        }}
        onClick={handleToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(0deg)' : 'rotate(-180deg)',
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>
      
      <Collapse in={expanded} timeout={300}>
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CollapsibleSection;
