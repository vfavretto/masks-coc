import { useState, useEffect } from 'react';
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

  // Filter sessions - garantir que sessions é sempre um array
  const filteredSessions = Array.isArray(sessions) ? sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? session.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  }) : [];

  // Get all unique tags - garantir que sessions é um array
  const allTags = Array.isArray(sessions) ? Array.from(new Set(sessions.flatMap((session) => session.tags))) : [];

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
    
    // Converter a data para o formato correto do input date (YYYY-MM-DD)
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Limpar IDs dos clues e items antes de enviar (backend não espera esses campos)
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
        const isTimeout = (error as any).code === 'ECONNABORTED';
        const errorMessage = isTimeout 
          ? 'The server is starting up (this can take up to 60 seconds). Please try again in a moment.'
          : 'Failed to delete session: ' + (error as any).message;
          
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

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-primary text-lg">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-200 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {isSlowOperation && (
        <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 p-4 rounded-lg flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
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
          <h1 className="heading mb-0 font-[MedievalSharp]">Chronicles of Madness</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
            <input
              type="text"
              placeholder="Search the archives..."
              className="pl-10 pr-4 py-2 bg-black/50 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-200 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-black/50 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-200 w-48"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Occurrences</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-gray-900">
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
          </div>
          
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-blue-800 hover:bg-blue-700 transition-colors duration-300 rounded-lg border border-blue-600"
            onClick={async () => {
              console.log('🧪 Running connection tests...');
              await testBackendConnection();
              await testCORS();
            }}
            disabled={loading}
            title="Test backend connection"
          >
            <div className="w-4 h-4">🧪</div>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors duration-300 rounded-lg border border-primary/20"
            onClick={handleCreateNew}
            disabled={loading}
          >
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400">
            {sessions.length === 0 ? 'No sessions found. Create your first session!' : 'No sessions match your criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSessions.map((session) => (
            <div 
              key={session.id} 
              className={`card hover:shadow-lg hover:shadow-primary/20 transition-all duration-500
                ${expandedSession === session.id ? 'border-primary' : 'border-gray-800'}`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {session.images.length > 0 && (
                  <div className="md:w-64 flex-shrink-0">
                    <div className="relative cursor-pointer group" onClick={() => setImageModal({ src: session.images[0], alt: session.title })}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                        <div className="bg-black/70 rounded-full p-2">
                          <Search className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <img
                        src={session.images[0]}
                        alt={session.title}
                        className="w-full h-48 object-cover rounded-lg border border-primary/20 transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-[MedievalSharp] text-primary mb-3">{session.title}</h2>
                      <div className="flex items-center gap-4 text-gray-400 mb-4 font-serif">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {session.location}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4 font-serif italic">{session.summary}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {session.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-3 py-1 bg-black/30 border border-primary/20 rounded-full text-sm hover:border-primary/40 transition-colors duration-300"
                          >
                            <Tag className="w-3 h-3 text-primary" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleEdit(session)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors duration-300"
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(session.id, session.title)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors duration-300"
                      >
                        <ChevronRight 
                          className={`w-5 h-5 transition-transform duration-300
                            ${expandedSession === session.id ? 'rotate-90' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {expandedSession === session.id && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-700 mb-6">
                    <button
                      onClick={() => setActiveTab('notes')}
                      className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'notes'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      Session Notes
                    </button>
                    <button
                      onClick={() => setActiveTab('clues')}
                      className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'clues'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <SearchIcon className="w-4 h-4" />
                      Clues ({session.clues.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('items')}
                      className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'items'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      Items ({session.items.length})
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none">
                        <MarkdownEditor
                          value={session.details}
                          onChange={() => {}} // Read-only in view mode
                          placeholder=""
                          rows={1}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'clues' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-[MedievalSharp] text-primary flex items-center gap-2">
                        <Skull className="w-5 h-5" /> Discovered Clues
                      </h3>
                      <div className="grid gap-4">
                        {session.clues.length > 0 ? session.clues.map((clue) => (
                          <div 
                            key={clue.id}
                            className="p-4 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors duration-300"
                          >
                            <div className="flex items-start gap-4">
                              {clue.image && (
                                <div 
                                  className="cursor-pointer group relative"
                                  onClick={() => setImageModal({ src: clue.image!, alt: clue.name })}
                                >
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                    <Search className="w-4 h-4 text-white" />
                                  </div>
                                  <img
                                    src={clue.image}
                                    alt={clue.name}
                                    className="w-20 h-20 object-cover rounded border border-primary/20 transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-serif font-semibold text-gray-200 text-lg">{clue.name}</h4>
                                  <span className="text-2xl">{getItemIcon(clue.type)}</span>
                                </div>
                                
                                <div className="space-y-2 mb-3">
                                  {clue.tag && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 border border-primary/30 rounded text-sm text-primary">
                                      <Tag className="w-3 h-3" />
                                      {clue.tag}
                                    </span>
                                  )}
                                  {clue.location && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-sm text-gray-300 ml-2">
                                      <MapPin className="w-3 h-3" />
                                      {clue.location}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="prose prose-invert prose-sm max-w-none">
                                  <MarkdownEditor
                                    value={clue.description}
                                    onChange={() => {}} // Read-only in view mode
                                    placeholder=""
                                    rows={1}
                                    readOnly={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <p className="text-gray-500 italic">No clues discovered yet.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'items' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-[MedievalSharp] text-primary flex items-center gap-2">
                        <Package className="w-5 h-5" /> Collected Items
                      </h3>
                      <div className="grid gap-4">
                        {session.items.length > 0 ? session.items.map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors duration-300"
                          >
                            <span className="text-2xl">{getItemIcon(item.type)}</span>
                            <div className="flex-1">
                              <h4 className="font-serif font-semibold text-gray-200">{item.name}</h4>
                              <div className="prose prose-invert prose-sm max-w-none">
                                <MarkdownEditor
                                  value={item.description}
                                  onChange={() => {}} // Read-only in view mode
                                  placeholder=""
                                  rows={1}
                                  readOnly={true}
                                />
                              </div>
                            </div>
                          </div>
                        )) : (
                          <p className="text-gray-500 italic">No items collected yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating/editing session */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-primary/30 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-[MedievalSharp] text-primary">
                  {editingSession ? `Edit ${editingSession.title}` : 'Create New Session'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-black/30 border border-primary/20 rounded p-3 text-white"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-black/30 border border-primary/20 rounded p-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-black/30 border border-primary/20 rounded p-3 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <MarkdownEditor
                    value={formData.summary}
                    onChange={(value) => setFormData(prev => ({ ...prev, summary: value }))}
                    placeholder="Brief summary of the session..."
                    label="Summary"
                    rows={4}
                  />
                </div>

                <div>
                  <MarkdownEditor
                    value={formData.details}
                    onChange={(value) => setFormData(prev => ({ ...prev, details: value }))}
                    placeholder="Detailed notes about the session..."
                    label="Details"
                    rows={8}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-gray-300 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/20 border border-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      className="flex-1 bg-black/30 border border-primary/20 rounded p-2 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const tag = e.currentTarget.value.trim();
                          if (tag) {
                            addTag(tag);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const tag = input.value.trim();
                        if (tag) {
                          addTag(tag);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded border border-primary/20"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-gray-300 mb-2">Image URL (optional)</label>
                  <input
                    type="text"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      images: e.target.value ? [e.target.value] : [] 
                    }))}
                    className="w-full bg-black/30 border border-primary/20 rounded p-3 text-white"
                    placeholder="https://..."
                  />
                </div>

                {/* Clues Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-[MedievalSharp] text-primary">Discovered Clues</h3>
                    <button
                      type="button"
                      onClick={() => {
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
                      }}
                      className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Clue
                    </button>
                  </div>
                  
                  {formData.clues.map((clue, index) => (
                    <div key={clue.id || index} className="mb-6 p-4 bg-black/20 rounded-lg border border-primary/10">
                      <div className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-6">
                          <label className="block text-gray-400 text-sm mb-1">Name *</label>
                          <input
                            type="text"
                            value={clue.name}
                            onChange={(e) => {
                              const newClues = [...formData.clues];
                              newClues[index] = { ...newClues[index], name: e.target.value };
                              setFormData(prev => ({ ...prev, clues: newClues }));
                            }}
                            placeholder="Clue name"
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                            required
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-gray-400 text-sm mb-1">Type</label>
                          <select
                            value={clue.type}
                            onChange={(e) => {
                              const newClues = [...formData.clues];
                              newClues[index] = { ...newClues[index], type: e.target.value };
                              setFormData(prev => ({ ...prev, clues: newClues }));
                            }}
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                            required
                          >
                            <option value="evidence">Evidence</option>
                            <option value="document">Document</option>
                            <option value="witness">Witness</option>
                            <option value="location">Location</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-400 text-sm mb-1">Tag</label>
                          <input
                            type="text"
                            value={clue.tag || ''}
                            onChange={(e) => {
                              const newClues = [...formData.clues];
                              newClues[index] = { ...newClues[index], tag: e.target.value };
                              setFormData(prev => ({ ...prev, clues: newClues }));
                            }}
                            placeholder="Tag"
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                clues: prev.clues.filter((_, i) => i !== index)
                              }));
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Image URL</label>
                          <input
                            type="text"
                            value={clue.image || ''}
                            onChange={(e) => {
                              const newClues = [...formData.clues];
                              newClues[index] = { ...newClues[index], image: e.target.value };
                              setFormData(prev => ({ ...prev, clues: newClues }));
                            }}
                            placeholder="https://..."
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Location</label>
                          <input
                            type="text"
                            value={clue.location || ''}
                            onChange={(e) => {
                              const newClues = [...formData.clues];
                              newClues[index] = { ...newClues[index], location: e.target.value };
                              setFormData(prev => ({ ...prev, clues: newClues }));
                            }}
                            placeholder="Where was this found?"
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Description</label>
                        <MarkdownEditor
                          value={clue.description}
                          onChange={(value) => {
                            const newClues = [...formData.clues];
                            newClues[index] = { ...newClues[index], description: value };
                            setFormData(prev => ({ ...prev, clues: newClues }));
                          }}
                          placeholder="Describe this clue..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-[MedievalSharp] text-primary">Collected Items</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          items: [...prev.items, { id: crypto.randomUUID(), name: '', description: '', type: 'tool' }]
                        }));
                      }}
                      className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                  
                  {formData.items.map((item, index) => (
                    <div key={item.id || index} className="mb-6 p-4 bg-black/20 rounded-lg border border-primary/10">
                      <div className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-6">
                          <label className="block text-gray-400 text-sm mb-1">Name *</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[index] = { ...newItems[index], name: e.target.value };
                              setFormData(prev => ({ ...prev, items: newItems }));
                            }}
                            placeholder="Item name"
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                            required
                          />
                        </div>
                        <div className="col-span-5">
                          <label className="block text-gray-400 text-sm mb-1">Type</label>
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[index] = { ...newItems[index], type: e.target.value };
                              setFormData(prev => ({ ...prev, items: newItems }));
                            }}
                            className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                            required
                          >
                            <option value="tool">Tool</option>
                            <option value="key">Key</option>
                            <option value="weapon">Weapon</option>
                            <option value="book">Book</option>
                            <option value="artifact">Artifact</option>
                            <option value="document">Document</option>
                          </select>
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                items: prev.items.filter((_, i) => i !== index)
                              }));
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Description</label>
                        <MarkdownEditor
                          value={item.description}
                          onChange={(value) => {
                            const newItems = [...formData.items];
                            newItems[index] = { ...newItems[index], description: value };
                            setFormData(prev => ({ ...prev, items: newItems }));
                          }}
                          placeholder="Describe this item..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 rounded-lg border border-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors duration-300 rounded-lg border border-primary/20 flex items-center gap-2"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : editingSession ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        src={imageModal?.src || ''}
        alt={imageModal?.alt || ''}
        isOpen={!!imageModal}
        onClose={() => setImageModal(null)}
      />
    </div>
  );
};

export default SessionNotes;