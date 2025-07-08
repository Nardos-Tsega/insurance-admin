// components/CompleteAdminPanel.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { usePermissions, PermissionGate, RoleGate, useUserActions } from '../hooks/usePermissions';
import { usePermissions, useUserActions } from '../hooks/usePermissions';
import { PermissionGate, RoleGate } from '../components/PermissionComponents';
import { 
  Users, 
  Building2, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Crown,
  Shield,
  User,
  Eye,
  Database,
  LogOut,
  AlertCircle
} from 'lucide-react';

// Define types for better TypeScript support
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  company: string;
  status: 'Active' | 'Inactive';
}

interface CompanyData {
  id: number;
  name: string;
  employees: number;
  status: 'Active' | 'Inactive';
  revenue: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  show: boolean;
}

const CompleteAdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const { userRole, canManageRole } = usePermissions();
  const {
    canViewUsers,
    canViewCompanies,
    canManageSystemSettings,
    canViewAuditLogs,
    canManageSuperAdmins
  } = useUserActions();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Sample data with proper typing
  const allUsers: UserData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', company: 'Acme Corp', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', company: 'TechStart Inc', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'super_admin', company: 'Global Solutions', status: 'Active' },
    { id: 4, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', company: 'Acme Corp', status: 'Inactive' },
  ];

  const companies: CompanyData[] = [
    { id: 1, name: 'Acme Corp', employees: 150, status: 'Active', revenue: '$2.1M' },
    { id: 2, name: 'TechStart Inc', employees: 45, status: 'Active', revenue: '$890K' },
    { id: 3, name: 'Global Solutions', employees: 230, status: 'Inactive', revenue: '$3.4M' },
  ];

  // Filter users based on permissions
  const visibleUsers: UserData[] = allUsers.filter((u: UserData) => {
    if (userRole === 'super_admin') return true;
    if (userRole === 'admin') return u.role !== 'super_admin';
    return u.id === user?.id; // Users can only see themselves
  });

  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: Database, show: true },
      { id: 'users', label: 'Users', icon: Users, show: canViewUsers() },
      { id: 'companies', label: 'Companies', icon: Building2, show: canViewCompanies() },
      { id: 'super-admins', label: 'Super Admins', icon: Crown, show: canManageSuperAdmins() },
      { id: 'system-settings', label: 'System Settings', icon: Settings, show: canManageSystemSettings() },
      { id: 'audit-logs', label: 'Audit Logs', icon: Eye, show: canViewAuditLogs() },
    ];

    return items.filter((item: NavigationItem) => item.show);
  };

  const getRoleIcon = (role: string): JSX.Element => {
    switch (role) {
      case 'super_admin': 
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'admin': 
        return <Shield className="h-4 w-4 text-emerald-500" />;
      default: 
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'super_admin': 
        return 'bg-purple-100 text-purple-800';
      case 'admin': 
        return 'bg-emerald-100 text-emerald-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBulkDelete = (): void => {
    if (selectedUsers.length === 0) return;
    setShowDeleteModal(true);
  };

  const confirmBulkDelete = (): void => {
    // Implement bulk delete logic
    console.log('Deleting users:', selectedUsers);
    setSelectedUsers([]);
    setShowDeleteModal(false);
  };

  const Sidebar: React.FC = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 h-screen flex flex-col`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {sidebarOpen && <span className="font-semibold text-gray-800">Admin Panel</span>}
        </div>
      </div>
      
      <nav className="flex-1 mt-8">
        <div className="px-4 space-y-2">
          {getNavigationItems().map((item: NavigationItem) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">{user?.full_name?.[0] || 'U'}</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm">{user?.full_name}</div>
              <div className="flex items-center gap-1">
                {getRoleIcon(user?.role || '')}
                <span className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>
        
        {sidebarOpen && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </div>
  );

  const Header: React.FC = () => (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getRoleIcon(user?.role || '')}
              <span>Welcome back, {user?.full_name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
        </div>
      </div>
    </header>
  );

  const UsersTable: React.FC = () => (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedUsers([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
              <PermissionGate permission="delete_users">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </PermissionGate>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <PermissionGate permission="delete_users">
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === visibleUsers.length && visibleUsers.length > 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          setSelectedUsers(visibleUsers.map((u: UserData) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                </PermissionGate>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Company</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleUsers.map((userItem: UserData) => (
                <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                  <PermissionGate permission="delete_users">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userItem.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, userItem.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter((id: number) => id !== userItem.id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                  </PermissionGate>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{userItem.name[0]}</span>
                      </div>
                      <span className="font-medium text-gray-900">{userItem.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{userItem.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getRoleColor(userItem.role)}`}>
                      {getRoleIcon(userItem.role)}
                      <span className="capitalize">{userItem.role.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{userItem.company}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userItem.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <PermissionGate permission="write_users">
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit size={16} className="text-gray-600" />
                        </button>
                      </PermissionGate>
                      
                      <PermissionGate permission="delete_users">
                        {canManageRole(userItem.role) && (
                          <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                            <Trash2 size={16} className="text-gray-600" />
                          </button>
                        )}
                      </PermissionGate>
                      
                      <button className="p-1 hover:bg-gray-100 rounded" title="More">
                        <MoreHorizontal size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TableControls: React.FC<{ entityType: string }> = ({ entityType }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <PermissionGate permission={`write_${entityType.toLowerCase()}s` as any}>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Add {entityType}
          </button>
        </PermissionGate>
        
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Filter size={16} />
          Filter
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show</span>
        <select className="border border-gray-300 rounded px-2 py-1">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <span>per page</span>
      </div>
    </div>
  );

  const CompaniesTable: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Company</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Employees</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Revenue</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company: CompanyData) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{company.name[0]}</span>
                    </div>
                    <span className="font-medium text-gray-900">{company.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{company.employees}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    company.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{company.revenue}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <PermissionGate permission="write_companies">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Edit size={16} className="text-gray-600" />
                      </button>
                    </PermissionGate>
                    <PermissionGate permission="delete_companies">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </PermissionGate>
                    <button className="p-1 hover:bg-gray-100 rounded" title="More">
                      <MoreHorizontal size={16} className="text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DeleteModal: React.FC = () => (
    showDeleteModal ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}? 
            This action cannot be undone.
          </p>
          
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ) : null
  );

  const Dashboard: React.FC = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{visibleUsers.length}</p>
            </div>
            <Users className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        
        <PermissionGate permission="read_companies">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-2xl font-semibold text-gray-900">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </PermissionGate>

        <RoleGate role="super_admin">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-2xl font-semibold text-emerald-600">Online</p>
              </div>
              <Database className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </RoleGate>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">New user registered: Jane Smith</span>
            <span className="text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Company updated: Acme Corp</span>
            <span className="text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">System maintenance scheduled</span>
            <span className="text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            <TableControls entityType="User" />
            <UsersTable />
          </>
        );
      case 'companies':
        return (
          <RoleGate roles={['admin', 'super_admin']}>
            <TableControls entityType="Company" />
            <CompaniesTable />
          </RoleGate>
        );
      case 'super-admins':
        return (
          <RoleGate role="super_admin">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Super Admin Management</h3>
              <p className="text-gray-600">Super admin management interface would go here.</p>
            </div>
          </RoleGate>
        );
      case 'system-settings':
        return (
          <RoleGate role="super_admin">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                  </div>
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Backup Settings</h4>
                    <p className="text-sm text-gray-600">Configure automated backups</p>
                  </div>
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </RoleGate>
        );
      case 'audit-logs':
        return (
          <PermissionGate permission="read_audit_logs">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Logs</h3>
              <p className="text-gray-600">Audit logs interface would go here.</p>
            </div>
          </PermissionGate>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      <DeleteModal />
    </div>
  );
};

export default CompleteAdminPanel;