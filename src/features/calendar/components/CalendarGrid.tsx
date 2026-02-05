import { format, isToday, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/hooks/useCalendar';

interface CalendarGridProps {
  currentDate: Date;
  days: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  getEventsForDay: (date: Date) => Event[];
}

export function CalendarGrid({
  currentDate,
  days,
  selectedDate,
  onSelectDate,
  onNextMonth,
  onPrevMonth,
  getEventsForDay
}: CalendarGridProps) {
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="border-primary/20 bg-black/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-2xl font-[MedievalSharp] text-primary">
          {format(currentDate, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onPrevMonth} className="hover:text-primary">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNextMonth} className="hover:text-primary">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-[MedievalSharp] text-primary/80 py-2 text-sm uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => onSelectDate(day)}
                className={`
                  relative min-h-[80px] p-2 rounded-lg cursor-pointer border transition-all duration-200
                  flex flex-col items-start justify-between group
                  ${isCurrentMonth ? 'bg-card/50' : 'bg-transparent opacity-30'}
                  ${isSelected ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(201,165,92,0.2)]' : 'border-transparent hover:border-primary/30 hover:bg-white/5'}
                  ${isTodayDate ? 'ring-1 ring-primary ring-offset-2 ring-offset-black' : ''}
                `}
              >
                <span className={`text-sm font-serif ${dayEvents.length > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {format(day, 'd')}
                </span>
                
                <div className="w-full flex flex-wrap gap-1 content-end">
                  {dayEvents.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
