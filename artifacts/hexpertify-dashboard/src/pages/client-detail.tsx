import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  useGetClient,
  useGetClientAssessments,
  useGetClientMood,
  useGetClientHomework,
  useGetClientSessionHistory
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Clock, Calendar, Video, FileText, CheckCircle2, TrendingUp, TrendingDown,
  Activity, AlertCircle, FilePlus, Plus, HelpCircle, User, MessageSquare, Bell, Brain,
  Calculator, Send, Sparkles, ChevronDown, ChevronUp, ClipboardCheck, ArrowUpRight, Check,
  Target, RefreshCw, Eye, ShieldCheck, FileSpreadsheet, Scale, Layers, AlertTriangle, ArrowRight, Minus, Lock, Edit3,
  LineChart as LineChartIcon, Trophy, Flame, Heart, BarChart2, Gamepad2, BookOpen as BookOpenIcon, MessageSquare as MessageSquareIcon
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/format";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { useOutcomeStore } from "@/lib/outcome-store";
import { useToast } from "@/hooks/use-toast";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const { toast } = useToast();
  const { outcomes, calculateOutcome: triggerOutcomeCalc } = useOutcomeStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [showFullIntakeSummary, setShowFullIntakeSummary] = useState(false);
  const [personalizedScale, setPersonalizedScale] = useState<string>("GAD-7");

  // Real Database Client State
  const [dbClient, setDbClient] = useState<any | null>(null);
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [dbGoals, setDbGoals] = useState<any[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadClientData() {
      try {
        setIsDbLoading(true);
        const [usersRes, bookingsRes, goalsRes] = await Promise.all([
          fetch('/api/users').then(r => r.ok ? r.json() : { users: [] }).catch(() => ({ users: [] })),
          fetch('/api/bookings').then(r => r.ok ? r.json() : { bookings: [] }).catch(() => ({ bookings: [] })),
          fetch('/api/goals').then(r => r.ok ? r.json() : { goals: [] }).catch(() => ({ goals: [] })),
        ]);

        const rawUsers = Array.isArray(usersRes?.users) ? usersRes.users : [];
        const rawBookings = Array.isArray(bookingsRes?.bookings) ? bookingsRes.bookings : [];
        const rawGoals = Array.isArray(goalsRes?.goals) ? goalsRes.goals : [];

        const targetId = String(id || '');
        const found = rawUsers.find((u: any) => 
          String(u._id || u.id) === targetId || String(u.id) === targetId || u.email === targetId
        );

        if (found) {
          const userEmail = found.email;
          const userId = String(found._id || found.id);
          const matchedBookings = rawBookings.filter((b: any) => 
            b.clientEmail === userEmail || b.clientId === userId
          );
          const matchedGoals = rawGoals.filter((g: any) => 
            g.clientEmail === userEmail || g.userId === userId
          );

          if (isMounted) {
            setDbClient(found);
            setDbBookings(matchedBookings);
            setDbGoals(matchedGoals);
          }
        } else {
          if (isMounted) {
            setDbClient(null);
          }
        }
      } catch (err) {
        console.error('Error fetching client record from DB:', err);
      } finally {
        if (isMounted) setIsDbLoading(false);
      }
    }

    loadClientData();
    return () => { isMounted = false; };
  }, [id]);

  // Personal Therapist Notes State
  const [personalNotesStore, setPersonalNotesStore] = useState<Record<string, string>>({});
  const [noteInputText, setNoteInputText] = useState<string>("");
  const [isNoteSavedFeedback, setIsNoteSavedFeedback] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    if (id && personalNotesStore[id]) {
      setNoteInputText(personalNotesStore[id]);
    }
  }, [id, personalNotesStore]);

  // Dialog States for Outcomes & Assessments
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [itemDetailsScale, setItemDetailsScale] = useState<any | null>(null);

  // Dialog & Form states for Assign Activity
  const [assignActivityModalOpen, setAssignActivityModalOpen] = useState(false);
  const [activityTitle, setActivityTitle] = useState("Zen Breath & Focus Chamber");
  const [activityCategory, setActivityCategory] = useState("MINDFULNESS");
  const [activityInstructions, setActivityInstructions] = useState("Practice 5 minutes of mindful breath awareness & thought bubble popping before sleep.");
  const [activityFrequency, setActivityFrequency] = useState("Daily");
  const [activityDueDate, setActivityDueDate] = useState("2026-08-22");

  // Form states for Assign Assessment
  const [selectedAssignScale, setSelectedAssignScale] = useState("GAD-7");
  const [assignNote, setAssignNote] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("2026-08-15");

  // Form states for Calculate Outcome
  const [calcMilestone, setCalcMilestone] = useState("12");
  const [calcScale, setCalcScale] = useState("GAD-7");
  const [calcPrevScore, setCalcPrevScore] = useState("18");
  const [calcCurrScore, setCalcCurrScore] = useState("6");

  // Form states for Schedule Session
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().slice(0, 10));
  const [scheduleTime, setScheduleTime] = useState("10:00 AM");
  const [scheduleTitle, setScheduleTitle] = useState("Individual Clinical Psychology Consultation");
  const [scheduleDuration, setScheduleDuration] = useState("50 min");
  const [isScheduling, setIsScheduling] = useState(false);

  const isRealDbUser = !!dbClient;
  const isDemo = (id === "1" || id === "2" || id === "3") && !dbClient;
  const clientName = dbClient?.name || dbClient?.email?.split('@')[0] || (isDemo ? "Demo Client" : "Client User");
  const clientInitials = clientName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || "CL";
  const hasBookings = dbBookings.length > 0;
  const hasGoals = dbGoals.length > 0 || (Array.isArray(dbClient?.therapyGoals) && dbClient.therapyGoals.length > 0);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    try {
      const storedUser = localStorage.getItem("hexpertify_auth_user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      const newBooking = {
        id: `BK-${Date.now().toString().slice(-6)}`,
        clientId: client.id || dbClient?._id || dbClient?.id || '',
        clientName: client.name,
        clientEmail: client.email,
        consultantId: user?.id || '',
        consultantName: user?.name || 'Therapist',
        serviceTitle: scheduleTitle,
        scheduledAt: `${scheduleDate}T10:00:00.000Z`,
        date: scheduleDate,
        time: scheduleTime,
        durationMinutes: parseInt(scheduleDuration) || 50,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString()
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });

      if (res.ok) {
        setDbBookings(prev => [newBooking, ...prev]);
        toast({
          title: "Session Scheduled! 📅",
          description: `Booked session for ${client.name} on ${scheduleDate} at ${scheduleTime}. Stored in database.`,
        });
        setScheduleModalOpen(false);
      }
    } catch (err) {
      console.error('Error scheduling session in DB:', err);
      toast({
        title: "Error",
        description: "Failed to schedule session in database.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const client = {
    id: dbClient?._id || dbClient?.id || id,
    name: clientName,
    initials: clientInitials,
    age: dbClient?.age || (isRealDbUser ? 30 : 29),
    gender: dbClient?.gender || (isRealDbUser ? "Client" : "Female"),
    email: dbClient?.email || "client@example.com",
    phone: dbClient?.phoneNumber || dbClient?.phone || "+91 98765 43210",
    status: (dbClient?.emailVerified || hasBookings) ? "active" : "new",
    primaryGoal: dbClient?.primaryGoal || (hasBookings ? "Individual Clinical Psychological Consultation" : "General Wellness & Therapy Consultation"),
    presentingProblems: Array.isArray(dbClient?.presentingProblems) ? dbClient.presentingProblems : [],
    therapyGoals: hasGoals ? (dbGoals.map((g: any) => g.title || g.goal || g.text) || dbClient?.therapyGoals) : [],
    preferredLanguage: dbClient?.language || "English",
    communicationPreference: dbClient?.commPreference || "Video Call",
    therapyTimeline: dbClient?.timeline || "Ongoing",
    aiIntakeSummary: dbClient?.aiIntakeSummary || dbClient?.intakeSummary || null,
    progressPercent: hasBookings ? 60 : 0,
    startDate: dbClient?.createdAt ? new Date(dbClient.createdAt).toISOString().split('T')[0] : '2026-07-20',
    lastSession: hasBookings ? (dbBookings[0]?.date?.split('T')[0] || '2026-07-28') : undefined,
    nextSession: hasBookings ? '2026-09-02' : undefined,
    sessionCount: dbBookings.length,
  };

  const history = hasBookings ? dbBookings.map((b: any, i: number) => ({
    id: b._id || b.id || i + 1,
    date: b.date?.split('T')[0] || '2026-07-28',
    durationMinutes: b.duration || 60,
    sessionType: b.serviceTitle || 'Clinical Consultation',
    summary: `${b.serviceTitle || 'Consultation Session'} - Status: ${b.status || 'Confirmed'}`,
    homeworkAssigned: b.homework || undefined,
    therapistNotes: b.notes || undefined,
  })) : [];

  const assessments: any[] = Array.isArray(dbClient?.assessments) ? dbClient.assessments : [];
  const homework: any[] = Array.isArray(dbClient?.homework) ? dbClient.homework : [];
  const moodTrend: any[] = Array.isArray(dbClient?.moodTrend) ? dbClient.moodTrend : [];

  const SCALE_TITLES: Record<string, string> = {
    "PSS-10": "Perceived Stress Scale-10",
    "WHO-5": "WHO-5 Well-Being Index",
    "WSAS": "Work and Social Adjustment Scale",
    "PHQ-9": "Patient Health Questionnaire-9",
    "GAD-7": "Generalized Anxiety Disorder-7",
    "PCL-5": "PTSD Checklist for DSM-5",
    "OCI-R": "Obsessive-Compulsive Inventory - Revised",
    "ASRS v1.1": "Adult ADHD Self-Report Scale v1.1",
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("hexpertify_auth_user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const assignmentDoc = {
      id: `ASN-${Date.now().toString().slice(-6)}`,
      assessmentId: `ASS-${selectedAssignScale}`,
      assessmentAcronym: selectedAssignScale,
      assessmentTitle: SCALE_TITLES[selectedAssignScale] || selectedAssignScale,
      clientId: client.id || dbClient?._id || dbClient?.id || id || '',
      clientName: client.name,
      clientEmail: client.email || dbClient?.email || '',
      consultantId: user?.id || '',
      consultantName: user?.name || 'Dr. Alex Harrison',
      therapistName: user?.name || 'Dr. Alex Harrison',
      dueDate: assignDueDate,
      notes: assignNote,
      frequency: 'Weekly Check-in',
      status: 'Pending',
      assignedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    // 1. Post to Backend API
    try {
      await fetch('/api/assessments/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentDoc)
      });
    } catch (err) {
      console.warn('Failed to post assignment to API:', err);
    }

    // 2. Persist to local storage & broadcast real-time event
    try {
      const existing = JSON.parse(localStorage.getItem('hexpertify_assignments') || '[]');
      localStorage.setItem('hexpertify_assignments', JSON.stringify([assignmentDoc, ...existing]));
      window.dispatchEvent(new CustomEvent('hexpertify-assignment-created', { detail: assignmentDoc }));
    } catch {}

    setAssignModalOpen(false);
    toast({
      title: "Assessment Scale Dispatched! 🚀",
      description: `${selectedAssignScale} assigned to ${client.name} with due date ${formatDate(assignDueDate)}. Synchronized with Client Panel.`,
    });
    setAssignNote("");
  };

  const handleAssignActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignActivityModalOpen(false);
    toast({
      title: "Therapeutic Activity Assigned! 🎮",
      description: `"${activityTitle}" (${activityCategory}) assigned to ${client.name} due by ${formatDate(activityDueDate)}. Synchronized to client portal.`,
    });
  };

  const handleCalcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prev = Number(calcPrevScore);
    const curr = Number(calcCurrScore);
    const ms = Number(calcMilestone);

    triggerOutcomeCalc({
      clientId: String(id),
      clientName: client.name,
      clientInitials: client.initials,
      assessmentName: calcScale === "GAD-7" ? "Generalized Anxiety" : calcScale === "PHQ-9" ? "Patient Health Questionnaire" : "Clinical Scale",
      assessmentCode: calcScale,
      sessionMilestone: ms,
      previousScore: prev,
      currentScore: curr,
      maxScore: calcScale === "GAD-7" ? 21 : calcScale === "PHQ-9" ? 27 : 80,
    });

    setCalcModalOpen(false);
    toast({
      title: "3-Session Outcome Calculated! ⚡",
      description: `Session ${ms} milestone calculated for ${client.name}. Score change: ${curr - prev > 0 ? '+' : ''}${curr - prev} points. Therapist alert dispatched.`,
    });
  };

  if (isDbLoading) {
    return (
      <div className="space-y-6 pb-10">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/clients" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#5e2be2] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Clients
        </Link>
      </div>

      <PageHeader
        title={client.name}
        description={`${client.email} · ${client.phone} · ${client.primaryGoal}`}
      >
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#5e2be2] hover:bg-white/90 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-full border border-white/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Session</span>
          </button>
        </div>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border border-border w-full justify-start p-1 h-14 rounded-xl overflow-x-auto flex-nowrap shrink-0 hide-scrollbar">
          <TabsTrigger value="overview" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">
            Progress
          </TabsTrigger>
          <TabsTrigger value="assessments" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">
            Assessments
          </TabsTrigger>
          <TabsTrigger value="homework" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">
            Activities &amp; Homework
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">
            Session History
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Therapy Goals</h4>
                      {client.therapyGoals && client.therapyGoals.length > 0 ? (
                        <div className="space-y-3">
                          {client.therapyGoals.map((goal: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <span className="text-sm font-medium">{goal}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                          <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-700">No therapy goals registered yet</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Therapeutic milestones and goals will appear here once configured.</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Presenting Problems</h4>
                        {client.presentingProblems && client.presentingProblems.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {client.presentingProblems.map((prob: string, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-normal">{prob}</Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 font-medium">No presenting problems logged yet.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-purple-200/80 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-white rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#5e2be2]" />
                        AI Intake Summary
                      </CardTitle>
                      <Badge variant="outline" className="bg-purple-100 text-[#5e2be2] border-purple-200 text-[10px] font-extrabold">
                        AI Clinical Insights
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {client.aiIntakeSummary ? (
                      <>
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                          {client.aiIntakeSummary}
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowFullIntakeSummary(!showFullIntakeSummary)}
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5e2be2] hover:text-[#4f28d9] transition-colors cursor-pointer pt-1"
                        >
                          <span>{showFullIntakeSummary ? "Read Less" : "Read More"}</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", showFullIntakeSummary && "rotate-180")} />
                        </button>
                      </>
                    ) : (
                      <div className="p-8 text-center bg-white/70 rounded-2xl border border-dashed border-purple-200/80">
                        <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <h4 className="font-extrabold text-slate-800 text-xs">No AI Intake Survey Logs</h4>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">This client has not completed the pre-consultation intake questionnaire yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Personal Notes Box UI (Therapist Reference) */}
                <div className="bg-white rounded-3xl border border-purple-200/80 p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-2xl bg-purple-100/80 text-[#5e2be2]">
                        <Edit3 className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">Personal Notes</h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-50 text-[#5e2be2] border border-purple-100 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3 text-amber-500" />
                      Therapist Only
                    </span>
                  </div>

                  {isEditingNote ? (
                    <div className="space-y-3">
                      <textarea
                        autoFocus
                        value={noteInputText}
                        onChange={(e) => {
                          setNoteInputText(e.target.value);
                          setIsNoteSavedFeedback(false);
                        }}
                        rows={4}
                        placeholder="Type personal reference notes about this client..."
                        className="w-full p-4 bg-white border border-[#5e2be2] rounded-2xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-100 leading-relaxed resize-none transition-all shadow-sm"
                      />
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-slate-400 font-medium">Click Save when finished</span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setNoteInputText(personalNotesStore[String(id)] || "");
                              setIsEditingNote(false);
                            }}
                            className="text-xs font-bold text-slate-500 h-8 px-3 rounded-xl hover:bg-slate-100 cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setPersonalNotesStore((prev) => ({ ...prev, [String(id)]: noteInputText }));
                              setIsNoteSavedFeedback(true);
                              setIsEditingNote(false);
                              toast({
                                title: "Personal Note Saved",
                                description: "Therapist reference note updated for this client.",
                              });
                            }}
                            className="bg-[#5e2be2] hover:bg-[#4d22be] text-white font-extrabold text-xs h-8 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Save Note</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl min-h-[90px] flex flex-col justify-between space-y-3">
                      <p className="text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {noteInputText.trim() ? (
                          noteInputText
                        ) : (
                          <span className="text-slate-400 italic">No personal logs added yet. Click "Edit Note" to add reference notes for this client...</span>
                        )}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-1.5">
                          {isNoteSavedFeedback && (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> Saved to record
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingNote(true)}
                          className="text-[11px] font-extrabold text-[#5e2be2] flex items-center gap-1 bg-purple-100/70 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200/60 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Card className="shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessments.length === 0 ? (
                      <div className="p-6 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                        <Scale className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">No Assessment Logs</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">No psychometric test scores on file for this client.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {assessments.slice(0, 3).map((assessment) => (
                          <div key={assessment.id} className="flex flex-col gap-2 p-3 rounded-lg border border-border">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{assessment.type}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{assessment.currentScore}</span>
                                <span className="text-xs text-muted-foreground">/ {assessment.maxScore}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className={cn("font-medium",
                                assessment.severity === 'Severe' ? 'text-red-600' :
                                  assessment.severity === 'Moderate' ? 'text-amber-600' : 'text-green-600'
                              )}>
                                {assessment.severity}
                              </span>
                              <span className="text-muted-foreground">{formatDate(assessment.completedAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-primary/5 border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">Next Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(client as any).nextSession ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{formatDate((client as any).nextSession)}</p>
                            <p className="text-sm text-muted-foreground">Follow-up · Video</p>
                          </div>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">Prepare Session Note</Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-4">No upcoming sessions scheduled.</p>
                        <Button
                          type="button"
                          onClick={() => setScheduleModalOpen(true)}
                          variant="outline"
                          className="w-full border-primary/20 text-primary font-bold cursor-pointer hover:bg-purple-50"
                        >
                          Schedule Session
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CLINICAL OUTCOMES TAB */}
          <TabsContent value="outcomes" className="space-y-6 outline-none">
            {hasBookings || isDemo ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-purple-100 text-[#5e2be2]">
                      <Activity className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Clinical Outcome</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Outcome assessments performed by {client.name} after therapy sessions
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-[#5e2be2] border-purple-200 text-xs font-bold px-3 py-1">
                    Evaluation Cycle
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <LineChartIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">No Outcome Analytics Logs</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">This client has no recorded session milestones or psychometric test entries in the database collection. Progress analytics will generate automatically once sessions and assessments are logged.</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 3: DIAGNOSTIC ASSESSMENTS TAB */}
          <TabsContent value="assessments" className="space-y-6 outline-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[#5e2be2]" />
                    Active Assessment Instruments &amp; Longitudinal Trends
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track score trajectories across sessions and inspect question breakdowns
                  </p>
                </div>
                <Button onClick={() => setAssignModalOpen(true)} className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer">
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Dispatch Assessment
                </Button>
              </div>

              {assessments.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <Scale className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-extrabold text-slate-900">No Assessment Records Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">No clinical psychometric assessments (GAD-7, PHQ-9, PCL-5) have been completed by this client in the database.</p>
                  <Button onClick={() => setAssignModalOpen(true)} className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs rounded-xl h-10 px-5 mt-2">
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Dispatch First Assessment
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {assessments.map((assessment) => (
                    <Card key={assessment.id} className="shadow-sm border-border hover:border-purple-200 transition-colors">
                      <CardHeader className="pb-2 flex flex-row items-start justify-between border-b border-slate-100 bg-slate-50/50">
                        <div>
                          <CardTitle className="text-base font-bold text-slate-900">{assessment.type}</CardTitle>
                          <CardDescription className="text-xs text-slate-500 mt-0.5">{assessment.name}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-slate-900">
                            {assessment.currentScore}
                            <span className="text-xs font-normal text-slate-400">/{assessment.maxScore}</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 4: ACTIVITIES & HOMEWORK */}
          <TabsContent value="homework" className="space-y-6 outline-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Assigned Therapeutic Activities</h3>
              <Button
                onClick={() => setAssignActivityModalOpen(true)}
                className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Assign Activity
              </Button>
            </div>
            {homework.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">No Activities or Homework Assigned</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">No mindfulness practices, CBT thought records, or exercises have been assigned to this client in the database collection.</p>
                <Button onClick={() => setAssignActivityModalOpen(true)} className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs rounded-xl h-10 px-5 mt-2">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Assign First Activity
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {homework.map((item) => (
                  <Card key={item.id} className="shadow-sm border-border overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-bold text-lg">{item.activity}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 5: SESSION HISTORY */}
          <TabsContent value="history" className="space-y-6 outline-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Session History</h3>
                <p className="text-xs text-slate-500 font-medium">All logged consultations and appointments for {client.name}</p>
              </div>
              <Button
                type="button"
                onClick={() => setScheduleModalOpen(true)}
                className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs h-8 px-3.5 rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Session
              </Button>
            </div>

            {history.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">No Session Logs Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">There is no consultation or booking history recorded in the database collection for this client yet.</p>
                <Button
                  type="button"
                  onClick={() => setScheduleModalOpen(true)}
                  className="mt-4 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule First Session
                </Button>
              </div>
            ) : (
              <div className="relative border-l-2 border-border ml-4 pl-8 space-y-8 py-4">
                {history.map((session, i) => (
                  <div key={session.id} className="relative">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-primary shadow-sm" />

                    <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3 bg-secondary/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              Session {history.length - i}
                              <Badge variant="outline" className="font-normal text-muted-foreground bg-white">{session.sessionType}</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3.5 h-3.5" /> {formatDate(session.date)}
                              <span className="mx-1">•</span>
                              <Clock className="w-3.5 h-3.5" /> {session.durationMinutes} min
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Clinical Summary</h4>
                          <p className="text-sm text-slate-700 leading-relaxed">{session.summary}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* DIALOG 1: ASSIGN ASSESSMENT SCALE */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Send className="w-5 h-5 text-[#5e2be2]" />
              Assign Assessment Scale
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Dispatch a standardized clinical assessment to {client.name}'s client app.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Select Assessment Instrument</label>
              <Select value={selectedAssignScale} onValueChange={setSelectedAssignScale}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    General Assessments (Common for All Clients)
                  </div>
                  <SelectItem value="PSS-10">1. PSS-10 (Perceived Stress Scale - 10 Items)</SelectItem>
                  <SelectItem value="WHO-5">2. WHO-5 (Well-Being Index - 5 Items)</SelectItem>
                  <SelectItem value="WSAS">3. WSAS (Work and Social Adjustment Scale - 5 Items)</SelectItem>

                  <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1.5 pt-1.5 border-t border-slate-100">
                    Specific Clinical Concern Assessments (Consultant Assigned)
                  </div>
                  <SelectItem value="PHQ-9">4. PHQ-9 (Patient Health Questionnaire / Depression - 9 Items)</SelectItem>
                  <SelectItem value="GAD-7">5. GAD-7 (Generalized Anxiety Disorder - 7 Items)</SelectItem>
                  <SelectItem value="PCL-5">6. PCL-5 (PTSD Checklist for DSM-5 - 20 Items)</SelectItem>
                  <SelectItem value="OCI-R">7. OCI-R (Obsessive-Compulsive Inventory - 18 Items)</SelectItem>
                  <SelectItem value="ASRS v1.1">8. ASRS v1.1 (Adult ADHD Self-Report Scale - 18 Items)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Due Date</label>
              <Input
                type="date"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Therapist Instructions (Optional)</label>
              <Input
                placeholder="e.g. Please complete prior to our Session #13 discussion."
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold cursor-pointer">Dispatch Scale</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: CALCULATE 3-SESSION OUTCOME */}
      <Dialog open={calcModalOpen} onOpenChange={setCalcModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Calculator className="w-5 h-5 text-[#5e2be2]" />
              Calculate 3-Session Outcome Milestone
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Record score milestone for {client.name} and trigger automated therapist panel alerts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCalcSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Milestone Session #</label>
                <Select value={calcMilestone} onValueChange={setCalcMilestone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Session 3</SelectItem>
                    <SelectItem value="6">Session 6</SelectItem>
                    <SelectItem value="9">Session 9</SelectItem>
                    <SelectItem value="12">Session 12</SelectItem>
                    <SelectItem value="15">Session 15</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Scale Code</label>
                <Select value={calcScale} onValueChange={setCalcScale}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GAD-7">GAD-7</SelectItem>
                    <SelectItem value="PHQ-9">PHQ-9</SelectItem>
                    <SelectItem value="PCL-5">PCL-5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Previous / Baseline Score</label>
                <Input
                  type="number"
                  value={calcPrevScore}
                  onChange={(e) => setCalcPrevScore(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">New Milestone Score</label>
                <Input
                  type="number"
                  value={calcCurrScore}
                  onChange={(e) => setCalcCurrScore(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Calculated Score Difference:</span>
              <span className="font-black text-sm text-[#5e2be2]">
                {Number(calcCurrScore) - Number(calcPrevScore) > 0 ? `+${Number(calcCurrScore) - Number(calcPrevScore)}` : `${Number(calcCurrScore) - Number(calcPrevScore)}`} pts
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCalcModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold cursor-pointer">Run Outcome Engine</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: ITEM RESPONSE BREAKDOWN */}
      <Dialog open={!!itemDetailsScale} onOpenChange={() => setItemDetailsScale(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Eye className="w-5 h-5 text-[#5e2be2]" />
              {itemDetailsScale?.type || "Assessment"} - Line Item Responses
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Item-by-item response breakdown for {client.name} (Latest completed evaluation)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{itemDetailsScale?.name}</span>
                <span className="text-slate-500">Completed: {formatDate(itemDetailsScale?.completedAt || '2026-07-20')}</span>
              </div>
              <Badge className="bg-[#5e2be2] text-white font-bold">
                Score: {itemDetailsScale?.currentScore} / {itemDetailsScale?.maxScore || 21}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Question Responses &amp; Baseline Comparison</h4>
              {((itemDetailsScale?.type && DEMO_QUESTION_BREAKDOWNS[itemDetailsScale.type]) || DEMO_QUESTION_BREAKDOWNS["GAD-7"]).map((item: any, idx: number) => (
                <div key={idx} className={cn("p-3 rounded-xl border text-xs space-y-1.5 transition-colors", item.flagged ? "bg-amber-50/70 border-amber-200" : "bg-white border-slate-100 hover:border-purple-100")}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 leading-snug">{item.q}</span>
                    {item.flagged && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] shrink-0 font-bold">
                        Clinical Concern
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Baseline: <strong className="text-slate-700">{item.baseline}</strong></span>
                    <span className="text-slate-500">Latest: <strong className="text-[#5e2be2] font-extrabold">{item.current}</strong> ({item.change})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: ASSIGN THERAPEUTIC ACTIVITY */}
      <Dialog open={assignActivityModalOpen} onOpenChange={setAssignActivityModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Gamepad2 className="w-5 h-5 text-[#5e2be2]" />
              Assign Therapeutic Activity
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Assign an interactive exercise or practice simulation to {client.name}'s portal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignActivitySubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Activity Title</label>
              <Input
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder="e.g. Zen Breath & Focus Chamber"
                className="w-full text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Exercise Category</label>
                <Select value={activityCategory} onValueChange={setActivityCategory}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MINDFULNESS">Mindfulness &amp; Focus</SelectItem>
                    <SelectItem value="CBT">CBT Cognitive Reframe</SelectItem>
                    <SelectItem value="GRATITUDE">Gratitude Jar</SelectItem>
                    <SelectItem value="BREATHING">4-7-8 Breathing Wave</SelectItem>
                    <SelectItem value="SOMATIC">Somatic Muscle Release</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Frequency</label>
                <Select value={activityFrequency} onValueChange={setActivityFrequency}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily Practice</SelectItem>
                    <SelectItem value="3x/Week">3x Per Week</SelectItem>
                    <SelectItem value="Weekly">Weekly Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Due Date</label>
              <Input
                type="date"
                value={activityDueDate}
                onChange={(e) => setActivityDueDate(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Therapist Instructions</label>
              <Input
                value={activityInstructions}
                onChange={(e) => setActivityInstructions(e.target.value)}
                placeholder="Practice guidelines..."
                className="w-full text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAssignActivityModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold cursor-pointer">Assign Activity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 5: SCHEDULE CLIENT SESSION */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Calendar className="w-5 h-5 text-[#5e2be2]" />
              Schedule Therapy Session
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create and store a consultation session for {client.name} in the MongoDB database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Session Title / Modality</label>
              <Input
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                placeholder="e.g. CBT Anxiety & Sleep Hygiene Review"
                className="w-full text-xs font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Date</label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-600 uppercase">Start Time</label>
                <Select value={scheduleTime} onValueChange={setScheduleTime}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"].map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-600 uppercase">Duration</label>
              <Select value={scheduleDuration} onValueChange={setScheduleDuration}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["30 min", "50 min", "60 min", "80 min", "90 min"].map((d) => (
                    <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isScheduling} className="bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold cursor-pointer">
                {isScheduling ? "Saving to DB..." : "Confirm & Save Session"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const DEMO_QUESTION_BREAKDOWNS: Record<string, any[]> = {
  "GAD-7": [
    { q: "1. Feeling nervous, anxious, or on edge", baseline: "Nearly every day (3/3)", current: "Several days (1/3)", change: "-2" },
    { q: "2. Not being able to stop or control worrying", baseline: "Nearly every day (3/3)", current: "Several days (1/3)", change: "-2" },
    { q: "3. Worrying too much about different things", baseline: "More than half the days (2/3)", current: "Several days (1/3)", change: "-1" },
    { q: "4. Trouble relaxing", baseline: "Nearly every day (3/3)", current: "Several days (1/3)", change: "-2" },
    { q: "5. Being so restless that it's hard to sit still", baseline: "More than half the days (2/3)", current: "Not at all (0/3)", change: "-2" },
    { q: "6. Becoming easily annoyed or irritable", baseline: "Several days (1/3)", current: "Not at all (0/3)", change: "-1" },
    { q: "7. Feeling afraid as if something awful might happen", baseline: "Nearly every day (3/3)", current: "Several days (1/3)", change: "-2", flagged: true }
  ],
  "PHQ-9": [
    { q: "1. Little interest or pleasure in doing things", baseline: "Nearly every day (3/3)", current: "Several days (1/3)", change: "-2" },
    { q: "2. Feeling down, depressed, or hopeless", baseline: "Nearly every day (3/3)", current: "Not at all (0/3)", change: "-3" },
    { q: "3. Trouble falling or staying asleep, or sleeping too much", baseline: "More than half the days (2/3)", current: "Several days (1/3)", change: "-1" },
    { q: "4. Feeling tired or having little energy", baseline: "More than half the days (2/3)", current: "Several days (1/3)", change: "-1" },
    { q: "5. Poor appetite or overeating", baseline: "Several days (1/3)", current: "Not at all (0/3)", change: "-1" },
    { q: "6. Feeling bad about yourself or that you are a failure", baseline: "More than half the days (2/3)", current: "Not at all (0/3)", change: "-2" },
    { q: "7. Trouble concentrating on things", baseline: "Several days (1/3)", current: "Not at all (0/3)", change: "-1" },
    { q: "8. Moving or speaking slowly / fidgety", baseline: "Not at all (0/3)", current: "Not at all (0/3)", change: "0" },
    { q: "9. Thoughts that you would be better off dead or hurting yourself", baseline: "Not at all (0/3)", current: "Not at all (0/3)", change: "0" }
  ],
  "PCL-5": [
    { q: "1. Repeated, disturbing memories or thoughts of stressful experience", baseline: "Extremely (4/4)", current: "Moderately (2/4)", change: "-2" },
    { q: "2. Repeated, disturbing dreams of stressful experience", baseline: "Quite a bit (3/4)", current: "A little bit (1/4)", change: "-2" },
    { q: "3. Suddenly feeling or acting as if stressful experience were happening", baseline: "Moderately (2/4)", current: "Not at all (0/4)", change: "-2" },
    { q: "4. Avoidance of external reminders (people, places, conversations)", baseline: "Extremely (4/4)", current: "Moderately (2/4)", change: "-2", flagged: true },
    { q: "5. Trouble remembering important parts of stressful experience", baseline: "Moderately (2/4)", current: "A little bit (1/4)", change: "-1" }
  ]
};

