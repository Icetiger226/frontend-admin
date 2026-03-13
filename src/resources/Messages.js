import React, { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  useUpdate,
  Toolbar,
  Button,
  TopToolbar,
  ExportButton,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
} from 'react-admin';
import { Box, Card, CardContent, Divider, Typography, Dialog, DialogContent, DialogTitle, DialogActions, TextField as MuiTextField } from '@mui/material';
import { useRecordContext } from 'ra-core';
import { useFormContext } from 'react-hook-form';
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
  { id: 'nouveau', name: 'Nouveau' },
  { id: 'lu', name: 'Lu' },
  { id: 'repondu', name: 'Répondu' },
  { id: 'archivé', name: 'Archivé' },
];

const prioriteChoices = [
  { id: 'basse', name: 'Basse' },
  { id: 'normale', name: 'Normale' },
  { id: 'haute', name: 'Haute' },
  { id: 'urgente', name: 'Urgente' },
];

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

export const MessageList = (props) => (
  <List
    {...props}
    perPage={25}
    sort={{ field: 'date', order: 'DESC' }}
    actions={<ListActions />}
    filters={[<SearchInput source="q" alwaysOn placeholder="Rechercher..." />]}
    sx={listSx}
  >
    <Datagrid
      bulkActionButtons={can('messages', 'delete') ? <BulkDeleteButton /> : false}
      rowClick={false}
      sx={datagridSx}
    >
      <TextField source="nom" />
      <TextField source="email" />
      <TextField source="statut" />
      <TextField source="priorite" />
      <DateField source="date" />
      {can('messages', 'edit') && <EditButton label="" icon={<EditIcon fontSize="small" />} />}
      {can('messages', 'delete') && (
        <DeleteButton label="" icon={<DeleteIcon fontSize="small" />} mutationMode="pessimistic" />
      )}
    </Datagrid>
  </List>
);

const SaveStatusToolbar = () => {
  const { getValues } = useFormContext();
  const [update, { isLoading }] = useUpdate();
  const record = useRecordContext();

  const onSave = () => {
    const statut = getValues('statut');
    const priorite = getValues('priorite');
    update('messages', { id: record?.id, data: { _action: 'status', statut, priorite } });
  };

  return (
    <Toolbar>
      <Button label="Enregistrer le statut" onClick={onSave} disabled={isLoading} />
    </Toolbar>
  );
};

export const MessageEdit = (props) => {
  const [openReply, setOpenReply] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [update, { isLoading }] = useUpdate();
  const record = useRecordContext();

  const handleMarkRead = (id) => {
    update(
      'messages',
      { id, data: { _action: 'read' } },
      { onSuccess: () => {}, onError: () => {} }
    );
  };

  const handleReply = (id) => {
    update(
      'messages',
      { id, data: { _action: 'reply', reponse: replyBody, admin: 'Admin' } },
      { onSuccess: () => setOpenReply(false), onError: () => {} }
    );
  };

  return (
    <Edit {...props}>
      <SimpleForm toolbar={<SaveStatusToolbar />} sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
        <Card sx={formCardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Détails
              </Typography>
              <TextInput source="nom" disabled />
              <TextInput source="email" disabled />
              <TextInput source="message" multiline rows={6} disabled fullWidth />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 0 }}>
              <Typography variant="h6" gutterBottom>
                Statut
              </Typography>
              <SelectInput source="statut" choices={statutChoices} />
              <SelectInput source="priorite" choices={prioriteChoices} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 1.5 }}>
                <Button label="Marquer comme lu" onClick={() => handleMarkRead(record?.id)} />
                <Button label="Répondre" onClick={() => setOpenReply(true)} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Dialog open={openReply} onClose={() => setOpenReply(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Répondre au message</DialogTitle>
          <DialogContent>
            <MuiTextField
              label="Votre réponse"
              multiline
              minRows={5}
              fullWidth
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button label="Annuler" onClick={() => setOpenReply(false)} />
            <Button label="Envoyer" onClick={() => handleReply(record?.id)} disabled={isLoading || !replyBody.trim()} />
          </DialogActions>
        </Dialog>
      </SimpleForm>
    </Edit>
  );
};



