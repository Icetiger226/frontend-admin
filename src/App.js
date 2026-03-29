import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Admin, Resource, Layout } from 'react-admin';
import { useTheme } from '@mui/material/styles';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import ActiviteDashboard from './components/ActiviteDashboard';
import ActualiteDashboard from './components/ActualiteDashboard';
import {
  ActiviteList,
  ActiviteEdit,
  ActiviteCreate,
} from './resources/Activites';
import {
  ActualiteList,
  ActualiteEdit,
  ActualiteCreate,
} from './resources/Actualites';
import {
  MembreList,
  MembreEdit,
  MembreCreate,
} from './resources/Membres';
import {
  TemoignageList,
  TemoignageEdit,
  TemoignageCreate,
} from './resources/Temoignages';
import { 
  MotPresidentList,
  MotPresidentEdit,
  MotPresidentCreate,
} from './resources/MotPresident';
import { MessageList, MessageEdit } from './resources/Messages';
import { NewsletterList, NewsletterCreate, NewsletterEdit } from './resources/Newsletter';
import {
  SponsorList,
  SponsorEdit,
  SponsorCreate,
} from './resources/Sponsors';
import { AdminUserList, AdminUserShow } from './resources/AdminUsers';
import { AdminLogsList } from './resources/AdminLogs';
import { AuditLogsList } from './resources/AuditLogs';
import AdminLayout from './components/AdminLayout';
import { API_URL } from './apiConfig';

// Composant pour l'interface admin React Admin
const AdminInterface = () => {
  const muiTheme = useTheme();
  const role = (typeof window !== 'undefined' && sessionStorage.getItem('authRole')) || null;
  const isSuperAdmin = role === 'super_admin';

  return (
    <Admin theme={muiTheme} dataProvider={dataProvider} authProvider={authProvider} loginPage={Login} layout={AdminLayout}>
      {/* Shared resources for both roles */}
      <Resource name="activites" list={ActiviteList} edit={ActiviteEdit} create={ActiviteCreate} />
      <Resource name="actualites" list={ActualiteList} edit={ActualiteEdit} create={ActualiteCreate} />
      <Resource name="messages" list={MessageList} edit={MessageEdit} />
      <Resource name="newsletter" options={{ label: 'Newsletter' }} list={NewsletterList} create={NewsletterCreate} edit={NewsletterEdit} />

      {/* Super admin only */}
      {isSuperAdmin && (
        <>
          <Resource name="membres" list={MembreList} edit={MembreEdit} create={MembreCreate} />
          <Resource name="temoignages" list={TemoignageList} edit={TemoignageEdit} create={TemoignageCreate} />
          <Resource name="motpresident" options={{ label: 'Mot du Président' }} list={MotPresidentList} edit={MotPresidentEdit} create={MotPresidentCreate} />
          <Resource name="sponsors" list={SponsorList} edit={SponsorEdit} create={SponsorCreate} />
           <Resource name="admin-users" options={{ label: 'Gestion Admins' }} list={AdminUserList} show={AdminUserShow} />
          <Resource name="admin-logs" list={AdminLogsList} options={{ label: 'Logs Système' }} />
          <Resource name="audit-logs" list={AuditLogsList} options={{ label: 'Audit' }} />
        </>
      )}
    </Admin>
  );
};

// Vérification session via cookies httpOnly (verify + refresh si besoin)
const ProtectedRoute = ({ children }) => {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let res = await fetch(`${API_URL}/auth/verify`, { credentials: 'include' });
        if (res.status === 401) {
          const r2 = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (r2.ok) {
            res = await fetch(`${API_URL}/auth/verify`, { credentials: 'include' });
          }
        }
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.user?.role) sessionStorage.setItem('authRole', data.user.role);
          if (data.user?.email) sessionStorage.setItem('authEmail', data.user.email);
        }
        if (!cancelled) setState({ loading: false, ok: res.ok });
      } catch {
        if (!cancelled) setState({ loading: false, ok: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) return null;
  if (!state.ok) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Routes d'authentification publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Route racine - Dashboard */}
            <Route path="/" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          
          {/* Route dashboard explicite */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          
          {/* Route dashboard des activités */}
            <Route path="/activites-dashboard" element={
              <ProtectedRoute>
                <ActiviteDashboard />
              </ProtectedRoute>
            } />
          
          {/* Route dashboard des actualités */}
            <Route path="/actualites-dashboard" element={
              <ProtectedRoute>
                <ActualiteDashboard />
              </ProtectedRoute>
            } />
          
          {/* Toutes les autres routes - gérées par React Admin */}
            <Route path="/*" element={
              <ProtectedRoute>
                <AdminInterface />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeModeProvider>
  );
}

export default App;