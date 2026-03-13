import React from 'react';
import { List, Datagrid, TextField, DateField, TopToolbar, ExportButton, TextInput, SelectInput, useRecordContext, Button, useNotify } from 'react-admin';

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
  <SelectInput key="type" source="type" label="Type" choices={[
    { id: 'combined', name: 'Combined' },
    { id: 'error', name: 'Error' },
    { id: 'exceptions', name: 'Exceptions' },
    { id: 'rejections', name: 'Rejections' },
  ]} alwaysOn />,
  <SelectInput key="level" source="level" label="Level" choices={[
    { id: 'error', name: 'error' },
    { id: 'warn', name: 'warn' },
    { id: 'info', name: 'info' },
    { id: 'debug', name: 'debug' },
  ]} />,
  <TextInput key="date" source="date" label="Date (YYYY-MM-DD)" />,
  <TextInput key="q" source="q" label="Search" alwaysOn />,
];

const ExportRawButton = () => {
  const notify = useNotify();
  const handleClick = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const type = params.get('filter%5Btype%5D') || 'combined';
      const date = params.get('filter%5Bdate%5D') || '';
      const base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');
      const url = `${base}/admin/logs/export?type=${encodeURIComponent(type)}${date ? `&date=${encodeURIComponent(date)}` : ''}`;
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `logs-${type}${date ? `-${date}` : ''}.log`;
      a.click();
    } catch (e) {
      notify(`Export error: ${e.message}`, { type: 'warning' });
    }
  };
  return <Button label="Exporter brut" onClick={handleClick} />;
};

const ListActions = () => (
  <TopToolbar>
    <ExportButton disabled />
    <ExportRawButton />
  </TopToolbar>
);

export const AdminLogsList = (props) => (
  <List
    {...props}
    filters={filters}
    sort={{ field: 'timestamp', order: 'DESC' }}
    actions={<ListActions />}
    perPage={100}
    resource="admin-logs"
    sx={listSx}
  >
    <Datagrid bulkActionButtons={false} rowClick={false} sx={datagridSx}>
      <DateField source="timestamp" showTime />
      <TextField source="level" />
      <TextField source="message" />
      <TextField source="metadata.method" label="method" />
      <TextField source="metadata.endpoint" label="endpoint" />
      <TextField source="metadata.statusCode" label="status" />
      <TextField source="metadata.ip" label="ip" />
      <TextField source="metadata.userAgent" label="userAgent" />
    </Datagrid>
  </List>
);
