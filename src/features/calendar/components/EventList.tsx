import { format } from 'date-fns';
import { Clock, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Event } from '@/hooks/useCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventListProps {
  events: Event[];
  selectedDate: Date | null;
}

export function EventList({ events, selectedDate }: EventListProps) {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventTypeVariant = (type?: string) => {
    switch (type) {
      case 'session': return 'destructive';
      case 'workshop': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-[MedievalSharp] text-primary">
          {selectedDate 
            ? `Events for ${format(selectedDate, 'MMM do')}`
            : 'Upcoming Events'}
        </h2>
        <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <Card className="bg-transparent border-dashed border-primary/20">
            <CardContent className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-serif italic">No events scheduled.</p>
            </CardContent>
          </Card>
        ) : (
          sortedEvents.map((event) => (
            <Card 
              key={event.id}
              className="bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:translate-x-1"
            >
              <CardContent className="p-4 flex gap-4">
                <div className="flex flex-col items-center justify-center min-w-[60px] h-16 bg-black/40 rounded border border-primary/20">
                  <span className="text-xl font-bold text-primary font-[MedievalSharp] leading-none">
                    {format(event.date, 'd')}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                    {format(event.date, 'MMM')}
                  </span>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-foreground font-[MedievalSharp] text-lg leading-tight">
                      {event.title}
                    </h3>
                    {event.type && (
                      <Badge variant={getEventTypeVariant(event.type) as any} className="text-[10px] uppercase">
                        {event.type}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-primary/80 font-medium">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </div>
                  
                  <p className="text-sm text-muted-foreground font-serif leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
