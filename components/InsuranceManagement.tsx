import React, { useState } from 'react';
import { 
  Shield,
  Car,
  Heart,
  Activity as HealthIcon,
  Eye,
  Edit,
  MoreHorizontal,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Plus
} from 'lucide-react';
import InsuranceApplicationDetail from './InsuranceApplicationDetail';

// Insurance application interface
interface InsuranceApplication {
  id: string;
  type: 'motor' | 'life' | 'health';
  applicantName: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  premium: number;
  coverage: number;
  submittedAt: string;
  lastUpdated: string;
  
  // Motor insurance specific
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  registrationNumber?: string;
  
  // Life insurance specific
  sumAssured?: number;
  policyTerm?: number;
  paymentFrequency?: string;
  
  // Health insurance specific
  familyMembers?: number;
  preExistingConditions?: string[];
  hospitalPreference?: string;
}

const InsuranceManagement: React.FC = () => {
  const [insuranceTab, setInsuranceTab] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<InsuranceApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Sample insurance applications data
  const insuranceApplications: InsuranceApplication[] = [
    {
      id: 'INS-2024-001',
      type: 'motor',
      applicantName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'pending',
      premium: 2500,
      coverage: 50000,
      submittedAt: '2024-07-15T10:30:00Z',
      lastUpdated: '2024-07-15T10:30:00Z',
      vehicleType: 'Car',
      vehicleModel: 'Toyota Camry',
      vehicleYear: 2022,
      registrationNumber: 'ABC-123'
    },
    {
      id: 'INS-2024-002',
      type: 'life',
      applicantName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      status: 'approved',
      premium: 5000,
      coverage: 500000,
      submittedAt: '2024-07-14T14:20:00Z',
      lastUpdated: '2024-07-16T09:15:00Z',
      sumAssured: 500000,
      policyTerm: 20,
      paymentFrequency: 'Annual'
    },
    {
      id: 'INS-2024-003',
      type: 'health',
      applicantName: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+1234567892',
      status: 'under_review',
      premium: 3500,
      coverage: 100000,
      submittedAt: '2024-07-13T16:45:00Z',
      lastUpdated: '2024-07-17T11:30:00Z',
      familyMembers: 4,
      preExistingConditions: ['Diabetes', 'Hypertension'],
      hospitalPreference: 'Network Hospitals'
    },
    {
      id: 'INS-2024-004',
      type: 'motor',
      applicantName: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1234567893',
      status: 'rejected',
      premium: 1800,
      coverage: 30000,
      submittedAt: '2024-07-12T12:15:00Z',
      lastUpdated: '2024-07-16T15:20:00Z',
      vehicleType: 'Motorcycle',
      vehicleModel: 'Honda CBR',
      vehicleYear: 2021,
      registrationNumber: 'XYZ-789'
    },
    {
      id: 'INS-2024-005',
      type: 'life',
      applicantName: 'Mike Brown',
      email: 'mike@example.com',
      phone: '+1234567894',
      status: 'pending',
      premium: 7500,
      coverage: 750000,
      submittedAt: '2024-07-16T08:30:00Z',
      lastUpdated: '2024-07-16T08:30:00Z',
      sumAssured: 750000,
      policyTerm: 25,
      paymentFrequency: 'Monthly'
    }
  ];

  const getInsuranceIcon = (type: string) => {
    switch (type) {
      case 'motor': return <Car className="h-3 w-3" />;
      case 'life': return <Heart className="h-3 w-3" />;
      case 'health': return <HealthIcon className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'under_review': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getInsuranceTypeColor = (type: string) => {
    switch (type) {
      case 'motor': return 'bg-blue-100 text-blue-800';
      case 'life': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = insuranceApplications.filter(app => {
    if (insuranceTab === 'all') return true;
    return app.type === insuranceTab;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Applications</p>
              <p className="text-lg font-semibold text-gray-900">{insuranceApplications.length}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15% this month
              </p>
            </div>
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending Review</p>
              <p className="text-lg font-semibold text-gray-900">
                {insuranceApplications.filter(app => app.status === 'pending' || app.status === 'under_review').length}
              </p>
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
              <p className="text-lg font-semibold text-gray-900">
                {insuranceApplications.filter(app => app.status === 'approved').length}
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                High approval rate
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Premium</p>
              <p className="text-lg font-semibold text-gray-900">
                ${insuranceApplications.filter(app => app.status === 'approved').reduce((sum, app) => sum + app.premium, 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Revenue generated
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Insurance Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-4">
            {[
              { id: 'all', label: 'All Applications', icon: Shield },
              { id: 'motor', label: 'Motor Insurance', icon: Car },
              { id: 'life', label: 'Life Insurance', icon: Heart },
              { id: 'health', label: 'Health Insurance', icon: HealthIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setInsuranceTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  insuranceTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {tab.id === 'all' ? insuranceApplications.length : insuranceApplications.filter(app => app.type === tab.id).length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Table Controls */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm">
                <Filter size={14} />
                Filter
              </button>
              <select className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs">
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Under Review</option>
              </select>
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

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Application ID</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Applicant</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Type</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Premium</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Coverage</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Status</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Submitted</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2">
                      <span className="font-medium text-gray-900 text-sm">{application.id}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">{application.applicantName[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{application.applicantName}</div>
                          <div className="text-xs text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getInsuranceTypeColor(application.type)}`}>
                        {getInsuranceIcon(application.type)}
                        <span className="capitalize">{application.type}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 font-medium text-sm">${application.premium.toLocaleString()}</td>
                    <td className="px-3 py-2 text-gray-600 text-sm">${application.coverage.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 text-xs">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded" 
                          title="View Details"
                        >
                          <Eye size={14} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit size={14} className="text-gray-600" />
                        </button>
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Showing 1 to {filteredApplications.length} of {filteredApplications.length} results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-2 py-1 bg-emerald-500 text-white rounded text-xs">
                1
              </button>
              <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <InsuranceApplicationDetail 
          application={selectedApplication}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default InsuranceManagement;