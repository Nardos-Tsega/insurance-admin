// hooks/usePermissions.ts
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type Permission = 
  | 'read_users'
  | 'write_users'
  | 'delete_users'
  | 'read_companies'
  | 'write_companies'
  | 'delete_companies'
  | 'read_super_admins'
  | 'write_super_admins'
  | 'delete_super_admins'
  | 'read_system_settings'
  | 'write_system_settings'
  | 'read_audit_logs'
  | 'write_audit_logs'
  | 'manage_roles'
  | 'manage_permissions'
  | 'system_maintenance'
  | 'backup_restore';

export type RolePermissions = {
  [key in 'user' | 'admin' | 'super_admin']: Permission[];
};

// Define permissions for each role
const ROLE_PERMISSIONS: RolePermissions = {
  user: [
    'read_users', // Can only read their own profile
  ],
  admin: [
    'read_users',
    'write_users',
    'read_companies',
    'write_companies',
    'delete_companies',
    'read_audit_logs',
  ],
  super_admin: [
    'read_users',
    'write_users',
    'delete_users',
    'read_companies',
    'write_companies',
    'delete_companies',
    'read_super_admins',
    'write_super_admins',
    'delete_super_admins',
    'read_system_settings',
    'write_system_settings',
    'read_audit_logs',
    'write_audit_logs',
    'manage_roles',
    'manage_permissions',
    'system_maintenance',
    'backup_restore',
  ],
};

// Define role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  user: 1,
  admin: 2,
  super_admin: 3,
};

export interface UsePermissionsReturn {
  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  // Role checks
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasMinimumRole: (minimumRole: string) => boolean;
  
  // Permission lists
  userPermissions: Permission[];
  availablePermissions: Permission[];
  
  // Role information
  userRole: string;
  roleHierarchy: number;
  canManageRole: (targetRole: string) => boolean;
  
  // UI helpers
  canRender: (permission: Permission) => boolean;
  canPerformAction: (action: string, resource: string) => boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  
  const userRole = user?.role || 'user';
  const userPermissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole as keyof RolePermissions] || [];
  }, [userRole]);
  
  const roleHierarchy = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };
  
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };
  
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };
  
  const hasRole = (role: string): boolean => {
    return userRole === role;
  };
  
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(userRole);
  };
  
  const hasMinimumRole = (minimumRole: string): boolean => {
    const minimumHierarchy = ROLE_HIERARCHY[minimumRole as keyof typeof ROLE_HIERARCHY] || 0;
    return roleHierarchy >= minimumHierarchy;
  };
  
  const canManageRole = (targetRole: string): boolean => {
    const targetHierarchy = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;
    return roleHierarchy > targetHierarchy;
  };
  
  const canRender = (permission: Permission): boolean => {
    return hasPermission(permission);
  };
  
  const canPerformAction = (action: string, resource: string): boolean => {
    const permission = `${action}_${resource}` as Permission;
    return hasPermission(permission);
  };
  
  const availablePermissions = useMemo(() => {
    return Object.values(ROLE_PERMISSIONS).flat().filter((permission, index, array) => 
      array.indexOf(permission) === index
    );
  }, []);
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    userPermissions,
    availablePermissions,
    userRole,
    roleHierarchy,
    canManageRole,
    canRender,
    canPerformAction,
  };
};

// Hook for managing user actions with permission checks
export const useUserActions = () => {
  const { hasPermission } = usePermissions();
  
  const canCreateUser = () => hasPermission('write_users');
  const canEditUser = () => hasPermission('write_users');
  const canDeleteUser = () => hasPermission('delete_users');
  const canViewUsers = () => hasPermission('read_users');
  
  const canCreateCompany = () => hasPermission('write_companies');
  const canEditCompany = () => hasPermission('write_companies');
  const canDeleteCompany = () => hasPermission('delete_companies');
  const canViewCompanies = () => hasPermission('read_companies');
  
  const canManageSystemSettings = () => hasPermission('write_system_settings');
  const canViewSystemSettings = () => hasPermission('read_system_settings');
  
  const canPerformMaintenance = () => hasPermission('system_maintenance');
  const canManageBackups = () => hasPermission('backup_restore');
  
  const canViewAuditLogs = () => hasPermission('read_audit_logs');
  const canManageAuditLogs = () => hasPermission('write_audit_logs');
  
  const canManageRoles = () => hasPermission('manage_roles');
  const canManagePermissions = () => hasPermission('manage_permissions');
  
  const canManageSuperAdmins = () => hasPermission('write_super_admins');
  const canViewSuperAdmins = () => hasPermission('read_super_admins');
  
  return {
    // User actions
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canViewUsers,
    
    // Company actions
    canCreateCompany,
    canEditCompany,
    canDeleteCompany,
    canViewCompanies,
    
    // System actions
    canManageSystemSettings,
    canViewSystemSettings,
    canPerformMaintenance,
    canManageBackups,
    
    // Audit actions
    canViewAuditLogs,
    canManageAuditLogs,
    
    // Role/Permission actions
    canManageRoles,
    canManagePermissions,
    
    // Super admin actions
    canManageSuperAdmins,
    canViewSuperAdmins,
  };
};