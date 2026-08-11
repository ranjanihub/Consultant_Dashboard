import { useState } from "react";
import { useGetClients } from "@workspace/api-client-react";
import AddClientDialog from "@/components/AddClientDialog";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Clients() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [selectedRecordClient, setSelectedRecordClient] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"intake" | "assessments" | "mood" | "sessions" | "documents">("intake");

  // Interactive Popup States
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

      {/* Filter Bar */}
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
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-xs text-slate-500 font-semibold">
          Showing {clientList.length} clients
        </div>
      </div>

      {/* Table Layout */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                <th className="py-4 px-6 text-center">Client Code &amp; Name</th>
                <th className="py-4 px-6 text-center">Service Modality</th>
                <th className="py-4 px-6 text-center">Last Session</th>
                <th className="py-4 px-6 text-center">Next Session</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-6 text-center" colSpan={6}>
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : clientList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium text-xs">
                    No clients found matching your search.
                  </td>
                </tr>
              ) : (
                clientList.map((client: any) => {
                  const clientCode = client.code || `#CL-${100 + Number(client.id || 1)}`;
                  const modality = client.modality || (client.id % 2 === 0 ? "Couple Therapy" : "Individual Therapy");
                  const lastSession = client.lastSession || "2026-07-28";
                  const nextSessionDate = client.nextSession || "2026-08-01";
                  const nextSessionTime = client.nextSessionTime || "(09:00 AM)";

                  return (
                    <tr key={client.id} className="hover:bg-purple-50/30 transition-colors whitespace-nowrap">
                      <td className="py-4 px-6 whitespace-nowrap space-y-0.5 text-center">
                        <div className="flex justify-center">
                          <span className="text-[10px] text-purple-600 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            {clientCode}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">{client.name}</div>
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap text-center">
                        {modality}
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap text-center">
                        {lastSession}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap space-y-0.5 text-center">
                        {client.nextSession ? (
                          <>
                            <div className="font-bold text-[#5e2be2] text-xs">{nextSessionDate}</div>
                            <div className="text-[11px] font-semibold text-slate-500">{nextSessionTime}</div>
                          </>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unscheduled</span>
                        )}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        {getStatusBadge(client.status)}
                      </td>

                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecordClient(client);
                            setActiveModalTab("intake");
                          }}
                          className="px-4 py-2 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs rounded-xl shadow-md shadow-[#5e2be2]/20 transition-all active:scale-95 cursor-pointer"
                        >
                          View Full Record
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Full Record Modal Popup */}
      <Dialog open={!!selectedRecordClient} onOpenChange={(open) => !open && setSelectedRecordClient(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none outline-none overflow-visible [&>button]:hidden">
          {selectedRecordClient && (
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] my-auto overflow-y-auto p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900">{selectedRecordClient.name}</h2>
                    <span className="px-3 py-0.5 bg-purple-100 text-[#5e2be2] font-mono font-bold text-xs rounded-full">
                      {selectedRecordClient.code || `#CL-${100 + Number(selectedRecordClient.id || 1)}`}
                    </span>
                    {getStatusBadge(selectedRecordClient.status)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecordClient(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("intake")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "intake"
                      ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Intake &amp; Survey</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab("assessments")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "assessments"
                      ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <Award className="w-4 h-4" />
                  <span>Clinical Assessments</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab("mood")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "mood"
                      ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <Activity className="w-4 h-4" />
                  <span>Goals &amp; Mood Tracker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab("sessions")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "sessions"
                      ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Sessions &amp; Homework</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab("documents")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeModalTab === "documents"
                      ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  <span>Documents &amp; Files</span>
                </button>
              </div>

              {/* Tab Contents */}
              {/* TAB 1: AI INTAKE & SURVEY */}
              {activeModalTab === "intake" && (
                <div className="space-y-6">
                  <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-100 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#5e2be2] uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5e2be2]" />
                        AI Intake Summary
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5e2be2] hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Client presents with persistent generalized anxiety, work-related burnout, and mild insomnia over the past 6 months. Seeking CBT coping strategies and sleep hygiene guidance.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Client Intake Survey Responses</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Primary Concern</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                          {selectedRecordClient.primaryGoal || "Generalized Anxiety & Workplace Stress"}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Symptom Onset</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">6 months ago</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Previous Therapy</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">Yes (1 year ago)</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Medication</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">None reported</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Sleep Average</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 block">5.5 hours/night</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block">Stress Level Rating</span>
                        <span className="text-xs font-bold text-amber-700 mt-0.5 block">7.5 / 10 (High Anxiety)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CLINICAL ASSESSMENTS */}
              {activeModalTab === "assessments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Completed Scale Battery</span>
                    <button
                      type="button"
                      onClick={() => toast({ title: "Assessment Sent", description: `Scale request emailed to ${selectedRecordClient.name}.` })}
                      className="inline-flex items-center gap-1.5 bg-[#5e2be2] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs hover:bg-[#4f28d9] transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Assign New Scale</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">GAD-7 (Generalized Anxiety Scale)</span>
                          <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Moderate (11/21)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Completed Jul 22, 2026 · Symptom improvement -3 pts</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedScale(expandedScale === "gad7" ? null : "gad7")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#5e2be2] hover:underline cursor-pointer"
                      >
                        <span>{expandedScale === "gad7" ? "Hide Item Details" : "View Item Details"}</span>
                        {expandedScale === "gad7" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {expandedScale === "gad7" && (
                      <div className="pt-3 border-t border-slate-200/60 text-xs space-y-2 bg-white p-3 rounded-xl">
                        <div className="flex justify-between text-slate-600">
                          <span>1. Feeling nervous, anxious, or on edge:</span>
                          <span className="font-bold text-slate-900">2 (More than half the days)</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>2. Not being able to stop or control worrying:</span>
                          <span className="font-bold text-slate-900">2 (More than half the days)</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>3. Trouble relaxing &amp; restless motor activity:</span>
                          <span className="font-bold text-slate-900">3 (Nearly every day)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">PHQ-9 (Patient Health Questionnaire)</span>
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Mild (4/27)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Completed Jul 18, 2026 · Symptom improvement -5 pts</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedScale(expandedScale === "phq9" ? null : "phq9")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#5e2be2] hover:underline cursor-pointer"
                      >
                        <span>{expandedScale === "phq9" ? "Hide Item Details" : "View Item Details"}</span>
                        {expandedScale === "phq9" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {expandedScale === "phq9" && (
                      <div className="pt-3 border-t border-slate-200/60 text-xs space-y-2 bg-white p-3 rounded-xl">
                        <div className="flex justify-between text-slate-600">
                          <span>1. Little interest or pleasure in doing things:</span>
                          <span className="font-bold text-slate-900">1 (Several days)</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>2. Feeling down, depressed, or hopeless:</span>
                          <span className="font-bold text-slate-900">1 (Several days)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: GOALS & MOOD TRACKER */}
              {activeModalTab === "mood" && (
                <div className="space-y-5">
                  <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#5e2be2] uppercase tracking-wider">Interactive Therapeutic Goals</h4>
                      <span className="text-xs font-bold text-purple-700">
                        {clientGoals.filter((g) => g.completed).length} / {clientGoals.length} Completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {clientGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-purple-100/80 hover:bg-purple-50/50 transition-colors"
                        >
                          <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => toggleGoal(goal.id)}
                              className="w-4 h-4 accent-[#5e2be2] rounded cursor-pointer shrink-0"
                            />
                            <span className={cn("text-xs font-medium truncate", goal.completed ? "line-through text-slate-400" : "text-slate-800")}>
                              {goal.text}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGoal(goal.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                            title="Delete goal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Goal Form */}
                    <div className="flex gap-2 pt-2">
                      <Input
                        placeholder="Add new therapeutic goal..."
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddGoal();
                          }
                        }}
                        className="text-xs h-9 rounded-xl border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddGoal()}
                        className="bg-[#5e2be2] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#4f28d9] shrink-0 cursor-pointer transition-all active:scale-95"
                      >
                        Add Goal
                      </button>
                    </div>
                  </div>

                  {/* Mood Log Recent Entries */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recent Client Mood Check-ins</h4>
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
