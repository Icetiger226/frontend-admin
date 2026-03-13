import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  Create,
  required,
  TopToolbar,
  CreateButton,
  ExportButton,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
} from 'react-admin';
import { Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SearchInput } from 'react-admin';

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

export const TemoignageList = (props) => (
  <List
    {...props}
    perPage={25}
    sort={{ field: 'date', order: 'DESC' }}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid bulkActionButtons={<BulkDeleteButton />} rowClick={false} sx={datagridSx}>
      <TextField source="nom" />
      <TextField source="poste" />
      <NumberField source="note" />
      <DateField source="date" />
      <EditButton label="" icon={<EditIcon fontSize="small" />} />
      <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

export const TemoignageEdit = (props) => (
  <Edit {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="nom" validate={[required()]} fullWidth />
          <TextInput source="poste" fullWidth />
          <NumberInput source="note" min={0} max={5} step={1} />
          <TextInput source="commentaire" multiline rows={5} fullWidth />
          <DateInput source="date" />
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const TemoignageCreate = (props) => (
  <Create {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="nom" validate={[required()]} fullWidth />
          <TextInput source="poste" fullWidth />
          <NumberInput source="note" min={0} max={5} step={1} />
          <TextInput source="commentaire" multiline rows={5} fullWidth />
          <DateInput source="date" />
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);


