import { Edit2, Save, Skull, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Case } from '@/hooks/useInvestigation';

interface CasePanelProps {
  caseDetails: Case;
  isEditing: boolean;
  onUpdate: (updates: Partial<Case>) => void;
  onToggleEdit: () => void;
  onSave: () => void;
}

export function CasePanel({ caseDetails, isEditing, onUpdate, onToggleEdit, onSave }: CasePanelProps) {
  return (
    <div className="max-w-4xl mx-auto mb-10 w-full space-y-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Eye className="w-8 h-8 text-primary/60 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-[MedievalSharp] text-primary text-center leading-tight">
          Investigation Board
        </h1>
        <Eye className="w-8 h-8 text-primary/60 animate-pulse" />
      </div>

      <Card className="bg-black/60 border-primary/30 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <CardHeader className="relative pb-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleEdit}
              className="absolute top-4 right-4 hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3 text-primary mb-2">
            <Skull className="w-6 h-6" />
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-70">Current Case Directive</h2>
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Input
                type="text"
                value={caseDetails.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="text-2xl font-[MedievalSharp] text-primary h-14 bg-black/50 border-primary/40 focus:border-primary"
                placeholder="Case Title"
              />
              <Textarea
                value={caseDetails.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="font-serif text-lg min-h-[120px] bg-black/50 border-primary/40 focus:border-primary resize-none"
                placeholder="Case Description..."
              />
              <div className="flex justify-end pt-2">
                <Button onClick={onSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-3xl font-[MedievalSharp] text-foreground border-b border-primary/10 pb-4">
                {caseDetails.title}
              </h3>
              <p className="text-lg text-muted-foreground font-serif italic leading-relaxed pl-4 border-l-2 border-primary/30">
                "{caseDetails.description}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
