import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, isSameMonth } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  description: string;
  type?: 'session' | 'workshop' | 'other';
}

const events: Event[] = [
  {
    id: 1,
    title: 'Next Session: The Haunting',
    date: new Date(2024, 2, 23),
    time: '7:00 PM EST',
    description: 'Continuing our investigation of the Corbitt House.',
    type: 'session'
  },
  {
    id: 2,
    title: 'Character Creation Workshop',
    date: new Date(2024, 2, 30),
    time: '6:00 PM EST',
    description: 'Help new players create their investigators.',
    type: 'workshop'
  },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (date: Date) => events.filter(event => isSameDay(event.date, date));

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'session': return 'border-red-800 bg-red-900/20';
      case 'workshop': return 'border-blue-800 bg-blue-900/20';
      default: return 'border-primary bg-primary/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <CalendarIcon className="w-8 h-8 text-primary" />
        <h1 className="heading mb-0 font-[MedievalSharp]">Campaign Calendar</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card hover:shadow-lg hover:shadow-primary/20 transition-all duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-[MedievalSharp] text-primary">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                  onClick={() => setCurrentDate(addMonths(currentDate, -1))}
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <button
                  className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-[MedievalSharp] text-primary py-2">
                  {day}
                </div>
              ))}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-2 text-center rounded-lg cursor-pointer border transition-all
                      ${isCurrentMonth ? 'text-gray-200' : 'text-gray-600'}
                      ${isSelected ? 'border-primary bg-primary/20' : 'border-transparent hover:border-primary/50'}
                      ${isToday(day) ? 'ring-1 ring-primary' : ''}
                    `}
                  >
                    <span className={dayEvents.length > 0 ? 'font-bold text-primary' : ''}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                          {dayEvents.map((_, idx) => (
                            <div
                              key={idx}
                              className="w-1 h-1 rounded-full bg-primary"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-[MedievalSharp] text-primary">Upcoming Events</h2>
            <button className="p-2 hover:bg-primary/20 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
          
          {events
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((event) => (
              <div 
                key={event.id} 
                className={`card border ${getEventTypeColor(event.type)} hover:shadow-lg hover:shadow-primary/20 transition-all duration-500`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-black/30 rounded-lg border border-primary/20">
                    <span className="text-primary font-bold">{format(event.date, 'd')}</span>
                    <span className="text-xs text-gray-400">{format(event.date, 'MMM')}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold font-[MedievalSharp] text-primary">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <p className="text-gray-300 mt-2 font-serif">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;