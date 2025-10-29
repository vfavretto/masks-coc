import axios from 'axios';
import { CharacterFormData, SessionFormData } from '../types';

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
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Aumentar para 60 segundos (suficiente para cold start do Render)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Não enviar cookies (não necessário para esta aplicação)
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.response?.status, error.response?.data);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
    }
    
    // Retry automático para cold starts (timeout ou erro 502/503)
    const isTimeoutError = error.code === 'ECONNABORTED';
    const isServerError = error.response?.status >= 502 && error.response?.status <= 504;
    const shouldRetry = isTimeoutError || isServerError;
    
    if (shouldRetry && !error.config._retry) {
      if (import.meta.env.DEV) {
        console.log('🔄 API Cold start detected, retrying in 5 seconds...');
      }
      error.config._retry = true;
      
      // Aguardar 5 segundos antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return apiClient(error.config);
    }
    
    return Promise.reject(error);
  }
);

// Character API methods
export const characterAPI = {
  getAll: () => apiClient.get('/characters'),
  getById: (id: string) => apiClient.get(`/characters/${id}`),
  create: (data: CharacterFormData) => apiClient.post('/characters', data),
  update: (id: string, data: Partial<CharacterFormData>) => apiClient.put(`/characters/${id}`, data),
  delete: (id: string) => apiClient.delete(`/characters/${id}`)
};

// Session API methods
export const sessionAPI = {
  getAll: () => apiClient.get('/sessions'),
  getById: (id: string) => apiClient.get(`/sessions/${id}`),
  search: (query: string) => apiClient.get(`/sessions/search?q=${query}`),
  getByTags: (tags: string[]) => apiClient.get(`/sessions/tags?tags=${tags.join(',')}`),
  create: (data: SessionFormData) => apiClient.post('/sessions', data),
  update: (id: string, data: Partial<SessionFormData>) => apiClient.put(`/sessions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/sessions/${id}`)
};

// Função para "acordar" o backend (warm-up)
export const warmUpServer = async () => {
  try {
    if (import.meta.env.DEV) {
      console.log('🌡️ Warming up server...');
    }
    await apiClient.get('/health');
    if (import.meta.env.DEV) {
      console.log('✅ Server is warm');
    }
    return true;
  } catch {
    if (import.meta.env.DEV) {
      console.log('❄️ Server is cold, will take longer...');
    }
    return false;
  }
};

export default apiClient; 