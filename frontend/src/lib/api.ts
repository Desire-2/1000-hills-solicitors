/**
 * API Service for 1000 Hills Solicitors
 * Handles all HTTP requests to the backend API
 */

import { User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  msg?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  /**
   * Set the authentication token
   */
  setToken(token: string) {
    console.log('[API] Setting token:', token ? `${token.substring(0, 20)}...` : 'null');
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (this.token) {
      console.log('[API] Adding Authorization header with token:', this.token.substring(0, 20) + '...');
      headers['Authorization'] = `Bearer ${this.token}`;
    } else {
      console.log('[API] No token available for request to:', endpoint);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.msg || data.message || 'An error occurred',
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // --- Auth Endpoints ---

  async register(email: string, password: string, name: string) {
    return this.post('/auth/register', { email, password, name });
  }

  async login(email: string, password: string) {
    console.log('[API] Logging in with email:', email);
    const response = await this.post<{ access_token: string }>('/auth/login', {
      email,
      password,
    });

    console.log('[API] Login response:', response);
    if (response.data?.access_token) {
      console.log('[API] Token received from login');
      this.setToken(response.data.access_token);
    } else {
      console.log('[API] No access_token in response!');
    }

    return response;
  }

  async logout() {
    this.clearToken();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }

  // --- Case Endpoints ---

  async getCases() {
    return this.get('/cases/');
  }

  async getCase(caseId: number) {
    return this.get(`/cases/${caseId}`);
  }

  async createCase(caseData: {
    title: string;
    description: string;
    category: string;
    priority?: string;
  }) {
    return this.post('/cases/', caseData);
  }

  async updateCase(caseId: number, updates: any) {
    return this.put(`/cases/admin/${caseId}`, updates);
  }

  async getAdminCases() {
    return this.get('/cases/admin');
  }

  async getAdminCase(caseId: number) {
    return this.get(`/cases/admin/${caseId}`);
  }

  async getServices() {
    return this.get('/cases/services');
  }

  async createService(serviceData: {
    name: string;
    description: string;
    category: string;
  }) {
    return this.post('/cases/admin/services', serviceData);
  }

  // --- User Endpoints ---

  async getUsers() {
    return this.get('/users');
  }
}

// Export a singleton instance
const apiService = new ApiService(API_URL);

export default apiService;
