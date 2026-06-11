/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getThemeTokens } from '@/theme/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Box } from '@mui/material';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Establish the current color palette state string
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  // Flag to track client-side mounting to avoid hydration flickering
  const [mounted, setMounted] = useState(false);

  // 2. Read the saved theme from localStorage on initial client mount
  useEffect(() => {
    const savedMode = localStorage.getItem('kayal_vista_theme_mode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  // 3. Re-compile the active theme token mapping only when the mode shifts
  const activeTheme = useMemo(() => createTheme(getThemeTokens(mode)), [mode]);

  // 4. Toggle executor callback that also persists the setting for new tabs
  const handleToggleThemeMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('kayal_vista_theme_mode', nextMode);
      return nextMode;
    });
  };

  // Guard clause to prevent layout structural pop/flicker before initialization completes
  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" async />
        </head>
        <body style={{ visibility: 'hidden' }}>
          {/* Invisible placeholder matching structural dimensions during layout evaluation */}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" async />
      </head>
      <body>
        <ThemeProvider theme={activeTheme}>
          <CssBaseline /> 
          
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Pass the interactive toggle handler down to your header toggle button */}
            <Header onToggleThemeMode={handleToggleThemeMode} />
            
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            
            <Footer />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}