/* eslint-disable react-hooks/set-state-in-effect */
// components/AppThemeProvider.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { getThemeTokens } from '@/theme/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('kayal_vista_theme_mode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  const activeTheme = useMemo(() => createTheme(getThemeTokens(mode)), [mode]);

  const handleToggleThemeMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('kayal_vista_theme_mode', nextMode);
      return nextMode;
    });
  };

  if (!mounted) {
    return (
      <Box style={{ visibility: 'hidden' }}>
        {children}
      </Box>
    );
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline /> 
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header onToggleThemeMode={handleToggleThemeMode} />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        
        <Footer />
      </Box>
    </ThemeProvider>
  );
}