import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../contexts/ThemeModeContext';

const AdminAppBar = (props) => {
  const { mode, toggleMode } = useThemeMode();
  const email = (typeof window !== 'undefined' && sessionStorage.getItem('authEmail')) || '';

  return (
    <AppBar
      {...props}
      color="transparent"
      elevation={0}
      sx={(theme) => ({
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
        backgroundColor:
          theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.70)' : 'rgba(255, 255, 255, 0.70)',
      })}
    >
      <TitlePortal />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Box
          component="img"
          src="/Logo.jpg"
          alt="Logo Be A Leader"
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            objectFit: 'cover',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 10px 24px rgba(0, 0, 0, 0.25)'
                : '0 10px 24px rgba(15, 23, 42, 0.10)',
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: -0.2, lineHeight: 1.1 }} noWrap>
            Be A Leader
          </Typography>
          {email ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {email}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Tooltip title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}>
        <IconButton aria-label="toggle theme" onClick={toggleMode} size="small" sx={{ ml: 1 }}>
          {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </AppBar>
  );
};

export default AdminAppBar;
