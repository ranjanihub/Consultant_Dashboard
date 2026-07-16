import { useState, useMemo } from "react";
import { useGetCalendarEvents } from "@workspace/api-client-react";
import SetAvailabilityDialog from "@/components/SetAvailabilityDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  Plus,
  Globe,
  Users,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── helpers ─────────────────────────────────────────────── */
const DAYS_SHORT  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS      = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

function startOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function daysInMonth (y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }

/* Mock sessions keyed by "YYYY-M-D" */
const SESSION_DATA: Record<string, { client: string; initials: string; time: string; type: string; duration: string }[]> = {
  "2025-7-7":  [
    { client: "Emma Martinez",  initials: "EM", time: "10:30 AM", type: "CBT · Follow-up",        duration: "50 min" },
    { client: "James Chen",     initials: "JC", time: "12:00 PM", type: "CBT · Intake",            duration: "60 min" },
    { client: "Priya Kapoor",   initials: "PK", time: "2:15 PM",  type: "EMDR · Session 4",        duration: "50 min" },
    { client: "Marcus ONeill",  initials: "MO", time: "4:00 PM",  type: "Couples Therapy",         duration: "80 min" },
    { client: "Hana Suzuki",    initials: "HS", time: "5:30 PM",  type: "CBT · Session 11",        duration: "50 min" },
    { client: "David Kim",      initials: "DK", time: "6:30 PM",  type: "Crisis Check-in",         duration: "30 min" },
  ],
  "2025-7-8":  [
    { client: "Olivia Bennett", initials: "OB", time: "10:00 AM", type: "CBT · Session 8",         duration: "50 min" },
    { client: "Ryan Alvarez",   initials: "RA", time: "11:00 AM", type: "ACT · Session 3",         duration: "50 min" },
  ],
  "2025-7-9":  [
    { client: "David Kim",      initials: "DK", time: "9:00 AM",  type: "CBT · Weekly Check-in",  duration: "50 min" },
    { client: "Tom Bradley",    initials: "TB", time: "11:00 AM", type: "ACT · Session 7",         duration: "50 min" },
    { client: "Nina Patel",     initials: "NP", time: "2:00 PM",  type: "CBT · Session 2",         duration: "50 min" },
    { client: "Isabelle Fontaine", initials: "IF", time: "4:00 PM", type: "CBT · Session 9",       duration: "50 min" },
  ],
  "2025-7-10": [
    { client: "Alex Thompson",  initials: "AT", time: "10:00 AM", type: "CBT · Session 12",        duration: "50 min" },
    { client: "Fatima Hassan",  initials: "FH", time: "2:00 PM",  type: "ACT · Session 5",         duration: "50 min" },
  ],
  "2025-7-11": [
    { client: "Hana Suzuki",    initials: "HS", time: "10:00 AM", type: "CBT · Session 12",        duration: "50 min" },
    { client: "Sofia Rodriguez",initials: "SR", time: "1:00 PM",  type: "ACT · Session 8",         duration: "50 min" },
    { client: "Lucy Wang",      initials: "LW", time: "3:00 PM",  type: "CBT · Session 14",        duration: "50 min" },
  ],
  "2025-7-14": [
    { client: "Emma Martinez",  initials: "EM", time: "10:30 AM", type: "CBT · Session 13",        duration: "50 min" },
    { client: "Chris Anderson", initials: "CA", time: "2:00 PM",  type: "DBT · Session 11",        duration: "50 min" },
  ],
  "2025-7-15": [
    { client: "Amara Johnson",  initials: "AJ", time: "11:00 AM", type: "ACT · Session 9",         duration: "50 min" },
    { client: "Kevin Park",     initials: "KP", time: "3:00 PM",  type: "CBT · Session 7",         duration: "50 min" },
    { client: "Jake Morrison",  initials: "JM", time: "5:00 PM",  type: "CBT · Session 10",        duration: "50 min" },
  ],
  "2025-7-16": [
    { client: "Priya Kapoor",   initials: "PK", time: "2:00 PM",  type: "EMDR · Session 5",        duration: "50 min" },
    { client: "Samuel Okafor",  initials: "SO", time: "4:00 PM",  type: "CBT · Session 6",         duration: "50 min" },
  ],
};

/* Session dot indicator colours */
function dotColor(count: number) {
  if (count >= 5) return "bg-primary";
  if (count >= 3) return "bg-primary/60";
  return "bg-primary/30";
}

