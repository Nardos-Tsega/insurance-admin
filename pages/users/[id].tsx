import React from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Calendar, Shield, Crown } from 'lucide-react';

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isSuperAdmin } = useAuth();
  
  // Sample user data - in real app, fetch from API
  const userData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'admin',
    company: 'Acme Corp',
    status: 'Active',
    created_at: '2024-01-15',
    last_login: '2024-02-20T10:30:00Z'
  };
  
  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-emerald-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-emerald-600 hover:text-emerald-700 mb-4"
          >
            ← Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">User Details</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{userData.name[0]}</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{userData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon(userData.role)}
                <span className="text-gray-600 capitalize">{userData.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{userData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Joined: {userData.created_at}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userData.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userData.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <span className="text-gray-600">{userData.company}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <span className="text-gray-600">{new Date(userData.last_login).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Super Admin Only Actions */}
          {isSuperAdmin() && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              <div className="flex gap-3">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Edit User
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Reset Password
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Deactivate User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function UserDetailPageWithAuth() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserDetailPage />
    </ProtectedRoute>
  );
}