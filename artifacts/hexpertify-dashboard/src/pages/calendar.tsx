import { useState, useMemo } from "react";
import { useGetCalendarEvents } from "@workspace/api-client-react";
import SetAvailabilityDialog from "@/components/SetAvailabilityDialog";
import AddEventDialog from "@/components/AddEventDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  Calendar as CalendarIcon,
  Trash2,
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
const INITIAL_SESSION_DATA: Record<string, { client: string; initials: string; time: string; type: string; duration: string; status: "booked" | "available" }[]> = {
  "2026-7-27": [
    { client: "Sarah Jenkins",          initials: "SJ",   time: "09:00 AM", type: "CBT · Cognitive Restructuring", duration: "60 min", status: "booked" },
    { client: "Michael Chen",           initials: "MC",   time: "10:30 AM", type: "ACT · Values Clarification",    duration: "60 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "12:00 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
    { client: "David Kim",              initials: "DK",   time: "02:00 PM", type: "CBT · Exposure Hierarchy",     duration: "60 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "03:30 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
    { client: "Emily Rodriguez",        initials: "ER",   time: "04:30 PM", type: "DBT · Distress Tolerance",     duration: "60 min", status: "booked" },
  ],
  "2026-7-28": [
    { client: "Sarah Jenkins",          initials: "SJ",   time: "10:00 AM", type: "CBT · Session 13",             duration: "50 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "11:30 AM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
    { client: "Michael Chen",           initials: "MC",   time: "02:00 PM", type: "ACT · Session 9",              duration: "50 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "04:00 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
  ],
  "2026-7-29": [
    { client: "David Kim",              initials: "DK",   time: "09:00 AM", type: "CBT · Session 3",              duration: "50 min", status: "booked" },
    { client: "Emily Rodriguez",        initials: "ER",   time: "11:00 AM", type: "DBT · Session 16",             duration: "50 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "01:30 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "03:30 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
  ],
  "2026-7-30": [
    { client: "Sarah Jenkins",          initials: "SJ",   time: "10:00 AM", type: "CBT · Check-in",               duration: "50 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "11:30 AM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
    { client: "Michael Chen",           initials: "MC",   time: "02:00 PM", type: "ACT · Behavioral Activation",   duration: "50 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "04:30 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
  ],
  "2026-7-31": [
    { client: "Open Consultation Slot", initials: "OPEN", time: "11:00 AM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
    { client: "Emily Rodriguez",        initials: "ER",   time: "01:00 PM", type: "DBT · Mindfulness",            duration: "50 min", status: "booked" },
    { client: "Jessica Taylor",         initials: "JT",   time: "03:00 PM", type: "CBT · Graduation Check-in",    duration: "50 min", status: "booked" },
    { client: "Open Consultation Slot", initials: "OPEN", time: "05:00 PM", type: "Available for Client Booking",  duration: "50 min", status: "available" },
  ],
};

const DEFAULT_DAY_SLOTS = [
  { client: "Open Consultation Slot", initials: "OPEN", time: "10:00 AM", type: "Available for Client Booking", duration: "50 min", status: "available" as const },
  { client: "Open Consultation Slot", initials: "OPEN", time: "02:30 PM", type: "Available for Client Booking", duration: "50 min", status: "available" as const },
];

/* Session dot indicator colours */
function dotColor(count: number) {
  if (count >= 5) return "bg-[#5e2be2]";
  if (count >= 3) return "bg-[#5e2be2]/60";
  return "bg-[#5e2be2]/30";
}

/* ─── component ───────────────────────────────────────────── */
export default function Calendar() {
  const { toast } = useToast();
  const today = useMemo(() => new Date(), []);
  const [year,  setYear]  = useState(2026);
  const [month, setMonth] = useState(6); // 0-indexed, 6 = July
  const [selectedDay, setSelectedDay] = useState(27); // July 27
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  // Dynamic session data state to support delete, reschedule, and available slots
  const [sessionData, setSessionData] = useState(INITIAL_SESSION_DATA);

  // Reschedule dialog state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<{ key: string; index: number; session: any } | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("2026-07-29");
  const [rescheduleTime, setRescheduleTime] = useState("11:00 AM");
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Assign client dialog state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{ key: string; index: number; slot: any } | null>(null);
  const [assignClientName, setAssignClientName] = useState("Sarah Jenkins");
  const [assignType, setAssignType] = useState("Individual CBT Therapy");

  const { data: events } = useGetCalendarEvents();

  const sessionKey = `${year}-${month + 1}-${selectedDay}`;
  const daySessions = sessionData[sessionKey] ?? DEFAULT_DAY_SLOTS;

  const bookedCount = daySessions.filter(s => s.status === 'booked' || s.client !== 'Open Consultation Slot').length;
  const availableCount = daySessions.filter(s => s.status === 'available' || s.client === 'Open Consultation Slot').length;

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

  const handleOpenReschedule = (key: string, index: number, session: any) => {
    setRescheduleTarget({ key, index, session });
    setRescheduleTime(session.time);
    setRescheduleDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`);
    setRescheduleReason("");
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleTarget) return;

    const { key: oldKey, index, session } = rescheduleTarget;
    const parts = rescheduleDate.split("-");
    const newKey = parts.length === 3 ? `${parseInt(parts[0])}-${parseInt(parts[1])}-${parseInt(parts[2])}` : oldKey;

    setSessionData((prev) => {
      const updated = { ...prev };
      
      // Remove from old key
      if (updated[oldKey]) {
        updated[oldKey] = updated[oldKey].filter((_, i) => i !== index);
      }

      // Add to new key with updated time
      const updatedSession = { ...session, time: rescheduleTime };
      if (!updated[newKey]) {
        updated[newKey] = [...DEFAULT_DAY_SLOTS];
      }
      updated[newKey] = [...updated[newKey], updatedSession];

      return updated;
    });

    setRescheduleModalOpen(false);
    setRescheduleTarget(null);

    toast({
      title: "Session Rescheduled! 📅",
      description: `Successfully rescheduled session for ${session.client} to ${rescheduleDate} at ${rescheduleTime}.`,
    });
  };

  const handleOpenAssignClient = (key: string, index: number, slot: any) => {
    setAssignTarget({ key, index, slot });
    setAssignClientName("Sarah Jenkins");
    setAssignType("Individual CBT Therapy");
    setAssignModalOpen(true);
  };

  const handleConfirmAssignClient = () => {
    if (!assignTarget) return;
    const { key, index, slot } = assignTarget;

    const initials = assignClientName.split(" ").map(n => n[0]).join("").toUpperCase();

    setSessionData((prev) => {
      const updated = { ...prev };
      if (!updated[key]) {
        updated[key] = [...DEFAULT_DAY_SLOTS];
      }
      if (updated[key][index]) {
        updated[key][index] = {
          ...slot,
          client: assignClientName,
          initials: initials,
          type: assignType,
          status: "booked",
        };
      }
      return updated;
    });

    setAssignModalOpen(false);
    setAssignTarget(null);

    toast({
      title: "Client Booked! 🎯",
      description: `Assigned ${assignClientName} to open slot at ${slot.time}.`,
    });
  };

  const handleDeleteSlot = (key: string, index: number, clientName: string, slotTime: string) => {
    setSessionData((prev) => {
      const updated = { ...prev };
      if (!updated[key]) {
        updated[key] = [...DEFAULT_DAY_SLOTS];
      }
      if (updated[key]) {
        updated[key] = updated[key].filter((_, i) => i !== index);
      }
      return updated;
    });

    toast({
      title: "Session Slot Deleted 🗑️",
      description: `Slot for ${clientName} at ${slotTime} has been removed from calendar.`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Session Schedule & Availability"
        description="View booked client therapy appointments, set your recurring weekly availability, and manage consultation slots."
        badge="CALENDAR & SCHEDULER"
        icon={<CalendarDays className="w-4 h-4 text-purple-200" />}
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setAvailabilityOpen(true)}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/20 font-bold text-xs px-3.5 py-2 rounded-full cursor-pointer bg-white/10"
          >
            Set Availability
          </Button>
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

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-[600px]">

        <div className="lg:col-span-5 p-5 xl:p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select Date</span>
              <span className="text-xs font-bold text-[#5e2be2] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {MONTHS[month]} {year}
              </span>
            </div>

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

            <div className="grid grid-cols-7 mb-2 text-center">
              {DAYS_SHORT.map(d => (
                <div key={d} className="text-[11px] font-extrabold text-slate-400 py-1 uppercase tracking-wider">
                  {d.slice(0, 2)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const key   = `${year}-${month + 1}-${day}`;
                const count = (sessionData[key] ?? DEFAULT_DAY_SLOTS).length;
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

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Weekly Capacity</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-slate-500 font-medium text-[11px]">This Week</span>
                <span className="font-extrabold text-sm text-[#5e2be2] bg-purple-100/80 text-purple-900 px-2.5 py-1 rounded-xl w-fit border border-purple-200">
                  {Object.values(sessionData).flat().length} Sessions
                </span>
              </div>
              <div className="flex flex-col justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-slate-500 font-medium text-[11px]">Selected Day</span>
                <span className="font-extrabold text-sm text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-xl w-fit border border-emerald-200">
                  {bookedCount} Booked / {availableCount} Open
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 xl:p-6 bg-slate-50/30 flex flex-col overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {MONTHS[month]} {selectedDay}, {year}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {bookedCount} booked session{bookedCount !== 1 ? "s" : ""} · {availableCount} available open slot{availableCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-extrabold px-2.5 py-0.5">
                  {bookedCount} Booked
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-[#5e2be2] border-purple-200 text-[11px] font-extrabold px-2.5 py-0.5">
                  {availableCount} Available
                </Badge>
              </div>
            </div>

            <button 
              onClick={() => setAddEventOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-purple-300 bg-white text-[#5e2be2] text-xs font-extrabold py-3 hover:bg-purple-50/80 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Session Slot</span>
            </button>

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
                  const isBooked = s.status === "booked" || s.client !== "Open Consultation Slot";
                  return (
                    <div
                      key={i}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all bg-white shadow-2xs hover:shadow-md",
                        isBooked
                          ? "border-slate-200/80 hover:border-purple-200"
                          : "border-dashed border-purple-300 bg-purple-50/20 hover:bg-purple-50/50"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "shrink-0 w-22 text-center py-2 rounded-xl text-xs font-black transition-all",
                          isBooked
                            ? "bg-slate-100 text-slate-800 group-hover:bg-purple-100 group-hover:text-[#5e2be2]"
                            : "bg-purple-100/80 text-[#5e2be2] font-black border border-purple-200"
                        )}>
                          {s.time}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-extrabold text-xs sm:text-sm truncate",
                              isBooked ? "text-slate-900" : "text-purple-900"
                            )}>
                              {s.client}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">{s.type} · {s.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isBooked ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-extrabold px-2.5 py-0.5">
                            Confirmed
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-purple-100 text-[#5e2be2] border-0 text-[10px] font-extrabold px-2.5 py-0.5">
                              Available Slot
                            </Badge>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleOpenAssignClient(sessionKey, i, s)}
                              className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold text-[11px] h-7 px-2.5 rounded-lg shadow-2xs cursor-pointer"
                            >
                              + Book Client
                            </Button>
                          </div>
                        )}

                        <button
                          type="button"
                          title="Reschedule Slot"
                          onClick={() => handleOpenReschedule(sessionKey, i, s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#5e2be2] hover:bg-purple-100/60 transition-all cursor-pointer"
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          title="Delete Slot"
                          onClick={() => handleDeleteSlot(sessionKey, i, s.client, s.time)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Client to Open Slot Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border-0 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#5e2be2]" />
              Book Client into Available Slot
            </DialogTitle>
            <p className="text-xs text-slate-500 font-medium">
              Select a client to assign to the open consultation slot at {assignTarget?.slot.time}.
            </p>
          </DialogHeader>

          {assignTarget && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1 text-xs">
                <span className="text-[10px] font-extrabold text-[#5e2be2] uppercase tracking-wider block">Target Slot</span>
                <p className="font-extrabold text-slate-900 text-sm">Time: {assignTarget.slot.time}</p>
                <p className="text-slate-600 font-medium">{assignTarget.slot.duration} Session</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Select Client</label>
                <Select value={assignClientName} onValueChange={setAssignClientName}>
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Sarah Jenkins", "Michael Chen", "Emily Rodriguez", "David Kim", "Jessica Taylor", "Marcus Vance"].map((name) => (
                      <SelectItem key={name} value={name} className="text-xs">
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Treatment Modality / Notes</label>
                <Input
                  value={assignType}
                  onChange={(e) => setAssignType(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAssignModalOpen(false)}
              className="rounded-xl text-xs font-bold border-slate-200 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAssignClient}
              className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#5e2be2]/20 cursor-pointer"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Session Dialog Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border-0 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#5e2be2]" />
              Reschedule Session Slot
            </DialogTitle>
            <p className="text-xs text-slate-500 font-medium">
              Select a new date and time slot for {rescheduleTarget?.session.client}'s booked session.
            </p>
          </DialogHeader>

          {rescheduleTarget && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1 text-xs">
                <span className="text-[10px] font-extrabold text-[#5e2be2] uppercase tracking-wider block">Current Booking</span>
                <p className="font-extrabold text-slate-900 text-sm">{rescheduleTarget.session.client} ({rescheduleTarget.session.initials})</p>
                <p className="text-slate-600 font-medium">{rescheduleTarget.session.type} · {rescheduleTarget.session.duration}</p>
                <p className="text-[#5e2be2] font-extrabold font-mono mt-1">Current Time: {rescheduleTarget.session.time}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Select New Date</label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs h-10 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Select New Time Slot</label>
                <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 font-mono">
                    <SelectValue placeholder="Select new time" />
                  </SelectTrigger>
                  <SelectContent>
                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "11:30 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                      <SelectItem key={t} value={t} className="font-mono text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Reschedule Reason / Note (Optional)</label>
                <Input
                  placeholder="e.g. Client requested time shift"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRescheduleModalOpen(false)}
              className="rounded-xl text-xs font-bold border-slate-200 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReschedule}
              className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#5e2be2]/20 cursor-pointer"
            >
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SetAvailabilityDialog open={availabilityOpen} onOpenChange={setAvailabilityOpen} />
      <AddEventDialog
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        defaultDate={`${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`}
      />
    </div>
  );
}
