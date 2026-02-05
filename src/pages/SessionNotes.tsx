<<<<<<< HEAD
import { Scroll, Search, Plus, ChevronDown } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { SessionCard, SessionForm } from '@/features/sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import ImageModal from '@/components/ImageModal';
import { testBackendConnection, testCORS } from '@/utils/testConnection';

const SessionNotes = () => {
  const {
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
=======
import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Tag, 
  Scroll, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  Skull, 
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  FileText,
  Search as SearchIcon,
  Package
} from 'lucide-react';
import { sessionAPI } from '../services/api';
import { Session, SessionFormData } from '../types';
import { testBackendConnection, testCORS } from '../utils/testConnection';
import MarkdownEditor from '../components/MarkdownEditor';
import ImageModal from '../components/ImageModal';

const SessionNotes = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSlowOperation, setIsSlowOperation] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'clues' | 'items'>('notes');
  const [imageModal, setImageModal] = useState<{ src: string; alt: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    summary: '',
    details: '',
    tags: [],
    images: [],
    clues: [],
    items: []
  });

  // Fetch sessions from API
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.getAll();
      
      console.log('📦 Sessions API Response:', response);
      console.log('📋 Sessions Data:', response.data);
      
      // Validar se response.data é um array
      const sessionsData = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Sessions Array:', sessionsData);
      
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
      setSessions([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Ensure sessions is always an array and memoize filtered results
  const safeSessions = useMemo(() => Array.isArray(sessions) ? sessions : [], [sessions]);

  // Filter sessions - memoized for performance
  const filteredSessions = useMemo(() => {
    return safeSessions.filter((session) => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? session.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [safeSessions, searchTerm, selectedTag]);

  // Get all unique tags - memoized for performance
  const allTags = useMemo(() => {
    return Array.from(new Set(safeSessions.flatMap((session) => session.tags)));
  }, [safeSessions]);

  // Helper function for item icons
  const getItemIcon = (type: string) => {
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

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      summary: '',
      details: '',
      tags: [],
      images: [],
      clues: [],
      items: []
    });
    setEditingSession(null);
    setActiveTab('notes'); // Reset to notes tab
  };

  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
    
    setSearchTerm,
    setSelectedTag,
    setExpandedSession,
    setShowModal,
    setError,
    setActiveTab,
    setImageModal,
    
<<<<<<< HEAD
    fetchSessions,
    handleCreateNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    
    updateFormField,
    addTag,
    removeTag,
    addClue,
    updateClue,
    removeClue,
    addItem,
    updateItem,
    removeItem,
  } = useSessions();

  // Loading State
  if (loading && sessions.length === 0) {
=======
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Limpar IDs dos clues e items antes de enviar (backend não espera esses campos)
      const cleanFormData = {
        ...formData,
        clues: formData.clues.map(({ id: _, ...clue }) => clue),
        items: formData.items.map(({ id: _, ...item }) => item)
      };
      
      if (editingSession) {
        await sessionAPI.update(editingSession.id, cleanFormData);
      } else {
        await sessionAPI.create(cleanFormData);
      }
      
      await fetchSessions(); // Refresh the list
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving session:', error);
      setError('Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        setLoading(true);
        setError(null);
        console.log('🗑️ Deleting session with ID:', id);
        
        // Mostrar mensagem especial para cold start
        const startTime = Date.now();
        
        // Mostrar indicador de "servidor iniciando" após 10 segundos
        const slowOperationTimer = setTimeout(() => {
          setIsSlowOperation(true);
        }, 10000);
        
        const response = await sessionAPI.delete(id);
        clearTimeout(slowOperationTimer);
        setIsSlowOperation(false);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration > 15000) {
          console.log('🥶 Cold start detected (took ' + Math.round(duration/1000) + 's)');
        }
        
        console.log('✅ Delete response:', response);
        await fetchSessions(); // Refresh the list
        console.log('🔄 Sessions refreshed after delete');
      } catch (error) {
        console.error('❌ Error deleting session:', error);
        
        // Mensagem mais amigável para timeout
        const axiosError = error as { code?: string; message?: string };
        const isTimeout = axiosError.code === 'ECONNABORTED';
        const errorMessage = isTimeout 
          ? 'The server is starting up (this can take up to 60 seconds). Please try again in a moment.'
          : 'Failed to delete session: ' + (axiosError.message || 'Unknown error');
          
        setError(errorMessage);
      } finally {
        setLoading(false);
        setIsSlowOperation(false);
      }
    }
  };

  // Helper function to add tags
  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (loading && safeSessions.length === 0) {
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-80" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive-foreground p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Slow Operation Alert */}
      {isSlowOperation && (
        <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 p-4 rounded-lg flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400" />
          <div>
            <strong>Server is starting up...</strong>
            <p className="text-sm text-yellow-200">This can take up to 60 seconds on the first request. Please wait.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <Scroll className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Chronicles of Madness</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search the archives..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-input border border-border rounded-md text-foreground w-48 h-10"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Occurrences</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={async () => {
              console.log('🧪 Running connection tests...');
              await testBackendConnection();
              await testCORS();
            }}
            disabled={loading}
            title="Test backend connection"
          >
            🧪
          </Button>
          
          <Button onClick={handleCreateNew} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
<<<<<<< HEAD
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Scroll className="w-16 h-16 text-muted-foreground" />
          <p className="text-muted-foreground">
            {sessions.length === 0 ? 'No sessions found. Create your first session!' : 'No sessions match your criteria.'}
=======
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400">
            {safeSessions.length === 0 ? 'No sessions found. Create your first session!' : 'No sessions match your criteria.'}
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
          </p>
          {sessions.length === 0 && (
            <Button onClick={handleCreateNew} disabled={loading}>
              Create First Session
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isExpanded={expandedSession === session.id}
              loading={loading}
              activeTab={activeTab}
              onToggleExpand={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
              onEdit={() => handleEdit(session)}
              onDelete={() => handleDelete(session.id, session.title)}
              onTabChange={setActiveTab}
              onImageClick={(src, alt) => setImageModal({ src, alt })}
            />
          ))}
        </div>
      )}

      {/* Session Form Modal */}
      <SessionForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        editingSession={editingSession}
        loading={loading}
        onSubmit={handleSubmit}
        updateFormField={updateFormField}
        addTag={addTag}
        removeTag={removeTag}
        addClue={addClue}
        updateClue={updateClue}
        removeClue={removeClue}
        addItem={addItem}
        updateItem={updateItem}
        removeItem={removeItem}
      />

      {/* Image Modal */}
      {imageModal && (
        <ImageModal
          src={imageModal.src}
          alt={imageModal.alt}
          onClose={() => setImageModal(null)} isOpen={false}        />
      )}
    </div>
  );
};

export default SessionNotes;