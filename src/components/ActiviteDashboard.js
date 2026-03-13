import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ActiviteDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    vedettes: 0,
    recentes: 0,
    totalParticipants: 0,
    moyenneParticipants: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDialog, setPreviewDialog] = useState({ open: false, activity: null });

  useEffect(() => {
    const role = localStorage.getItem('authRole');
    setUserRole(role);
    loadActiviteStats();
    loadRecentActivities();
  }, []);

  const loadActiviteStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API}/activites/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API}/activites?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des activités récentes:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePreviewActivity = (activity) => {
    setPreviewDialog({ open: true, activity });
  };

  const handleClosePreview = () => {
    setPreviewDialog({ open: false, activity: null });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des statistiques des activités...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header avec informations utilisateur */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <ArticleIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Gestion des Activités
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Interface améliorée pour {getRoleLabel(userRole)}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={getRoleLabel(userRole)} 
          color={getRoleColor(userRole)} 
          variant="outlined"
          size="large"
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Statistiques détaillées */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Statistiques des Activités
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Activités
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ArticleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Activités Vedettes
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.vedettes}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <StarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Récentes (30j)
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.recentes}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Participants
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalParticipants}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions rapides */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Actions Rapides
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => navigate('/activites/create')}
            sx={{ height: 60 }}
          >
            Nouvelle Activité
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditIcon />}
            onClick={() => navigate('/activites')}
            sx={{ height: 60 }}
          >
            Gérer les Activités
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/activites')}
            sx={{ height: 60 }}
          >
            Voir les Statistiques
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/activites')}
            sx={{ height: 60 }}
          >
            Historique
          </Button>
        </Grid>
      </Grid>

      {/* Activités récentes */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Activités Récentes
      </Typography>
      <Grid container spacing={2}>
        {recentActivities.map((activity, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {activity.titre}
                  </Typography>
                  {activity.vedette && (
                    <Chip 
                      icon={<StarIcon />} 
                      label="Vedette" 
                      color="warning" 
                      size="small" 
                    />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {activity.description?.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(activity.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {activity.lieu}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PeopleIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {activity.participants || 0} participants
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Prévisualiser">
                      <IconButton 
                        size="small" 
                        onClick={() => handlePreviewActivity(activity)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/activites/${activity._id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {activity.imageUrl && activity.imageUrl.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Badge badgeContent={activity.imageUrl.length} color="primary">
                      <ImageIcon color="action" />
                    </Badge>
                    <Typography variant="body2" color="text.secondary">
                      {activity.imageUrl.length} image(s)
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de prévisualisation */}
      <Dialog 
        open={previewDialog.open} 
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prévisualisation de l'activité
        </DialogTitle>
        <DialogContent>
          {previewDialog.activity && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {previewDialog.activity.titre}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<CalendarIcon />} 
                  label={formatDate(previewDialog.activity.date)} 
                  color="primary" 
                />
                <Chip 
                  icon={<LocationIcon />} 
                  label={previewDialog.activity.lieu} 
                  color="secondary" 
                />
                <Chip 
                  icon={<PeopleIcon />} 
                  label={`${previewDialog.activity.participants || 0} participants`} 
                  color="info" 
                />
                {previewDialog.activity.vedette && (
                  <Chip 
                    icon={<StarIcon />} 
                    label="Vedette" 
                    color="warning" 
                  />
                )}
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {previewDialog.activity.description}
              </Typography>

              {previewDialog.activity.imageUrl && previewDialog.activity.imageUrl.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Images ({previewDialog.activity.imageUrl.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {previewDialog.activity.imageUrl.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box
                          component="img"
                          src={image}
                          alt={`Image ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>
            Fermer
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              handleClosePreview();
              navigate(`/activites/${previewDialog.activity._id}/edit`);
            }}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiviteDashboard;
