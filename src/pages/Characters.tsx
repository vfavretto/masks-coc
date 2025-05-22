import { useState, useEffect } from 'react';
import { Search, Skull, ChevronRight, Heart, Brain, Book, Shield, PlusCircle, Edit, Trash2} from 'lucide-react';

// Tipos baseados no seu esquema de backend
interface Stats {
  For: number;
  Con: number;
  Tam: number;
  Des: number;
  Apa: number;
  Edu: number;
  Int: number;
  Pod: number;
}

interface MentalHealth {
  sanity: number;
  maxSanity: number;
  tempSanity: boolean;
  indefiniteSanity: boolean;
  phobias: string[];
  manias: string[];
}

interface Skill {
  name: string;
  value: number;
  category: 'combat' | 'academic' | 'pratical' | 'social';
}

interface Equipment {
  name: string;
  description: string;
  type: 'weapon' | 'tool' | 'book' | 'artifact';
}

interface Character {
  id: string;
  name: string;
  occupation: string;
  image: string;
  stats: Stats;
  background: string;
  mentalHealth: MentalHealth;
  skills: Skill[];
  equipment: Equipment[];
  pulpTalents: string[];
  wounds: number;
  maxHealth: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para formulário de criação de personagem
interface CharacterFormData {
  name: string;
  occupation: string;
  image: string;
  stats: Stats;
  background: string;
  mentalHealth: MentalHealth;
  skills: Skill[];
  equipment: Equipment[];
  pulpTalents: string[];
  wounds: number;
  maxHealth: number;
}

// API client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; // Fallback para localhost

const fetchCharacters = async (): Promise<Character[]> => {
  const response = await fetch(`${API_URL}/characters`);
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  const data = await response.json();
  return data.characters;
};

const createCharacter = async (character: CharacterFormData): Promise<Character> => {
  const response = await fetch(`${API_URL}/characters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(character),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create character');
  }
  
  return response.json();
};

const updateCharacter = async (id: string, data: Partial<CharacterFormData>): Promise<Character> => {
  const response = await fetch(`${API_URL}/characters/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update character');
  }
  
  return response.json();
};

const deleteCharacter = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/characters/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete character');
  }
};

// Componente principal
const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChar, setExpandedChar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para o modal de criar/editar personagem
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
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
    wounds: 10,
    maxHealth: 10
  });

  // Carrega personagens quando o componente monta
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCharacters();
        setCharacters(data);
        setError(null);
      } catch (err) {
        setError('Failed to load characters');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  // Filtro de personagens
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções para renderizar ícones
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

  // Manipulação do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [name]: parseInt(value) }
    }));
  };

  const handleMentalHealthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      mentalHealth: { 
        ...prev.mentalHealth, 
        [name]: name === 'sanity' || name === 'maxSanity' ? parseInt(value) : value
      }
    }));
  };

  // Funções para manipulação de skills (habilidades)
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', value: 0, category: 'academic' }]
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: field === 'value' ? parseInt(value) : value };
      return { ...prev, skills: newSkills };
    });
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Funções para manipulação de equipamentos
  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, { name: '', description: '', type: 'tool' }]
    }));
  };

  const updateEquipment = (index: number, field: keyof Equipment, value: any) => {
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

  // Funções para manipulação de pulp talents (talentos)
  const handlePulpTalents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const talents = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, pulpTalents: talents }));
  };

  // Funções para manipulação de phobias e manias
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

  // Funções para manipulação de booleanos
  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      mentalHealth: { ...prev.mentalHealth, [name]: checked } 
    }));
  };

  // Resetar o formulário para um novo personagem
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
      wounds: 10,
      maxHealth: 10
    });
    setEditingCharacter(null);
  };

  // Abrir modal para criar novo personagem
  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Abrir modal para editar personagem
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

  // Enviar formulário para criar/editar personagem
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (editingCharacter) {
        // Atualizar personagem existente
        const updated = await updateCharacter(editingCharacter.id, formData);
        setCharacters(prev => 
          prev.map(char => char.id === editingCharacter.id ? updated : char)
        );
      } else {
        // Criar novo personagem
        const newCharacter = await createCharacter(formData);
        setCharacters(prev => [...prev, newCharacter]);
      }
      
      setShowModal(false);
      resetForm();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir personagem
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        setIsLoading(true);
        await deleteCharacter(id);
        setCharacters(prev => prev.filter(char => char.id !== id));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-lg">
          {error}
        </div>
      )}

