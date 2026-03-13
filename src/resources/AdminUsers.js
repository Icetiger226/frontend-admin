import React, { useCallback } from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  FunctionField,
  TopToolbar,
  useRefresh,
  useNotify,
  Show,
  SimpleShowLayout,
  TextInput,
  SelectInput,
} from 'react-admin';
import { Card, CardContent, Button as MuiButton, Chip, Stack, Typography, Divider } from '@mui/material';

const StatusChip = (props) => {
  const value = props.record?.status;
  const muiColor = value === 'actif' ? 'success' : value === 'en_attente' ? 'warning' : value === 'suspendu' ? 'error' : 'default';
  return <Chip size="small" variant="outlined" color={muiColor} label={String(value || '')} />;
};

const RoleChip = (props) => {
  const value = props.record?.role;
  const muiColor = value === 'super_admin' ? 'primary' : 'default';
  return <Chip size="small" variant="outlined" color={muiColor} label={String(value || '')} />;
};

const Actions = ({ record }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;

  const call = (url, options = {}) => {
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    }).then(async (res) => {
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
      try { return JSON.parse(text); } catch { return text; }
    });
  };

  const withCatch = async (fn) => {
    try {
      await fn();
      notify('Action effectuée', { type: 'success' });
      refresh();
    } catch (e) {
      notify(e.message || 'Erreur', { type: 'warning' });
    }
  };

  const validateUser = useCallback(() => withCatch(() => call(`${API}/admin/users/${record.id}/validate`, { method: 'POST', body: JSON.stringify({ role: 'admin_simple' }) })), [record, API]);
  const refuseUser = useCallback(() => withCatch(() => call(`${API}/admin/users/${record.id}/refuse`, { method: 'POST', body: JSON.stringify({ raison: 'Non conforme' }) })), [record, API]);
  const suspendUser = useCallback(() => withCatch(() => call(`${API}/admin/users/${record.id}/suspend`, { method: 'POST', body: JSON.stringify({ raison: 'Violation', duree: 60 }) })), [record, API]);
  const reactivateUser = useCallback(() => withCatch(() => call(`${API}/admin/users/${record.id}/reactivate`, { method: 'POST' })), [record, API]);
  const changeRole = useCallback(() => {
    const newRole = window.prompt('Nouveau rôle (admin_simple | super_admin):', record.role || 'admin_simple');
    if (!newRole) return;
    return withCatch(() => call(`${API}/admin/users/${record.id}/role`, { method: 'PUT', body: JSON.stringify({ role: newRole }) }));
  }, [record, API]);
  const resetPassword = useCallback(() => {
    if (window.confirm(`Voulez-vous réinitialiser le mot de passe de ${record.email} ?`)) {
      return withCatch(() => call(`${API}/admin/users/${record.id}/reset-password`, { method: 'POST' }));
    }
  }, [record, API]);
  const deleteUser = useCallback(() => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${record.email} ? Cette action est irréversible.`)) {
      return withCatch(() => call(`${API}/admin/users/${record.id}`, { method: 'DELETE' }));
    }
  }, [record, API]);

  if (!record) return null;
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {record.status === 'en_attente' && (
        <MuiButton size="small" variant="contained" color="success" onClick={validateUser}>
          Valider
        </MuiButton>
      )}
      {record.status === 'en_attente' && (
        <MuiButton size="small" variant="contained" color="warning" onClick={refuseUser}>
          Refuser
        </MuiButton>
      )}
      {record.status === 'actif' && (
        <MuiButton size="small" variant="contained" color="error" onClick={suspendUser}>
          Suspendre
        </MuiButton>
      )}
      {record.status === 'suspendu' && (
        <MuiButton size="small" variant="contained" color="primary" onClick={reactivateUser}>
          Réactiver
        </MuiButton>
      )}
      <MuiButton size="small" variant="outlined" onClick={changeRole}>
        Changer rôle
      </MuiButton>
      <MuiButton size="small" variant="outlined" onClick={resetPassword}>
        Réinitialiser MDP
      </MuiButton>
      <MuiButton size="small" variant="outlined" color="error" onClick={deleteUser}>
        Supprimer
      </MuiButton>
    </Stack>
  );
};

const AdminUsersListActions = (props) => <TopToolbar />;

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

const filters = [
  <TextInput key="q" source="q" label="Recherche" alwaysOn />,
  <SelectInput key="status" source="status" label="Statut" choices={[
    { id: 'en_attente', name: 'En attente' },
    { id: 'actif', name: 'Actif' },
    { id: 'suspendu', name: 'Suspendu' },
    { id: 'refuse', name: 'Refusé' },
  ]} />, 
  <SelectInput key="role" source="role" label="Rôle" choices={[
    { id: 'admin_simple', name: 'Admin simple' },
    { id: 'super_admin', name: 'Super admin' },
  ]} />,
];

export const AdminUserList = (props) => (
  <List
    {...props}
    filters={filters}
    actions={<AdminUsersListActions />}
    perPage={25}
    sort={{ field: 'createdAt', order: 'DESC' }}
    sx={listSx}
  >
    <Datagrid rowClick="show" bulkActionButtons={false} sx={datagridSx}>
      <EmailField source="email" />
      <TextField source="nom" />
      <FunctionField label="Rôle" render={(record) => <RoleChip record={record} />} />
      <FunctionField label="Statut" render={(record) => <StatusChip record={record} />} />
      <DateField source="createdAt" label="Créé le" showTime />
      <DateField source="updatedAt" label="Mis à jour" showTime />
      <FunctionField label="Actions" render={(record) => <Actions record={record} />} />
    </Datagrid>
  </List>
);

export const AdminUserShow = (props) => (
  <Show {...props}>
    <Stack sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }} spacing={2}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            Détails du compte
          </Typography>
          <SimpleShowLayout>
            <EmailField source="email" />
            <TextField source="nom" />
            <FunctionField label="Rôle" render={(record) => <RoleChip record={record} />} />
            <FunctionField label="Statut" render={(record) => <StatusChip record={record} />} />
            <DateField source="createdAt" label="Créé le" showTime />
            <DateField source="updatedAt" label="Mis à jour" showTime />
          </SimpleShowLayout>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
            Actions
          </Typography>
          <FunctionField label="" render={(record) => <Actions record={record} />} />
        </CardContent>
      </Card>
    </Stack>
  </Show>
);
