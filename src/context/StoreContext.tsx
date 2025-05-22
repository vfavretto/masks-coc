import React, { createContext, useContext, useState, useCallback } from 'react';
import { SessionNote, CalendarEvent, Tag } from '../types';

interface StoreContextType {
  sessions: SessionNote[];
  events: CalendarEvent[];
  tags: Tag[];
  addSession: (session: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSession: (id: string, session: Partial<SessionNote>) => void;
  deleteSession: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<SessionNote[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const addSession = useCallback((session: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: SessionNote = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => [...prev, newSession]);
  }, []);

  const updateSession = useCallback((id: string, sessionUpdate: Partial<SessionNote>) => {
    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...sessionUpdate, updatedAt: new Date().toISOString() }
        : session
    ));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, eventUpdate: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...eventUpdate, updatedAt: new Date().toISOString() }
        : event
    ));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const addTag = useCallback((tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID(),
    };
    setTags(prev => [...prev, newTag]);
  }, []);

  return (
    <StoreContext.Provider value={{
      sessions,
      events,
      tags,
      addSession,
      updateSession,
      deleteSession,
      addEvent,
      updateEvent,
      deleteEvent,
      addTag,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};