import { useState } from 'react';
import { Node } from '@/types';

export interface Case {
  title: string;
  description: string;
  date: string;
}

const INITIAL_CASE: Case = {
  title: "The Mystery of Blackwater Hollow",
  description: "In a remote village surrounded by dense forests, residents have been vanishing without explanation. Survivors report strange noises coming from the central well and sightings of a hooded figure near the abandoned cemetery. The clues point to ancient rituals and buried secrets.",
  date: "January 15th, 1925",
};

const INITIAL_NODES: Node[] = [
  {
    id: 1,
    type: "evidence",
    title: "Torn Letter",
    content: 'A hastily written note mentioning "the blood moon" and the Gates of Blackwater',
    date: "January 15th, 1925", // Added date to match interface if needed, relying on 'any' spreading or Node type update
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
];

export function useInvestigation() {
  const [caseDetails, setCaseDetails] = useState<Case>(INITIAL_CASE);
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [isEditing, setIsEditing] = useState(false);

  const updateCase = (updates: Partial<Case>) => {
    setCaseDetails(prev => ({ ...prev, ...updates }));
  };

  const toggleEditing = () => setIsEditing(prev => !prev);
  const saveCase = () => setIsEditing(false);

  return {
    caseDetails,
    nodes,
    isEditing,
    setNodes,
    updateCase,
    toggleEditing,
    saveCase
  };
}
