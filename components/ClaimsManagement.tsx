// src/components/claims/ClaimsManagement.tsx - Updated with Detail Page
import React, { useState, useEffect } from 'react';
import { claimsApi, Claim, ClaimStats } from '../services/claimsApi';
import ClaimDetailPage from './ClaimDetailPage'; // Import the new detail page
import { 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Settings,
  TrendingUp,
  Activity,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  User,
  Car,
  Shield,
  Building2,
  MapPin,
  Phone,
  Mail,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertTriangle,
  Info,
  Database
} from 'lucide-react';

/**
 * Main Claims Management Component
 * Integrated with FastAPI backend and matching admin panel UI style
 */
const ClaimsManagement: React.FC = () => {
  // State management
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<ClaimStats | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);
  const [showClaimDetail, setShowClaimDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedClaims, setSelectedClaims] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Utility functions for UI styling
  const getStatusColor = (status: string): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800', 
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      under_review: <Eye className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      completed: <Shield className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <AlertCircle className="h-4 w-4" />;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Data fetching functions
  const fetchClaims = async (): Promise<void> => {
    try {
      setError(null);
      const claimsData = await claimsApi.getAllClaims({
        skip: 0,
        limit: 100
      });
      setClaims(claimsData);
      console.log('✅ Claims fetched successfully:', claimsData.length);
    } catch (err) {
      console.error('❌ Error fetching claims:', err);
      setError('Failed to fetch claims. Please try again.');
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const statsData = await claimsApi.getClaimStats();
      setStats(statsData);
      console.log('✅ Stats fetched successfully:', statsData);
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
    }
  };

  const refreshData = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await Promise.all([fetchClaims(), fetchStats()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchClaims(), fetchStats()]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filter claims based on search and filters
  useEffect(() => {
    let filtered = [...claims];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(claim =>
        claim.id.toString().includes(searchLower) ||
        claim.car_brand.toLowerCase().includes(searchLower) ||
        claim.car_type.toLowerCase().includes(searchLower) ||
        claim.description?.toLowerCase().includes(searchLower) ||
        claim.admin_notes?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(claim => {
        const claimDate = new Date(claim.created_at);
        switch (dateFilter) {
          case 'today':
            return claimDate >= today;
          case 'week':
            return claimDate >= thisWeek;
          case 'month':
            return claimDate >= thisMonth;
          default:
            return true;
        }
      });
    }

    setFilteredClaims(filtered);
    setCurrentPage(1);
  }, [claims, searchTerm, statusFilter, dateFilter]);

  // Action handlers
  const handleStatusUpdate = async (claimId: number, newStatus: string, adminNotes?: string): Promise<void> => {
    setUpdating(claimId);
    try {
      const updatedClaim = await claimsApi.updateClaim(claimId, {
        status: newStatus,
        admin_notes: adminNotes
      });

      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? updatedClaim : claim
      ));

      console.log('✅ Claim status updated successfully');
    } catch (err) {
      console.error('❌ Error updating claim status:', err);
      setError('Failed to update claim status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  // NEW: Handle navigation to detail page
  const handleClaimSelect = (claimId: number): void => {
    setSelectedClaimId(claimId);
    setShowClaimDetail(true);
  };

  // NEW: Handle back navigation from detail page
  const handleBackFromDetail = (): void => {
    setShowClaimDetail(false);
    setSelectedClaimId(null);
    // Refresh data when coming back
    refreshData();
  };

  const handleDeleteClaim = async (claimId: number): Promise<void> => {
    try {
      await claimsApi.deleteClaim(claimId);
      
      setClaims(prev => prev.filter(claim => claim.id !== claimId));
      setSelectedClaims(prev => prev.filter(id => id !== claimId));

      console.log('✅ Claim deleted successfully');
    } catch (err) {
      console.error('❌ Error deleting claim:', err);
      setError('Failed to delete claim. Please try again.');
    }
  };

  const handleBulkDelete = async (): Promise<void> => {
    try {
      await Promise.all(selectedClaims.map(id => claimsApi.deleteClaim(id)));
      
      setClaims(prev => prev.filter(claim => !selectedClaims.includes(claim.id)));
      setSelectedClaims([]);
      setShowDeleteModal(false);

      console.log('✅ Bulk delete completed successfully');
    } catch (err) {
      console.error('❌ Error in bulk delete:', err);
      setError('Failed to delete some claims. Please try again.');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClaims = filteredClaims.slice(startIndex, endIndex);

  // If showing detail page, render that instead
  if (showClaimDetail && selectedClaimId) {
    return (
      <ClaimDetailPage 
        claimId={selectedClaimId} 
        onBack={handleBackFromDetail}
      />
    );
  }

  // Header Component JSX - matching admin panel style
  const renderHeader = (): React.ReactElement => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Claims Management</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Monitor and manage insurance claims</span>
              {stats && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {stats.total_claims} total claims
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );

  // Stats Cards Component JSX
  const renderStatsCards = (): React.ReactElement => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!stats) return <></>;

    const statsCards = [
      {
        title: "Total Claims",
        value: stats.total_claims,
        icon: FileText,
        color: "blue",
        trend: `+${Math.round((stats.total_claims / 100) * 12)}% from last month`,
        bgColor: "from-blue-400 to-blue-500"
      },
      {
        title: "Pending Review", 
        value: stats.pending_claims,
        icon: Clock,
        color: "orange",
        trend: "Needs attention",
        bgColor: "from-orange-400 to-orange-500"
      },
      {
        title: "Under Review",
        value: stats.under_review_claims || 0,
        icon: Eye,
        color: "purple", 
        trend: "In progress",
        bgColor: "from-purple-400 to-purple-500"
      },
      {
        title: "Approved",
        value: stats.approved_claims,
        icon: CheckCircle,
        color: "green",
        trend: `${stats.total_claims > 0 ? Math.round((stats.approved_claims / stats.total_claims) * 100) : 0}% approval rate`,
        bgColor: "from-green-400 to-green-500"
      },
      {
        title: "Completed",
        value: stats.completed_claims,
        icon: Activity,
        color: "emerald",
        trend: "Fully processed",
        bgColor: "from-emerald-400 to-emerald-500"
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mb-2">{card.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Search and Filters Component JSX
  const renderSearchAndFilters = (): React.ReactElement => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search claims by ID, brand, type, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-[150px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-[150px]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedClaims.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-medium text-sm">{selectedClaims.length}</span>
              </div>
              <span className="text-blue-900 font-medium">
                {selectedClaims.length} claim{selectedClaims.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedClaims([])}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear selection
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Claims Table Component JSX
  const renderClaimsTable = (): React.ReactElement => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Claims List ({filteredClaims.length})
            </h3>
            {filteredClaims.length !== claims.length && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Filtered from {claims.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={itemsPerPage}
              onChange={(e) => {
                console.log('Items per page:', e.target.value);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedClaims.length === currentClaims.length && currentClaims.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClaims(currentClaims.map(claim => claim.id));
                    } else {
                      setSelectedClaims([]);
                    }
                  }}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Claim Details</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Vehicle</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Images</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Created</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                {/* Checkbox */}
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedClaims.includes(claim.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClaims(prev => [...prev, claim.id]);
                      } else {
                        setSelectedClaims(prev => prev.filter(id => id !== claim.id));
                      }
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>

                {/* Claim Details */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">#{claim.id}</div>
                      <div className="text-sm text-gray-500">User ID: {claim.user_id}</div>
                      {claim.description && (
                        <div className="text-xs text-gray-400 max-w-xs truncate mt-1">
                          {claim.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Vehicle Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{claim.car_brand}</div>
                      <div className="text-sm text-gray-500 capitalize">{claim.car_type}</div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${getStatusColor(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      {claim.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {updating === claim.id && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Updating...
                      </div>
                    )}
                  </div>
                </td>

                {/* Images */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {(claim.images || []).slice(0, 3).map((image, imageIndex) => (
                        <div
                          key={image.id}
                          className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleClaimSelect(claim.id)}
                        >
                          <img
                            src={`http://192.168.0.7:8000${image.file_path}`}
                            alt={image.image_type}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                      {(claim.images || []).length > 3 && (
                        <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{(claim.images || []).length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {(claim.images || []).length} image{(claim.images || []).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(claim.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {formatDate(claim.updated_at)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleClaimSelect(claim.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <div className="relative group">
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Quick Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {/* Quick Actions Dropdown */}
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleStatusUpdate(claim.id, 'under_review')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Mark for Review
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(claim.id, 'approved')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(claim.id, 'rejected')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleDeleteClaim(claim.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredClaims.length)} of {filteredClaims.length} claims
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="px-4 py-2 text-sm font-medium text-gray-900">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Empty State Component
  const renderEmptyState = (): React.ReactElement => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No claims found</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
            ? "No claims match your current filters. Try adjusting your search criteria."
            : "No claims have been submitted yet. Claims will appear here once users start submitting them."
          }
        </p>
        
        {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('all');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const renderDeleteModal = (): React.ReactElement | null => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete {selectedClaims.length} claim{selectedClaims.length > 1 ? 's' : ''}? 
            All associated images and data will be permanently removed.
          </p>
          
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete {selectedClaims.length} Claim{selectedClaims.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading State Component
  const renderLoadingState = (): React.ReactElement => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Component Return
  if (loading) {
    return renderLoadingState();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {renderHeader()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Search and Filters */}
        {renderSearchAndFilters()}

        {/* Claims Table or Empty State */}
        {filteredClaims.length > 0 ? renderClaimsTable() : renderEmptyState()}
      </div>

      {/* Modals */}
      {renderDeleteModal()}
    </div>
  );
};

export default ClaimsManagement;