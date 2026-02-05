import { Session } from '@/types';
import { getItemIcon } from '@/hooks/useSessions';
import { 
  Calendar,
  MapPin,
  Tag,
  ChevronRight,
  Skull,
  Edit,
  Trash2,
  FileText,
  Search,
  Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MarkdownEditor from '@/components/MarkdownEditor';

interface SessionCardProps {
  session: Session;
  isExpanded: boolean;
  loading: boolean;
  activeTab: 'notes' | 'clues' | 'items';
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTabChange: (tab: 'notes' | 'clues' | 'items') => void;
  onImageClick: (src: string, alt: string) => void;
}

export function SessionCard({
  session,
  isExpanded,
  loading,
  activeTab,
  onToggleExpand,
  onEdit,
  onDelete,
  onTabChange,
  onImageClick
}: SessionCardProps) {
  return (
    <Card 
      className={`transition-all duration-500 hover:shadow-lg hover:shadow-primary/20
        ${isExpanded ? 'border-primary' : 'border-border'}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Session Image */}
          {session.images.length > 0 && (
            <div className="md:w-64 flex-shrink-0">
              <div 
                className="relative cursor-pointer group" 
                onClick={() => onImageClick(session.images[0], session.title)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                  <div className="bg-black/70 rounded-full p-2">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                </div>
                <img
                  src={session.images[0]}
                  alt={session.title}
                  className="w-full h-48 object-cover rounded-lg border border-border transition-transform group-hover:scale-105"
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
                <h2 className="text-2xl font-bold text-primary mb-3">{session.title}</h2>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {session.location}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 italic">{session.summary}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-primary/30">
                      <Tag className="w-3 h-3 mr-1 text-primary" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  disabled={loading}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  disabled={loading}
                  className="hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                >
                  <ChevronRight 
                    className={`w-5 h-5 transition-transform duration-300
                      ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-border">
            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              <button
                onClick={() => onTabChange('notes')}
                className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'notes'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4" />
                Session Notes
              </button>
              <button
                onClick={() => onTabChange('clues')}
                className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'clues'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Search className="w-4 h-4" />
                Clues ({session.clues.length})
              </button>
              <button
                onClick={() => onTabChange('items')}
                className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'items'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Package className="w-4 h-4" />
                Items ({session.items.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'notes' && (
              <div className="prose prose-invert max-w-none">
                <MarkdownEditor
                  value={session.details}
                  onChange={() => {}}
                  placeholder=""
                  rows={1}
                  readOnly={true}
                />
              </div>
            )}

            {activeTab === 'clues' && (
              <div className="space-y-4">
                <h3 className="text-xl text-primary flex items-center gap-2">
                  <Skull className="w-5 h-5" /> Discovered Clues
                </h3>
                <div className="grid gap-4">
                  {session.clues.length > 0 ? session.clues.map((clue) => (
                    <div 
                      key={clue.id}
                      className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {clue.image && (
                          <div 
                            className="cursor-pointer group relative"
                            onClick={() => onImageClick(clue.image!, clue.name)}
                          >
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                              <Search className="w-4 h-4 text-white" />
                            </div>
                            <img
                              src={clue.image}
                              alt={clue.name}
                              className="w-20 h-20 object-cover rounded border border-border transition-transform group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground text-lg">{clue.name}</h4>
                            <span className="text-2xl">{getItemIcon(clue.type)}</span>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            {clue.tag && (
                              <Badge variant="default" className="mr-2">
                                <Tag className="w-3 h-3 mr-1" />
                                {clue.tag}
                              </Badge>
                            )}
                            {clue.location && (
                              <Badge variant="secondary">
                                <MapPin className="w-3 h-3 mr-1" />
                                {clue.location}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="prose prose-invert prose-sm max-w-none">
                            <MarkdownEditor
                              value={clue.description}
                              onChange={() => {}}
                              placeholder=""
                              rows={1}
                              readOnly={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground italic">No clues discovered yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div className="space-y-4">
                <h3 className="text-xl text-primary flex items-center gap-2">
                  <Package className="w-5 h-5" /> Collected Items
                </h3>
                <div className="grid gap-4">
                  {session.items.length > 0 ? session.items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <span className="text-2xl">{getItemIcon(item.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <MarkdownEditor
                            value={item.description}
                            onChange={() => {}}
                            placeholder=""
                            rows={1}
                            readOnly={true}
                          />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground italic">No items collected yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
