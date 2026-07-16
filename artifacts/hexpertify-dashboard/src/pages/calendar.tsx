import { useState } from "react";
import { useGetCalendarEvents } from "@workspace/api-client-react";
import SetAvailabilityDialog from "@/components/SetAvailabilityDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Video, Calendar as CalendarIcon, Clock, Lock, User, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Simplified calendar view just to show the requested UI
export default function Calendar() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const { data: events, isLoading } = useGetCalendarEvents({
    query: {
      view,
      start: new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toISOString(),
      end: new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6)).toISOString(),
    }
  });

  const getEventStyle = (type: string) => {
    switch(type) {
      case 'session': return "bg-primary text-white border-primary-foreground/20";
      case 'blocked': return "bg-slate-100 text-slate-500 border-slate-200 border-dashed";
      case 'available': return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-secondary text-foreground";
    }
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'session': return <Video className="w-3 h-3 mr-1" />;
      case 'blocked': return <Lock className="w-3 h-3 mr-1" />;
      case 'available': return <Clock className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  // Mock schedule hours (9AM to 5PM)
  const hours = Array.from({ length: 9 }, (_, i) => i + 9);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="space-y-6 pb-10 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your availability and scheduled sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white" onClick={() => setAvailabilityOpen(true)}>Set Availability</Button>
          <Button className="shrink-0 bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-border flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-4 border-b border-border bg-white flex flex-row items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <Button variant="ghost" size="sm" onClick={() => setView('day')} className={cn("px-4 py-1.5 h-auto text-sm", view === 'day' && "bg-white shadow-sm")}>Day</Button>
              <Button variant="ghost" size="sm" onClick={() => setView('week')} className={cn("px-4 py-1.5 h-auto text-sm", view === 'week' && "bg-white shadow-sm")}>Week</Button>
              <Button variant="ghost" size="sm" onClick={() => setView('month')} className={cn("px-4 py-1.5 h-auto text-sm", view === 'month' && "bg-white shadow-sm")}>Month</Button>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-bold min-w-[150px] text-center">July 2024</h2>
              <Button variant="ghost" size="sm" className="text-primary font-medium hover:bg-primary/10">Today</Button>
            </div>
          </div>
          
          <div className="flex gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary"></div> Session</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></div> Available</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 border-dashed"></div> Blocked</div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto bg-slate-50/50">
          <div className="min-w-[800px] h-full flex flex-col">
            {/* Header row */}
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-border sticky top-0 bg-white z-10 shadow-sm">
              <div className="p-3 text-center border-r border-border flex items-end justify-center text-xs text-muted-foreground font-medium">GMT-4</div>
              {days.map((day, i) => (
                <div key={day} className="p-3 text-center border-r border-border last:border-r-0">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{day}</div>
                  <div className={cn("text-2xl font-bold mt-1", i === 1 ? "text-primary bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center mx-auto" : "")}>
                    {6 + i}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="flex-1 relative">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] h-[100px] border-b border-border/50 group">
                  <div className="border-r border-border text-xs text-muted-foreground text-center font-medium pt-2 bg-white relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                      {hour > 12 ? `${hour-12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                    </span>
                  </div>
                  {days.map((day, i) => (
                    <div key={`${day}-${hour}`} className="border-r border-border/50 last:border-r-0 relative group-hover:bg-slate-50/80 transition-colors p-1">
                      {/* Fake rendering some events based on mock logic to match visual */}
                      {i === 1 && hour === 10 && (
                        <div className="absolute top-1/2 left-2 right-2 h-[80px] bg-primary rounded-lg border border-primary-foreground/10 p-2 text-white shadow-md z-10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                          <div className="font-bold text-sm leading-tight mb-1 truncate">Emma Martinez</div>
                          <div className="text-xs text-primary-foreground/80 flex items-center opacity-90">
                            <Video className="w-3 h-3 mr-1 shrink-0" /> CBT · 50m
                          </div>
                        </div>
                      )}
                      
                      {i === 3 && hour === 13 && (
                        <div className="absolute top-2 left-2 right-2 h-[45px] bg-primary rounded-lg border border-primary-foreground/10 p-2 text-white shadow-md z-10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                          <div className="font-bold text-sm leading-tight flex items-center justify-between">
                            <span className="truncate">James Wilson</span>
                            <span className="text-[10px] bg-white/20 px-1.5 rounded text-white shrink-0">New</span>
                          </div>
                        </div>
                      )}

                      {i === 2 && hour === 15 && (
                        <div className="absolute top-2 left-2 right-2 h-[96px] bg-slate-100 rounded-lg border border-slate-200 border-dashed p-2 text-slate-500 z-10 overflow-hidden flex flex-col items-center justify-center text-center cursor-not-allowed">
                          <Lock className="w-4 h-4 mb-1 text-slate-400" />
                          <div className="font-bold text-xs">Admin Block</div>
                        </div>
                      )}

                      {i === 4 && hour === 11 && (
                        <div className="absolute top-2 left-2 right-2 h-[96px] bg-green-50 rounded-lg border border-green-200 p-2 text-green-700 z-10 overflow-hidden flex flex-col justify-center items-center text-center cursor-pointer hover:bg-green-100 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mb-1">
                            <Plus className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="font-bold text-xs">Open Slot</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              
              {/* Current time line indicator */}
              <div className="absolute left-[80px] right-0 top-[160px] h-px bg-red-500 z-20 pointer-events-none">
                <div className="absolute -left-2 -top-1 w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SetAvailabilityDialog open={availabilityOpen} onOpenChange={setAvailabilityOpen} />
    </div>
  );
}
