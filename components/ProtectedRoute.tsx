// components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { 
  Loader, 
  AlertTriangle, 
  Shield, 
  Crown, 
  User, 
  Lock, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin';
  fallback?: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  showRoleInfo?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'admin',
  fallback,
  allowedRoles = [],
  redirectTo = '/login',
  showRoleInfo = true
}) => {
  const router = useRouter();
  const { user, loading, hasPermission, logout, refreshToken } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace(redirectTo);
      } else if (!hasPermission(requiredRole) && !checkAllowedRoles()) {
        // Logged in but insufficient permissions
        console.log('Access denied: insufficient permissions');
      }
    }
  }, [user, loading, hasPermission, requiredRole, router, redirectTo]);

  // Check if user has any of the allowed roles
  const checkAllowedRoles = (): boolean => {
    if (allowedRoles.length === 0) return false;
    return allowedRoles.includes(user?.role || '');
  };

  // Check if user has required permission or is in allowed roles
  const hasAccess = (): boolean => {
    if (!user) return false;
    return hasPermission(requiredRole) || checkAllowedRoles();
  };

  // Retry authentication with exponential backoff
  const handleRetry = async () => {
    if (retryCount >= 3) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await refreshToken();
      // If successful, the useEffect will handle the redirect
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-emerald-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-purple-600';
      case 'admin':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRoleDisplayName = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-emerald-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-emerald-500 mx-auto" />
          <p className="mt-2 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User logged in but insufficient permissions
  if (!hasAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          
          <p className="text-gray-600 mb-6">
            You don't have sufficient permissions to access this page. Please contact your administrator if you believe this is an error.
          </p>

          {showRoleInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-2">Your Current Role:</p>
                  <div className={`flex items-center justify-center gap-2 font-medium ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span>{getRoleDisplayName(user.role)}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500 mb-2">Required Role:</p>
                  <div className={`flex items-center justify-center gap-2 font-medium ${getRoleColor(requiredRole)}`}>
                    {getRoleIcon(requiredRole)}
                    <span>{getRoleDisplayName(requiredRole)}</span>
                  </div>
                </div>

                {allowedRoles.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-2">Allowed Roles:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {allowedRoles.map((role) => (
                        <div key={role} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)} bg-gray-100`}>
                          {getRoleIcon(role)}
                          <span>{getRoleDisplayName(role)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <User className="h-4 w-4" />
              <span>Logged in as: {user.full_name}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              
              <button
                onClick={handleRetry}
                disabled={isRetrying || retryCount >= 3}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Retry ({retryCount}/3)
              </button>
            </div>
            
            <button
              onClick={logout}
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium"
            >
              Logout and Login with Different Account
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              Need help? Contact your system administrator or IT support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User has permission, render children
  return <>{children}</>;
};

export default ProtectedRoute;