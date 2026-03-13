import React from 'react';
import { Navigate } from 'react-router-dom';

/*
  Usage:
  <Route path="/admin-only" element={<ProtectedRoute roles={["super_admin"]} element={<MyPage />} />} />

  - Vérifie la présence du token dans localStorage (authToken)
  - Si roles est fourni, compare avec localStorage (authRole)
  - Redirige vers /login si non autorisé
*/
const ProtectedRoute = ({ element, roles, redirectTo = '/login' }) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
  const role = typeof window !== 'undefined' ? window.localStorage.getItem('authRole') : null;

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
