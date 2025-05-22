import { useState } from 'react';
import { Search, Calendar, Tag, Scroll, MapPin, ChevronDown, ChevronRight, Skull } from 'lucide-react';

const sessions = [
  {
    id: 1,
    title: 'The Haunting Begins',
    date: '1925-03-15',
    location: 'Arkham',
    summary: 'The investigators begin their exploration of the mysterious Corbitt House...',
    details: 'Upon arriving at the decrepit Corbitt House, the investigators immediately sensed something was amiss. The air grew thick with an inexplicable tension as they crossed the threshold. Their initial search revealed signs of recent occupancy, despite the house being supposedly abandoned for years.',
    tags: ['combat', 'investigation', 'supernatural'],
    images: ['https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?auto=format&fit=crop&q=80'],
    clues: [
      { id: 1, name: 'Newspaper Clipping', description: 'Article about mysterious deaths in the house', type: 'document' },
      { id: 2, name: 'Strange Symbol', description: 'Carved into basement door frame', type: 'evidence' }
    ],
    items: [
      { id: 1, name: 'Brass Key', description: 'Old key found in living room drawer', type: 'key' },
      { id: 2, name: 'Ancient Tome', description: 'Latin text, heavily damaged', type: 'book' }
    ]
  },
  {
    id: 2,
    title: 'Secrets in the Basement',
    date: '1925-03-08',
    location: 'Arkham',
    summary: 'Discovering hidden passages beneath the house leads to terrifying revelations...',
    details: 'The basement revealed a horrifying truth: a hidden chamber accessible only through a concealed door. Inside, ritualistic markings covered the walls, and evidence of dark ceremonies littered the floor. The investigators discovered journals detailing the houses disturbing history.',
    tags: ['horror', 'discovery', 'ritual'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80'],
    clues: [
      { id: 3, name: 'Ritual Circle', description: 'Chalk markings on floor', type: 'evidence' },
      { id: 4, name: 'Hidden Journal', description: 'Details of occult ceremonies', type: 'document' }
    ],
    items: [
      { id: 3, name: 'Silver Dagger', description: 'Ceremonial weapon with strange engravings', type: 'weapon' },
      { id: 4, name: 'Ritual Components', description: 'Various herbs and minerals', type: 'misc' }
    ]
  }
];

const SessionNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? session.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(sessions.flatMap((session) => session.tags)));

  const getItemIcon = (type: any) => {
    switch (type) {
      case 'document': return '📜';
      case 'evidence': return '🔍';
      case 'key': return '🗝️';
      case 'book': return '📚';
      case 'weapon': return '🗡️';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-8">
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
              className="pl-10 pr-4 py-2 bg-black/50 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent backdrop-blur-sm text-gray-200 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-black/50 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent backdrop-blur-sm text-gray-200 w-48"
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
        </div>
      </div>

      <div className="space-y-6">
        {filteredSessions.map((session) => (
          <div 
            key={session.id} 
            className={`card hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 cursor-pointer
              ${expandedSession === session.id ? 'border-primary' : 'border-gray-800'}`}
            onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {session.images.length > 0 && (
                <div className="md:w-64 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={session.images[0]}
                      alt={session.title}
                      className="w-full h-48 object-cover rounded-lg border border-primary/20"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-[MedievalSharp] text-primary mb-3">{session.title}</h2>
                  <ChevronRight 
                    className={`w-6 h-6 text-primary transition-transform duration-300
                      ${expandedSession === session.id ? 'rotate-90' : ''}`}
                  />
                </div>
                <div className="flex items-center gap-4 text-gray-400 mb-4 font-serif">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {session.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {session.location}
                  </div>
                </div>
                <p className="text-gray-300 mb-4 font-serif italic">{session.summary}</p>
                <div className="flex flex-wrap gap-2">
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
            </div>

            {expandedSession === session.id && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-gray-300 mb-6 font-serif">{session.details}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-[MedievalSharp] text-primary flex items-center gap-2">
                      <Skull className="w-5 h-5" /> Discovered Clues
                    </h3>
                    <div className="space-y-3">
                      {session.clues.map((clue) => (
                        <div 
                          key={clue.id}
                          className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors duration-300"
                        >
                          <span className="text-2xl">{getItemIcon(clue.type)}</span>
                          <div>
                            <h4 className="font-serif font-semibold text-gray-200">{clue.name}</h4>
                            <p className="text-gray-400 text-sm">{clue.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-[MedievalSharp] text-primary flex items-center gap-2">
                      <Skull className="w-5 h-5" /> Collected Items
                    </h3>
                    <div className="space-y-3">
                      {session.items.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors duration-300"
                        >
                          <span className="text-2xl">{getItemIcon(item.type)}</span>
                          <div>
                            <h4 className="font-serif font-semibold text-gray-200">{item.name}</h4>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionNotes;