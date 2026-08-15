import { useState, useMemo } from "react";
import { useGetCalendarEvents } from "@workspace/api-client-react";
import SetAvailabilityDialog from "@/components/SetAvailabilityDialog";
import AddEventDialog from "@/components/AddEventDialog";
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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";

/* ─── helpers ─────────────────────────────────────────────── */
const DAYS_SHORT  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS      = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

function startOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function daysInMonth (y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }

/* Mock sessions keyed by "YYYY-M-D" */
const SESSION_DATA: Record<string, { client: string; initials: string; time: string; type: string; duration: string }[]> = {
  "2026-7-27": [
    { client: "Sarah Jenkins",  initials: "SJ", time: "09:00 AM", type: "CBT · Cognitive Restructuring", duration: "60 min" },
    { client: "Michael Chen",   initials: "MC", time: "10:30 AM", type: "ACT · Values Clarification",    duration: "60 min" },
    { client: "David Kim",      initials: "DK", time: "02:00 PM", type: "CBT · Exposure Hierarchy",     duration: "60 min" },
    { client: "Emily Rodriguez",initials: "ER", time: "04:30 PM", type: "DBT · Distress Tolerance",     duration: "60 min" },
  ],
  "2026-7-28": [
    { client: "Sarah Jenkins",  initials: "SJ", time: "10:00 AM", type: "CBT · Session 13",             duration: "50 min" },
    { client: "Michael Chen",   initials: "MC", time: "02:00 PM", type: "ACT · Session 9",              duration: "50 min" },
  ],
  "2026-7-29": [
    { client: "David Kim",      initials: "DK", time: "09:00 AM", type: "CBT · Session 3",              duration: "50 min" },
    { client: "Emily Rodriguez",initials: "ER", time: "11:00 AM", type: "DBT · Session 16",             duration: "50 min" },
  ],
  "2026-7-30": [
    { client: "Sarah Jenkins",  initials: "SJ", time: "10:00 AM", type: "CBT · Check-in",               duration: "50 min" },
    { client: "Michael Chen",   initials: "MC", time: "02:00 PM", type: "ACT · Behavioral Activation",   duration: "50 min" },
  ],
  "2026-7-31": [
    { client: "Emily Rodriguez",initials: "ER", time: "01:00 PM", type: "DBT · Mindfulness",            duration: "50 min" },
    { client: "Jessica Taylor", initials: "JT", time: "03:00 PM", type: "CBT · Graduation Check-in",    duration: "50 min" },
  ],
};

/* Session dot indicator colours */
function dotColor(count: number) {
  if (count >= 5) return "bg-[#5e2be2]";
  if (count >= 3) return "bg-[#5e2be2]/60";
  return "bg-[#5e2be2]/30";
}

