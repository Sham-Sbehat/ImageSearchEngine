import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = 'https://api.unsplash.com';

// Token management class
class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;

  private constructor() {
    // Initialize token from localStorage
    this.token = localStorage.getItem('authToken');
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  public getToken(): string | null {
    return this.token;
  }

  public removeToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Adds token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('🔄 Request Interceptor - Adding token to request');
    
    const tokenManager = TokenManager.getInstance();
    const token = tokenManager.getToken();

    // Add token to headers if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token available for request');
    }

    // Add custom headers for demonstration
    config.headers['X-Request-ID'] = Date.now().toString();
    config.headers['X-Client-Version'] = '1.0.0';

    console.log('📤 Request URL:', config.url);
    console.log('📤 Request Method:', config.method?.toUpperCase());
    console.log('📤 Request Headers:', config.headers);

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handles responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Response Interceptor - Success');
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response URL:', response.config.url);
    
    return response;
  },
  async (error: AxiosError) => {
    console.log('❌ Response Interceptor - Error');
    console.log('📥 Error Status:', error.response?.status);
    console.log('📥 Error URL:', error.config?.url);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Token expired, attempting refresh...');
      originalRequest._retry = true;
      
      const tokenManager = TokenManager.getInstance();
      
      try {
        // Try to refresh token (implement your refresh logic here)
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('🔄 Attempting token refresh...');
          
          // This would be your actual refresh endpoint
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const newToken = refreshResponse.data.accessToken;
          tokenManager.setToken(newToken);
          
          console.log('✅ Token refreshed successfully');
          
          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log('❌ Token refresh failed, redirecting to login');
        // Refresh failed, redirect to login
        tokenManager.removeToken();
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.log('🚫 Access forbidden');
    } else if (error.response?.status === 404) {
      console.log('🔍 Resource not found');
    } else if (error.response?.status && error.response.status >= 500) {
      console.log('🔥 Server error');
    }

    return Promise.reject(error);
  }
);

// Export the configured api instance and token manager
export { api, TokenManager };

// Export axios types for convenience
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig }; 