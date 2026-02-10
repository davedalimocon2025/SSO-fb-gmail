import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router'; // Path to your router.tsx
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Create a theme (optional, but good for MUI)
const theme = createTheme({
  palette: {
    primary: {
      main: '#00B14F', // Grab-like Green
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kicks out default browser margins/paddings */}
      <CssBaseline /> 
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);