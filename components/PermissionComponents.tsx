// components/PermissionComponents.tsx
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '../hooks/usePermissions';

// Component wrapper for conditional rendering based on permissions
export const PermissionGate = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null, 
  children 
}: {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Role-based component wrapper
export const RoleGate = ({ 
  role, 
  roles, 
  minimumRole, 
  fallback = null, 
  children 
}: {
  role?: string;
  roles?: string[];
  minimumRole?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { hasRole, hasAnyRole, hasMinimumRole } = usePermissions();
  
  let hasAccess = false;
  
  if (role) {
    hasAccess = hasRole(role);
  } else if (roles) {
    hasAccess = hasAnyRole(roles);
  } else if (minimumRole) {
    hasAccess = hasMinimumRole(minimumRole);
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};