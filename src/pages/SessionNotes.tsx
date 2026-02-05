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
    
    setSearchTerm,
    setSelectedTag,
    setExpandedSession,
    setShowModal,
    setError,
    setActiveTab,
    setImageModal,
    
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
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Scroll className="w-16 h-16 text-muted-foreground" />
          <p className="text-muted-foreground">
            {sessions.length === 0 ? 'No sessions found. Create your first session!' : 'No sessions match your criteria.'}
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