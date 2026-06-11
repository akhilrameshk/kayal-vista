import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getThemeTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#004d40', // Deep Backwater Teal
      light: '#337066',
      dark: '#00352c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d6af37', // Traditional Kasavu Gold Accent
      light: '#dfbe5f',
      dark: '#957a26',
      contrastText: '#1c1c1c',
    },
    background: {
      default: mode === 'light' ? '#f9fbfb' : '#121212', 
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1c2d2a' : '#e0e0e0', 
      secondary: mode === 'light' ? '#5c6b68' : '#a0a0a0',
    },
    divider: mode === 'light' ? 'rgba(0, 77, 64, 0.08)' : 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 900 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 700 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});