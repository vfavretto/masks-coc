import { useState, useRef, MouseEvent } from 'react';
import { Pin, FileText, User, MapPin, Link as LinkIcon, Plus } from 'lucide-react';
import { Node, Connection } from '../types/index';


interface InvestigationBoardProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const InvestigationBoard: React.FC<InvestigationBoardProps> = ({ nodes, setNodes }) => {

  const [connections] = useState<Connection[]>([
    { from: 1, to: 2, label: 'Crime Scene' },
    { from: 2, to: 3, label: 'Interviewed Here' }
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, nodeId: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDraggedNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedNode || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - dragOffset.x;
    const newY = e.clientY - boardRect.top - dragOffset.y;

    setNodes(nodes.map(node => 
      node.id === draggedNode 
        ? { ...node, x: Math.max(0, Math.min(newX, boardRect.width - 200)), y: Math.max(0, Math.min(newY, boardRect.height - 100)) }
        : node
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const getNodeIcon = (type: Node['type']) => {
    switch (type) {
      case 'evidence': return <FileText className="w-4 h-4" />;
      case 'person': return <User className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      default: return <Pin className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: Node['type']) => {
    switch (type) {
      case 'evidence': return 'border-red-500';
      case 'person': return 'border-blue-500';
      case 'location': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className="w-full h-[800px] relative overflow-hidden bg-neutral-900 border border-primary/20 rounded-lg">
      <div className="absolute inset-0 bg-[url('/texture.png')] opacity-5" />
      
      <div 
        ref={boardRef}
        className="relative w-full h-full cursor-move"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map(({ from, to, label }) => {
            const fromNode = nodes.find(n => n.id === from);
            const toNode = nodes.find(n => n.id === to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 100;
            const y1 = fromNode.y + 50;
            const x2 = toNode.x + 100;
            const y2 = toNode.y + 50;

            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  fill="#ef4444"
                  className="text-xs"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute w-48 p-4 rounded-lg border-2 bg-black/80 backdrop-blur-sm cursor-move
              ${getNodeColor(node.type)} hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300`}
            style={{ left: node.x, top: node.y }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              {getNodeIcon(node.type)}
              <h3 className="text-sm font-bold text-primary font-[MedievalSharp]">
                {node.title}
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-serif">{node.content}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors">
          <Plus className="w-4 h-4 text-primary" />
        </button>
        <button className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors">
          <LinkIcon className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default InvestigationBoard;