import React from 'react';
import { List, Datagrid, TextField, DateField, TextInput, TopToolbar, ExportButton } from 'react-admin';

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
  <TextInput key="action" source="action" label="Action" />,
  <TextInput key="resource" source="resource" label="Resource" />,
  <TextInput key="actorId" source="actorId" label="Actor ID" />,
  <TextInput key="targetId" source="targetId" label="Target ID" />,
  <TextInput key="from" source="from" label="From (ISO)" />,
  <TextInput key="to" source="to" label="To (ISO)" />,
  <TextInput key="q" source="q" label="Search" alwaysOn />,
];

const ListActions = () => (
  <TopToolbar>
    <ExportButton disabled />
  </TopToolbar>
);

export const AuditLogsList = (props) => (
  <List
    {...props}
    filters={filters}
    sort={{ field: 'createdAt', order: 'DESC' }}
    actions={<ListActions />}
    perPage={50}
    resource="audit-logs"
    sx={listSx}
  >
    <Datagrid bulkActionButtons={false} rowClick={false} sx={datagridSx}>
      <DateField source="createdAt" />
      <TextField source="action" />
      <TextField source="resource" />
      <TextField source="resourceId" />
      <TextField source="actor.email" label="Actor" />
      <TextField source="target.email" label="Target" />
      <TextField source="ip" />
      <TextField source="endpoint" />
      <TextField source="statusCode" />
      <TextField source="error" />
    </Datagrid>
  </List>
);
