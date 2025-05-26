// Types based on backend entities

export interface Stats {
    For: number;
    Con: number;
    Tam: number;
    Des: number;
    Apa: number;
    Edu: number;
    Int: number;
    Pod: number;
}

export interface MentalHealth {
    sanity: number;
    maxSanity: number;
    tempSanity: boolean;
    indefiniteSanity: boolean;
    phobias: string[];
    manias: string[];
}

export interface Skill {
    name: string;
    value: number;
    category: 'combat' | 'academic' | 'pratical' | 'social';
}

export interface Equipment {
    name: string;
    description: string;
    type: 'weapon' | 'tool' | 'book' | 'artifact';
}

export interface Character {
    id: string;
    name: string;
    occupation: string;
    image: string;
    stats: Stats;
    background: string;
    mentalHealth: MentalHealth;
    skills: Skill[];
    equipment: Equipment[];
    pulpTalents: string[];
    wounds: number;
    maxHealth: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Clue {
    id: string;
    name: string;
    description: string;
    type: string;
    image?: string;
    tag?: string;
    location?: string;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: string;
}

export interface Session {
    id: string;
    title: string;
    date: string;
    location: string;
    summary: string;
    details: string;
    tags: string[];
    images: string[];
    clues: Clue[];
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}

// Form types for creating/updating
export interface CharacterFormData {
    name: string;
    occupation: string;
    image: string;
    stats: Stats;
    background: string;
    mentalHealth: MentalHealth;
    skills: Skill[];
    equipment: Equipment[];
    pulpTalents: string[];
    wounds: number;
    maxHealth: number;
}

export interface SessionFormData {
    title: string;
    date: string;
    location: string;
    summary: string;
    details: string;
    tags: string[];
    images: string[];
    clues: Clue[];
    items: Item[];
}

// Investigation Board types
export interface Node {
    id: number;
    type: 'evidence' | 'person' | 'location';
    title: string;
    content: string;
    date?: string;
    importance?: 'low' | 'medium' | 'high';
    status?: 'verified' | 'unverified';
    x: number;
    y: number;
}

export interface Connection {
    from: number;
    to: number;
    label: string;
}

// Legacy interface for backwards compatibility
export interface SessionNote {
    id: string;
    title: string;
    date: string;
    location: string;
    summary: string;
    content: string;
    tags: string[];
    images: string[];
}