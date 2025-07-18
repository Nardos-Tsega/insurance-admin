import React from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Car,
  Heart,
  Activity as HealthIcon,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
  CreditCard,
  Users,
  MapPin,
  Download
} from 'lucide-react';

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

interface InsuranceApplicationDetailProps {
  application: InsuranceApplication;
  onClose: () => void;
}

const InsuranceApplicationDetail: React.FC<InsuranceApplicationDetailProps> = ({ 
  application, 
  onClose 
}) => {
  const getInsuranceIcon = (type: string) => {
    switch (type) {
      case 'motor': return <Car className="h-5 w-5 text-gray-400" />;
      case 'life': return <Heart className="h-5 w-5 text-gray-400" />;
      case 'health': return <HealthIcon className="h-5 w-5 text-gray-400" />;
      default: return <Shield className="h-5 w-5 text-gray-400" />;
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
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
                <p className="text-sm text-gray-500">{application.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                {application.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Applicant Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{application.applicantName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{application.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{application.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">{new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {getInsuranceIcon(application.type)}
                <div>
                  <p className="text-sm text-gray-500">Insurance Type</p>
                  <p className="font-medium text-gray-900 capitalize">{application.type} Insurance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Premium</p>
                  <p className="font-medium text-gray-900">${application.premium.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Coverage</p>
                  <p className="font-medium text-gray-900">${application.coverage.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Type-specific Details */}
          {application.type === 'motor' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-medium text-gray-900">{application.vehicleType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium text-gray-900">{application.vehicleModel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{application.vehicleYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Registration</p>
                    <p className="font-medium text-gray-900">{application.registrationNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {application.type === 'life' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Insurance Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Sum Assured</p>
                    <p className="font-medium text-gray-900">${application.sumAssured?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Policy Term</p>
                    <p className="font-medium text-gray-900">{application.policyTerm} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Frequency</p>
                    <p className="font-medium text-gray-900">{application.paymentFrequency}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {application.type === 'health' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Insurance Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Family Members</p>
                    <p className="font-medium text-gray-900">{application.familyMembers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Hospital Preference</p>
                    <p className="font-medium text-gray-900">{application.hospitalPreference}</p>
                  </div>
                </div>
                {application.preExistingConditions && application.preExistingConditions.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">Pre-existing Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {application.preExistingConditions.map((condition, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <CheckCircle size={16} />
              Approve
            </button>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <XCircle size={16} />
              Reject
            </button>
            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2">
              <Clock size={16} />
              Mark Under Review
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceApplicationDetail;