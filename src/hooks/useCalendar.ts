import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths } from 'date-fns';

export interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  description: string;
  type?: 'session' | 'workshop' | 'other';
}

const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Next Session: The Haunting',
    date: new Date(2025, 2, 23), // Adjusting year to be more current/future-proof
    time: '7:00 PM EST',
    description: 'Continuing our investigation of the Corbitt House.',
    type: 'session'
  },
  {
    id: 2,
    title: 'Character Creation Workshop',
    date: new Date(2025, 2, 30),
    time: '6:00 PM EST',
    description: 'Help new players create their investigators.',
    type: 'workshop'
  },
];

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<Event[]>(INITIAL_EVENTS);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));

  const getEventsForDay = (date: Date) => events.filter(event => isSameDay(event.date, date));
  
  const selectedDayEvents = selectedDate 
    ? events.filter(event => isSameDay(event.date, selectedDate))
    : events.filter(event => isSameMonth(event.date, currentDate));

  return {
    currentDate,
    selectedDate,
    days,
    events,
    selectedDayEvents,
    setSelectedDate,
    nextMonth,
    prevMonth,
    getEventsForDay,
  };
}
