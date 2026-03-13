import * as React from 'react';
import { Layout } from 'react-admin';
import CustomMenu from './CustomMenu';
import AdminAppBar from './AdminAppBar';

const AdminLayout = (props) => (
  <Layout {...props} menu={CustomMenu} appBar={AdminAppBar} />
);

export default AdminLayout;
