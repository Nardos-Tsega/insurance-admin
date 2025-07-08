import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Types
export interface User {
  id: number;
  phone_number: string;
  full_name: string;
  email?: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  is_phone_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phoneNumber: string, otpCode: string) => Promise<boolean>;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  hasPermission: (requiredRole: 'admin' | 'super_admin') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          Cookies.set('access_token', access_token, { expires: 7 }); // 7 days
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    const token = Cookies.get('access_token');
    
    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      }
    }
    
    setLoading(false);
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      console.log('Sending OTP to:', phoneNumber);
      
      const response = await api.post('/auth/send-otp', {
        phone_number: phoneNumber,
        purpose: 'login',
      });
      
      console.log('Send OTP response:', response.data);
      return true;
    } catch (error: any) {
      console.error('Send OTP failed:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        // Extract the actual error message from backend
        const errorMessage = error.response.data?.detail || 
                           error.response.data?.message || 
                           'Failed to send OTP';
        
        console.error('Backend error message:', errorMessage);
        
        // Throw specific error messages for different status codes
        if (error.response.status === 400) {
          throw new Error(errorMessage);
        } else if (error.response.status === 404) {
          throw new Error('User not found. Please check your phone number or contact admin.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      return false;
    }
  };

  const login = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/verify-otp', {
        phone_number: phoneNumber,
        code: otpCode,
      });

      // Debug: Log the entire response structure
      console.log('=== FULL LOGIN RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      console.log('Response data keys:', Object.keys(response.data));
      
      // Extract data from response
      const responseData = response.data;
      
      // Try different possible structures for user data
      let userData = null;
      let accessToken = null;
      let refreshToken = null;
      
      // Check for nested user object
      if (responseData.user) {
        userData = responseData.user;
        console.log('Found user in responseData.user:', userData);
      }
      // Check if user data is at root level
      else if (responseData.id && (responseData.role || responseData.user_role)) {
        userData = responseData;
        console.log('Found user at root level:', userData);
      }
      // Check for other possible structures
      else if (responseData.data && responseData.data.user) {
        userData = responseData.data.user;
        console.log('Found user in responseData.data.user:', userData);
      }
      // Check if it's nested under response
      else if (responseData.response && responseData.response.user) {
        userData = responseData.response.user;
        console.log('Found user in responseData.response.user:', userData);
      }
      else {
        console.log('Could not find user data in any expected location');
        console.log('Available keys in response:', Object.keys(responseData));
        
        // As a last resort, check if the whole response IS the user object
        if (responseData && typeof responseData === 'object') {
          // Look for any field that might contain role information
          const possibleRoleFields = ['role', 'user_role', 'userRole', 'Role'];
          const foundRoleField = possibleRoleFields.find(field => responseData[field]);
          
          if (foundRoleField) {
            userData = responseData;
            console.log('Treating entire response as user data with role field:', foundRoleField);
          }
        }
      }
      
      // Extract tokens from various possible locations
      accessToken = responseData.access_token || 
                   responseData.accessToken || 
                   responseData.token ||
                   responseData.access ||
                   (responseData.data && responseData.data.access_token) ||
                   (responseData.response && responseData.response.access_token);
      
      refreshToken = responseData.refresh_token || 
                    responseData.refreshToken ||
                    responseData.refresh ||
                    (responseData.data && responseData.data.refresh_token) ||
                    (responseData.response && responseData.response.refresh_token);
      
      console.log('Extracted accessToken:', accessToken ? 'Found' : 'Not found');
      console.log('Extracted refreshToken:', refreshToken ? 'Found' : 'Not found');
      console.log('Extracted userData:', userData);
      
      // Check if user data is valid
      if (!userData) {
        console.error('No user data found in response');
        console.error('Full response for debugging:', JSON.stringify(responseData, null, 2));
        throw new Error('No user data received from server.');
      }
      
      // Normalize role field (handle different possible role field names)
      const role = userData.role || userData.user_role || userData.userRole || userData.Role;
      
      if (!role) {
        console.error('No role found in user data:', userData);
        console.error('Checking for role fields: role, user_role, userRole, Role');
        console.error('Available user data keys:', Object.keys(userData));
        throw new Error('User role not found in server response.');
      }
      
      // Ensure the userData object has the role field in the expected format
      if (!userData.role && role) {
        userData.role = role;
        console.log('Normalized role field to userData.role:', role);
      }
      
      console.log('User role:', userData.role);

      // Check if user has admin permissions
      if (!['admin', 'super_admin'].includes(userData.role)) {
        throw new Error('Insufficient permissions. Admin access required.');
      }

      // Validate that we have tokens
      if (!accessToken) {
        throw new Error('No access token received from server.');
      }

      // Store tokens
      Cookies.set('access_token', accessToken, { expires: 7 });
      if (refreshToken) {
        Cookies.set('refresh_token', refreshToken, { expires: 30 });
      }

      console.log('Login successful, setting user:', userData);
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Log the full response for debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) return false;

      const response = await api.post('/auth/refresh-token', {
        refresh_token: refreshToken,
      });

      const { access_token } = response.data;
      Cookies.set('access_token', access_token, { expires: 7 });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.role === 'super_admin';
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === 'super_admin';
  };

  const hasPermission = (requiredRole: 'admin' | 'super_admin'): boolean => {
    if (!user) return false;
    
    if (requiredRole === 'admin') {
      return ['admin', 'super_admin'].includes(user.role);
    }
    
    if (requiredRole === 'super_admin') {
      return user.role === 'super_admin';
    }
    
    return false;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    sendOTP,
    logout,
    refreshToken,
    isAdmin,
    isSuperAdmin,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};