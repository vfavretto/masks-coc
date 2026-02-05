import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvestigationBoard from '@/components/InvestigationBoard';
import { Node } from '@/types';

interface EvidenceMapProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  lastUpdated: string;
}

export function EvidenceMap({ nodes, setNodes, lastUpdated }: EvidenceMapProps) {
  return (
    <Card className="border-primary/20 bg-[#1a1510] overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[url('/old-paper.png')] opacity-10 pointer-events-none mix-blend-overlay z-0" />
      
      <CardHeader className="relative z-10 border-b border-primary/10 bg-black/20 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="font-[MedievalSharp] tracking-wide">Evidence Connection Map</CardTitle>
          </div>
          <div className="text-sm font-serif text-muted-foreground italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative z-10">
        <div className="min-h-[800px] bg-neutral-900/50">
          <InvestigationBoard nodes={nodes} setNodes={setNodes} />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm border-t border-primary/10 text-xs text-center text-muted-foreground font-serif">
          * Drag items to rearrange connections. The truth lies within the web.
        </div>
      </CardContent>
    </Card>
  );
}
