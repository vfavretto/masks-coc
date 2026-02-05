import { useState, useEffect, useCallback } from 'react';
import { characterAPI } from '@/services/api';
import { Character, CharacterFormData, Skill, Equipment } from '@/types';

const INITIAL_FORM_DATA: CharacterFormData = {
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
};

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChar, setExpandedChar] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState<CharacterFormData>(INITIAL_FORM_DATA);

  // Fetch characters from API
  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await characterAPI.getAll();
      const charactersData = Array.isArray(response.data) ? response.data : [];
      setCharacters(charactersData);
      
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Falha ao carregar investigadores');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Filter characters
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setEditingCharacter(null);
  }, []);

  const handleCreateNew = useCallback(() => {
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleEdit = useCallback((character: Character) => {
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
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingCharacter) {
        await characterAPI.update(editingCharacter.id, formData);
      } else {
        await characterAPI.create(formData);
      }
      
      await fetchCharacters();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving character:', err);
      setError('Failed to save character');
    } finally {
      setLoading(false);
    }
  }, [editingCharacter, formData, fetchCharacters, resetForm]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        setLoading(true);
        setError(null);
        await characterAPI.delete(id);
        await fetchCharacters();
      } catch (err) {
        console.error('Error deleting character:', err);
        setError('Failed to delete character');
      } finally {
        setLoading(false);
      }
    }
  }, [fetchCharacters]);

  // Skill management
  const addSkill = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', value: 0, category: 'academic' }]
    }));
  }, []);

  const updateSkill = useCallback((index: number, field: keyof Skill, value: string | number) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { 
        ...newSkills[index], 
        [field]: field === 'value' ? parseInt(String(value)) : value 
      };
      return { ...prev, skills: newSkills };
    });
  }, []);

  const removeSkill = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  }, []);

  // Equipment management
  const addEquipment = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, { name: '', description: '', type: 'tool' }]
    }));
  }, []);

  const updateEquipment = useCallback((index: number, field: keyof Equipment, value: string) => {
    setFormData(prev => {
      const newEquipment = [...prev.equipment];
      newEquipment[index] = { ...newEquipment[index], [field]: value };
      return { ...prev, equipment: newEquipment };
    });
  }, []);

  const removeEquipment = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  }, []);

  // Pulp talents management
  const handlePulpTalents = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const talents = e.target.value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, pulpTalents: talents }));
  }, []);

  // Phobias and manias management
  const handlePhobias = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const phobias = e.target.value.split(',').map(p => p.trim()).filter(p => p);
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, phobias } 
    }));
  }, []);

  const handleManias = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const manias = e.target.value.split(',').map(m => m.trim()).filter(m => m);
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, manias } 
    }));
  }, []);

  // Boolean change handler
  const handleBooleanChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, [name]: checked } 
    }));
  }, []);

  // Form field update helper
  const updateFormField = useCallback(<K extends keyof CharacterFormData>(
    field: K, 
    value: CharacterFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateStat = useCallback((stat: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [stat]: value }
    }));
  }, []);

  const updateMentalHealth = useCallback((field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      mentalHealth: { ...prev.mentalHealth, [field]: value }
    }));
  }, []);

  return {
    // State
    characters,
    filteredCharacters,
    loading,
    error,
    searchTerm,
    expandedChar,
    showModal,
    editingCharacter,
    formData,
    
    // Setters
    setSearchTerm,
    setExpandedChar,
    setShowModal,
    setError,
    
    // Actions
    fetchCharacters,
    handleCreateNew,
    handleEdit,
    handleSubmit,
    handleDelete,
    
    // Form actions
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
  };
}

// Helper functions for icons
export const getSkillIcon = (category: string): string => {
  switch (category) {
    case 'combat': return '⚔️';
    case 'academic': return '📚';
    case 'pratical': return '🛠️';
    case 'social': return '🗣️';
    default: return '📌';
  }
};

export const getEquipmentIcon = (type: string): string => {
  switch (type) {
    case 'weapon': return '🗡️';
    case 'tool': return '🔧';
    case 'book': return '📚';
    case 'artifact': return '🏺';
    default: return '📦';
  }
};
