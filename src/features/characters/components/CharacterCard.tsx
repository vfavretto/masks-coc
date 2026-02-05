import { Character } from '@/types';
import { getSkillIcon, getEquipmentIcon } from '@/hooks/useCharacters';
import { 
  ChevronRight, 
  Heart, 
  Brain, 
  Book, 
  Shield,
  Edit, 
  Trash2 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CharacterCardProps {
  character: Character;
  isExpanded: boolean;
  loading: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CharacterCard({
  character,
  isExpanded,
  loading,
  onToggleExpand,
  onEdit,
  onDelete
}: CharacterCardProps) {
  return (
    <Card 
      className={`transition-all duration-500 hover:shadow-lg hover:shadow-primary/20
        ${isExpanded ? 'border-primary' : 'border-border'}`}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <img
            src={character.image}
            alt={character.name}
            className="w-24 h-24 rounded-lg object-cover border-2 border-primary/20"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/96x96?text=?';
            }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {character.name}
                </h2>
                <p className="text-muted-foreground italic">{character.occupation}</p>
              </div>
              <div className="flex gap-2">
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

        {/* Stats Grid */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">Atributos</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(character.stats).map(([stat, value]) => (
              <div 
                key={stat} 
                className="p-3 text-center border border-border rounded-lg hover:border-primary/40 transition-colors"
              >
                <div className="text-sm text-muted-foreground uppercase">{stat}</div>
                <div className="text-lg font-bold text-primary">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 space-y-6">
            {/* Health and Sanity Bars */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Saúde
                </h3>
                <div className="h-4 bg-background rounded-full overflow-hidden border border-border">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${((character.maxHealth - character.wounds) / character.maxHealth) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {character.maxHealth - character.wounds}/{character.maxHealth}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Brain className="w-5 h-5" /> Sanidade
                </h3>
                <div className="h-4 bg-background rounded-full overflow-hidden border border-border">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(character.mentalHealth.sanity / character.mentalHealth.maxSanity) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {character.mentalHealth.sanity}/{character.mentalHealth.maxSanity}
                </p>
              </div>
            </div>

            {/* Skills */}
            {character.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                  <Book className="w-5 h-5" /> Habilidades Principais
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {character.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <span className="text-xl">{getSkillIcon(skill.category)}</span>
                      <div className="flex-1 flex justify-between items-center">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="text-primary font-bold">{skill.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {character.equipment.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Equipamentos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {character.equipment.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 p-2 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <span className="text-xl">{getEquipmentIcon(item.type)}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pulp Talents */}
            {character.pulpTalents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Talentos Pulp</h3>
                <div className="flex flex-wrap gap-2">
                  {character.pulpTalents.map((talent, index) => (
                    <Badge key={index} variant="outline" className="border-primary/30">
                      {talent}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Mental Conditions */}
            {(character.mentalHealth.phobias.length > 0 || 
              character.mentalHealth.manias.length > 0 || 
              character.mentalHealth.tempSanity || 
              character.mentalHealth.indefiniteSanity) && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Condições Mentais</h3>
                <div className="space-y-2">
                  {character.mentalHealth.tempSanity && (
                    <p className="text-yellow-500 italic">⚠️ Insanidade Temporária</p>
                  )}
                  {character.mentalHealth.indefiniteSanity && (
                    <p className="text-destructive italic">💀 Insanidade Indefinida</p>
                  )}
                  {character.mentalHealth.phobias.map((phobia, index) => (
                    <p key={index} className="text-destructive italic">🔥 Fobia: {phobia}</p>
                  ))}
                  {character.mentalHealth.manias.map((mania, index) => (
                    <p key={index} className="text-yellow-500 italic">⚡ Mania: {mania}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Background */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">História</h3>
              <p className="text-muted-foreground italic">{character.background}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
