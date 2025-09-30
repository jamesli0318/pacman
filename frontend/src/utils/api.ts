import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthTokens, LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const tokens = this.getTokens();
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const tokens = this.getTokens();
          if (tokens?.refresh) {
            try {
              const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
                refresh: tokens.refresh,
              });

              const newTokens = {
                access: response.data.access,
                refresh: tokens.refresh,
              };

              this.setTokens(newTokens);
              originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

              return this.api(originalRequest);
            } catch (refreshError) {
              this.clearTokens();
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getTokens(): AuthTokens | null {
    const tokensStr = localStorage.getItem('authTokens');
    return tokensStr ? JSON.parse(tokensStr) : null;
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('authTokens', JSON.stringify(tokens));
  }

  private clearTokens(): void {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
  }

  // Authentication endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/auth/register/', data);
    this.setTokens(response.data.tokens);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/auth/login/', credentials);
    this.setTokens(response.data.tokens);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async logout(): Promise<void> {
    const tokens = this.getTokens();
    if (tokens?.refresh) {
      try {
        await this.api.post('/api/auth/logout/', {
          refresh_token: tokens.refresh,
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearTokens();
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/api/auth/profile/');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!tokens?.access;
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
export default apiService;