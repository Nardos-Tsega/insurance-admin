import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import CompleteAdminPanel from '../components/CompleteAdminPanel';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CompleteAdminPanel />
    </ProtectedRoute>
  );
}