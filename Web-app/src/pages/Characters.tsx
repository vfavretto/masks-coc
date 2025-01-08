import { useState } from 'react';
import { Search, Skull, ChevronRight, Heart, Brain, Book, Shield } from 'lucide-react';

interface Character {
  id: number;
  name: string;
  occupation: string;
  image: string;
  stats: {
    For: number;
    Con: number;
    Tam: number;
    Des: number;
    Apa: number;
    Edu: number;
    Int: number;
    Pod: number;
  };
  background: string;
  mentalHealth: {
    sanity: number;
    maxSanity: number;
    temporaryInsanity: boolean;
    indefiniteInsanity: boolean;
    phobias: string[];
    manias: string[];
  };
  skills: {
    name: string;
    value: number;
    category: 'combat' | 'academic' | 'practical' | 'social';
  }[];
  equipment: {
    name: string;
    type: 'weapon' | 'tool' | 'book' | 'artifact';
    description: string;
  }[];
  pulpTalents: string[];
  wounds: number;
  maxHealth: number;
}

const characters: Character[] = [
  {
    id: 1,
    name: 'Professor William Hayes',
    occupation: 'Miskatonic University Professor',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
    stats: {
      For: 40,
      Con: 50,
      Tam: 50,
      Des: 40,
      Apa: 60,
      Edu: 80,
      Int: 70,
      Pod: 65
    },
    background: 'A brilliant archaeologist whose curiosity may be his undoing.',
    mentalHealth: {
      sanity: 65,
      maxSanity: 99,
      temporaryInsanity: false,
      indefiniteInsanity: false,
      phobias: ['Nyctophobia - Fear of darkness'],
      manias: []
    },
    skills: [
      { name: 'Arqueologia', value: 70, category: 'academic' },
      { name: 'Línguas Mortas', value: 60, category: 'academic' },
      { name: 'Biblioteca', value: 65, category: 'academic' },
      { name: 'Lutar (Briga)', value: 35, category: 'combat' },
      { name: 'Esquivar', value: 30, category: 'combat' }
    ],
    equipment: [
      { name: 'Revólver .38', type: 'weapon', description: 'Standard police revolver' },
      { name: 'Livro de Rituais Egípcios', type: 'book', description: 'Ancient tome with hieroglyphic inscriptions' }
    ],
    pulpTalents: ['Conhecimento Proibido', 'Sexto Sentido'],
    wounds: 10,
    maxHealth: 10
  },
  {
    id: 2,
    name: 'Edmund Blackwood',
    occupation: "Savanah's Hunter",
    image: 'https://images.unsplash.com/photo-1736197714985-0c4f94db1865?w=600&auto=format&fit=crop&q=60',
    stats: { 
      For: 70,
      Con: 50,
      Tam: 60,
      Des: 50,
      Apa: 40,
      Edu: 80,
      Int: 50,
      Pod: 60
    },
    background: "A British nobleman who found his true calling as a guardian of Africa's ancient secrets.",
    mentalHealth: {
      sanity: 60,
      maxSanity: 99,
      temporaryInsanity: false,
      indefiniteInsanity: false,
      phobias: ['Arachnophobia'],
      manias: ['Compulsive note-taking']
    },
    skills: [
      { name: 'Rifle', value: 75, category: 'combat' },
      { name: 'Rastrear', value: 65, category: 'practical' },
      { name: 'Sobrevivência', value: 70, category: 'practical' },
      { name: 'Persuasão', value: 55, category: 'social' },
      { name: 'Primeiros Socorros', value: 45, category: 'practical' }
    ],
    equipment: [
      { name: 'Rifle de Elefante', type: 'weapon', description: 'Powerful hunting rifle (3d6+4)' },
      { name: 'Revolver .45', type: 'weapon', description: 'Nice hand gun (1d10+2)' }
    ],
    pulpTalents: ['Atirador de Elite', 'Sobrevivente Nato'],
    wounds: 12,
    maxHealth: 12
  }
];

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChar, setExpandedChar] = useState<number | null>(null);

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'combat': return '⚔️';
      case 'academic': return '📚';
      case 'practical': return '🛠️';
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Skull className="w-8 h-8 text-primary" />
          <h1 className="heading mb-0 font-[MedievalSharp]">Investigators</h1>
        </div>
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
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {filteredCharacters.map((character) => (
          <div 
            key={character.id} 
            className={`card hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 cursor-pointer
              ${expandedChar === character.id ? 'border-primary' : 'border-gray-800'}`}
            onClick={() => setExpandedChar(expandedChar === character.id ? null : character.id)}
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
                  <ChevronRight 
                    className={`w-6 h-6 text-primary transition-transform duration-300
                      ${expandedChar === character.id ? 'rotate-90' : ''}`}
                  />
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
    </div>
  );
};

export default Characters;