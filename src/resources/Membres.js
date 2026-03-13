import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  EmailField,
  required,
  minLength,
  TopToolbar,
  CreateButton,
  ExportButton,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
} from 'react-admin';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SearchInput } from 'react-admin';
import ImageArrayInput from '../components/ImageArrayInput';

const listSx = {
  px: { xs: 1, sm: 2 },
  pb: { xs: 2, sm: 3 },
  '& .RaList-content': { borderRadius: 3, overflow: 'hidden' },
  '& .RaDatagrid-tableWrapper': { overflowX: 'auto' },
};

const datagridSx = {
  '& .RaDatagrid-rowCell': { py: 1.5 },
  '& .RaDatagrid-headerCell': { py: 1.5, fontWeight: 800 },
};

const formCardSx = { borderRadius: 3, overflow: 'hidden' };

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const MembreList = (props) => (
  <List
    {...props}
    perPage={25}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid bulkActionButtons={<BulkDeleteButton />} rowClick={false} sx={datagridSx}>
      <TextField source="nom" />
      <TextField source="poste" />
      <EmailField source="email" />
      <EditButton label="" icon={<EditIcon fontSize="small" />} />
      <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

const validateNom = [required(), minLength(2)];

export const MembreEdit = (props) => (
  <Edit {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations
            </Typography>
            <TextInput source="nom" validate={validateNom} fullWidth />
            <TextInput source="poste" fullWidth />
            <TextInput source="bio" multiline rows={5} fullWidth />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <TextInput source="telephone" />
            <TextInput source="email" type="email" />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Photo
            </Typography>
            <ImageArrayInput
              source="photoUrl"
              label="Photo du membre"
              multiple={false}
              maxFiles={1}
              folder="membres"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const MembreCreate = (props) => (
  <Create {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations
            </Typography>
            <TextInput source="nom" validate={validateNom} fullWidth />
            <TextInput source="poste" fullWidth />
            <TextInput source="bio" multiline rows={5} fullWidth />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <TextInput source="telephone" />
            <TextInput source="email" type="email" />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Photo
            </Typography>
            <ImageArrayInput
              source="photoUrl"
              label="Photo du membre"
              multiple={false}
              maxFiles={1}
              folder="membres"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);


