import React from 'react';
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

export const MotPresidentList = (props) => (
  <List
    {...props}
    perPage={25}
    sort={{ field: 'date', order: 'DESC' }}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid bulkActionButtons={<BulkDeleteButton />} rowClick={false} sx={datagridSx}>
      <DateField source="date" />
      <TextField source="contenu" />
      <EditButton label="" icon={<EditIcon fontSize="small" />} />
      <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
    </Datagrid>
  </List>
);

export const MotPresidentEdit = (props) => (
  <Edit {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="contenu" validate={[required()]} multiline rows={10} fullWidth />
          <DateInput source="date" />
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const MotPresidentCreate = (props) => (
  <Create {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="contenu" validate={[required()]} multiline rows={10} fullWidth />
          <DateInput source="date" />
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);


