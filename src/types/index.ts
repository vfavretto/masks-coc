export interface Clue {
  id: number;
  title: string;
  content: string;
  position: { x: number; y: number };
  type: 'location' | 'evidence' | 'testimony' | 'suspect';
  date?: string;
  tags?: string[];
}

export interface Node {
  id: number;
  type: 'evidence' | 'person' | 'location';
  title: string;
  content: string;
  date?: string;
  importance: 'low' | 'medium' | 'high';
  status: 'unverified' | 'verified' | 'disproven';
  x: number;
  y: number;
}

export interface Connection {
  from: number;
  to: number;
  label: string;
}