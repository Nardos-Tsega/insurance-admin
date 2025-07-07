import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';

const ModernAdminLayout = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const companies = [
    { id: 1, name: 'Acme Corp', employees: 150, status: 'Active', revenue: '$2.1M' },
    { id: 2, name: 'TechStart Inc', employees: 45, status: 'Active', revenue: '$890K' },
    { id: 3, name: 'Global Solutions', employees: 230, status: 'Inactive', revenue: '$3.4M' },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', company: 'Acme Corp' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', company: 'TechStart Inc' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Manager', company: 'Global Solutions' },
  ];

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 h-screen`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {sidebarOpen && <span className="font-semibold text-gray-800">Admin Panel</span>}
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'companies' 
                ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building2 size={20} />
            {sidebarOpen && <span>Companies</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'users' 
                ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            {sidebarOpen && <span>Users</span>}
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </nav>
    </div>
  );

  const Header = () => (
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
          
          <h1 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeTab}
          </h1>
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
          
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  );

  const TableControls = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Add {activeTab === 'companies' ? 'Company' : 'User'}
        </button>
        
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

  const CompaniesTable = () => (
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
            {companies.map((company) => (
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
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
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

  const UsersTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">User</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Role</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Company</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{user.name[0]}</span>
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Admin' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : user.role === 'Manager'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.company}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          <TableControls />
          {activeTab === 'companies' ? <CompaniesTable /> : <UsersTable />}
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayout;