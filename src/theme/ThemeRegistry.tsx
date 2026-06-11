/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom React Context to export our toggle function globally
const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Pull saved preference from local storage on mount so it persists across reloads
  useEffect(() => {
    const savedMode = localStorage.getItem('kaayalvista-theme-mode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('kaayalvista-theme-mode', nextMode);
          return nextMode;
        });
      },
    }),
    []
  );

  // Generate dynamic theme configuration values depending on dark/light states
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#004D40' : '#00bfa5', // Deep Backwater Teal vs Vibrant Teal
            light: '#006666',
            dark: '#00332c',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#D4AF37', // Sunrise Gold Accent
          },
          background: {
            default: mode === 'light' ? '#f8faf9' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#1c2d2a' : '#ffffff',
            secondary: mode === 'light' ? '#5c6e6b' : '#b0bec5',
          },
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          h5: { fontWeight: 900 },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  );
}