import { Skull, Search, PlusCircle } from 'lucide-react';
import { useCharacters } from '@/hooks/useCharacters';
import { CharacterCard, CharacterForm } from '@/features/characters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const Characters = () => {
  const {
    filteredCharacters,
    loading,
    error,
    searchTerm,
    expandedChar,
    showModal,
    editingCharacter,
    formData,
    characters,
    
    setSearchTerm,
    setExpandedChar,
    setShowModal,
    setError,
    
    fetchCharacters,
    handleCreateNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    
    updateFormField,
    updateStat,
    updateMentalHealth,
    addSkill,
    updateSkill,
    removeSkill,
    addEquipment,
    updateEquipment,
    removeEquipment,
    handlePulpTalents,
    handlePhobias,
    handleManias,
    handleBooleanChange,
  } = useCharacters();

  // Loading State
  if (loading && characters.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
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
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                size="sm"
                onClick={fetchCharacters}
                disabled={loading}
              >
                Tentar Novamente
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Skull className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Investigators</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar investigadores..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={fetchCharacters}
            disabled={loading}
            title="Recarregar investigadores"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
          </Button>
          <Button onClick={handleCreateNew} disabled={loading}>
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Investigador
          </Button>
        </div>
      </div>

      {/* Characters Grid */}
      {filteredCharacters.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Carregando investigadores...</p>
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center space-y-3">
              <Skull className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Nenhum investigador encontrado.</p>
              <p className="text-muted-foreground/70 text-sm">Crie o seu primeiro investigador!</p>
              <Button onClick={handleCreateNew} disabled={loading}>
                Criar Primeiro Investigador
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <Search className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Nenhum investigador corresponde à sua busca.</p>
              <p className="text-muted-foreground/70 text-sm">Termo: "{searchTerm}"</p>
              <Button variant="secondary" onClick={() => setSearchTerm('')}>
                Limpar Busca
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isExpanded={expandedChar === character.id}
              loading={loading}
              onToggleExpand={() => setExpandedChar(expandedChar === character.id ? null : character.id)}
              onEdit={() => handleEdit(character)}
              onDelete={() => handleDelete(character.id, character.name)}
            />
          ))}
        </div>
      )}

      {/* Character Form Modal */}
      <CharacterForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        editingCharacter={editingCharacter}
        loading={loading}
        onSubmit={handleSubmit}
        updateFormField={updateFormField}
        updateStat={updateStat}
        updateMentalHealth={updateMentalHealth}
        handleBooleanChange={handleBooleanChange}
        handlePhobias={handlePhobias}
        handleManias={handleManias}
        handlePulpTalents={handlePulpTalents}
        addSkill={addSkill}
        updateSkill={updateSkill}
        removeSkill={removeSkill}
        addEquipment={addEquipment}
        updateEquipment={updateEquipment}
        removeEquipment={removeEquipment}
      />
    </div>
  );
};

export default Characters;