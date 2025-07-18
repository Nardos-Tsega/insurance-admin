// services/claimsService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AI_ENDPOINT = 'https://gashudemman-car-parts-damage-detection.hf.space/assess-damage';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types for API responses
interface ClaimResponse {
  id: number;
  claim_number: string;
  user_id: number;
  claim_type: string;
  damage_type: string;
  description: string;
  incident_date: string;
  incident_location: string;
  status: string;
  submitted_at: string;
  ai_analysis_status: string;
  ai_confidence_score?: number;
  ai_estimated_cost?: number;
  ai_damage_assessment?: any;
  ai_analyzed_at?: string;
  assigned_admin_id?: number;
  admin_notes?: string;
  reviewed_at?: string;
  approved_amount?: number;
  rejection_reason?: string;
  approved_by_id?: number;
  decision_date?: string;
  created_at: string;
  updated_at: string;
  images: ClaimImageResponse[];
  documents: ClaimDocumentResponse[];
}

interface ClaimImageResponse {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  image_type: string;
  description?: string;
  ai_analysis?: any;
  ai_damage_detected: boolean;
  ai_confidence?: number;
  uploaded_at: string;
}

interface ClaimDocumentResponse {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  document_type: string;
  description?: string;
  uploaded_at: string;
}

interface ClaimListResponse {
  claims: ClaimResponse[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface ClaimFilters {
  status?: string;
  claim_type?: string;
  damage_type?: string;
  date_from?: string;
  date_to?: string;
  assigned_admin_id?: number;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  per_page?: number;
  search?: string;
}

interface StatusUpdateRequest {
  status: string;
  notes?: string;
  approved_amount?: number;
  rejection_reason?: string;
}

interface AIAnalysisRequest {
  front_image?: File;
  rear_image?: File;
  left_image?: File;
  right_image?: File;
  car_brand: string;
  car_type: string;
}

class ClaimsService {
  // Get all claims with filtering and pagination
  async getClaims(filters: ClaimFilters = {}): Promise<ClaimListResponse> {
    try {
      const response = await api.get('/claims', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching claims:', error);
      throw error;
    }
  }

  // Get a specific claim by ID
  async getClaim(id: number): Promise<ClaimResponse> {
    try {
      const response = await api.get(`/claims/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching claim:', error);
      throw error;
    }
  }

  // Update claim status
  async updateClaimStatus(id: number, statusUpdate: StatusUpdateRequest): Promise<ClaimResponse> {
    try {
      const response = await api.put(`/claims/${id}/status`, statusUpdate);
      return response.data;
    } catch (error) {
      console.error('Error updating claim status:', error);
      throw error;
    }
  }

  // Add admin notes to a claim
  async addAdminNotes(id: number, notes: string): Promise<ClaimResponse> {
    try {
      const response = await api.patch(`/claims/${id}`, { admin_notes: notes });
      return response.data;
    } catch (error) {
      console.error('Error adding admin notes:', error);
      throw error;
    }
  }

  // Approve a claim
  async approveClaim(id: number, approvedAmount: number, notes?: string): Promise<ClaimResponse> {
    try {
      const response = await api.post(`/claims/${id}/approve`, {
        approved_amount: approvedAmount,
        admin_notes: notes
      });
      return response.data;
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  }

  // Reject a claim
  async rejectClaim(id: number, rejectionReason: string, notes?: string): Promise<ClaimResponse> {
    try {
      const response = await api.post(`/claims/${id}/reject`, {
        rejection_reason: rejectionReason,
        admin_notes: notes
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    }
  }

  // Trigger AI re-analysis for a claim
  async reanalyzeClaimAI(id: number): Promise<ClaimResponse> {
    try {
      const response = await api.post(`/claims/${id}/reanalyze`);
      return response.data;
    } catch (error) {
      console.error('Error triggering AI re-analysis:', error);
      throw error;
    }
  }

  // Get claim statistics for dashboard
  async getClaimStats(): Promise<any> {
    try {
      const response = await api.get('/claims/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching claim stats:', error);
      throw error;
    }
  }

  // Export claims data
  async exportClaims(filters: ClaimFilters = {}): Promise<Blob> {
    try {
      const response = await api.get('/claims/export', { 
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting claims:', error);
      throw error;
    }
  }

  // Get claim status history
  async getClaimStatusHistory(id: number): Promise<any[]> {
    try {
      const response = await api.get(`/claims/${id}/status-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching claim status history:', error);
      throw error;
    }
  }

  // Upload additional images to a claim
  async uploadClaimImages(id: number, images: File[]): Promise<ClaimImageResponse[]> {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await api.post(`/claims/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading claim images:', error);
      throw error;
    }
  }

  // Delete a claim image
  async deleteClaimImage(claimId: number, imageId: number): Promise<void> {
    try {
      await api.delete(`/claims/${claimId}/images/${imageId}`);
    } catch (error) {
      console.error('Error deleting claim image:', error);
      throw error;
    }
  }

  // Call external AI service directly (for testing/debugging)
  async callAIService(analysisRequest: AIAnalysisRequest): Promise<any> {
    try {
      const formData = new FormData();
      
      if (analysisRequest.front_image) {
        formData.append('front_image', analysisRequest.front_image);
      }
      if (analysisRequest.rear_image) {
        formData.append('rear_image', analysisRequest.rear_image);
      }
      if (analysisRequest.left_image) {
        formData.append('left_image', analysisRequest.left_image);
      }
      if (analysisRequest.right_image) {
        formData.append('right_image', analysisRequest.right_image);
      }
      
      formData.append('car_brand', analysisRequest.car_brand);
      formData.append('car_type', analysisRequest.car_type);

      const response = await axios.post(AI_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
      });

      return response.data;
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw error;
    }
  }

  // Get image URL for display
  getImageUrl(filePath: string): string {
    if (filePath.startsWith('http')) {
      return filePath;
    }
    return `${API_BASE_URL}${filePath}`;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get status color class
  getStatusColor(status: string): string {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'ai_analyzed': return 'bg-purple-100 text-purple-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'payment_pending': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Get damage type color class
  getDamageTypeColor(type: string): string {
    switch (type) {
      case 'collision': return 'bg-red-100 text-red-800';
      case 'theft': return 'bg-purple-100 text-purple-800';
      case 'fire': return 'bg-orange-100 text-orange-800';
      case 'flood': return 'bg-blue-100 text-blue-800';
      case 'vandalism': return 'bg-pink-100 text-pink-800';
      case 'natural_disaster': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Validate claim data
  validateClaimData(claimData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!claimData.claim_type) {
      errors.push('Claim type is required');
    }

    if (!claimData.damage_type) {
      errors.push('Damage type is required');
    }

    if (!claimData.description || claimData.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!claimData.incident_date) {
      errors.push('Incident date is required');
    }

    if (!claimData.incident_location || claimData.incident_location.length < 5) {
      errors.push('Incident location must be at least 5 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if status transition is valid
  isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      'submitted': ['processing', 'rejected'],
      'processing': ['ai_analyzed', 'under_review', 'rejected'],
      'ai_analyzed': ['under_review', 'approved', 'rejected'],
      'under_review': ['approved', 'rejected', 'processing'],
      'approved': ['payment_pending', 'completed'],
      'rejected': ['under_review'],
      'payment_pending': ['completed'],
      'completed': []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // Generate claim number
  generateClaimNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `CLM-${year}${month}${day}-${random}`;
  }
}

// Export singleton instance
export const claimsService = new ClaimsService();
export default claimsService;