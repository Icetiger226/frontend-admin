import React from 'react';
import { Menu, useResourceDefinitions, MenuItemLink } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import GroupIcon from '@mui/icons-material/Group';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CampaignIcon from '@mui/icons-material/Campaign';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArticleIcon from '@mui/icons-material/Article';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../contexts/ThemeModeContext';

export default function CustomMenu(props) {
  const { mode, toggleMode } = useThemeMode();
  const role = (typeof window !== 'undefined' && sessionStorage.getItem('authRole')) || null;
  const isSuperAdmin = role === 'super_admin';
  const defs = useResourceDefinitions();
  const navigate = useNavigate();

  const allowedForAdminSimple = new Set(['activites', 'actualites', 'messages', 'newsletter']);

  const hasResource = (name) => Boolean(defs?.[name]);
  const canSee = (name) => (isSuperAdmin ? hasResource(name) : allowedForAdminSimple.has(name) && hasResource(name));

  const SectionTitle = ({ children }) => (
    <Typography
      component="div"
      variant="caption"
      sx={{
        px: 2,
        pt: 1.25,
        pb: 0.5,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.7,
        textTransform: 'uppercase',
        color: 'text.secondary',
        opacity: 0.9,
      }}
    >
      {children}
    </Typography>
  );

  const itemSx = {
    mx: 1,
    my: 0.25,
    borderRadius: 2,
    '& .RaMenuItemLink-icon': {
      minWidth: 38,
    },
    '& .RaMenuItemLink-active': {
      borderRadius: 12,
    },
  };

  return (
    <Menu {...props}>
      <MenuItemLink
        to="/dashboard"
        primaryText="Dashboard"
        leftIcon={<DashboardIcon />}
        onClick={() => navigate('/dashboard')}
        sx={itemSx}
      />

      <MenuItemLink
        to="#"
        primaryText={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}
        leftIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        onClick={(e) => {
          e.preventDefault();
          toggleMode();
        }}
        sx={itemSx}
      />

      <Box sx={{ px: 2, pt: 1.25 }}>
        <Divider />
      </Box>
      <SectionTitle>Contenu</SectionTitle>
      {canSee('activites') && (
        <MenuItemLink to="/activites" primaryText="Activités" leftIcon={<EventNoteIcon />} sx={itemSx} />
      )}
      {canSee('actualites') && (
        <MenuItemLink to="/actualites" primaryText="Actualités" leftIcon={<NewspaperIcon />} sx={itemSx} />
      )}
      {canSee('messages') && (
        <MenuItemLink to="/messages" primaryText="Messages" leftIcon={<MailOutlineIcon />} sx={itemSx} />
      )}
      {canSee('newsletter') && (
        <MenuItemLink to="/newsletter" primaryText="Newsletter" leftIcon={<MarkEmailReadIcon />} sx={itemSx} />
      )}

      {isSuperAdmin && (
        <>
          <Box sx={{ px: 2, pt: 1.25 }}>
            <Divider />
          </Box>
          <SectionTitle>Association</SectionTitle>
          {hasResource('membres') && (
            <MenuItemLink to="/membres" primaryText="Membres" leftIcon={<GroupIcon />} sx={itemSx} />
          )}
          {hasResource('temoignages') && (
            <MenuItemLink to="/temoignages" primaryText="Témoignages" leftIcon={<EmojiPeopleIcon />} sx={itemSx} />
          )}
          {hasResource('motpresident') && (
            <MenuItemLink to="/motpresident" primaryText="Mot du Président" leftIcon={<ArticleIcon />} sx={itemSx} />
          )}
          {hasResource('sponsors') && (
            <MenuItemLink to="/sponsors" primaryText="Sponsors" leftIcon={<HandshakeIcon />} sx={itemSx} />
          )}

          <Box sx={{ px: 2, pt: 1.25 }}>
            <Divider />
          </Box>
          <SectionTitle>Administration</SectionTitle>
          {hasResource('admin-users') && (
            <MenuItemLink to="/admin-users" primaryText="Gestion Admins" leftIcon={<ManageAccountsIcon />} sx={itemSx} />
          )}
          {hasResource('admin-logs') && (
            <MenuItemLink to="/admin-logs" primaryText="Logs Système" leftIcon={<AdminPanelSettingsIcon />} sx={itemSx} />
          )}
          {hasResource('audit-logs') && (
            <MenuItemLink to="/audit-logs" primaryText="Audit" leftIcon={<CampaignIcon />} sx={itemSx} />
          )}
        </>
      )}
    </Menu>
  );
}
