// src/services/claimsApi.ts - Updated to match backend structure

// Updated types to match your FastAPI backend
export interface Claim {
  id: number;
  user_id: number;
  car_brand: string;
  car_type: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
  description?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  images: ClaimImage[];
  
  // Additional fields from backend
  claim_number?: string;
  claim_type?: string;
  claimant_role?: string;
  policy_holder_name?: string;
  policy_holder_phone?: string;
  policy_holder_email?: string;
  policy_number?: string;
  policy_holder_relationship?: string;
  vehicle_plate?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_color?: string;
  vehicle_chassis?: string;
  vehicle_odometer?: number;
  incident_date?: string;
  incident_time?: string;
  incident_location_data?: any;
  has_injuries?: boolean;
  injury_description?: string;
  police_report_filed?: boolean;
  police_report_number?: string;
  has_witnesses?: boolean;
  witness_details?: string;
  third_party_involved?: boolean;
  third_party_data?: any;
  repair_data?: any;
  estimated_cost?: number;
  last_status_update?: string;
  device_info?: any;
  location_data?: any;
  incident_timestamp?: string;
}

export interface ClaimImage {
  id: number;
  claim_id: number;
  image_type: 'front' | 'rear' | 'left' | 'right' | 'damage' | string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface ClaimStats {
  total_claims: number;
  pending_claims: number;
  under_review_claims?: number;
  approved_claims: number;
  rejected_claims: number;
  completed_claims: number;
}

// API Client for backend integration - NO AUTH FOR TESTING
class ClaimsApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' 
      ? 'http://192.168.0.7:8000' 
      : 'https://your-production-api.com';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 API Request:', options.method || 'GET', url);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        // REMOVED: 'Authorization': `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
    });

    console.log('📡 Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success Response Data Keys:', Object.keys(data));
    
    // Log first item if it's an array to see structure
    if (Array.isArray(data) && data.length > 0) {
      console.log('📋 First item structure:', Object.keys(data[0]));
    }
    
    return data;
  }

  // Admin Claims API methods
  async getAllClaims(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    user_id?: number;
  }): Promise<Claim[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user_id !== undefined) queryParams.append('user_id', params.user_id.toString());

    const query = queryParams.toString();
    
    try {
      const response = await this.makeRequest<Claim[]>(`/api/v1/admin/claims${query ? `?${query}` : ''}`);
      
      // Ensure images array exists for each claim
      return response.map(claim => ({
        ...claim,
        images: claim.images || []
      }));
    } catch (error) {
      console.error('❌ Error in getAllClaims:', error);
      throw error;
    }
  }

  async getClaimById(claimId: number): Promise<Claim> {
    try {
      const response = await this.makeRequest<Claim>(`/api/v1/admin/claims/${claimId}`);
      
      // Ensure images array exists
      return {
        ...response,
        images: response.images || []
      };
    } catch (error) {
      console.error('❌ Error in getClaimById:', error);
      throw error;
    }
  }

  async updateClaim(claimId: number, data: {
    status?: string;
    admin_notes?: string;
    car_brand?: string;
    car_type?: string;
    description?: string;
    estimated_cost?: number;
  }): Promise<Claim> {
    try {
      const response = await this.makeRequest<Claim>(`/api/v1/admin/claims/${claimId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // Ensure images array exists
      return {
        ...response,
        images: response.images || []
      };
    } catch (error) {
      console.error('❌ Error in updateClaim:', error);
      throw error;
    }
  }

  async getClaimStats(): Promise<ClaimStats> {
    try {
      const response = await this.makeRequest<ClaimStats>('/api/v1/admin/claims/stats');
      
      // Ensure all required fields exist with defaults
      return {
        total_claims: response.total_claims || 0,
        pending_claims: response.pending_claims || 0,
        under_review_claims: response.under_review_claims || 0,
        approved_claims: response.approved_claims || 0,
        rejected_claims: response.rejected_claims || 0,
        completed_claims: response.completed_claims || 0
      };
    } catch (error) {
      console.error('❌ Error in getClaimStats:', error);
      throw error;
    }
  }

  async getClaimImage(claimId: number, imageId: number): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/v1/admin/claims/${claimId}/images/${imageId}`,
        {
          // REMOVED: Authorization header for testing
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      // Check if response is JSON (error info) or actual image
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Backend returned image info as JSON
        const imageInfo = await response.json();
        console.log('📷 Image info received:', imageInfo);
        
        // For development, we might not have actual files, so return a placeholder
        // or construct the image URL from the file_path
        if (imageInfo.file_path) {
          return `${this.baseURL}${imageInfo.file_path}`;
        }
        
        // Return a placeholder image if no file path
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
      } else {
        // Actual image blob
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('❌ Error fetching image:', error);
      // Return placeholder on error
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
    }
  }

  async deleteClaim(claimId: number): Promise<void> {
    try {
      await this.makeRequest(`/api/v1/admin/claims/${claimId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('❌ Error in deleteClaim:', error);
      throw error;
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      console.log('🔗 Backend connection test:', data);
      return response.ok;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  }
}

export const claimsApi = new ClaimsApiClient();

// Test the connection when the module loads (development only)
if (process.env.NODE_ENV === 'development') {
  claimsApi.testConnection().then(isConnected => {
    if (isConnected) {
      console.log('✅ Backend connection established');
    } else {
      console.warn('⚠️ Backend connection failed - check if server is running');
    }
  });
}