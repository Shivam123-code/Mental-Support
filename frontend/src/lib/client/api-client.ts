// Centralized API Client with automatic token management
// All API requests should go through this client

const API_BASE = '/api';

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add Authorization header if token exists and not skipped
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// ============================================
// Authentication API
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'PROFESSIONAL' | 'ENTERPRISE';
}

export interface AuthResponse {
  user: any;
  token: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    }),

  register: (data: RegisterData) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  me: () => apiRequest('/auth/me'),
};

// ============================================
// Assessment API
// ============================================

export interface AssessmentSubmission {
  assessmentType: string;
  answers: Record<string, any>;
}

export const assessmentApi = {
  list: () => apiRequest('/assessments'),

  submit: (data: AssessmentSubmission) =>
    apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// Program API
// ============================================

export interface ProgramEnrollment {
  programType: string;
}

export const programApi = {
  list: () => apiRequest('/programs'),

  enroll: (data: ProgramEnrollment) =>
    apiRequest('/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// Mood API
// ============================================

export interface MoodLog {
  mood: string;
  intensity: number;
  notes?: string;
  triggers?: string[];
  activities?: string[];
}

export const moodApi = {
  list: (days = 30) => apiRequest(`/mood?days=${days}`),

  log: (data: MoodLog) =>
    apiRequest('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// Journal API
// ============================================

export interface JournalEntry {
  title?: string;
  content: string;
  mood?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export const journalApi = {
  list: (limit = 20, offset = 0) =>
    apiRequest(`/journal?limit=${limit}&offset=${offset}`),

  create: (data: JournalEntry) =>
    apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// Admin API
// ============================================

export interface AdminActionData {
  action: string;
  targetId: string;
  updateValue?: any;
}

export const adminApi = {
  getDashboardData: () => apiRequest('/admin/dashboard'),
  executeAction: (data: AdminActionData) =>
    apiRequest('/admin/dashboard', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// Unified API Export
// ============================================

export const api = {
  auth: authApi,
  assessments: assessmentApi,
  programs: programApi,
  mood: moodApi,
  journal: journalApi,
  admin: adminApi,
};

export default api;
