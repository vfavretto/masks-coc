import { Calendar as CalendarIcon } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarGrid, EventList } from '@/features/calendar';

const Calendar = () => {
  const {
    currentDate,
    selectedDate,
    days,
    // events, // Unused in this view if we filter directly
    selectedDayEvents,
    setSelectedDate,
    nextMonth,
    prevMonth,
    getEventsForDay,
  } = useCalendar();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
          <CalendarIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-[MedievalSharp] text-primary drop-shadow-md">
          Campaign Calendar
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CalendarGrid
            currentDate={currentDate}
            days={days}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onNextMonth={nextMonth}
            onPrevMonth={prevMonth}
            getEventsForDay={getEventsForDay}
          />
        </div>

        <div className="lg:col-span-1">
          <EventList 
            events={selectedDayEvents} 
            selectedDate={selectedDate} 
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;