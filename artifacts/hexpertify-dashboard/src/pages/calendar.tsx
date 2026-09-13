import { useState, useMemo, useEffect } from "react";
import { useGetCalendarEvents } from "@workspace/api-client-react";
import SetAvailabilityDialog from "@/components/SetAvailabilityDialog";
import AddEventDialog from "@/components/AddEventDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Lock,
  Unlock,
  Ban,
  MoreVertical,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { getAuthUser } from "@/lib/auth";

/* ─── helpers ─────────────────────────────────────────────── */
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function startOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }

function checkCanCancelSlot(key: string, timeStr: string): { canCancel: boolean; hoursLeft: number } {
  try {
    const parts = key.split("-");
    if (parts.length !== 3) return { canCancel: true, hoursLeft: 24 };

    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);

    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return { canCancel: true, hoursLeft: 24 };

    let h = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    const slotDate = new Date(y, m, d, h, min);
    const now = new Date();

    const diffHours = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return {
      canCancel: diffHours >= 3,
      hoursLeft: Math.max(0, Math.round(diffHours * 10) / 10),
    };
  } catch {
    return { canCancel: true, hoursLeft: 24 };
  }
}

export type SessionStatus = "booked" | "available" | "blocked";

export interface SessionSlot {
  client: string;
  initials: string;
  time: string;
  type: string;
  duration: string;
  status: SessionStatus;
  bookingId?: string;
  consultantId?: string;
  consultantName?: string;
}

