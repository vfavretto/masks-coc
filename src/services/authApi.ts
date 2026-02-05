import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'keeper' | 'player';
  characterId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'keeper' | 'player';
  characterId?: string;
}

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await authApi.post<User>('/register', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await authApi.get<User>('/me');
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await authApi.get<User[]>('/users');
    return response.data;
  },
};