/* ─── component ───────────────────────────────────────────── */
export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [year,  setYear]  = useState(2025);
  const [month, setMonth] = useState(6); // 0-indexed, 6 = July
  const [selectedDay, setSelectedDay] = useState(7); // July 7
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  const { data: events } = useGetCalendarEvents({ query: {} });

  const sessionKey = `${year}-${month + 1}-${selectedDay}`;
  const daySessions = SESSION_DATA[sessionKey] ?? [];

  /* calendar grid */
  const firstDay  = startOfMonth(year, month);
  const totalDays = daysInMonth(year, month);
  const cells = Array.from({ length: firstDay + totalDays }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(1);
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="space-y-6 pb-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your availability and scheduled sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white" onClick={() => setAvailabilityOpen(true)}>
            Set Availability
          </Button>
          <Button className="shrink-0 bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendly-style 3-panel card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[580px]">

        {/* ── Panel 1: Therapist / event info ─────────────── */}
        <div className="lg:w-[260px] border-b lg:border-b-0 lg:border-r border-border p-8 flex flex-col gap-6">
          {/* Avatar */}
          <div>
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">
              SW
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Dr. Sarah Wilson</p>
            <h2 className="text-xl font-bold leading-snug">Therapy Session</h2>
          </div>

          {/* Meta */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 shrink-0 text-primary" />
              <span>50 minutes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 shrink-0 text-primary" />
              <span>Video · Zoom / Google Meet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 shrink-0 text-primary" />
              <span>Eastern Time – US &amp; Canada</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0 text-primary" />
              <span>24 active clients</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-auto pt-6 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">This week</span>
              <Badge className="bg-primary/10 text-primary border-0 font-semibold">
                {Object.values(SESSION_DATA).flat().length} sessions
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today</span>
              <Badge className="bg-green-100 text-green-700 border-0 font-semibold">
                {daySessions.length} booked
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <Badge className="bg-secondary text-foreground border-0 font-semibold">
                2 open slots
              </Badge>
            </div>
          </div>
        </div>

        {/* ── Panel 2: Month calendar picker ──────────────── */}
        <div className="lg:w-[340px] border-b lg:border-b-0 lg:border-r border-border p-8">
          <p className="text-sm font-semibold text-foreground mb-5">Select a Date &amp; Time</p>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-[15px]">{MONTHS[month]} {year}</span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
                {d.slice(0, 2)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const key   = `${year}-${month + 1}-${day}`;
              const count = SESSION_DATA[key]?.length ?? 0;
              const sel   = day === selectedDay;
              const tod   = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-full w-9 h-9 mx-auto text-sm font-medium transition-all",
                    sel  && "bg-primary text-white shadow-md",
                    !sel && tod  && "border-2 border-primary text-primary font-bold",
                    !sel && !tod && "text-foreground hover:bg-secondary",
                  )}
                >
                  {day}
                  {count > 0 && !sel && (
                    <span className={cn(
                      "absolute bottom-0.5 w-1.5 h-1.5 rounded-full",
                      dotColor(count)
                    )} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-5 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              High load
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/40" />
              Moderate
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/20" />
              Light
            </div>
          </div>
        </div>

        {/* ── Panel 3: Time slots for selected day ─────────── */}
        <div className="flex-1 p-8 overflow-y-auto">
          <p className="text-sm font-semibold text-foreground mb-1">
            {MONTHS[month]} {selectedDay}, {year}
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            {daySessions.length > 0
              ? `${daySessions.length} session${daySessions.length !== 1 ? "s" : ""} scheduled`
              : "No sessions — day is open"}
          </p>

          {daySessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-center">
              <CalendarDays className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No sessions on this day</p>
              <p className="text-xs text-muted-foreground mt-1">Available for new bookings</p>
              <Button size="sm" className="mt-5 bg-primary text-white">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Schedule Session
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {daySessions.map((s, i) => {
                const isConfirmed = confirmedSlot === `${sessionKey}-${i}`;
                return (
                  <div
                    key={i}
                    className={cn(
                      "group flex items-center gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                      isConfirmed
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 hover:bg-secondary/30"
                    )}
                    onClick={() =>
                      setConfirmedSlot(isConfirmed ? null : `${sessionKey}-${i}`)
                    }
                  >
                    {/* Time pill */}
                    <div className={cn(
                      "shrink-0 w-20 text-center py-2 rounded-lg text-sm font-bold transition-colors",
                      isConfirmed
                        ? "bg-primary text-white"
                        : "bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {s.time}
                    </div>

                    {/* Avatar */}
                    <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {s.initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{s.client}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.type} · {s.duration}</p>
                    </div>

                    {/* Status */}
                    {isConfirmed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Badge className="bg-green-100 text-green-700 border-0 text-[11px] shrink-0">
                        Confirmed
                      </Badge>
                    )}
                  </div>
                );
              })}

              {/* Open slot button */}
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 text-primary text-sm font-medium py-3 hover:bg-primary/5 transition-colors mt-2">
                <Plus className="w-4 h-4" />
                Add session on this day
              </button>
            </div>
          )}
        </div>
      </div>

      <SetAvailabilityDialog open={availabilityOpen} onOpenChange={setAvailabilityOpen} />
    </div>
  );
}
