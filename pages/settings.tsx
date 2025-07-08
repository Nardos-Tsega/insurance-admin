// pages/settings.tsx
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { PermissionGate, RoleGate } from '../hooks/usePermissions';
import { Settings, User, Bell, Lock, Palette, Shield, Crown } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-5 w-5 text-purple-500" />;
      case 'admin': return <Shield className="h-5 w-5 text-emerald-500" />;
      default: return <User className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>
        
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={user?.full_name || ''} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={user?.phone_number || ''} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {getRoleIcon(user?.role)}
                  <span className="text-gray-700 capitalize">{user?.role?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive SMS notifications for urgent alerts</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Session Management</h3>
                  <p className="text-sm text-gray-600">Manage your active sessions</p>
                </div>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
          
          {/* Super Admin Only Settings */}
          <RoleGate role="super_admin">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-6 w-6 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">Super Admin Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <h3 className="font-medium text-gray-900">System Maintenance Mode</h3>
                    <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <h3 className="font-medium text-gray-900">Global Settings</h3>
                    <p className="text-sm text-gray-600">Configure system-wide settings and preferences</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Manage
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <h3 className="font-medium text-gray-900">System Backups</h3>
                    <p className="text-sm text-gray-600">Configure automated system backups</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </RoleGate>

          {/* Admin Settings */}
          <PermissionGate permission="read_audit_logs">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-semibold text-gray-900">Admin Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <h3 className="font-medium text-gray-900">User Management Preferences</h3>
                    <p className="text-sm text-gray-600">Configure your user management settings</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <h3 className="font-medium text-gray-900">Report Preferences</h3>
                    <p className="text-sm text-gray-600">Set your default report settings</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPageWithAuth() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <SettingsPage />
    </ProtectedRoute>
  );
}