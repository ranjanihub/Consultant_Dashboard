import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, Video, Lock, Clock, CalendarDays } from "lucide-react";

const EVENT_TYPES = [
  { value: "session",   label: "Client Session",    icon: Video,        color: "bg-primary/10 text-primary border-primary/20" },
  { value: "blocked",   label: "Block Time",        icon: Lock,         color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "available", label: "Open Slot",         icon: Clock,        color: "bg-green-50 text-green-700 border-green-200" },
  { value: "other",     label: "Other",             icon: CalendarDays, color: "bg-secondary text-foreground border-border" },
];

const TIMES = Array.from({ length: 28 }, (_, i) => {
  const totalMins = 7 * 60 + i * 30;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m === 0 ? "00" : "30"} ${ampm}`;
});

const DURATIONS = ["30 min", "50 min", "60 min", "80 min", "90 min", "120 min"];

const CLIENTS = [
  "Emma Martinez", "James Chen", "Priya Kapoor", "Marcus ONeill",
  "Olivia Bennett", "Ryan Alvarez", "Hana Suzuki", "David Kim",
  "Sofia Rodriguez", "Alex Thompson", "Amara Johnson", "Tom Bradley",
  "Nina Patel", "Jake Morrison", "Rachel Green", "Samuel Okafor",
  "Lucy Wang", "Fatima Hassan", "Chris Anderson", "Isabelle Fontaine", "Kevin Park",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string; // e.g. "2025-07-07"
}

export default function AddEventDialog({ open, onOpenChange, defaultDate }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const [form, setForm] = useState({
    type:     "session",
    client:   "",
    date:     defaultDate ?? new Date().toISOString().slice(0, 10),
    start:    "10:00 AM",
    end:      "10:50 AM",
    duration: "50 min",
    title:    "",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const isSession = form.type === "session";

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSaved(false);
      setForm({ type: "session", client: "", date: defaultDate ?? new Date().toISOString().slice(0, 10), start: "10:00 AM", end: "10:50 AM", duration: "50 min", title: "" });
    }, 300);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      handleClose();
    }, 900);
  };

  const canSave = isSession
    ? form.client && form.date && form.start && form.duration
    : form.title && form.date && form.start;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Purple header */}
        <div className="bg-primary px-8 pt-8 pb-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Add Event</DialogTitle>
            <DialogDescription className="text-white/70 mt-1">
              Schedule a session, block time, or mark availability.
            </DialogDescription>
          </DialogHeader>

          {/* Event type selector */}
          <div className="flex gap-2 mt-5">
            {EVENT_TYPES.map(t => {
              const Icon = t.icon;
              const active = form.type === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => set("type", t.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    active
                      ? "bg-white text-primary border-white"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form body */}
        <div className="px-8 py-7 space-y-5">
          {isSession ? (
            <div className="space-y-1.5">
              <Label>Client <span className="text-destructive">*</span></Label>
              <Select value={form.client} onValueChange={v => set("client", v)}>
                <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                <SelectContent>
                  {CLIENTS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder={form.type === "blocked" ? "e.g. Admin block, Lunch break" : "e.g. Open for new clients"}
                value={form.title}
                onChange={e => set("title", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Date <span className="text-destructive">*</span></Label>
            <Input
              type="date"
              value={form.date}
              onChange={e => set("date", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start time <span className="text-destructive">*</span></Label>
              <Select value={form.start} onValueChange={v => set("start", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {isSession ? (
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Select value={form.duration} onValueChange={v => set("duration", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>End time</Label>
                <Select value={form.end} onValueChange={v => set("end", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {isSession && (
            <div className="space-y-1.5">
              <Label>Session type</Label>
              <Select defaultValue="CBT">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["CBT","EMDR","ACT","DBT","Couples Therapy","Intake","Crisis Check-in","Group Therapy"].map(s =>
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-border bg-secondary/30">
          <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">
            Cancel
          </Button>
          <Button
            className="bg-primary text-white px-8"
            onClick={handleSave}
            disabled={!canSave || saving || saved}
          >
            {saved ? (
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Added!</span>
            ) : saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : "Add to Calendar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
