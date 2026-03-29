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
  Badge
} from '@mui/material';
import {
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Publish as PublishIcon,
  Note as DraftIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_URL, credFetch } from '../apiConfig';

const ActualiteDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    recentes: 0,
    totalAuteurs: 0
  });
  const [recentActualites, setRecentActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDialog, setPreviewDialog] = useState({ open: false, actualite: null });

  useEffect(() => {
    const role = localStorage.getItem('authRole');
    setUserRole(role);
    loadActualiteStats();
    loadRecentActualites();
  }, []);

  const loadActualiteStats = async () => {
    try {
      const response = await credFetch(`${API_URL}/actualites/stats`);

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadRecentActualites = async () => {
    try {
      const response = await credFetch(`${API_URL}/actualites`);

      if (response.ok) {
        const data = await response.json();
        setRecentActualites(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des actualités récentes:', error);
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

  const handlePreviewActualite = (actualite) => {
    setPreviewDialog({ open: true, actualite });
  };

  const handleClosePreview = () => {
    setPreviewDialog({ open: false, actualite: null });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Chargement des statistiques des actualités...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header avec informations utilisateur */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <ArticleIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Gestion des Actualités
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
        Statistiques des Actualités
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Actualités
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <ArticleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Auteurs Uniques
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalAuteurs}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PersonIcon />
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
            onClick={() => navigate('/actualites/create')}
            sx={{ height: 60 }}
          >
            Nouvelle Actualité
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditIcon />}
            onClick={() => navigate('/actualites')}
            sx={{ height: 60 }}
          >
            Gérer les Actualités
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<ScheduleIcon />}
            onClick={() => navigate('/actualites')}
            sx={{ height: 60 }}
          >
            Planifier Publication
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<DraftIcon />}
            onClick={() => navigate('/actualites')}
            sx={{ height: 60 }}
          >
            Brouillons
          </Button>
        </Grid>
      </Grid>

      {/* Actualités récentes */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Actualités Récentes
      </Typography>
      <Grid container spacing={2}>
        {recentActualites.map((actualite, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {actualite.titre}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {actualite.contenu?.substring(0, 150)}...
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(actualite.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {actualite.auteur || 'Équipe Be A Leader'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {actualite.imageUrl && actualite.imageUrl.length > 0 && (
                      <Badge badgeContent={actualite.imageUrl.length} color="primary">
                        <ImageIcon color="action" />
                      </Badge>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Prévisualiser">
                      <IconButton 
                        size="small" 
                        onClick={() => handlePreviewActualite(actualite)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/actualites/${actualite._id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
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
          Prévisualisation de l'actualité
        </DialogTitle>
        <DialogContent>
          {previewDialog.actualite && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {previewDialog.actualite.titre}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<CalendarIcon />} 
                  label={formatDate(previewDialog.actualite.date)} 
                  color="primary" 
                />
                <Chip 
                  icon={<PersonIcon />} 
                  label={previewDialog.actualite.auteur || 'Équipe Be A Leader'} 
                  color="secondary" 
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {previewDialog.actualite.contenu}
              </Typography>

              {previewDialog.actualite.imageUrl && previewDialog.actualite.imageUrl.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Images ({previewDialog.actualite.imageUrl.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {previewDialog.actualite.imageUrl.map((image, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          component="img"
                          src={image}
                          alt={`Image ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 200,
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
              navigate(`/actualites/${previewDialog.actualite._id}/edit`);
            }}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActualiteDashboard;