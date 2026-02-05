import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'keeper' | 'player';
  characterId?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  settings?: {
    emailNotifications: boolean;
    theme: 'dark' | 'light';
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  visibility: 'private' | 'public';
  tags: string[];
  linkedSessionId?: string;
  linkedCharacterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  type: 'session' | 'reminder' | 'milestone' | 'other';
  createdBy: string;
  visibility: 'private' | 'public';
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// API instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profile API
export const ProfileAPI = {
  getMyProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get('/profile/me');
    return data;
  },
  
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await api.put('/profile/me', profile);
    return data;
  },
  
  getPublicProfile: async (userId: string): Promise<UserProfile> => {
    const { data } = await api.get(`/profile/${userId}`);
    return data;
  },
};

// Notes API
export const NotesAPI = {
  getMyNotes: async (): Promise<Note[]> => {
    const { data } = await api.get('/notes');
    return data;
  },
  
  getPublicNotes: async (): Promise<Note[]> => {
    const { data } = await api.get('/notes/public');
    return data;
  },
  
  createNote: async (note: Partial<Note>): Promise<Note> => {
    const { data } = await api.post('/notes', note);
    return data;
  },
  
  updateNote: async (id: string, note: Partial<Note>): Promise<Note> => {
    const { data } = await api.put(`/notes/${id}`, note);
    return data;
  },
  
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

// Events API
export const EventsAPI = {
  getAllEvents: async (mine?: boolean): Promise<CalendarEvent[]> => {
    const { data } = await api.get('/events', { params: { mine } });
    return data;
  },
  
  createEvent: async (event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const { data } = await api.post('/events', event);
    return data;
  },
  
  updateEvent: async (id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const { data } = await api.put(`/events/${id}`, event);
    return data;
  },
  
  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};
