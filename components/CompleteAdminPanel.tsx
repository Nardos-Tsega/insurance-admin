// components/CompleteAdminPanel.tsx - Section 1: Imports and Types
import InsuranceManagement from './InsuranceManagement';
import React, { JSX, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions, useUserActions } from '../hooks/usePermissions';
import { PermissionGate, RoleGate } from '../components/PermissionComponents';
import ClaimsManagement from './ClaimsManagement';
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
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  Car,
  Heart,
  Activity as HealthIcon
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

// Section 2: Component Declaration and State
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

  // Section 3: Helper Functions
  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: Database, show: true },
      { id: 'claims', label: 'Claims', icon: FileText, show: true },
      { id: 'insurance', label: 'Insurance', icon: Shield, show: true },
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
        return <Crown className="h-3 w-3 text-purple-500" />;
      case 'admin': 
        return <Shield className="h-3 w-3 text-emerald-500" />;
      default: 
        return <User className="h-3 w-3 text-gray-500" />;
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

  // Section 4: Sidebar Component
  const Sidebar: React.FC = () => (
    <div className={`${sidebarOpen ? 'w-52' : 'w-14'} bg-white border-r border-gray-200 transition-all duration-300 h-screen flex flex-col`}>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          {sidebarOpen && <span className="font-semibold text-gray-800 text-sm">Admin Panel</span>}
        </div>
      </div>
      
      <nav className="flex-1 mt-4">
        <div className="px-3 space-y-1">
          {getNavigationItems().map((item: NavigationItem) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-sm ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={16} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-xs">{user?.full_name?.[0] || 'U'}</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-xs truncate">{user?.full_name}</div>
              <div className="flex items-center gap-1">
                {getRoleIcon(user?.role || '')}
                <span className="text-xs text-gray-500 capitalize truncate">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>
        
        {sidebarOpen && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        )}
      </div>
    </div>
  );

  // Section 5: Header Component
  const Header: React.FC = () => (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-4 h-4 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {activeTab === 'claims' ? 'Claims Management' : 
               activeTab === 'super-admins' ? 'Super Admins' : 
               activeTab === 'system-settings' ? 'System Settings' : 
               activeTab === 'audit-logs' ? 'Audit Logs' : 
               activeTab.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {getRoleIcon(user?.role || '')}
              <span>Welcome back, {user?.full_name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={16} className="text-gray-600" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
        </div>
      </div>
    </header>
  );

  // Section 6: Dashboard Component
  const Dashboard: React.FC = () => (
    <div className="p-4 space-y-4">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Insurance Applications</p>
              <p className="text-lg font-semibold text-gray-900">234</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </p>
            </div>
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending Review</p>
              <p className="text-lg font-semibold text-gray-900">56</p>
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Needs attention
              </p>
            </div>
            <Eye className="h-6 w-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Approved Today</p>
              <p className="text-lg font-semibold text-gray-900">23</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                $45,600 total
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Premium Revenue</p>
              <p className="text-lg font-semibold text-gray-900">$156,780</p>
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                This month
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Claims Quick Access */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => setActiveTab('claims')}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Manage Claims</div>
                <div className="text-xs text-gray-500">View and process claims</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('claims')}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-orange-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Pending Reviews</div>
                <div className="text-xs text-gray-500">56 claims need attention</div>
              </div>
            </div>
          </button>
          
          <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">AI Analytics</div>
                <div className="text-xs text-gray-500">View AI performance</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-900">Claim CLM-2024-001 approved</div>
              <div className="text-gray-500">$2,500 • 2 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="h-3 w-3 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-900">AI analysis completed</div>
              <div className="text-gray-500">CLM-2024-002 • 15 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-3 w-3 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-900">Claim CLM-2024-003 rejected</div>
              <div className="text-gray-500">Insufficient evidence • 1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Section 7: Table Components
  const TableControls: React.FC<{ entityType: string }> = ({ entityType }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <PermissionGate permission={`write_${entityType.toLowerCase()}s` as any}>
          <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1.5 text-sm">
            <Plus size={14} />
            Add {entityType}
          </button>
        </PermissionGate>
        
        <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm">
          <Filter size={14} />
          Filter
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span>Show</span>
        <select className="border border-gray-300 rounded px-2 py-1 text-xs">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <span>per page</span>
      </div>
    </div>
  );

  const UsersTable: React.FC = () => (
    <div className="space-y-3">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-900">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedUsers([])}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
              <PermissionGate permission="delete_users">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
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
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">
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
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">User</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Email</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Role</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Company</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Status</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleUsers.map((userItem: UserData) => (
                <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                  <PermissionGate permission="delete_users">
                    <td className="px-3 py-2">
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
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">{userItem.name[0]}</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{userItem.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-sm">{userItem.email}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getRoleColor(userItem.role)}`}>
                      {getRoleIcon(userItem.role)}
                      <span className="capitalize">{userItem.role.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-sm">{userItem.company}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      userItem.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userItem.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <PermissionGate permission="write_users">
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit size={14} className="text-gray-600" />
                        </button>
                      </PermissionGate>
                      
                      <PermissionGate permission="delete_users">
                        {canManageRole(userItem.role) && (
                          <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                            <Trash2 size={14} className="text-gray-600" />
                          </button>
                        )}
                      </PermissionGate>
                      
                      <button className="p-1 hover:bg-gray-100 rounded" title="More">
                        <MoreHorizontal size={14} className="text-gray-600" />
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

  const CompaniesTable: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Company</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Employees</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Status</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Revenue</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company: CompanyData) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-xs">{company.name[0]}</span>
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{company.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-gray-600 text-sm">{company.employees}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    company.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-600 font-medium text-sm">{company.revenue}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <PermissionGate permission="write_companies">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Edit size={14} className="text-gray-600" />
                      </button>
                    </PermissionGate>
                    <PermissionGate permission="delete_companies">
                      <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                        <Trash2 size={14} className="text-gray-600" />
                      </button>
                    </PermissionGate>
                    <button className="p-1 hover:bg-gray-100 rounded" title="More">
                      <MoreHorizontal size={14} className="text-gray-600" />
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

  // Section 8: Modal Components
  const DeleteModal: React.FC = () => (
    showDeleteModal ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-semibold text-gray-900">Confirm Deletion</h3>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm">
            Are you sure you want to delete {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}? 
            This action cannot be undone.
          </p>
          
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ) : null
  );

  // Section 9: Render Content Function
  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'claims':
        return (
          <RoleGate roles={['admin', 'super_admin']}>
            <ClaimsManagement />
          </RoleGate>
        );
      case 'insurance':
        return <InsuranceManagement />;
      case 'users':
        return (
          <div className="p-4">
            <TableControls entityType="User" />
            <UsersTable />
          </div>
        );
      case 'companies':
        return (
          <RoleGate roles={['admin', 'super_admin']}>
            <div className="p-4">
              <TableControls entityType="Company" />
              <CompaniesTable />
            </div>
          </RoleGate>
        );
      case 'super-admins':
        return (
          <RoleGate role="super_admin">
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Super Admin Management</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Manage Super Admins</h4>
                      <p className="text-xs text-gray-600">Add, edit, or remove super administrator accounts</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                      Manage
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Permission Templates</h4>
                      <p className="text-xs text-gray-600">Create and manage permission templates</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </RoleGate>
        );
      case 'system-settings':
        return (
          <RoleGate role="super_admin">
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">System Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">AI Analysis Settings</h4>
                      <p className="text-xs text-gray-600">Configure AI analysis parameters and thresholds</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Notification Settings</h4>
                      <p className="text-xs text-gray-600">Manage notification preferences and mobile alerts</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Backup Settings</h4>
                      <p className="text-xs text-gray-600">Configure automated backups and data retention</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Security Settings</h4>
                      <p className="text-xs text-gray-600">Manage security policies and access controls</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </RoleGate>
        );
      case 'audit-logs':
        return (
          <PermissionGate permission="read_audit_logs">
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Audit Logs</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Eye className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">Admin viewed claim CLM-2024-001</div>
                      <div className="text-gray-500">User: {user?.full_name} • 2024-01-15 10:30:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">Claim CLM-2024-001 approved</div>
                      <div className="text-gray-500">User: {user?.full_name} • 2024-01-15 10:25:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Database className="h-3 w-3 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">AI analysis triggered</div>
                      <div className="text-gray-500">System • 2024-01-15 10:20:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">New user registration</div>
                      <div className="text-gray-500">System • 2024-01-15 09:45:00</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-3 w-3 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">Failed login attempt</div>
                      <div className="text-gray-500">IP: 192.168.1.1 • 2024-01-15 09:30:00</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm">
                    <Filter size={14} />
                    Filter Logs
                  </button>
                  <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1.5 text-sm">
                    <DollarSign size={14} />
                    Export Logs
                  </button>
                </div>
              </div>
            </div>
          </PermissionGate>
        );
      default:
        return <Dashboard />;
    }
  };

  // Section 10: Main Return Statement & Export
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <DeleteModal />
    </div>
  );
};

export default CompleteAdminPanel;