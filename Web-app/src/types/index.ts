export interface Clue {
  id: number;
  title: string;
  content: string;
  position: { x: number; y: number };
  type: 'location' | 'evidence' | 'testimony' | 'suspect';
  date?: string;
  tags?: string[];
}

export interface Connection {
  id: number;
  from: number;
  to: number;
  notes?: string;
}