/* ─── component ───────────────────────────────────────────── */
export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(6); // 0-indexed, 6 = July
  const [selectedDay, setSelectedDay] = useState(27); // July 27
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  const { data: events } = useGetCalendarEvents();

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
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Schedule & Availability"
        description="Manage consultation hours, view scheduled sessions, and organize appointment slots."
        badge="CALENDAR & BOOKINGS"
        icon={<CalendarDays className="w-4 h-4 text-purple-200" />}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAvailabilityOpen(true)}
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-full border border-white/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Set Availability</span>
          </button>
          <button
            type="button"
            onClick={() => setAddEventOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#5e2be2] hover:bg-white/90 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Event</span>
          </button>
        </div>
      </PageHeader>

      {/* Modern 12-Column Responsive Grid Container for Laptop & Desktop */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-[600px]">

        {/* ── Panel 1: Therapist / Event Info (lg:col-span-3) ─────────────── */}
        <div className="lg:col-span-3 p-5 xl:p-6 flex flex-col justify-between bg-slate-50/50 space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-extrabold text-[#5e2be2] uppercase tracking-wider block">Therapist Profile</span>
              <h2 className="text-base font-extrabold text-slate-900 truncate">Dr. Sarah Wilson</h2>
              <span className="text-xs text-slate-500 font-medium block">Clinical Director</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0 text-[#5e2be2]" />
                <span className="font-semibold text-slate-800">50 min Therapy Session</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 shrink-0 text-[#5e2be2]" />
                <span className="truncate">Video · Zoom / Google Meet</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 shrink-0 text-[#5e2be2]" />
                <span>IST (UTC +5:30)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0 text-[#5e2be2]" />
                <span>24 Active Clients</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="pt-5 border-t border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Weekly Capacity</span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">This Week</span>
                <span className="font-extrabold text-[#5e2be2] bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                  {Object.values(SESSION_DATA).flat().length} Sessions
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Selected Day</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                  {daySessions.length} Booked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Panel 2: Month Calendar Picker (lg:col-span-4) ──────────────── */}
        <div className="lg:col-span-4 p-5 xl:p-6 bg-white flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select Date</span>
            <span className="text-xs font-bold text-[#5e2be2] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {MONTHS[month]} {year}
            </span>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm text-slate-900">{MONTHS[month]} {year}</span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day-of-week Headers */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-[11px] font-extrabold text-slate-400 py-1 uppercase tracking-wider">
                {d.slice(0, 2)}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
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
                    "relative flex flex-col items-center justify-center rounded-2xl h-10 w-full text-xs font-bold transition-all cursor-pointer",
                    sel  && "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20 scale-105 z-10",
                    !sel && tod  && "border-2 border-[#5e2be2] text-[#5e2be2] bg-purple-50/50 font-extrabold",
                    !sel && !tod && "text-slate-700 hover:bg-slate-100/80",
                  )}
                >
                  <span>{day}</span>
                  {count > 0 && !sel && (
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full mt-0.5",
                      dotColor(count)
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Panel 3: Time Slots for Selected Day (lg:col-span-5) ─────────── */}
        <div className="lg:col-span-5 p-5 xl:p-6 bg-slate-50/30 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {MONTHS[month]} {selectedDay}, {year}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {daySessions.length > 0
                    ? `${daySessions.length} session${daySessions.length !== 1 ? "s" : ""} booked`
                    : "No appointments scheduled"}
                </p>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-[#5e2be2] border-purple-200 text-[11px] font-extrabold px-3 py-1">
                {daySessions.length > 0 ? "Bookings Active" : "Day Open"}
              </Badge>
            </div>

            {daySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[260px] text-center p-6 bg-white rounded-2xl border border-dashed border-slate-200">
                <CalendarDays className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-extrabold text-slate-800">No sessions scheduled</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">This day is currently clear for client appointments or open consultation slots.</p>
                <Button 
                  onClick={() => setAddEventOpen(true)}
                  size="sm" 
                  className="mt-5 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-[#5e2be2]/20 cursor-pointer"
                >
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
                        "group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer bg-white shadow-2xs hover:shadow-md",
                        isConfirmed
                          ? "border-[#5e2be2] ring-1 ring-[#5e2be2]/30 bg-purple-50/30"
                          : "border-slate-200/80 hover:border-purple-200"
                      )}
                      onClick={() =>
                        setConfirmedSlot(isConfirmed ? null : `${sessionKey}-${i}`)
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Time pill */}
                        <div className={cn(
                          "shrink-0 w-22 text-center py-2 rounded-xl text-xs font-black transition-all",
                          isConfirmed
                            ? "bg-[#5e2be2] text-white shadow-xs"
                            : "bg-slate-100 text-slate-800 group-hover:bg-purple-100 group-hover:text-[#5e2be2]"
                        )}>
                          {s.time}
                        </div>

                        {/* Client details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">{s.client}</span>
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {s.initials}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">{s.type} · {s.duration}</p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="shrink-0">
                        {isConfirmed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#5e2be2]" />
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-extrabold px-2.5 py-0.5">
                            Confirmed
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            onClick={() => setAddEventOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-purple-300 bg-white text-[#5e2be2] text-xs font-extrabold py-3 hover:bg-purple-50/80 transition-all cursor-pointer mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session Slot</span>
          </button>
        </div>
      </div>

      <SetAvailabilityDialog open={availabilityOpen} onOpenChange={setAvailabilityOpen} />
      <AddEventDialog
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        defaultDate={`${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`}
      />
    </div>
  );
}


