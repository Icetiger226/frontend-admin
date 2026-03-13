import React, { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Create,
  required,
  minLength,
  TopToolbar,
  CreateButton,
  ExportButton,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
  useRecordContext,
  FunctionField,
  ChipField
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
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import { SearchInput } from 'react-admin';
import { can } from '../utils/roleUtils';
import ImageArrayInput from '../components/ImageArrayInput';

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

// Composant pour afficher les informations d'une actualité
const ActualiteInfo = ({ record }) => {
  if (!record) return null;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Auteur">
        <Chip 
          icon={<PersonIcon />} 
          label={record.auteur || 'Non défini'} 
          size="small" 
          color="info" 
        />
      </Tooltip>
      {record.imageUrl && record.imageUrl.length > 0 && (
        <Tooltip title={`${record.imageUrl.length} image(s) disponible(s)`}>
          <Badge badgeContent={record.imageUrl.length} color="primary">
            <ImageIcon color="action" fontSize="small" />
          </Badge>
        </Tooltip>
      )}
    </Box>
  );
};

// Composant pour prévisualiser une actualité
const ActualitePreview = ({ record }) => {
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
          Prévisualisation de l'actualité
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
                  icon={<PersonIcon />} 
                  label={record.auteur || 'Non défini'} 
                  color="secondary" 
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {record.contenu}
              </Typography>

              {record.imageUrl && record.imageUrl.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Images ({record.imageUrl.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {record.imageUrl.map((image, index) => (
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
    {can('actualites', 'create') && <CreateButton />}
    <ExportButton />
  </TopToolbar>
);

export const ActualiteList = (props) => (
  <List
    {...props}
    perPage={25}
    sort={{ field: 'date', order: 'DESC' }}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid
      bulkActionButtons={can('actualites', 'delete') ? <BulkDeleteButton /> : false}
      rowClick={false}
      sx={datagridSx}
    >
      <TextField source="titre" />
      <DateField source="date" />
      <FunctionField 
        label="Informations" 
        render={(record) => <ActualiteInfo record={record} />} 
      />
      <FunctionField 
        label="Actions" 
        render={(record) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ActualitePreview record={record} />
            {can('actualites', 'edit') && (
              <EditButton label="" icon={<EditIcon fontSize="small" />} />
            )}
            {can('actualites', 'delete') && (
              <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
            )}
          </Box>
        )} 
      />
    </Datagrid>
  </List>
);

const validateTitre = [required(), minLength(3)];

export const ActualiteEdit = (props) => (
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
              <Grid item xs={12} sm={6}>
                <TextInput source="auteur" fullWidth defaultValue="Équipe Be A Leader" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateInput source="date" />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contenu de l'actualité
            </Typography>
            <TextInput
              source="contenu"
              multiline
              rows={10}
              fullWidth
              placeholder="Rédigez le contenu de votre actualité..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: 14,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Images de l'actualité
            </Typography>
            <ImageArrayInput
              source="imageUrl"
              label="Images de l'actualité"
              multiple={true}
              maxFiles={5}
              folder="actualites"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const ActualiteCreate = (props) => (
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
              <Grid item xs={12} sm={6}>
                <TextInput source="auteur" fullWidth defaultValue="Équipe Be A Leader" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateInput source="date" />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contenu de l'actualité
            </Typography>
            <TextInput
              source="contenu"
              multiline
              rows={10}
              fullWidth
              placeholder="Rédigez le contenu de votre actualité..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: 14,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Images de l'actualité
            </Typography>
            <ImageArrayInput
              source="imageUrl"
              label="Images de l'actualité"
              multiple={true}
              maxFiles={5}
              folder="actualites"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);


