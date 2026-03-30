import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  NumberField,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
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
} from 'react-admin';
import { Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

export const SponsorList = (props) => (
  <List 
    {...props} 
    perPage={25} 
    sort={{ field: 'principal', order: 'DESC' }} 
    actions={<ListActions />} 
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid bulkActionButtons={<BulkDeleteButton />} rowClick={false} sx={datagridSx}>
      <TextField source="nom" />
      <TextField source="siteWeb" />
      <BooleanField source="principal" label="Principal" />
      <NumberField source="ordre" label="Ordre" />
      <EditButton label="" icon={<EditIcon fontSize="small" />} />
      <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

const validateNom = [required(), minLength(2)];

export const SponsorEdit = (props) => (
  <Edit {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="nom" validate={validateNom} fullWidth />
          <TextInput source="description" multiline rows={3} fullWidth />
          <TextInput source="siteWeb" fullWidth />
          <BooleanInput
            source="principal"
            label="Marquer comme sponsor principal (affiché dans Partenaires Principaux)"
            defaultValue={false}
          />
          <NumberInput
            source="ordre"
            label="Ordre d'affichage (plus petit = 0)"
            min={0}
            step={1}
            defaultValue={0}
          />
          <ImageArrayInput
            source="imageUrl"
            label="Logo du sponsor"
            multiple={false}
            maxFiles={1}
            folder="sponsors"
          />
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const SponsorCreate = (props) => (
  <Create {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="nom" validate={validateNom} fullWidth />
          <TextInput source="description" multiline rows={3} fullWidth />
          <TextInput source="siteWeb" fullWidth />
          <BooleanInput
            source="principal"
            label="Marquer comme sponsor principal (affiché dans Partenaires Principaux)"
            defaultValue={false}
          />
          <NumberInput
            source="ordre"
            label="Ordre d'affichage (plus petit = affiché en premier)"
            min={0}
            step={1}
            defaultValue={0}
          />
          <ImageArrayInput
            source="imageUrl"
            label="Logo du sponsor"
            multiple={false}
            maxFiles={1}
            folder="sponsors"
          />
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);
