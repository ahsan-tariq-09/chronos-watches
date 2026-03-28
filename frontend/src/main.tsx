import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#102a43' },
    secondary: { main: '#8d6e63' },
    background: { default: '#f5f3ef', paper: '#ffffff' },
    text: { primary: '#102a43', secondary: '#334e68' }
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '3px solid #0f8cff',
            outlineOffset: 2
          }
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
