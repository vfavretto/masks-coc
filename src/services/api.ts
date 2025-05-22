import axios from 'axios';

// Configuração automática da URL da API baseada no ambiente
const getApiBaseUrl = () => {
  // Se VITE_API_URL está definida, use ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Se estamos em produção (GitHub Pages), use o Render
  if (import.meta.env.PROD) {
    return 'https://masks-coc-backend.onrender.com/api';
  }
  
  // Caso contrário, use localhost para desenvolvimento
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🌐 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Character API methods
export const characterAPI = {
  getAll: () => apiClient.get('/characters'),
  getById: (id: string) => apiClient.get(`/characters/${id}`),
  create: (data: any) => apiClient.post('/characters', data),
  update: (id: string, data: any) => apiClient.put(`/characters/${id}`, data),
  delete: (id: string) => apiClient.delete(`/characters/${id}`)
};

// Session API methods
export const sessionAPI = {
  getAll: () => apiClient.get('/sessions'),
  getById: (id: string) => apiClient.get(`/sessions/${id}`),
  search: (query: string) => apiClient.get(`/sessions/search?q=${query}`),
  getByTags: (tags: string[]) => apiClient.get(`/sessions/tags?tags=${tags.join(',')}`),
  create: (data: any) => apiClient.post('/sessions', data),
  update: (id: string, data: any) => apiClient.put(`/sessions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/sessions/${id}`)
};

export default apiClient; 