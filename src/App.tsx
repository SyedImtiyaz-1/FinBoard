import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import { useThemeStore } from './stores/themeStore';

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#2196f3',
    },
    ...(mode === 'dark'
      ? {
          background: { default: '#121212', paper: '#1e1e1e' },
        }
      : {
          background: { default: '#fafafa', paper: '#ffffff' },
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const { mode } = useThemeStore();
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;

