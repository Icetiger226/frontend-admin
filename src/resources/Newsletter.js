import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  SelectInput,
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
import { can } from '../utils/roleUtils';

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

const statutChoices = [
  { id: 'actif', name: 'Actif' },
  { id: 'inactif', name: 'Inactif' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'spam', name: 'Spam' },
];

const ListActions = () => (
  <TopToolbar>
    {can('newsletter', 'create') && <CreateButton />}
    <ExportButton />
  </TopToolbar>
);

export const NewsletterList = (props) => (
  <List
    {...props}
    perPage={50}
    sort={{ field: 'date', order: 'DESC' }}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid bulkActionButtons={can('newsletter', 'delete') ? <BulkDeleteButton /> : false} rowClick={false} sx={datagridSx}>
      <TextField source="email" />
      <TextField source="statut" />
      <TextField source="source" />
      <DateField source="date" />
      {can('newsletter', 'edit') && <EditButton label="" icon={<EditIcon fontSize="small" />} />}
      {can('newsletter', 'delete') && (
        <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
      )}
    </Datagrid>
  </List>
);

export const NewsletterEdit = (props) => (
  <Edit {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="email" disabled />
          <SelectInput source="statut" choices={statutChoices} />
          <TextInput
            source="tags"
            label="Tags (séparés par virgule)"
            parse={(v) => (v ? v.split(',').map((s) => s.trim()) : [])}
            format={(v) => (Array.isArray(v) ? v.join(', ') : '')}
            fullWidth
          />
        </CardContent>
      </Card>
    </SimpleForm>
  </Edit>
);

export const NewsletterCreate = (props) => (
  <Create {...props}>
    <SimpleForm sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <Card sx={formCardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextInput source="email" type="email" validate={[required()]} />
          <TextInput
            source="tags"
            label="Tags (séparés par virgule)"
            parse={(v) => (v ? v.split(',').map((s) => s.trim()) : [])}
            format={(v) => (Array.isArray(v) ? v.join(', ') : '')}
            fullWidth
          />
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);


