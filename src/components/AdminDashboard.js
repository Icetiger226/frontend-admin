import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, Chip, Avatar, Divider, IconButton, Tooltip } from '@mui/material';
import { 
  People as PeopleIcon,
  Article as ArticleIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RoleNav from './RoleNav';
import { useThemeMode } from '../contexts/ThemeModeContext';
import AdminAnalyticsCharts from './AdminAnalyticsCharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({
    activites: 0,
    actualites: 0,
    messages: 0,
    newsletter: 0,
    membres: 0,
    temoignages: 0,
    sponsors: 0
  });

  useEffect(() => {
    // Récupérer le rôle et l'email de l'utilisateur connecté
    const role = localStorage.getItem('authRole');
    const email = localStorage.getItem('authEmail');
    setUserRole(role);
    setUserEmail(email);

    // Charger les statistiques selon le rôle
    loadStats(role);
  }, []);

  const loadStats = async (role) => {
    try {
      const token = localStorage.getItem('authToken');
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      // Statistiques communes (activités, actualités, messages, newsletter)
      const commonStats = await Promise.all([
        fetch(`${API}/activites/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/actualites/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/messages/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/newsletter/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [activitesRes, actualitesRes, messagesRes, newsletterRes] = commonStats;
      
      if (activitesRes.ok) {
        const activitesData = await activitesRes.json();
        setStats(prev => ({ ...prev, activites: activitesData.total || 0 }));
      }

      if (actualitesRes.ok) {
        const actualitesData = await actualitesRes.json();
        setStats(prev => ({ ...prev, actualites: actualitesData.total || 0 }));
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setStats(prev => ({ ...prev, messages: messagesData.total || 0 }));
      }

      if (newsletterRes.ok) {
        const newsletterData = await newsletterRes.json();
        setStats(prev => ({ ...prev, newsletter: newsletterData.total || 0 }));
      }

      // Statistiques super_admin uniquement
      if (role === 'super_admin') {
        const superAdminStats = await Promise.all([
          fetch(`${API}/membres/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/temoignages/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/sponsors/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [membresRes, temoignagesRes, sponsorsRes] = superAdminStats;

        if (membresRes.ok) {
          const membresData = await membresRes.json();
          setStats(prev => ({ ...prev, membres: membresData.total || 0 }));
        }

        if (temoignagesRes.ok) {
          const temoignagesData = await temoignagesRes.json();
          setStats(prev => ({ ...prev, temoignages: temoignagesData.total || 0 }));
        }

        if (sponsorsRes.ok) {
          const sponsorsData = await sponsorsRes.json();
          setStats(prev => ({ ...prev, sponsors: sponsorsData.total || 0 }));
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Administrateur';
      case 'admin_simple': return 'Administrateur';
      default: return 'Utilisateur';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'error';
      case 'admin_simple': return 'primary';
      default: return 'default';
    }
  };

  const getQuickActions = (role) => {
    const commonActions = [
      { label: 'Nouvelle Activité', icon: <AddIcon />, path: '/activites/create', color: 'primary' },
      { label: 'Nouvelle Actualité', icon: <AddIcon />, path: '/actualites/create', color: 'secondary' },
      { label: 'Voir Messages', icon: <MessageIcon />, path: '/messages', color: 'info' },
      { label: 'Gérer Newsletter', icon: <EmailIcon />, path: '/newsletter', color: 'warning' }
    ];

    if (role === 'super_admin') {
      return [
        ...commonActions,
        { label: 'Nouveau Membre', icon: <AddIcon />, path: '/membres/create', color: 'success' },
        { label: 'Nouveau Témoignage', icon: <AddIcon />, path: '/temoignages/create', color: 'info' },
        { label: 'Nouveau Sponsor', icon: <AddIcon />, path: '/sponsors/create', color: 'warning' },
        { label: 'Gestion Admins', icon: <PeopleIcon />, path: '/admin-users', color: 'error' }
      ];
    }

    return commonActions;
  };

  const getStatsCards = (role) => {
    const commonStats = [
      { title: 'Activités', value: stats.activites, icon: <ArticleIcon />, color: 'primary' },
      { title: 'Actualités', value: stats.actualites, icon: <ArticleIcon />, color: 'secondary' },
      { title: 'Messages', value: stats.messages, icon: <MessageIcon />, color: 'info' },
      { title: 'Newsletter', value: stats.newsletter, icon: <EmailIcon />, color: 'warning' }
    ];

    if (role === 'super_admin') {
      return [
        ...commonStats,
        { title: 'Membres', value: stats.membres, icon: <PeopleIcon />, color: 'success' },
        { title: 'Témoignages', value: stats.temoignages, icon: <PeopleIcon />, color: 'info' },
        { title: 'Sponsors', value: stats.sponsors, icon: <PeopleIcon />, color: 'warning' }
      ];
    }

    return commonStats;
  };

  if (!userRole) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Chargement du dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header / hero */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          sx={(theme) => ({
            p: { xs: 2, md: 3 },
            background:
              theme.palette.mode === 'dark'
                ? 'radial-gradient(1200px circle at 10% 10%, rgba(59,130,246,0.28), transparent 40%), radial-gradient(900px circle at 90% 20%, rgba(168,85,247,0.22), transparent 45%)'
                : 'radial-gradient(1200px circle at 10% 10%, rgba(25,118,210,0.16), transparent 40%), radial-gradient(900px circle at 90% 20%, rgba(156,39,176,0.12), transparent 45%)',
          })}
        >
          <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src="/Logo.jpg" alt="Be A Leader Logo" sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  Admin • Be A Leader
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {userEmail}
                  </Typography>
                  <Chip label={getRoleLabel(userRole)} color={getRoleColor(userRole)} variant="outlined" size="small" />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={mode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}>
                <IconButton aria-label="toggle theme" onClick={toggleMode} color="inherit">
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Card>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation selon le rôle */}
      <RoleNav />

      <Divider sx={{ mb: 4 }} />

      {/* Statistiques */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Statistiques
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {getStatsCards(userRole).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total enregistré
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.main`, width: 44, height: 44 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics charts */}
      <AdminAnalyticsCharts stats={stats} role={userRole} />

      {/* Actions rapides */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Actions Rapides
      </Typography>
      <Grid container spacing={2}>
        {getQuickActions(userRole).map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{ 
                height: 60,
                borderColor: `${action.color}.main`,
                color: `${action.color}.main`,
                '&:hover': {
                  borderColor: `${action.color}.dark`,
                  backgroundColor: `${action.color}.light`,
                  color: `${action.color}.dark`
                }
              }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Informations système pour super_admin */}
      {userRole === 'super_admin' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Informations Système
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<VisibilityIcon />}
                onClick={() => navigate('/admin-logs')}
                sx={{ height: 60 }}
              >
                Voir les Logs Système
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<VisibilityIcon />}
                onClick={() => navigate('/audit-logs')}
                sx={{ height: 60 }}
              >
                Voir les Logs d'Audit
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
