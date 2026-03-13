// MUI theme setup with light/dark modes and accessible contrast
 import { createTheme } from '@mui/material/styles';

export const buildTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
      },
      secondary: {
        main: '#4f46e5',
      },
      info: {
        main: '#0284c7',
      },
      success: {
        main: '#16a34a',
      },
      warning: {
        main: '#f59e0b',
      },
      error: {
        main: '#ef4444',
      },
      background: isDark
        ? { default: '#0b1220', paper: '#0f172a' }
        : { default: '#f8fafc', paper: '#ffffff' },
      text: isDark
        ? { primary: '#e5e7eb', secondary: '#94a3b8' }
        : { primary: '#0f172a', secondary: '#475569' },
      divider: isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.10)'
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      h4: { fontWeight: 800, letterSpacing: -0.6 },
      h5: { fontWeight: 800, letterSpacing: -0.4 },
      h6: { fontWeight: 750, letterSpacing: -0.2 },
      button: { fontWeight: 650 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 200ms ease, color 200ms ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
            border: isDark ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(15, 23, 42, 0.06)',
            boxShadow: isDark
              ? '0 10px 30px rgba(0,0,0,0.30)'
              : '0 10px 30px rgba(15, 23, 42, 0.06)'
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 650,
            borderRadius: 12,
            transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
            '&:active': {
              transform: 'translateY(1px) scale(0.99)',
            },
          },
          contained: {
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.20)',
            '&:hover': {
              boxShadow: '0 14px 35px rgba(37, 99, 235, 0.26)',
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'box-shadow 150ms ease, border-color 150ms ease',
            '&.Mui-focused': {
              boxShadow: isDark
                ? '0 0 0 4px rgba(79, 70, 229, 0.20)'
                : '0 0 0 4px rgba(37, 99, 235, 0.14)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(17, 24, 39, 0.2)',
            color: 'inherit'
          }
        }
      }
    }
  });
};
