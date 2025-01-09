import { useState, useRef } from "react";
import {
  Image,
  StickyNote,
  MapPin,
  PlusCircle,
  Link as LinkIcon,
  X,
  Edit2,
} from "lucide-react";
import { Clue, Connection } from "../types";
import paperTexture from "../../assets/img/paper-texture.jpg"

const InvestigationBoard = () => {
  const [clues, setClues] = useState<Clue[]>([
    {
      id: 1,
      title: "Strange Symbols at Miskatonic",
      content:
        "Ancient runes discovered in basement. Professor Webb concerned.",
      position: { x: 120, y: 150 },
      type: "evidence",
      date: "1925-01-15",
      tags: ["occult", "university"],
    },
    {
      id: 2,
      title: "Missing Students",
      content: "Three students vanished after visiting library archives.",
      position: { x: 400, y: 300 },
      type: "suspect",
      date: "1925-01-20",
      tags: ["disappearance"],
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggingClue, setDraggingClue] = useState<number | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClue, setEditingClue] = useState<Clue | null>(null);
  const [caseTitle, setCaseTitle] = useState("Miskatonic Mysteries");
  const [editingTitle, setEditingTitle] = useState(false);

  const typeIcons = {
    location: <MapPin className="w-5 h-5" />,
    evidence: <Image className="w-5 h-5" />,
    testimony: <StickyNote className="w-5 h-5" />,
    suspect: <Image className="w-5 h-5" />,
  };

  const getTypeColor = (type: string) => {
    const colors = {
      location: "bg-blue-100 border-blue-300",
      evidence: "bg-red-100 border-red-300",
      testimony: "bg-yellow-100 border-yellow-300",
      suspect: "bg-purple-100 border-purple-300",
    };
    return colors[type as keyof typeof colors] || colors.evidence;
  };

  const handleDragStart = (id: number, e: React.DragEvent) => {
    setDraggingClue(id);
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!boardRef.current || !draggingClue) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 100;
    const y = e.clientY - rect.top - 50;

    setClues(
      clues.map((clue) =>
        clue.id === draggingClue ? { ...clue, position: { x, y } } : clue
      )
    );
    setDraggingClue(null);
  };

  const handleConnection = (clueId: number) => {
    if (connectingFrom === null) {
      setConnectingFrom(clueId);
    } else if (connectingFrom !== clueId) {
      setConnections([
        ...connections,
        { id: connections.length + 1, from: connectingFrom, to: clueId },
      ]);
      setConnectingFrom(null);
    }
  };

  const addNewClue = () => {
    const newClue: Clue = {
      id: clues.length + 1,
      title: "New Lead",
      content: "Add details...",
      position: { x: 300, y: 200 },
      type: "evidence",
      date: new Date().toISOString().split("T")[0],
    };
    setClues([...clues, newClue]);
    setEditingClue(newClue);
    setIsEditMode(true);
  };

  return (
    <div className="relative min-h-screen bg-[#2c2527] text-gray-200">
      <div
        className="absolute inset-0 bg-[#f4d03f] opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${paperTexture})`,
          backgroundBlendMode: "multiply",
          filter: "sepia(50%) contrast(90%)",
          mixBlendMode: "overlay",
        }}
      />

      <header className="p-6 bg-black/40 border-b border-primary/20 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-primary font-[MedievalSharp] mb-2">
          Investigation Board
        </h1>
        <div className="flex justify-between items-center">
          {editingTitle ? (
            <input
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="bg-transparent border-b text-gray-400 font-serif italic focus:outline-none"
              autoFocus
            />
          ) : (
            <p
              onClick={() => setEditingTitle(true)}
              className="text-gray-400 font-serif italic cursor-pointer hover:text-gray-300"
            >
              Case File: {caseTitle}
            </p>
          )}
          <button
            onClick={addNewClue}
            className="px-4 py-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-all"
          >
            <PlusCircle className="w-5 h-5 inline mr-2" />
            Add Clue
          </button>
        </div>
      </header>

      <div
        ref={boardRef}
        className="relative h-[calc(100vh-96px)] overflow-auto p-8"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map((conn) => {
            const fromClue = clues.find((c) => c.id === conn.from);
            const toClue = clues.find((c) => c.id === conn.to);
            if (!fromClue || !toClue) return null;

            return (
              <g key={conn.id}>
                <line
                  x1={fromClue.position.x + 100}
                  y1={fromClue.position.y + 50}
                  x2={toClue.position.x + 100}
                  y2={toClue.position.y + 50}
                  stroke="#ff6b6b"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </g>
            );
          })}
        </svg>

        {/* Clues */}
        {clues.map((clue) => (
          <div
            key={clue.id}
            className={`absolute w-[200px] p-4 rounded shadow-lg cursor-move
              ${getTypeColor(
                clue.type
              )} transform hover:-translate-y-1 transition-all duration-200`}
            style={{
              left: clue.position.x,
              top: clue.position.y,
              rotate: `${Math.random() * 3 - 1.5}deg`,
            }}
            draggable
            onDragStart={(e) => handleDragStart(clue.id, e)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {typeIcons[clue.type]}
                <h3 className="text-lg font-bold text-gray-800">
                  {clue.title}
                </h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleConnection(clue.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setEditingClue(clue);
                    setIsEditMode(true);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{clue.content}</p>
            {clue.date && (
              <div className="text-xs text-gray-500 italic">
                {new Date(clue.date).toLocaleDateString()}
              </div>
            )}
            {clue.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {clue.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Edit Modal */}
        {isEditMode && editingClue && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Clue</h2>
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setEditingClue(null);
                  }}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingClue.title}
                    onChange={(e) =>
                      setEditingClue({ ...editingClue, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    value={editingClue.content}
                    onChange={(e) =>
                      setEditingClue({
                        ...editingClue,
                        content: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={editingClue.type}
                    onChange={(e) =>
                      setEditingClue({
                        ...editingClue,
                        type: e.target.value as any,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="location">Location</option>
                    <option value="evidence">Evidence</option>
                    <option value="testimony">Testimony</option>
                    <option value="suspect">Suspect</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClues(clues.filter((c) => c.id !== editingClue.id));
                      setIsEditMode(false);
                      setEditingClue(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClues(
                        clues.map((c) =>
                          c.id === editingClue.id ? editingClue : c
                        )
                      );
                      setIsEditMode(false);
                      setEditingClue(null);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationBoard;
