/**
 * Production-Ready API Client with Authentication
 * Handles JWT tokens, error responses, and type safety
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiClientOptions {
  token?: string;
  headers?: HeadersInit;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<T> {
    const { token, headers: customHeaders, ...fetchOptions } = options;

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    // Add custom headers if provided
    if (customHeaders) {
      const headersToAdd = customHeaders instanceof Headers 
        ? Array.from(customHeaders.entries())
        : Object.entries(customHeaders as Record<string, string>);
      
      for (const [key, value] of headersToAdd) {
        headers.set(key, value);
      }
    }

    // Add authorization header if token provided
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new ApiError(
          response.status,
          error.message || 'API request failed',
          error
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error or server unavailable');
    }
  }

  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data: any,
    options?: ApiClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data: any,
    options?: ApiClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Typed API methods
export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiClient.post<{ access_token: string; user: any }>('/auth/login', {
        email,
        password,
      }),
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => apiClient.post('/auth/register', data),
  },

  diagnostics: {
    analyze: (patientId: string, symptoms: string, token: string) =>
      apiClient.post<any>(
        '/diagnostics/analyze',
        { patientId, clinicalNotes: symptoms },
        { token }
      ),
    getPatientReports: (patientId: string, token: string) =>
      apiClient.get<any[]>(`/diagnostics/patient/${patientId}`, { token }),
    getCriticalCases: (token: string) =>
      apiClient.get<any[]>('/diagnostics/critical/cases', { token }),
  },

  patients: {
    getAll: (token: string) => apiClient.get<any[]>('/patients', { token }),
    getById: (id: string, token: string) =>
      apiClient.get<any>(`/patients/${id}`, { token }),
    create: (data: any, token: string) =>
      apiClient.post<any>('/patients', data, { token }),
  },
};