<div className="flex justify-between items-center">
  <div className="flex items-center space-x-3">
    <Skull className="w-8 h-8 text-primary" />
    <h1 className="heading mb-0 font-[MedievalSharp]">Investigators</h1>
  </div>
  <div className="flex items-center gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
      <input
        type="text"
        placeholder="Search investigators..."
        className="pl-10 pr-4 py-2 bg-black/50 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent backdrop-blur-sm text-gray-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <button 
      className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors duration-300 rounded-lg border border-primary/20"
      onClick={handleCreateNew}
    >
      <PlusCircle className="w-5 h-5" />
      <span>New Investigator</span>
    </button>
  </div>
</div>

{isLoading && characters.length === 0 ? (
  <div className="flex justify-center items-center h-64">
    <p className="text-gray-400">Loading investigators...</p>
  </div>
) : filteredCharacters.length === 0 ? (
  <div className="flex justify-center items-center h-64">
    <p className="text-gray-400">No investigators found</p>
  </div>
) : (
  <div className="grid md:grid-cols-2 gap-8">
    {filteredCharacters.map((character) => (
      <div 
        key={character.id} 
        className={`card hover:shadow-lg hover:shadow-primary/20 transition-all duration-500
          ${expandedChar === character.id ? 'border-primary' : 'border-gray-800'}`}
      >
        <div className="flex items-start space-x-4">
          <img
            src={character.image}
            alt={character.name}
            className="w-24 h-24 rounded-lg object-cover border-2 border-primary/20"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold font-[MedievalSharp] text-primary">{character.name}</h2>
                <p className="text-gray-400 font-serif italic">{character.occupation}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(character)}
                  className="p-1 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(character.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setExpandedChar(expandedChar === character.id ? null : character.id)}
                  className="p-1 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  <ChevronRight 
                    className={`w-6 h-6 transition-transform duration-300
                      ${expandedChar === character.id ? 'rotate-90' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 font-[MedievalSharp] text-primary">Attributes</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-lg" />
                  <div className="relative p-3 text-center border border-primary/20 rounded-lg hover:border-primary/40 transition-colors duration-300">
                    <div className="text-sm text-gray-400 uppercase font-serif">{stat}</div>
                    <div className="text-lg font-bold text-primary">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {expandedChar === character.id && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold font-[MedievalSharp] text-primary flex items-center gap-2">
                    <Heart className="w-5 h-5" /> Health
                  </h3>
                  <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-primary/20">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(character.wounds / character.maxHealth) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {character.wounds}/{character.maxHealth}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold font-[MedievalSharp] text-primary flex items-center gap-2">
                    <Brain className="w-5 h-5" /> Sanity
                  </h3>
                  <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-primary/20">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(character.mentalHealth.sanity / character.mentalHealth.maxSanity) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {character.mentalHealth.sanity}/{character.mentalHealth.maxSanity}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 font-[MedievalSharp] text-primary flex items-center gap-2">
                  <Book className="w-5 h-5" /> Key Skills
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {character.skills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="flex items-center gap-2 p-2 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors duration-300"
                    >
                      <span className="text-xl">{getSkillIcon(skill.category)}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-200 font-serif">{skill.name}</span>
                          <span className="text-primary font-bold">{skill.value}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 font-[MedievalSharp] text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Equipment
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {character.equipment.map((item) => (
                    <div 
                      key={item.name}
                      className="flex items-start gap-2 p-2 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors duration-300"
                    >
                      <span className="text-xl">{getEquipmentIcon(item.type)}</span>
                      <div>
                        <h4 className="font-serif font-semibold text-gray-200">{item.name}</h4>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-lg font-[MedievalSharp] text-primary mb-2">Pulp Talents</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.pulpTalents.map((talent) => (
                      <span
                        key={talent}
                        className="px-3 py-1 bg-black/30 border border-primary/20 rounded-full text-sm hover:border-primary/40 transition-colors duration-300"
                      >
                        {talent}
                      </span>
                    ))}
                  </div>
                </div>

                {(character.mentalHealth.phobias.length > 0 || character.mentalHealth.manias.length > 0) && (
                  <div>
                    <h4 className="text-lg font-[MedievalSharp] text-primary mb-2">Mental Conditions</h4>
                    <div className="space-y-2">
                      {character.mentalHealth.phobias.map((phobia) => (
                        <p key={phobia} className="text-red-400 font-serif italic">🔥 {phobia}</p>
                      ))}
                      {character.mentalHealth.manias.map((mania) => (
                        <p key={mania} className="text-yellow-400 font-serif italic">⚡ {mania}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2 font-[MedievalSharp] text-primary">Background</h3>
            <p className="text-gray-400 font-serif italic">{character.background}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

{/* Modal para criar/editar personagem */}
{showModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-gray-900 border border-primary/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-[MedievalSharp] text-primary mb-6">
          {editingCharacter ? `Edit ${editingCharacter.name}` : 'Create New Investigator'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Background</label>
            <textarea
              name="background"
              value={formData.background}
              onChange={handleInputChange}
              className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white h-24"
              required
            />
          </div>
          
          <div>
            <h3 className="text-xl font-[MedievalSharp] text-primary mb-4">Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.stats).map(([stat, value]) => (
                <div key={stat}>
                  <label className="block text-gray-300 mb-2">{stat}</label>
                  <input
                    type="number"
                    name={stat}
                    value={value}
                    onChange={handleStatsChange}
                    min="1"
                    max="99"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-[MedievalSharp] text-primary mb-4">Health</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Wounds</label>
                  <input
                    type="number"
                    name="wounds"
                    value={formData.wounds}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Max Health</label>
                  <input
                    type="number"
                    name="maxHealth"
                    value={formData.maxHealth}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-[MedievalSharp] text-primary mb-4">Sanity</h3>
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-gray-300 mb-2">Current Sanity</label>
                  <input
                    type="number"
                    name="sanity"
                    value={formData.mentalHealth.sanity}
                    onChange={handleMentalHealthChange}
                    min="0"
                    max="99"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Max Sanity</label>
                  <input
                    type="number"
                    name="maxSanity"
                    value={formData.mentalHealth.maxSanity}
                    onChange={handleMentalHealthChange}
                    min="1"
                    max="99"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
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
                  <label htmlFor="tempSanity" className="text-gray-300">Temporary Insanity</label>
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
                  <label htmlFor="indefiniteSanity" className="text-gray-300">Indefinite Insanity</label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Phobias (comma separated)</label>
            <input
              type="text"
              value={formData.mentalHealth.phobias.join(', ')}
              onChange={handlePhobias}
              className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Manias (comma separated)</label>
            <input
              type="text"
              value={formData.mentalHealth.manias.join(', ')}
              onChange={handleManias}
              className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-[MedievalSharp] text-primary">Skills</h3>
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Skill
              </button>
            </div>
            
            {formData.skills.map((skill, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Skill name"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={skill.value}
                    onChange={(e) => updateSkill(index, 'value', e.target.value)}
                    placeholder="Value"
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
                    <option value="combat">Combat</option>
                    <option value="academic">Academic</option>
                    <option value="pratical">Practical</option>
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
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-[MedievalSharp] text-primary">Equipment</h3>
              <button
                type="button"
                onClick={addEquipment}
                className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Equipment
              </button>
            </div>
            
            {formData.equipment.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                    placeholder="Item name"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={item.type}
                    onChange={(e) => updateEquipment(index, 'type', e.target.value as any)}
                    className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
                    required
                  >
                    <option value="weapon">Weapon</option>
                    <option value="tool">Tool</option>
                    <option value="book">Book</option>
                    <option value="artifact">Artifact</option>
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
          
          <div>
            <label className="block text-gray-300 mb-2">Pulp Talents (comma separated)</label>
            <input
              type="text"
              value={formData.pulpTalents.join(', ')}
              onChange={handlePulpTalents}
              className="w-full bg-black/30 border border-primary/20 rounded p-2 text-white"
            />
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
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors duration-300 rounded-lg border border-primary/20"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : editingCharacter ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      
    </div>
  );
};

export default Characters;