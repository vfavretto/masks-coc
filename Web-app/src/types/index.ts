export interface SessionNote {
    id: string;
    title: string;
    date: string;
    location: string;
    summary: string;
    content: string;
    tags: string[];
    images: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    description: string;
    type: 'session' | 'workshop' | 'other';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
    color: string;
  }