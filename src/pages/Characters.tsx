<<<<<<< HEAD
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
=======
import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Skull, 
  ChevronRight, 
  Heart, 
  Brain, 
  Book, 
  Shield, 
  PlusCircle, 
  Edit, 
  Trash2,
  X,
  Save
} from 'lucide-react';
import { characterAPI } from '../services/api';
import { Character, CharacterFormData, Skill, Equipment } from '../types';

const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChar, setExpandedChar] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    occupation: '',
    image: '',
    stats: { For: 50, Con: 50, Tam: 50, Des: 50, Apa: 50, Edu: 50, Int: 50, Pod: 50 },
    background: '',
    mentalHealth: {
      sanity: 50,
      maxSanity: 99,
      tempSanity: false,
      indefiniteSanity: false,
      phobias: [],
      manias: []
    },
    skills: [],
    equipment: [],
    pulpTalents: [],
    wounds: 0,
    maxHealth: 10
  });

  // Fetch characters from API
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching characters...');
      
      const response = await characterAPI.getAll();
      
      console.log('📦 Characters API Response:', response);
      console.log('📋 Characters Data:', response.data);
      console.log('🔍 Response data type:', typeof response.data);
      console.log('🔍 Is array?', Array.isArray(response.data));
      
      // Validar se response.data é um array
      const charactersData = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Characters Array:', charactersData);
      console.log('📊 Characters count:', charactersData.length);
      
      setCharacters(charactersData);
      
      if (charactersData.length === 0) {
        console.log('⚠️ No characters found in response');
      } else {
        console.log('🎭 Characters loaded successfully:', charactersData.map(c => c.name));
      }
    } catch (error) {
      console.error('💥 Error fetching characters:', error);
      
      // Log mais detalhado do erro
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
      }
      
      setError('Falha ao carregar investigadores');
      setCharacters([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  // Ensure characters is always an array and memoize filtered results
  const safeCharacters = useMemo(() => Array.isArray(characters) ? characters : [], [characters]);

  // Filter characters - memoized for performance
  const filteredCharacters = useMemo(() => {
    return safeCharacters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.occupation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeCharacters, searchTerm]);

  // Helper functions for icons
  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'combat': return '⚔️';
      case 'academic': return '📚';
      case 'pratical': return '🛠️';
      case 'social': return '🗣️';
      default: return '📌';
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'weapon': return '🗡️';
      case 'tool': return '🔧';
      case 'book': return '📚';
      case 'artifact': return '🏺';
      default: return '📦';
    }
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      occupation: '',
      image: '',
      stats: { For: 50, Con: 50, Tam: 50, Des: 50, Apa: 50, Edu: 50, Int: 50, Pod: 50 },
      background: '',
      mentalHealth: {
        sanity: 50,
        maxSanity: 99,
        tempSanity: false,
        indefiniteSanity: false,
        phobias: [],
        manias: []
      },
      skills: [],
      equipment: [],
      pulpTalents: [],
      wounds: 0,
      maxHealth: 10
    });
    setEditingCharacter(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      occupation: character.occupation,
      image: character.image,
      stats: character.stats,
      background: character.background,
      mentalHealth: character.mentalHealth,
      skills: character.skills,
      equipment: character.equipment,
      pulpTalents: character.pulpTalents,
      wounds: character.wounds,
      maxHealth: character.maxHealth
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingCharacter) {
        await characterAPI.update(editingCharacter.id, formData);
      } else {
        await characterAPI.create(formData);
      }
      
      await fetchCharacters(); // Refresh the list
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving character:', error);
      setError('Failed to save character');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        setLoading(true);
        setError(null);
        await characterAPI.delete(id);
        await fetchCharacters(); // Refresh the list
      } catch (error) {
        console.error('Error deleting character:', error);
        setError('Failed to delete character');
      } finally {
        setLoading(false);
      }
    }
  };

  // Skill management functions
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', value: 0, category: 'academic' }]
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: field === 'value' ? parseInt(value as string) : value };
      return { ...prev, skills: newSkills };
    });
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Equipment management functions
  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, { name: '', description: '', type: 'tool' }]
    }));
  };

  const updateEquipment = (index: number, field: keyof Equipment, value: string) => {
    setFormData(prev => {
      const newEquipment = [...prev.equipment];
      newEquipment[index] = { ...newEquipment[index], [field]: value };
      return { ...prev, equipment: newEquipment };
    });
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  // Pulp talents management
  const handlePulpTalents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const talents = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, pulpTalents: talents }));
  };

  // Phobias and manias management
  const handlePhobias = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const phobias = value.split(',').map(p => p.trim()).filter(p => p);
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, phobias } 
    }));
  };

  const handleManias = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const manias = value.split(',').map(m => m.trim()).filter(m => m);
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, manias } 
    }));
  };

  // Boolean change handler
  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, [name]: checked } 
    }));
  };

  if (loading && safeCharacters.length === 0) {
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
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
          ) : safeCharacters.length === 0 ? (
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

<<<<<<< HEAD
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
=======
      {/* Modal for creating/editing character */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-primary/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-[MedievalSharp] text-primary">
                  {editingCharacter ? `Editar ${editingCharacter.name}` : 'Criar Novo Investigador'}
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Ocupação</label>
                    <input
                      type="text"
                      value={formData.occupation}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                      className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">URL da Imagem</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">História</label>
                  <textarea
                    value={formData.background}
                    onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white h-24"
                    required
                  />
                </div>
                
                {/* Stats */}
                <div>
                  <h3 className="text-xl font-[MedievalSharp] text-primary mb-4">Atributos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.stats).map(([stat, value]) => (
                      <div key={stat}>
                        <label className="block text-gray-300 mb-2">{stat}</label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            stats: { ...prev.stats, [stat]: parseInt(e.target.value) }
                          }))}
                          min="1"
                          max="99"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Health & Sanity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-[MedievalSharp] text-primary mb-4">Saúde</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Ferimentos</label>
                        <input
                          type="number"
                          value={formData.wounds}
                          onChange={(e) => setFormData(prev => ({ ...prev, wounds: parseInt(e.target.value) }))}
                          min="0"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Saúde Máxima</label>
                        <input
                          type="number"
                          value={formData.maxHealth}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxHealth: parseInt(e.target.value) }))}
                          min="1"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-[MedievalSharp] text-primary mb-4">Sanidade</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Sanidade Atual</label>
                        <input
                          type="number"
                          value={formData.mentalHealth.sanity}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            mentalHealth: { ...prev.mentalHealth, sanity: parseInt(e.target.value) }
                          }))}
                          min="0"
                          max="99"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Sanidade Máxima</label>
                        <input
                          type="number"
                          value={formData.mentalHealth.maxSanity}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            mentalHealth: { ...prev.mentalHealth, maxSanity: parseInt(e.target.value) }
                          }))}
                          min="1"
                          max="99"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Mental Health Checkboxes */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="tempSanity"
                          name="tempSanity"
                          checked={formData.mentalHealth.tempSanity}
                          onChange={handleBooleanChange}
                          className="bg-black/30 border border-primary/20 rounded"
                        />
                        <label htmlFor="tempSanity" className="text-gray-300">Insanidade Temporária</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="indefiniteSanity"
                          name="indefiniteSanity"
                          checked={formData.mentalHealth.indefiniteSanity}
                          onChange={handleBooleanChange}
                          className="bg-black/30 border border-primary/20 rounded"
                        />
                        <label htmlFor="indefiniteSanity" className="text-gray-300">Insanidade Indefinida</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phobias and Manias */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Fobias (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={formData.mentalHealth.phobias.join(', ')}
                      onChange={handlePhobias}
                      className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                      placeholder="ex: Aranhas, Lugares escuros, Fogo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Manias (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={formData.mentalHealth.manias.join(', ')}
                      onChange={handleManias}
                      className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                      placeholder="ex: Limpeza, Colecionismo"
                    />
                  </div>
                </div>
                
                {/* Skills */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-[MedievalSharp] text-primary">Habilidades</h3>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Adicionar Habilidade
                    </button>
                  </div>
                  
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          placeholder="Nome da habilidade"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={skill.value}
                          onChange={(e) => updateSkill(index, 'value', e.target.value)}
                          placeholder="Valor"
                          min="0"
                          max="99"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkill(index, 'category', e.target.value)}
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        >
                          <option value="combat">Combate</option>
                          <option value="academic">Acadêmica</option>
                          <option value="pratical">Prática</option>
                          <option value="social">Social</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Equipment */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-[MedievalSharp] text-primary">Equipamentos</h3>
                    <button
                      type="button"
                      onClick={addEquipment}
                      className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Adicionar Equipamento
                    </button>
                  </div>
                  
                  {formData.equipment.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                          placeholder="Nome do item"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                          placeholder="Descrição"
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={item.type}
                          onChange={(e) => updateEquipment(index, 'type', e.target.value)}
                          className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                          required
                        >
                          <option value="weapon">Arma</option>
                          <option value="tool">Ferramenta</option>
                          <option value="book">Livro</option>
                          <option value="artifact">Artefato</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeEquipment(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pulp Talents */}
                <div>
                  <label className="block text-gray-300 mb-2">Talentos Pulp (separados por vírgula)</label>
                  <input
                    type="text"
                    value={formData.pulpTalents.join(', ')}
                    onChange={handlePulpTalents}
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    placeholder="ex: Saque Rápido, Conversa Fiada, Valentão"
                  />
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 rounded-lg border border-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors duration-300 rounded-lg border border-primary/20 flex items-center gap-2"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Salvando...' : editingCharacter ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
>>>>>>> 32e2be8d11ca913036da63f2d56aad9d9caca78a
    </div>
  );
};

export default Characters;