import React, { useState, useEffect } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  BooleanInput,
  Create,
  required,
  minLength,
  TopToolbar,
  CreateButton,
  ExportButton,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
  SearchInput,
  useRecordContext,
  useNotify,
  useRefresh,
  FunctionField,
  ChipField,
  ImageField,
  ArrayField,
  SingleFieldList
} from 'react-admin';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Image as ImageIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import ImageArrayInput from '../components/ImageArrayInput';
import { can } from '../utils/roleUtils';

const listSx = {
  px: { xs: 1, sm: 2 },
  pb: { xs: 2, sm: 3 },
  '& .RaList-content': {
    borderRadius: 3,
    overflow: 'hidden',
  },
  '& .RaDatagrid-tableWrapper': {
    overflowX: 'auto',
  },
};

const datagridSx = {
  '& .RaDatagrid-rowCell': {
    py: 1.5,
  },
  '& .RaDatagrid-headerCell': {
    py: 1.5,
    fontWeight: 800,
  },
};

const formCardSx = {
  borderRadius: 3,
  overflow: 'hidden',
};

// Composant pour afficher les statistiques d'une activité
const ActiviteStats = ({ record }) => {
  if (!record) return null;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Participants">
        <Chip 
          icon={<PeopleIcon />} 
          label={record.participants || 0} 
          size="small" 
          color="info" 
        />
      </Tooltip>
      {record.vedette && (
        <Tooltip title="Activité vedette">
          <Chip 
            icon={<StarIcon />} 
            label="Vedette" 
            size="small" 
            color="warning" 
          />
        </Tooltip>
      )}
      {record.imageUrl && record.imageUrl.length > 0 && (
        <Tooltip title={`${record.imageUrl.length} image(s)`}>
          <Badge badgeContent={record.imageUrl.length} color="primary">
            <ImageIcon color="action" fontSize="small" />
          </Badge>
        </Tooltip>
      )}
    </Box>
  );
};

// Composant pour prévisualiser une activité
const ActivitePreview = ({ record }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const handlePreview = () => {
    setPreviewOpen(true);
  };
  
  const handleClose = () => {
    setPreviewOpen(false);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <>
      <Tooltip title="Prévisualiser">
        <IconButton size="small" onClick={handlePreview}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Dialog open={previewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Prévisualisation de l'activité
        </DialogTitle>
        <DialogContent>
          {record && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {record.titre}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<CalendarIcon />} 
                  label={formatDate(record.date)} 
                  color="primary" 
                />
                <Chip 
                  icon={<LocationIcon />} 
                  label={record.lieu} 
                  color="secondary" 
                />
                <Chip 
                  icon={<PeopleIcon />} 
                  label={`${record.participants || 0} participants`} 
                  color="info" 
                />
                {record.vedette && (
                  <Chip 
                    icon={<StarIcon />} 
                    label="Vedette" 
                    color="warning" 
                  />
                )}
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {record.description}
              </Typography>

              {record.imageUrl && record.imageUrl.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Images ({record.imageUrl.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {record.imageUrl.map((image, index) => (
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
          <Button onClick={handleClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ListActions = () => (
  <TopToolbar>
    {can('activites', 'create') && <CreateButton />}
    <ExportButton />
  </TopToolbar>
);

export const ActiviteList = (props) => (
  <List
    {...props}
    perPage={25}
    sort={{ field: 'date', order: 'DESC' }}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid
      bulkActionButtons={can('activites', 'delete') ? <BulkDeleteButton /> : false}
      rowClick={false}
      sx={datagridSx}
    >
      <TextField source="titre" />
      <TextField source="lieu" />
      <DateField source="date" />
      <FunctionField 
        label="Statistiques" 
        render={(record) => <ActiviteStats record={record} />} 
      />
      <BooleanField source="vedette" label="Vedette" />
      <FunctionField 
        label="Actions" 
        render={(record) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ActivitePreview record={record} />
            {can('activites', 'edit') && (
              <EditButton label="" icon={<EditIcon fontSize="small" />} />
            )}
            {can('activites', 'delete') && (
              <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
            )}
          </Box>
        )} 
      />
    </Datagrid>
  </List>
);

const validateTitre = [required(), minLength(3)];

export const ActiviteEdit = (props) => (
  <Edit {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations de base
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextInput source="titre" validate={validateTitre} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextInput source="description" multiline rows={4} fullWidth />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Détails de l'activité
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DateInput source="date" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="lieu" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberInput source="participants" min={0} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BooleanInput
                  source="vedette"
                  label="Marquer comme activité vedette (affichée sur la page d'accueil)"
                  defaultValue={false}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Images de l'activité
            </Typography>
            <ImageArrayInput
              source="imageUrl"
              label="Images de l'activité"
              multiple={true}
              maxFiles={10}
              folder="activites"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const ActiviteCreate = (props) => (
  <Create {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations de base
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextInput source="titre" validate={validateTitre} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextInput source="description" multiline rows={4} fullWidth />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Détails de l'activité
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DateInput source="date" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="lieu" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberInput source="participants" min={0} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BooleanInput
                  source="vedette"
                  label="Marquer comme activité vedette (affichée sur la page d'accueil)"
                  defaultValue={false}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Images de l'activité
            </Typography>
            <ImageArrayInput
              source="imageUrl"
              label="Images de l'activité"
              multiple={true}
              maxFiles={10}
              folder="activites"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);


