import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Tooltip title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}>
      <IconButton onClick={toggleLanguage} color="inherit">
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageToggle;

