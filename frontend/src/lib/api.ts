/**
 * API Service for 1000 Hills Solicitors
 * Handles all HTTP requests to the backend API
 */

import { User, Appointment, AppointmentStats } from './types';

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
      'Accept': 'application/json',
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
      console.log(`[API] Making ${options.method || 'GET'} request to:`, `${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        mode: 'cors',
        credentials: 'include',
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[API] Non-JSON response:', text);
        data = { msg: text || 'Invalid response format' };
      }

      if (!response.ok) {
        console.error('[API] Request failed:', response.status, data);
        return {
          error: data.msg || data.message || `Request failed with status ${response.status}`,
        };
      }

      console.log('[API] Request successful:', endpoint);
      return { data };
    } catch (error) {
      console.error('[API] Request error:', error);
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

  async deleteCase(caseId: number) {
    return this.delete(`/cases/admin/${caseId}`);
  }

  async getAdminCases(status?: string) {
    const endpoint = status ? `/cases/admin?status=${status}` : '/cases/admin';
    return this.get(endpoint);
  }

  async getAdminCase(caseId: number) {
    return this.get(`/cases/admin/${caseId}`);
  }

  async getCaseStatistics() {
    return this.get('/cases/statistics');
  }

  async filterCases(filters: {
    status?: string;
    category?: string;
    priority?: string;
    assigned_to_id?: number;
  }) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assigned_to_id) params.append('assigned_to_id', filters.assigned_to_id.toString());
    
    return this.get(`/cases/admin/filter?${params.toString()}`);
  }

  async getAssignedCases(userId: number) {
    return this.get(`/cases/admin/assigned/${userId}`);
  }

  // --- Case Notes Endpoints ---

  async getCaseNotes(caseId: number) {
    return this.get(`/cases/${caseId}/notes/`);
  }

  async createCaseNote(caseId: number, noteData: {
    content: string;
    is_private?: boolean;
  }) {
    return this.post(`/cases/${caseId}/notes/`, noteData);
  }

  async updateCaseNote(caseId: number, noteId: number, noteData: {
    content?: string;
    is_private?: boolean;
  }) {
    return this.put(`/cases/${caseId}/notes/${noteId}`, noteData);
  }

  async deleteCaseNote(caseId: number, noteId: number) {
    return this.delete(`/cases/${caseId}/notes/${noteId}`);
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

  async getCaseManagers() {
    return this.get('/admin/case-managers');
  }

  // --- Message Endpoints ---

  async getCaseMessages(caseId: number) {
    return this.get(`/cases/${caseId}/messages`);
  }

  async sendMessage(caseId: number, messageData: {
    recipient_id: number;
    content: string;
  }) {
    return this.post(`/cases/${caseId}/messages`, messageData);
  }

  async markMessageRead(messageId: number) {
    return this.put(`/messages/${messageId}/read`, {});
  }

  async getMessages() {
    return this.get('/messages/');
  }

  async getAllMessages(params?: {
    case_id?: number;
    unread_only?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.case_id) query.append('case_id', params.case_id.toString());
    if (params?.unread_only) query.append('unread_only', 'true');
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    
    const endpoint = query.toString() ? `/messages/all?${query.toString()}` : '/messages/all';
    return this.get(endpoint);
  }

  async getUnreadCount() {
    return this.get('/messages/unread-count');
  }

  async getConversations() {
    return this.get('/messages/conversations');
  }

  // --- Document Endpoints ---

  async uploadDocument(formData: FormData) {
    // Override headers for file upload
    const headers: Record<string, string> = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.msg || data.message || 'Upload failed',
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getDocuments(caseId?: number) {
    const endpoint = caseId ? `/documents/?case_id=${caseId}` : '/documents/';
    return this.get(endpoint);
  }

  async deleteDocument(documentId: number) {
    return this.delete(`/documents/${documentId}`);
  }

  async downloadDocument(documentId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/documents/${documentId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      return response.blob();
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  // --- Appointment Endpoints ---

  async getAppointments(params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.start_date) query.append('start_date', params.start_date);
    if (params?.end_date) query.append('end_date', params.end_date);
    
    const endpoint = query.toString() ? `/api/appointments?${query.toString()}` : '/api/appointments';
    // Explicitly type the response so callers can access `data.appointments`
    return this.get<{ appointments: Appointment[] }>(endpoint);
  }

  async getAppointment(appointmentId: number) {
    return this.get(`/api/appointments/${appointmentId}`);
  }

  async createAppointment(appointmentData: {
    title: string;
    description?: string;
    start_datetime: string;
    end_datetime: string;
    appointment_type: 'video' | 'in_person' | 'phone';
    location?: string;
    attorney_id: number;
    client_id?: number;
    case_id?: number;
    notes?: string;
    client_phone?: string;
  }) {
    return this.post('/api/appointments', appointmentData);
  }

  async updateAppointment(appointmentId: number, updates: {
    title?: string;
    description?: string;
    start_datetime?: string;
    end_datetime?: string;
    appointment_type?: 'video' | 'in_person' | 'phone';
    location?: string;
    status?: string;
    attorney_id?: number;
    notes?: string;
    client_phone?: string;
  }) {
    return this.put(`/api/appointments/${appointmentId}`, updates);
  }

  async deleteAppointment(appointmentId: number) {
    return this.delete(`/api/appointments/${appointmentId}`);
  }

  async cancelAppointment(appointmentId: number) {
    return this.post(`/api/appointments/${appointmentId}/cancel`, {});
  }

  async getAppointmentStats() {
    return this.get<AppointmentStats>('/api/appointments/stats');
  }

  async getAvailableAttorneys() {
    return this.get<{ attorneys: User[] }>('/api/appointments/attorneys');
  }

  async regenerateMeetingLink(appointmentId: number) {
    return this.post(`/api/appointments/${appointmentId}/regenerate-link`, {});
  }

  // --- Health Check ---

  async healthCheck() {
    return this.get('/health');
  }

  // --- Debug Method ---
  
  getRequestInfo() {
    return {
      baseUrl: this.baseUrl,
      hasToken: !!this.token,
      tokenPreview: this.token ? this.token.substring(0, 20) + '...' : 'No token',
    };
  }
}

// Export a singleton instance
const apiService = new ApiService(API_URL);

export default apiService;
