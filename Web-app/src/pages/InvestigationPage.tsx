import { useState } from "react";
import {
  Skull,
  Eye,
  Search,
  Edit2,
  Save,
} from "lucide-react";
import InvestigationBoard from "../components/InvestigationBoard.tsx";
import { Node} from '../types/index.ts';

interface Case {
  title: string;
  description: string;
  date: string;
}


const InvestigationPage = () => {
  const [editingCase, setEditingCase] = useState(false);
  const [caseDetails, setCaseDetails] = useState<Case>({
    title: "The Mystery of Blackwater Hollow",
    description:
      "In a remote village surrounded by dense forests, residents have been vanishing without explanation. Survivors report strange noises coming from the central well and sightings of a hooded figure near the abandoned cemetery. The clues point to ancient rituals and buried secrets..",
    date: "January 15th, 1925",
  });

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 1,
      type: "evidence",
      title: "Torn Letter",
      content: 'A hastily written note mentioning "the blood moon" and the Gates of Blackwater',
      date: "January 15th, 1925",
      importance: "high",
      status: "verified",
      x: 200,
      y: 100,
    },
    {
      id: 2,
      type: "evidence",
      title: "Wax Cylinder Recording",
      content: "A recording of a terrified voice muttering in Latin, mentioning an incomplete name: “Nyarl…",
      importance: "medium",
      status: "verified",
      x: 400,
      y: 150,
    },
    {
        id: 3,
        type: "location",
        title: "Village Ledger",
        content: "A record book with notes about mysterious “tribute offerings” to a 'Watcher' dating back over 100 years",
        importance: "low",
        status: "verified",
        x: 300,
        y: 550,
      },
  ]);



  return (
    <div className="min-h-screen bg-neutral-900 text-gray-200">
      <div className="absolute inset-0 bg-[url('assets/img/paper-texture.jpg')] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Eye className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-[MedievalSharp] text-primary">
              Investigation Board
            </h1>
            <Eye className="w-12 h-12 text-primary animate-pulse" />
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="p-6 bg-black/40 border border-primary/20 rounded-lg relative">
              {!editingCase ? (
                <>
                  <button
                    onClick={() => setEditingCase(true)}
                    className="absolute top-4 right-4 p-2 hover:bg-primary/20 rounded-full transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-primary" />
                  </button>
                  <h2 className="text-2xl font-[MedievalSharp] text-primary mb-4 flex items-center gap-2">
                    <Skull className="w-6 h-6" />
                    Current Case: {caseDetails.title}
                  </h2>
                  <p className="text-gray-400 font-serif italic">
                    {caseDetails.description}
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={caseDetails.title}
                    onChange={(e) =>
                      setCaseDetails({ ...caseDetails, title: e.target.value })
                    }
                    className="w-full bg-black/50 border border-primary/20 rounded p-2 text-xl font-[MedievalSharp]"
                  />
                  <textarea
                    value={caseDetails.description}
                    onChange={(e) =>
                      setCaseDetails({
                        ...caseDetails,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-black/50 border border-primary/20 rounded p-2 font-serif min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingCase(false)}
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 bg-[url('/old-paper.png')] bg-cover rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-[MedievalSharp]">Evidence Map</h3>
            </div>
            <div className="text-sm font-serif text-gray-400">
              Last updated: {caseDetails.date}
            </div>
          </div>

          <InvestigationBoard nodes={nodes} setNodes={setNodes} />

          <div className="mt-4 text-sm text-gray-400 font-serif italic">
            * Drag items to rearrange them. Use the buttons below to add new
            evidence or connections.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;
