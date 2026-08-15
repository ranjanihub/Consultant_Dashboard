import { useState, useEffect } from "react";
import { useGetClients } from "@workspace/api-client-react";
import AddClientDialog from "@/components/AddClientDialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Outcomes from "@/pages/outcomes";
import Assessments from "@/pages/assessments";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Users,
  Mail,
  Phone,
  UserCheck,
  X,
  Brain,
  Award,
  Activity,
  FileText,
  Sparkles,
  Copy,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  Upload,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  LineChart,
  ClipboardCheck,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Clients() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  const getTabFromUrl = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "outcomes" || tab === "assessments" || tab === "directory") {
        return tab;
      }
    }
    return "directory";
  };

  const [mainTab, setMainTab] = useState<string>(getTabFromUrl);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [selectedRecordClient, setSelectedRecordClient] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"intake" | "assessments" | "mood" | "sessions" | "documents">("intake");

  useEffect(() => {
    const tabFromUrl = getTabFromUrl();
    if (tabFromUrl !== mainTab) {
      setMainTab(tabFromUrl);
    }
  }, [location]);

  const handleTabChange = (val: string) => {
    setMainTab(val);
    if (val === "directory") {
      setLocation("/clients");
    } else {
      setLocation(`/clients?tab=${val}`);
    }
  };

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [expandedScale, setExpandedScale] = useState<string | null>(null);
  const [newGoalInput, setNewGoalInput] = useState("");
  const [clientGoals, setClientGoals] = useState([
    { id: 1, text: "Reduce panic episode frequency from 3x/week to 0", completed: true },
    { id: 2, text: "Master box breathing and cognitive restructuring techniques", completed: true },
    { id: 3, text: "Maintain consistent 7+ hours of restful sleep daily", completed: false },
    { id: 4, text: "Complete weekly CBT thought record entries before sessions", completed: false },
  ]);

  const [homeworkList, setHomeworkList] = useState([
    { id: 101, title: "CBT Thought Record Log", frequency: "Daily", status: "completed", dueDate: "2026-07-27" },
    { id: 102, title: "Progressive Muscle Relaxation", frequency: "2x/day", status: "pending", dueDate: "2026-08-01" },
  ]);

  const { data: clients, isLoading } = useGetClients({
    search: search || undefined,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined
  });

  const DEMO_CLIENTS = [
    {
      id: 1,
      code: "#CL-101",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 (555) 234-5678",
      therapist: "Dr. Alex Harrison",
      modality: "Individual Therapy",
      lastSession: "2026-07-28",
      nextSession: "2026-08-01",
      nextSessionTime: "(09:00 AM)",
      status: "active" as const,
      primaryGoal: "Generalized Anxiety & Workplace Stress",
    },
    {
      id: 2,
      code: "#CL-102",
      name: "Michael & Jennifer Chen",
      email: "m.chen@example.com",
      phone: "+1 (555) 876-5432",
      therapist: "Dr. Elena Rostova",
      modality: "Couple Therapy",
      lastSession: "2026-07-29",
      nextSession: "2026-08-01",
      nextSessionTime: "(10:30 AM)",
      status: "active" as const,
      primaryGoal: "Marital Communication & Emotional Regulation",
    },
    {
      id: 3,
      code: "#CL-103",
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      phone: "+1 (555) 345-6789",
      therapist: "Dr. Alex Harrison",
      modality: "CBT Therapy",
      lastSession: "2026-07-26",
      nextSession: "2026-08-02",
      nextSessionTime: "(02:00 PM)",
      status: "active" as const,
      primaryGoal: "Panic Disorder & Agoraphobia Management",
    },
    {
      id: 4,
      code: "#CL-104",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 456-7890",
      therapist: "Dr. Alex Harrison",
      modality: "Individual Therapy",
      lastSession: "2026-07-24",
      nextSession: "2026-08-03",
      nextSessionTime: "(11:15 AM)",
      status: "new" as const,
      primaryGoal: "Social Anxiety in Executive Leadership",
    },
    {
      id: 5,
      code: "#CL-105",
      name: "Jessica Taylor",
      email: "jessica.t@example.com",
      phone: "+1 (555) 567-8901",
      therapist: "Dr. Alex Harrison",
      modality: "Panic CBT",
      lastSession: "2026-07-12",
      nextSession: undefined,
      nextSessionTime: "",
      status: "completed" as const,
      primaryGoal: "Interoceptive Panic Exposure Remission",
    },
  ];

  const clientList = (Array.isArray(clients) && clients.length > 0) ? clients : DEMO_CLIENTS;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="text-[11px] px-3 py-1 font-bold rounded-full inline-block bg-emerald-100 text-emerald-700">Active</span>;
      case 'high_priority':
        return <span className="text-[11px] px-3 py-1 font-bold rounded-full inline-block bg-amber-100 text-amber-700">High Priority</span>;
      case 'new':
        return <span className="text-[11px] px-3 py-1 font-bold rounded-full inline-block bg-blue-100 text-blue-700">New</span>;
      case 'completed':
        return <span className="text-[11px] px-3 py-1 font-bold rounded-full inline-block bg-slate-100 text-slate-700">Completed</span>;
      case 'inactive':
        return <span className="text-[11px] px-3 py-1 font-bold rounded-full inline-block bg-rose-100 text-rose-700">Inactive</span>;
      default:
        return <span className="text-[11px] px-3 py-1 font-bold rounded-full inline-block bg-slate-100 text-slate-700 capitalize">{status}</span>;
    }
  };

  const handleCopySummary = () => {
    const text = "Client presents with persistent generalized anxiety, work-related burnout, and mild insomnia over the past 6 months. Seeking CBT coping strategies and sleep hygiene guidance.";
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    toast({
      title: "AI Summary Copied",
      description: "Intake summary copied to your clipboard.",
    });
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleAddGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newGoalInput.trim()) return;
    const text = newGoalInput.trim();
    setClientGoals((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
    setNewGoalInput("");
    toast({
      title: "Goal Added",
      description: `Goal "${text}" added to client plan.`,
    });
  };

  const deleteGoal = (id: number) => {
    setClientGoals((prev) => prev.filter((g) => g.id !== id));
    toast({
      title: "Goal Removed",
      description: "Therapeutic goal removed from client plan.",
    });
  };

  const toggleGoal = (id: number) => {
    setClientGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const toggleHomework = (id: number) => {
    setHomeworkList((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: h.status === "completed" ? "pending" : "completed" } : h
      )
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <Tabs value={mainTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <TabsList className="bg-slate-100/90 p-1.5 rounded-xl h-13 flex items-center justify-start overflow-x-auto hide-scrollbar shrink-0 border border-slate-200/60">
            <TabsTrigger 
              value="directory" 
              className="rounded-lg h-10 px-5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#5e2be2] data-[state=active]:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#5e2be2]" />
              <span>Client Directory &amp; Roster</span>
            </TabsTrigger>
            <TabsTrigger 
              value="outcomes" 
              className="rounded-lg h-10 px-5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#5e2be2] data-[state=active]:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <LineChart className="w-4 h-4 text-[#5e2be2]" />
              <span>Outcomes Workflow</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assessments" 
              className="rounded-lg h-10 px-5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#5e2be2] data-[state=active]:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-[#5e2be2]" />
              <span>Clinical Diagnostic Assessments</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5e2be2] bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              <Brain className="w-3.5 h-3.5" />
              <span>Unified Client Hub</span>
            </span>
          </div>
        </div>

        <TabsContent value="directory" className="space-y-6 outline-none mt-6">
          <PageHeader
            title="Client Directory"
            description="Manage your active caseload, track client progress, and schedule upcoming therapy sessions."
            badge="CASELOAD MANAGEMENT"
            icon={<Users className="w-4 h-4 text-purple-200" />}
          >
            <button
              type="button"
              onClick={() => setAddClientOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#5e2be2] hover:bg-white/90 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Client</span>
            </button>
          </PageHeader>

          <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} />

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search clients by name..." 
                  className="pl-10 w-full rounded-xl border-slate-200 text-xs h-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 text-xs h-10">
                  <Filter className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="high_priority">High Priority</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Showing {clientList.length} client{clientList.length === 1 ? '' : 's'}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : clientList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No clients found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientList.map((clientItem: any) => (
                <div 
                  key={clientItem.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-100 text-[#5e2be2] font-black text-sm flex items-center justify-center shrink-0">
                          {clientItem.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <Link href={`/clients/${clientItem.id}`}>
                            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#5e2be2] transition-colors cursor-pointer">
                              {clientItem.name}
                            </h3>
                          </Link>
                          <span className="text-[11px] font-mono font-medium text-slate-400">{clientItem.code || `#CL-10${clientItem.id}`}</span>
                        </div>
                      </div>
                      {getStatusBadge(clientItem.status)}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Primary Treatment Goal</span>
                      <p className="font-bold text-slate-800 line-clamp-2">{clientItem.primaryGoal || "Managing stress & emotional health"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">Modality</span>
                        <span className="font-bold text-slate-700">{clientItem.modality || "Individual CBT"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">Therapist</span>
                        <span className="font-bold text-slate-700 truncate block">{clientItem.therapist || "Dr. Alex Harrison"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecordClient(clientItem);
                        setActiveModalTab("intake");
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-[#5e2be2] transition-colors cursor-pointer"
                    >
                      Quick Overview
                    </button>
                    <Link href={`/clients/${clientItem.id}`}>
                      <button 
                        type="button"
                        className="bg-purple-50 hover:bg-[#5e2be2] text-[#5e2be2] hover:text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Full Profile →
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6 outline-none mt-6">
          <Outcomes />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6 outline-none mt-6">
          <Assessments />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRecordClient} onOpenChange={() => setSelectedRecordClient(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 shadow-2xl">
          {selectedRecordClient && (
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#5e2be2] text-white font-black text-lg flex items-center justify-center shadow-lg shadow-[#5e2be2]/20">
                    {selectedRecordClient.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-900">{selectedRecordClient.name}</h2>
                      {getStatusBadge(selectedRecordClient.status)}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {selectedRecordClient.code} · {selectedRecordClient.modality} · {selectedRecordClient.therapist}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecordClient(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 hide-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("intake")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "intake" ? "bg-[#5e2be2] text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Brain className="w-4 h-4" /> Intake
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("assessments")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "assessments" ? "bg-[#5e2be2] text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Award className="w-4 h-4" /> Assessments
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("mood")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "mood" ? "bg-[#5e2be2] text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Activity className="w-4 h-4" /> Goals
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("sessions")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "sessions" ? "bg-[#5e2be2] text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Calendar className="w-4 h-4" /> Sessions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("documents")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "documents" ? "bg-[#5e2be2] text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  <FileText className="w-4 h-4" /> Docs
                </button>
              </div>

              {activeModalTab === "intake" && (
                <div className="p-4 bg-purple-50 rounded-2xl text-xs text-purple-900">
                  <h4 className="font-extrabold uppercase mb-2">AI Summary</h4>
                  <p>Client presents with persistent generalized anxiety, work-related burnout, and mild insomnia over the past 6 months. Seeking CBT coping strategies and sleep hygiene guidance.</p>
                </div>
              )}

              {activeModalTab === "mood" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Therapeutic Goals</h4>
                      <span className="text-xs font-bold text-slate-500">
                        {clientGoals.filter((g) => g.completed).length} / {clientGoals.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {clientGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => toggleGoal(goal.id)}
                              className="w-4 h-4 accent-[#5e2be2] rounded cursor-pointer"
                            />
                            <span className={cn("font-semibold text-slate-800", goal.completed && "line-through text-slate-400")}>
                              {goal.text}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteGoal(goal.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddGoal} className="flex gap-2 pt-2">
                      <Input
                        placeholder="Add new therapy goal..."
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        className="text-xs rounded-xl h-9"
                      />
                      <button
                        type="submit"
                        className="bg-[#5e2be2] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#4f28d9] transition-colors cursor-pointer shrink-0"
                      >
                        Add Goal
                      </button>
                    </form>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recent Mood & Daily Check-ins</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">8.5 / 10</span>
                          <span className="text-slate-700 font-medium">Completed thought record log with ease. Slept 7.5 hours.</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">Jul 27, 2026</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">6.0 / 10</span>
                          <span className="text-slate-700 font-medium">Slight anxiety regarding work presentation. Practiced breathing.</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">Jul 24, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SESSIONS & HOMEWORK */}
              {activeModalTab === "sessions" && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Session Timeline</h4>
                      <button
                        type="button"
                        onClick={() => toast({ title: "Session Booking", description: `Opened booking calendar for ${selectedRecordClient.name}.` })}
                        className="inline-flex items-center gap-1.5 bg-[#5e2be2] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs hover:bg-[#4f28d9] cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Session</span>
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Session #12 · CBT Anxiety Protocol</span>
                        <span className="text-[11px] text-slate-500">Completed Jul 28, 2026 (50 min) · Notes logged</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Completed</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Session #13 · Review &amp; Sleep Hygiene</span>
                        <span className="text-[11px] text-slate-500">Upcoming Aug 01, 2026 at 09:00 AM</span>
                      </div>
                      <span className="text-xs font-bold text-[#5e2be2] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">Scheduled</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Assigned Homework Tasks</h4>
                    <div className="space-y-2">
                      {homeworkList.map((hw) => (
                        <div
                          key={hw.id}
                          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{hw.title}</span>
                            <span className="text-[11px] text-slate-500">Frequency: {hw.frequency} · Due: {hw.dueDate}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleHomework(hw.id)}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all",
                              hw.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            )}
                          >
                            {hw.status === "completed" ? "Completed" : "Mark Complete"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DOCUMENTS & FILES */}
              {activeModalTab === "documents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Clinical Workspace Documents</h4>
                    <label className="inline-flex items-center gap-1.5 bg-[#5e2be2] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-[#4f28d9] cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Document</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            toast({
                              title: "Document Uploaded",
                              description: `"${file.name}" uploaded to ${selectedRecordClient.name}'s file record.`,
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-red-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">CBT_Thought_Record_Worksheet.pdf</span>
                          <span className="text-[11px] text-slate-400">PDF · 1.4 MB · Uploaded Jul 20, 2026</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast({ title: "Downloading Worksheet", description: "CBT_Thought_Record_Worksheet.pdf downloaded." })}
                        className="text-xs font-bold text-[#5e2be2] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Initial_Intake_Assessment_Form.pdf</span>
                          <span className="text-[11px] text-slate-400">PDF · 2.1 MB · Uploaded Jun 15, 2026</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast({ title: "Downloading Intake Form", description: "Initial_Intake_Assessment_Form.pdf downloaded." })}
                        className="text-xs font-bold text-[#5e2be2] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Sleep_Hygiene_Psychoeducation_Guide.pdf</span>
                          <span className="text-[11px] text-slate-400">PDF · 890 KB · Uploaded Jul 04, 2026</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast({ title: "Downloading Psychoeducation Guide", description: "Sleep_Hygiene_Psychoeducation_Guide.pdf downloaded." })}
                        className="text-xs font-bold text-[#5e2be2] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
