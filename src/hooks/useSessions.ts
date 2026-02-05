import { useState, useEffect, useCallback } from 'react';
import { sessionAPI } from '@/services/api';
import { Session, SessionFormData, Clue, Item } from '@/types';

const INITIAL_FORM_DATA: SessionFormData = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  summary: '',
  details: '',
  tags: [],
  images: [],
  clues: [],
  items: []
};

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isSlowOperation, setIsSlowOperation] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'clues' | 'items'>('notes');
  const [formData, setFormData] = useState<SessionFormData>(INITIAL_FORM_DATA);
  const [imageModal, setImageModal] = useState<{ src: string; alt: string } | null>(null);

  // Fetch sessions from API
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.getAll();
      const sessionsData = Array.isArray(response.data) ? response.data : [];
      setSessions(sessionsData);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? session.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(sessions.flatMap((session) => session.tags)));

  // Form handlers
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setEditingSession(null);
    setActiveTab('notes');
  }, []);

  const handleCreateNew = useCallback(() => {
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleEdit = useCallback((session: Session) => {
    setEditingSession(session);
    
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      title: session.title,
      date: formatDateForInput(session.date),
      location: session.location,
      summary: session.summary,
      details: session.details,
      tags: session.tags,
      images: session.images,
      clues: session.clues,
      items: session.items
    });
    setShowModal(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Clean IDs before sending
      const cleanFormData = {
        ...formData,
        clues: formData.clues.map(({ id, ...clue }) => clue),
        items: formData.items.map(({ id, ...item }) => item)
      };
      
      if (editingSession) {
        await sessionAPI.update(editingSession.id, cleanFormData);
      } else {
        await sessionAPI.create(cleanFormData);
      }
      
      await fetchSessions();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving session:', err);
      setError('Failed to save session');
    } finally {
      setLoading(false);
    }
  }, [editingSession, formData, fetchSessions, resetForm]);

  const handleDelete = useCallback(async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setLoading(true);
        setError(null);
        
        const slowOperationTimer = setTimeout(() => {
          setIsSlowOperation(true);
        }, 10000);
        
        await sessionAPI.delete(id);
        clearTimeout(slowOperationTimer);
        setIsSlowOperation(false);
        
        await fetchSessions();
      } catch (err) {
        console.error('Error deleting session:', err);
        const isTimeout = (err as any).code === 'ECONNABORTED';
        const errorMessage = isTimeout 
          ? 'The server is starting up. Please try again in a moment.'
          : 'Failed to delete session';
        setError(errorMessage);
      } finally {
        setLoading(false);
        setIsSlowOperation(false);
      }
    }
  }, [fetchSessions]);

  // Tag management
  const addTag = useCallback((tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  }, [formData.tags]);

  const removeTag = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);

  // Form field update helpers
  const updateFormField = useCallback(<K extends keyof SessionFormData>(
    field: K, 
    value: SessionFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Clue management
  const addClue = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      clues: [...prev.clues, { 
        id: crypto.randomUUID(), 
        name: '', 
        description: '', 
        type: 'evidence',
        image: '',
        tag: '',
        location: ''
      }]
    }));
  }, []);

  const updateClue = useCallback((index: number, field: keyof Clue, value: string) => {
    setFormData(prev => {
      const newClues = [...prev.clues];
      newClues[index] = { ...newClues[index], [field]: value };
      return { ...prev, clues: newClues };
    });
  }, []);

  const removeClue = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      clues: prev.clues.filter((_, i) => i !== index)
    }));
  }, []);

  // Item management
  const addItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        id: crypto.randomUUID(), 
        name: '', 
        description: '', 
        type: 'tool'
      }]
    }));
  }, []);

  const updateItem = useCallback((index: number, field: keyof Item, value: string) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, []);

  return {
    // State
    sessions,
    filteredSessions,
    loading,
    error,
    searchTerm,
    selectedTag,
    expandedSession,
    showModal,
    editingSession,
    isSlowOperation,
    activeTab,
    formData,
    allTags,
    imageModal,
    
    // Setters
    setSearchTerm,
    setSelectedTag,
    setExpandedSession,
    setShowModal,
    setError,
    setActiveTab,
    setImageModal,
    
    // Actions
    fetchSessions,
    handleCreateNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    
    // Form actions
    updateFormField,
    addTag,
    removeTag,
    addClue,
    updateClue,
    removeClue,
    addItem,
    updateItem,
    removeItem,
  };
}

// Helper function for item icons
export const getItemIcon = (type: string): string => {
  switch (type) {
    case 'document': return '📜';
    case 'evidence': return '🔍';
    case 'key': return '🗝️';
    case 'book': return '📚';
    case 'weapon': return '🗡️';
    case 'tool': return '🔧';
    case 'artifact': return '🏺';
    case 'witness': return '👁️';
    case 'location': return '📍';
    default: return '📦';
  }
};