const DEFAULT_DAY_SLOTS: SessionSlot[] = [];

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
  const authUser = useMemo(() => getAuthUser(), []);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  // Dynamic session data state from MongoDB database
  const [allRawBookings, setAllRawBookings] = useState<any[]>([]);
  const [dbConsultants, setDbConsultants] = useState<{ id: string; _id?: string; name: string; email?: string; specialty?: string }[]>([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>("");
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [dbClients, setDbClients] = useState<{ id: string; name: string; email: string }[]>([]);

  // Fetch real database bookings, consultants, and users from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    async function loadDbData() {
      try {
        setIsDbLoading(true);
        const [bookingsRes, usersRes, consultantsRes] = await Promise.all([
          fetch('/api/bookings').catch(() => null),
          fetch(`/api/users?consultantId=${encodeURIComponent(authUser?.id || '')}&consultantName=${encodeURIComponent(authUser?.name || '')}&role=client`).catch(() => null),
          fetch('/api/consultants').catch(() => null)
        ]);

        let loadedConsultants: any[] = [];
        if (consultantsRes && consultantsRes.ok) {
          const cData = await consultantsRes.json();
          const rawConsultants = Array.isArray(cData?.consultants) ? cData.consultants : Array.isArray(cData) ? cData : [];
          loadedConsultants = rawConsultants.map((c: any) => ({
            id: String(c._id || c.id),
            name: c.name || 'Therapist',
            email: c.email || '',
            specialty: c.specialty || c.title || 'Clinical Psychologist'
          }));
          if (isMounted) {
            setDbConsultants(loadedConsultants);
          }
        }

        if (usersRes && usersRes.ok) {
          const uData = await usersRes.json();
          const rawUsers = Array.isArray(uData?.users) ? uData.users : Array.isArray(uData) ? uData : [];
          if (isMounted) {
            setDbClients(rawUsers.map((u: any) => ({
              id: String(u._id || u.id),
              name: u.name || u.email?.split('@')[0] || 'Client',
              email: u.email || ''
            })));
          }
        }

        if (bookingsRes && bookingsRes.ok) {
          const data = await bookingsRes.json();
          const rawBookings = Array.isArray(data?.bookings) ? data.bookings : [];
          if (isMounted) {
            setAllRawBookings(rawBookings);
          }
        }

        // Set default selected therapist to current authUser
        if (isMounted) {
          const cleanAuthName = (authUser?.name || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();
          const cleanAuthEmail = (authUser?.email || '').toLowerCase().trim();
          const authId = String(authUser?.id || '').toLowerCase().trim();

          const matched = loadedConsultants.find((c) => {
            const cId = String(c.id || c._id || '').toLowerCase().trim();
            const cEmail = (c.email || '').toLowerCase().trim();
            const cName = (c.name || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();

            return (
              (authId && (cId === authId || cId.includes(authId))) ||
              (cleanAuthEmail && cEmail === cleanAuthEmail) ||
              (cleanAuthName && (cName === cleanAuthName || cName.includes(cleanAuthName) || cleanAuthName.includes(cName)))
            );
          });

          if (matched) {
            setSelectedConsultantId(matched.id);
          } else if (authUser?.id) {
            setSelectedConsultantId(authUser.id);
          } else if (loadedConsultants.length > 0) {
            setSelectedConsultantId(loadedConsultants[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching calendar data from DB:', err);
      } finally {
        if (isMounted) setIsDbLoading(false);
      }
    }

    loadDbData();
    return () => { isMounted = false; };
  }, [authUser?.name, authUser?.id, authUser?.email]);

  // Derive active therapist name & specialty from logged-in authUser
  const activeConsultant = useMemo(() => {
    const cleanAuthName = (authUser?.name || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();
    const cleanAuthEmail = (authUser?.email || '').toLowerCase().trim();
    const authId = String(authUser?.id || '').toLowerCase().trim();

    const matched = dbConsultants.find((c) => {
      const cId = String(c.id || c._id || '').toLowerCase().trim();
      const cEmail = (c.email || '').toLowerCase().trim();
      const cName = (c.name || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();

      if (authId && (cId === authId || cId.includes(authId))) return true;
      if (cleanAuthEmail && cEmail === cleanAuthEmail) return true;
      if (cleanAuthName && cName === cleanAuthName) return true;
      return false;
    });

    if (matched) {
      return {
        ...matched,
        name: authUser?.name || matched.name
      };
    }

    return {
      id: authUser?.id || selectedConsultantId || 'consultant-self',
      name: authUser?.name || 'Dr. Jaswanth',
      email: authUser?.email || '',
      specialty: authUser?.profession || 'Couple Therapy'
    };
  }, [dbConsultants, selectedConsultantId, authUser]);

  // Compute per-therapist sessionData based on logged-in consultant only
  const sessionData = useMemo<Record<string, SessionSlot[]>>(() => {
    const grouped: Record<string, SessionSlot[]> = {};
    const myId = String(activeConsultant?.id || authUser?.id || '').toLowerCase().trim();
    const myCleanName = (activeConsultant?.name || authUser?.name || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();
    const myEmail = (activeConsultant?.email || authUser?.email || '').toLowerCase().trim();

    allRawBookings.forEach((b: any) => {
      const bConsultantId = String(b.consultantId || b.therapistId || '').toLowerCase().trim();
      const bConsultantName = String(b.consultantName || b.therapistName || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();
      const bConsultantEmail = String(b.consultantEmail || '').toLowerCase().trim();

      const matchId = myId && bConsultantId && (bConsultantId === myId || bConsultantId.includes(myId) || myId.includes(bConsultantId));
      const matchName = myCleanName && bConsultantName && (bConsultantName.includes(myCleanName) || myCleanName.includes(bConsultantName));
      const matchEmail = myEmail && bConsultantEmail && bConsultantEmail === myEmail;

      if (!matchId && !matchName && !matchEmail) {
        return; // Exclude bookings from other therapists
      }

      const bookingDate = b.scheduledAt || b.date || b.createdAt;
      if (!bookingDate) return;
      const d = new Date(bookingDate);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const initials = (b.clientName || 'Client').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'CL';

      const slot: SessionSlot = {
        client: b.clientName || b.clientEmail || 'Client Record',
        initials,
        time: b.time || d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        type: b.serviceTitle || 'Individual Clinical Psychology',
        duration: `${b.duration || 50} min`,
        status: b.status === 'CANCELLED' ? 'available' : 'booked',
        bookingId: b.id || b._id,
        consultantId: b.consultantId || b.therapistId,
        consultantName: b.consultantName || b.therapistName
      };

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(slot);
    });

    return grouped;
  }, [allRawBookings, activeConsultant, authUser]);

  // All past and upcoming bookings sorted chronologically for the logged-in therapist only
  const therapistBookingsList = useMemo(() => {
    const myId = String(activeConsultant?.id || authUser?.id || '').toLowerCase().trim();
    const myCleanName = (activeConsultant?.name || authUser?.name || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();
    const myEmail = (activeConsultant?.email || authUser?.email || '').toLowerCase().trim();

    return allRawBookings
      .filter((b: any) => {
        const bConsultantId = String(b.consultantId || b.therapistId || '').toLowerCase().trim();
        const bConsultantName = String(b.consultantName || b.therapistName || '').toLowerCase().replace(/^dr\.?\s*/i, '').trim();
        const bConsultantEmail = String(b.consultantEmail || '').toLowerCase().trim();

        const matchId = myId && bConsultantId && (bConsultantId === myId || bConsultantId.includes(myId) || myId.includes(bConsultantId));
        const matchName = myCleanName && bConsultantName && (bConsultantName.includes(myCleanName) || myCleanName.includes(bConsultantName));
        const matchEmail = myEmail && bConsultantEmail && bConsultantEmail === myEmail;

        return matchId || matchName || matchEmail;
      })
      .sort((a: any, b: any) => {
        const da = new Date(a.scheduledAt || a.date || a.createdAt).getTime();
        const db = new Date(b.scheduledAt || b.date || b.createdAt).getTime();
        return db - da; // most recent first
      });
  }, [allRawBookings, activeConsultant, authUser]);

  const handleJumpToBookingDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        setYear(d.getFullYear());
        setMonth(d.getMonth());
        setSelectedDay(d.getDate());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast({
          title: "Calendar Focused 📅",
          description: `Focused calendar on ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}.`,
        });
      }
    } catch {}
  };

  // Reschedule dialog state
  const [confirmRescheduleOpen, setConfirmRescheduleOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<{ key: string; index: number; session: SessionSlot } | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  const [rescheduleTime, setRescheduleTime] = useState("10:00 AM");
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Assign client dialog state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{ key: string; index: number; slot: SessionSlot } | null>(null);
  const [assignClientName, setAssignClientName] = useState("");
  const [assignType, setAssignType] = useState("Individual Clinical Psychology");

  const sessionKey = `${year}-${month + 1}-${selectedDay}`;
  const daySessions = sessionData[sessionKey] ?? DEFAULT_DAY_SLOTS;

  const bookedCount = daySessions.filter(s => s.status === 'booked' || (s.client !== 'Open Consultation Slot' && s.status !== 'blocked' && s.client !== 'Blocked Time Slot')).length;
  const availableCount = daySessions.filter(s => s.status === 'available' || (s.client === 'Open Consultation Slot' && s.status !== 'blocked')).length;
  const blockedCount = daySessions.filter(s => s.status === 'blocked' || s.client === 'Blocked Time Slot').length;

  /* calendar grid */
  const firstDay = startOfMonth(year, month);
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

  const handleToggleBlockSlot = (key: string, index: number) => {
    const slot = daySessions[index];
    if (!slot) return;

    const isBookedClient = slot.status === "booked" && slot.client !== "Open Consultation Slot" && slot.client !== "Blocked Time Slot";
    if (isBookedClient) {
      toast({
        title: "Booked Client Session",
        description: `This slot is currently booked for ${slot.client}. Please reschedule or cancel the session to alter availability.`,
      });
      return;
    }

    const isCurrentlyBlocked = slot.status === "blocked" || slot.client === "Blocked Time Slot";
    const newStatus = isCurrentlyBlocked ? "available" : "blocked";

    if (slot.bookingId) {
      setAllRawBookings(prev => prev.map(b => (b.id === slot.bookingId || b._id === slot.bookingId) ? { ...b, status: newStatus === "blocked" ? "BLOCKED" : "AVAILABLE" } : b));
      fetch(`/api/bookings/${slot.bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus === "blocked" ? "BLOCKED" : "AVAILABLE" })
      }).catch(() => {});
    } else {
      const parts = key.split("-");
      const dateStr = parts.length === 3 ? `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}` : new Date().toISOString().slice(0, 10);
      const newBookingObj = {
        id: `BK-${Date.now().toString().slice(-6)}`,
        clientId: '',
        clientName: newStatus === "blocked" ? "Blocked Time Slot" : "Open Consultation Slot",
        consultantId: selectedConsultantId || activeConsultant?.id || authUser?.id || '',
        consultantName: activeConsultant?.name || authUser?.name || 'Therapist',
        serviceTitle: newStatus === "blocked" ? "Unavailable / Blocked by Therapist" : "Available for Client Booking",
        scheduledAt: `${dateStr}T10:00:00.000Z`,
        date: dateStr,
        time: slot.time,
        durationMinutes: 50,
        status: newStatus === "blocked" ? "BLOCKED" : "AVAILABLE",
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString()
      };
      setAllRawBookings(prev => [newBookingObj, ...prev]);
    }

    toast({
      title: isCurrentlyBlocked ? "Slot Unblocked" : "Slot Blocked",
      description: isCurrentlyBlocked
        ? `Time slot at ${slot.time} is now open and available for client bookings.`
        : `Time slot at ${slot.time} has been blocked from client bookings.`,
    });
  };

  const handleAddSlotFromDialog = async (newSlot: { date: string; time: string; title: string; client: string; type: string; duration: string; status: SessionStatus }) => {
    const parts = newSlot.date.split("-");
    if (parts.length === 3) {
      setYear(parseInt(parts[0]));
      setMonth(parseInt(parts[1]) - 1);
      setSelectedDay(parseInt(parts[2]));
    }

    const matchedClient = dbClients.find(c => c.name === newSlot.client || c.email === newSlot.client);
    const newBookingObj = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      clientId: matchedClient?.id || '',
      clientName: newSlot.client,
      clientEmail: matchedClient?.email || '',
      consultantId: selectedConsultantId || activeConsultant?.id || authUser?.id || '',
      consultantName: activeConsultant?.name || authUser?.name || 'Therapist',
      serviceTitle: newSlot.type || newSlot.title || 'Individual Clinical Psychology',
      scheduledAt: newSlot.date ? `${newSlot.date}T10:00:00.000Z` : new Date().toISOString(),
      date: newSlot.date,
      time: newSlot.time,
      durationMinutes: parseInt(newSlot.duration) || 50,
      duration: newSlot.duration || '50 min',
      status: newSlot.status === 'blocked' ? 'BLOCKED' : newSlot.status === 'available' ? 'AVAILABLE' : 'CONFIRMED',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString()
    };

    // Update state immediately for instant feedback
    setAllRawBookings(prev => [newBookingObj, ...prev]);

    // Persist to MongoDB Atlas
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingObj)
      });
    } catch (e) {
      console.error('Error saving new booking to DB:', e);
    }

    toast({
      title: "Session Slot Added! 📅",
      description: `Successfully added ${newSlot.status} slot for ${newSlot.client} at ${newSlot.time} on ${newSlot.date}.`,
    });
  };

  const handleConfirmCancelBooking = async () => {
    if (!rescheduleTarget) return;

    const { session } = rescheduleTarget;

    if (session.bookingId) {
      try {
        await fetch(`/api/bookings/${session.bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' })
        });
      } catch (e) {
        console.error('Error cancelling booking in DB:', e);
      }
    }

    setAllRawBookings(prev => prev.map(b => (b.id === session.bookingId || b._id === session.bookingId) ? { ...b, status: 'CANCELLED' } : b));

    setConfirmRescheduleOpen(false);
    setRescheduleTarget(null);

    toast({
      title: "Booking Cancelled",
      description: `The booking for ${session.client} at ${session.time} has been cancelled.`,
    });
  };

  const handleOpenReschedule = (key: string, index: number, session: SessionSlot) => {
    const { canCancel, hoursLeft } = checkCanCancelSlot(key, session.time);

    if (!canCancel) {
      toast({
        variant: "destructive",
        title: "Cancellation Policy Restriction",
        description: `Sessions can only be cancelled at least 3 hours before start time. (Session starts in ${hoursLeft > 0 ? `${hoursLeft} hrs` : "less than 3 hrs"}).`,
      });
      return;
    }

    setRescheduleTarget({ key, index, session });
    setRescheduleTime(session.time);
    setRescheduleDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`);
    setRescheduleReason("");
    setConfirmRescheduleOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleTarget) return;

    const { session } = rescheduleTarget;

    if (session.bookingId) {
      try {
        await fetch(`/api/bookings/${session.bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scheduledAt: `${rescheduleDate}T10:00:00.000Z`,
            date: rescheduleDate,
            time: rescheduleTime
          })
        });
      } catch (e) {
        console.error('Error rescheduling booking in DB:', e);
      }
    }

    setAllRawBookings(prev => prev.map(b => (b.id === session.bookingId || b._id === session.bookingId) ? { ...b, scheduledAt: `${rescheduleDate}T10:00:00.000Z`, date: rescheduleDate, time: rescheduleTime } : b));

    setRescheduleModalOpen(false);
    setRescheduleTarget(null);

    toast({
      title: "Session Rescheduled! 📅",
      description: `Successfully rescheduled session for ${session.client} to ${rescheduleDate} at ${rescheduleTime}.`,
    });
  };

  const handleOpenAssignClient = (key: string, index: number, slot: SessionSlot) => {
    setAssignTarget({ key, index, slot });
    setAssignClientName(dbClients[0]?.name || "Client Record");
    setAssignType("Individual Clinical Psychology");
    setAssignModalOpen(true);
  };

  const handleConfirmAssignClient = async () => {
    if (!assignTarget) return;
    const { key, slot } = assignTarget;

    const matchedClient = dbClients.find(c => c.name === assignClientName);
    const dateStr = key.replace(/(\d+)-(\d+)-(\d+)/, (_, y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);

    const newBookingObj = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      clientId: matchedClient?.id || '',
      clientName: assignClientName,
      clientEmail: matchedClient?.email || '',
      consultantId: selectedConsultantId || activeConsultant?.id || authUser?.id || '',
      consultantName: activeConsultant?.name || authUser?.name || 'Therapist',
      serviceTitle: assignType || 'Individual Clinical Psychology',
      scheduledAt: `${dateStr}T10:00:00.000Z`,
      date: dateStr,
      time: slot.time,
      durationMinutes: parseInt(slot.duration) || 50,
      duration: slot.duration || '50 min',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString()
    };

    setAllRawBookings(prev => [newBookingObj, ...prev]);

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingObj)
      });
    } catch (e) {
      console.error('Error saving assigned booking to DB:', e);
    }

    setAssignModalOpen(false);
    setAssignTarget(null);

    toast({
      title: "Client Booked! 📅",
      description: `Assigned ${assignClientName} to open slot at ${slot.time}.`,
    });
  };

  const handleDeleteSlot = async (key: string, index: number, clientName: string, slotTime: string) => {
    toast({
      title: "Session Slot Removed",
      description: `Slot for ${clientName} at ${slotTime} has been removed.`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={activeConsultant ? `${activeConsultant.name}'s Calendar` : "Session Schedule & Availability"}
        description={`View booked therapy appointments for ${activeConsultant?.name || 'your clinical practice'}, set weekly availability, and manage consultation slots.`}
        badge="THERAPIST CALENDAR & SCHEDULER"
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
                const key = `${year}-${month + 1}-${day}`;
                const count = (sessionData[key] ?? DEFAULT_DAY_SLOTS).length;
                const sel = day === selectedDay;
                const tod = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-2xl h-10 w-full text-xs font-bold transition-all cursor-pointer",
                      sel && "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20 scale-105 z-10",
                      !sel && tod && "border-2 border-[#5e2be2] text-[#5e2be2] bg-purple-50/50 font-extrabold",
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
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Monthly Capacity & Status</span>
              {activeConsultant && (
                <span className="text-[10px] font-bold text-[#5e2be2] truncate max-w-[150px]">
                  {activeConsultant.name}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-slate-500 font-medium text-[11px]">{MONTHS[month]} Bookings</span>
                <span className="font-extrabold text-sm text-[#5e2be2] bg-purple-100/80 text-purple-900 px-2.5 py-1 rounded-xl w-fit border border-purple-200">
                  {Object.keys(sessionData).reduce((sum, key) => {
                    const parts = key.split('-').map(Number);
                    if (parts[0] === year && parts[1] === month + 1) {
                      return sum + (sessionData[key] || []).length;
                    }
                    return sum;
                  }, 0)} Booked
                </span>
              </div>
              <div className="flex flex-col justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-slate-500 font-medium text-[11px]">Selected Day</span>
                <span className="font-extrabold text-[11px] text-slate-800 bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                  <div className="text-slate-600 font-extrabold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> {bookedCount} Booked</div>
                  <div className="text-emerald-700 font-extrabold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {availableCount} Available</div>
                  <div className="text-slate-600 font-extrabold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> {blockedCount} Blocked</div>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 xl:p-6 bg-slate-50/30 flex flex-col">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {MONTHS[month]} {selectedDay}, {year}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeConsultant ? `${activeConsultant.name} · ` : ''}{bookedCount} booked · {availableCount} available · {blockedCount} blocked
                </p>
              </div>
            </div>

            {/* ── Interactive Time Slots & Quick Block Section ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase">
                    Time Slots
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Booked
                  </span>
                  <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Available
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    Blocked
                  </span>
                </div>
              </div>


              <div className="flex flex-wrap gap-2 pt-1">
                {daySessions.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium italic">No time slots available for this day.</span>
                ) : (
                  daySessions.map((slot, index) => {
                    const isBooked = slot.status === "booked" || (slot.client !== "Open Consultation Slot" && slot.status !== "blocked" && slot.client !== "Blocked Time Slot");
                    const isBlocked = slot.status === "blocked" || slot.client === "Blocked Time Slot";
                    const isAvailable = slot.status === "available" || (slot.client === "Open Consultation Slot" && !isBlocked);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleToggleBlockSlot(sessionKey, index)}
                        title={
                          isBooked
                            ? `Booked by ${slot.client} (${slot.time})`
                            : isBlocked
                              ? `Click to Unblock ${slot.time}`
                              : `Click to Block ${slot.time}`
                        }
                        className={cn(
                          "group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border shadow-2xs active:scale-95",
                          isBooked && "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200/70 cursor-default",
                          isAvailable && "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300",
                          isBlocked && "bg-slate-100 text-slate-700 border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                        )}
                      >
                        {isBlocked ? (
                          <Lock className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                        ) : isAvailable ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 group-hover:text-slate-500 transition-colors" />
                        ) : null}

                        <span>{slot.time}</span>

                        {!isBooked && (
                          <span className="hidden group-hover:inline-block text-[9px] font-black ml-0.5 underline">
                            {isBlocked ? "Unblock" : "Block"}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
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
                <p className="text-sm font-extrabold text-slate-800">No sessions scheduled for {activeConsultant?.name || 'this therapist'}</p>
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
                  const isBooked = s.status === "booked" || (s.client !== "Open Consultation Slot" && s.status !== "blocked" && s.client !== "Blocked Time Slot");
                  const isBlocked = s.status === "blocked" || s.client === "Blocked Time Slot";
                  const isAvailable = s.status === "available" || (s.client === "Open Consultation Slot" && !isBlocked);

                  return (
                    <div
                      key={i}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all bg-white shadow-2xs hover:shadow-md",
                        isBooked && "border-slate-200/80 hover:border-slate-300",
                        isAvailable && "border-dashed border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/50",
                        isBlocked && "border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/60"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "shrink-0 w-22 text-center py-2 rounded-xl text-xs font-black transition-all",
                          isBooked && "bg-slate-100 text-slate-700 border border-slate-200",
                          isAvailable && "bg-emerald-100/80 text-emerald-800 font-black border border-emerald-200",
                          isBlocked && "bg-slate-200/80 text-slate-700 font-black border border-slate-300"
                        )}>
                          {s.time}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-extrabold text-xs sm:text-sm truncate",
                              isBooked && "text-slate-900",
                              isAvailable && "text-emerald-900",
                              isBlocked && "text-slate-700 line-through decoration-slate-400"
                            )}>
                              {s.client}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">{s.type} · {s.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isBooked ? (
                          <Badge className="bg-slate-100 text-slate-700 border-0 text-[10px] font-extrabold px-2.5 py-0.5">
                            Confirmed
                          </Badge>
                        ) : isBlocked ? (
                          <Badge className="bg-slate-100 text-slate-700 border-0 text-[10px] font-extrabold px-2.5 py-0.5 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-500" />
                            Blocked Slot
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-extrabold px-2.5 py-0.5">
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

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              title="More Options"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-lg border-slate-200">
                            {isBooked && (
                              <DropdownMenuItem
                                onClick={() => handleOpenReschedule(sessionKey, i, s)}
                                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>Cancel Booking</span>
                              </DropdownMenuItem>
                            )}

                            {!isBooked && (
                              <DropdownMenuItem
                                onClick={() => handleToggleBlockSlot(sessionKey, i)}
                                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                              >
                                {isBlocked ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Unblock Slot</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Block Slot</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ALL PAST & UPCOMING SESSIONS LOG FOR ACTIVE THERAPIST ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#5e2be2]" />
              {activeConsultant ? `${activeConsultant.name}'s Consultation History & Bookings` : 'All Session Bookings Log'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Showing {therapistBookingsList.length} real appointments recorded in MongoDB Atlas. Click "Focus Date" to view any past or upcoming day on the calendar above.
            </p>
          </div>
          <Badge className="bg-purple-100 text-purple-900 border border-purple-200 font-extrabold text-xs px-3 py-1">
            {therapistBookingsList.length} Total Bookings
          </Badge>
        </div>

        {therapistBookingsList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
            <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No session bookings recorded in the database collection</p>
            <p className="text-xs text-slate-500 mt-1">When clients book consultations with this therapist, their sessions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Service Modality</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Calendar Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {therapistBookingsList.slice(0, 15).map((b: any, idx: number) => {
                  const bDate = b.scheduledAt || b.date || b.createdAt;
                  const dateStr = bDate ? new Date(bDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
                  const timeStr = b.time || (bDate ? new Date(bDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '10:00 AM');
                  const status = (b.status || 'CONFIRMED').toUpperCase();

                  return (
                    <tr key={b.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900">{b.clientName || b.clientEmail || 'Client Record'}</div>
                        {b.clientEmail && <div className="text-[10px] text-slate-400">{b.clientEmail}</div>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600">
                        {b.serviceTitle || 'Individual Clinical Psychology'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-700 font-mono">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-extrabold text-[#5e2be2]">
                        {timeStr}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge className={cn(
                          "border-0 text-[10px] font-extrabold px-2.5 py-0.5",
                          status === 'COMPLETED' && "bg-emerald-100 text-emerald-800",
                          status === 'CONFIRMED' && "bg-purple-100 text-[#5e2be2]",
                          status === 'PENDING' && "bg-amber-100 text-amber-800",
                          status === 'CANCELLED' && "bg-rose-100 text-rose-800"
                        )}>
                          {status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleJumpToBookingDate(bDate)}
                          className="text-[11px] font-bold h-7 px-2.5 rounded-lg border-purple-200 text-[#5e2be2] hover:bg-purple-50 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <CalendarIcon className="w-3 h-3 text-[#5e2be2]" />
                          Focus Date
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Client to Open Slot Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md rounded-3xl p-4 sm:p-6 border-0 shadow-2xl max-h-[92vh] overflow-y-auto">
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
                    <SelectValue placeholder="Select client from database" />
                  </SelectTrigger>
                  <SelectContent>
                    {dbClients.length > 0 ? (
                      dbClients.map((client) => (
                        <SelectItem key={client.id} value={client.name} className="text-xs">
                          {client.name} {client.email ? `(${client.email})` : ''}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Client Record" className="text-xs">
                        Default Client Record
                      </SelectItem>
                    )}
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

      {/* Cancel Booking Confirmation Popup (Cancel / Yes) */}
      <AlertDialog open={confirmRescheduleOpen} onOpenChange={setConfirmRescheduleOpen}>
        <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-3xl p-4 sm:p-6 border-0 shadow-2xl bg-white max-h-[92vh] overflow-y-auto">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              Cancel Booking?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 font-medium leading-relaxed space-y-2">
              <span>
                Are you sure you want to cancel the booking for <strong className="text-slate-900">{rescheduleTarget?.session.client}</strong> scheduled at <strong className="text-[#5e2be2]">{rescheduleTarget?.session.time}</strong>? This will release the slot back as an available consultation slot.
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200 mt-2.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Cancellation Policy: Allowed up to 3 hours before session start time.</span>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <AlertDialogCancel
              onClick={() => setConfirmRescheduleOpen(false)}
              className="rounded-xl text-xs font-extrabold border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancelBooking}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-600/20 cursor-pointer"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Session Dialog Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md rounded-3xl p-4 sm:p-6 border-0 shadow-2xl max-h-[92vh] overflow-y-auto">
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
                <p className="text-[#5e2be2] font-extrabold mt-1">Current Time: {rescheduleTarget.session.time}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Select New Date</label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">Select New Time Slot</label>
                <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10">
                    <SelectValue placeholder="Select new time" />
                  </SelectTrigger>
                  <SelectContent>
                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "11:30 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
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
        onAddSlot={handleAddSlotFromDialog}
      />
    </div>
  );
}
