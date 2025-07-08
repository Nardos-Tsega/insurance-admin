import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Crown, Settings, Database, Shield, Users, AlertTriangle } from 'lucide-react';

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">System-wide administration and management</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage all system users and their roles</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Manage Users
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure system-wide settings and preferences</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Settings
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <p className="text-gray-600 mb-4">Monitor security and audit logs</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SuperAdminPage() {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <SuperAdminDashboard />
    </ProtectedRoute>
  );
}