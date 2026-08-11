import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Send,
  FileSpreadsheet,
  Filter,
  Calendar as CalendarIcon,
  BarChart2,
  Sparkles,
  ChevronRight,
  Minus,
  Plus,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

interface AssessmentRecord {
  id: string;
  clientName: string;
  clientInitials: string;
  avatarBg: string;
  therapyType: string;
  instrument: string;
  instrumentCode: string;
  score: string;
  numericScore: number | null;
  maxScore: number;
  severity: string;
  severityColor: "green" | "yellow" | "orange" | "red" | "gray";
  trend: "improved" | "worsened" | "stable" | "none";
  trendDiff: string;
  sentDate: string;
  completedDate: string;
  status: "Completed" | "Pending" | "Overdue";
  flag: "Normal" | "High Risk" | "Requires Follow-up" | "Overdue";
  questions?: { q: string; a: string; flagged?: boolean }[];
}

const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: "ASM-101",
    clientName: "James Chen",
    clientInitials: "JC",
    avatarBg: "bg-purple-100 text-purple-700",
    therapyType: "CBT · Anxiety & Depression",
    instrument: "General Anxiety Disorder",
    instrumentCode: "GAD-7",
    score: "17 / 21",
    numericScore: 17,
    maxScore: 21,
    severity: "Severe Anxiety",
    severityColor: "red",
    trend: "worsened",
    trendDiff: "+2 pts increase",
    sentDate: "Jul 30, 2026",
    completedDate: "Jul 31, 2026",
    status: "Completed",
    flag: "High Risk",
    questions: [
      { q: "1. Feeling nervous, anxious, or on edge", a: "Nearly every day (3/3)" },
      { q: "2. Not being able to stop or control worrying", a: "Nearly every day (3/3)" },
      { q: "3. Worrying too much about different things", a: "More than half the days (2/3)" },
      { q: "4. Trouble relaxing", a: "Nearly every day (3/3)" },
      { q: "5. Being so restless that it's hard to sit still", a: "More than half the days (2/3)" },
      { q: "6. Becoming easily annoyed or irritable", a: "Several days (1/3)" },
      { q: "7. Feeling afraid as if something awful might happen", a: "Nearly every day (3/3)", flagged: true },
    ],
  },
  {
    id: "ASM-102",
    clientName: "Emma Martinez",
    clientInitials: "EM",
    avatarBg: "bg-blue-100 text-blue-700",
    therapyType: "CBT · Major Depression",
    instrument: "Patient Health Questionnaire",
    instrumentCode: "PHQ-9",
    score: "8 / 27",
    numericScore: 8,
    maxScore: 27,
    severity: "Mild Depression",
    severityColor: "yellow",
    trend: "improved",
    trendDiff: "-8 pts (-50%)",
    sentDate: "Jul 28, 2026",
    completedDate: "Jul 29, 2026",
    status: "Completed",
    flag: "Normal",
    questions: [
      { q: "1. Little interest or pleasure in doing things", a: "Several days (1/3)" },
      { q: "2. Feeling down, depressed, or hopeless", a: "Several days (1/3)" },
      { q: "3. Trouble falling or staying asleep", a: "More than half the days (2/3)" },
      { q: "4. Feeling tired or having little energy", a: "More than half the days (2/3)" },
      { q: "5. Poor appetite or overeating", a: "Several days (1/3)" },
      { q: "6. Feeling bad about yourself", a: "Not at all (0/3)" },
      { q: "7. Trouble concentrating on things", a: "Several days (1/3)" },
      { q: "8. Moving or speaking slowly / fidgety", a: "Not at all (0/3)" },
      { q: "9. Thoughts of self-harm or suicide", a: "Not at all (0/3)" },
    ],
  },
  {
    id: "ASM-103",
    clientName: "Priya Kapoor",
    clientInitials: "PK",
    avatarBg: "bg-emerald-100 text-emerald-700",
    therapyType: "EMDR · Trauma & PTSD",
    instrument: "PTSD Checklist for DSM-5",
    instrumentCode: "PCL-5",
    score: "24 / 80",
    numericScore: 24,
    maxScore: 80,
    severity: "Below Clinical Cutoff",
    severityColor: "green",
    trend: "improved",
    trendDiff: "-18 pts (-42%)",
    sentDate: "Jul 25, 2026",
    completedDate: "Jul 26, 2026",
    status: "Completed",
    flag: "Normal",
  },
  {
    id: "ASM-104",
    clientName: "David Kim",
    clientInitials: "DK",
    avatarBg: "bg-amber-100 text-amber-700",
    therapyType: "CBT · Depression",
    instrument: "Patient Health Questionnaire",
    instrumentCode: "PHQ-9",
    score: "--",
    numericScore: null,
    maxScore: 27,
    severity: "Awaiting Client Response",
    severityColor: "gray",
    trend: "none",
    trendDiff: "--",
    sentDate: "Jul 31, 2026",
    completedDate: "Due Aug 04",
    status: "Pending",
    flag: "Normal",
  },
  {
    id: "ASM-105",
    clientName: "Alex Thompson",
    clientInitials: "AT",
    avatarBg: "bg-rose-100 text-rose-700",
    therapyType: "ACT · Substance & Wellness",
    instrument: "Alcohol Use Disorders Test",
    instrumentCode: "AUDIT-C",
    score: "--",
    numericScore: null,
    maxScore: 12,
    severity: "3 Days Overdue",
    severityColor: "orange",
    trend: "none",
    trendDiff: "--",
    sentDate: "Jul 22, 2026",
    completedDate: "Due Jul 28",
    status: "Overdue",
    flag: "Overdue",
  },
  {
    id: "ASM-106",
    clientName: "Sofia Rodriguez",
    clientInitials: "SR",
    avatarBg: "bg-teal-100 text-teal-700",
    therapyType: "ACT · Generalized Anxiety",
    instrument: "General Anxiety Disorder",
    instrumentCode: "GAD-7",
    score: "11 / 21",
    numericScore: 11,
    maxScore: 21,
    severity: "Moderate Anxiety",
    severityColor: "yellow",
    trend: "improved",
    trendDiff: "-3 pts (-21%)",
    sentDate: "Jul 20, 2026",
    completedDate: "Jul 22, 2026",
    status: "Completed",
    flag: "Normal",
  },
  {
    id: "ASM-107",
    clientName: "Marcus O'Neill",
    clientInitials: "MO",
    avatarBg: "bg-indigo-100 text-indigo-700",
    therapyType: "Couples Therapy",
    instrument: "Revised Dyadic Adjustment Scale",
    instrumentCode: "RDAS",
    score: "41 / 69",
    numericScore: 41,
    maxScore: 69,
    severity: "Moderate Distress",
    severityColor: "orange",
    trend: "stable",
    trendDiff: "No change",
    sentDate: "Jul 18, 2026",
    completedDate: "Jul 19, 2026",
    status: "Completed",
    flag: "Requires Follow-up",
  },
];

export default function Assessments() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [instrumentFilter, setInstrumentFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

  /* Form states */
  const [newClientName, setNewClientName] = useState("");
  const [newInstrument, setNewInstrument] = useState("PHQ-9");
  const [newDueDate, setNewDueDate] = useState("2026-08-05");

  const filteredAssessments = assessments.filter((item) => {
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && item.status === "Completed") ||
      (statusFilter === "pending" && item.status === "Pending") ||
      (statusFilter === "overdue" && item.status === "Overdue") ||
      (statusFilter === "highrisk" && item.flag === "High Risk");

    const matchesInstrument =
      instrumentFilter === "all" || item.instrumentCode === instrumentFilter;

    return matchesSearch && matchesStatus && matchesInstrument;
  });

  const handleSendAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const initials = newClientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const newRecord: AssessmentRecord = {
      id: `ASM-${100 + assessments.length + 1}`,
      clientName: newClientName,
      clientInitials: initials || "CL",
      avatarBg: "bg-purple-100 text-purple-700",
      therapyType: "Psychotherapy",
      instrument: `${newInstrument} Assessment`,
      instrumentCode: newInstrument,
      score: "--",
      numericScore: null,
      maxScore: 27,
      severity: "Awaiting Response",
      severityColor: "gray",
      trend: "none",
      trendDiff: "--",
      sentDate: "Aug 01, 2026",
      completedDate: `Due ${newDueDate}`,
      status: "Pending",
      flag: "Normal",
    };

    setAssessments([newRecord, ...assessments]);
    setIsSendDialogOpen(false);
    setNewClientName("");
  };

  const getSeverityBadge = (color: AssessmentRecord["severityColor"], text: string) => {
    switch (color) {
      case "green":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100/80 text-emerald-800">
            {text}
          </span>
        );
      case "yellow":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100/80 text-amber-800">
            {text}
          </span>
        );
      case "orange":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-100/80 text-orange-800">
            {text}
          </span>
        );
      case "red":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800">
            {text}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
            {text}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-[1400px] mx-auto">
      <PageHeader
        title="Client Outcome Assessments"
        description="Monitor standardized scale responses (PHQ-9, GAD-7, PCL-5), track symptom progression, and identify clinical risk early."
        badge="EVALUATION & INTAKE"
        icon={<ClipboardCheck className="w-4 h-4 text-purple-200" />}
      >
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-full border border-white/20 transition-all active:scale-95 cursor-pointer"
            onClick={() => {
              const csvData = assessments
                .map((a) => `${a.id},${a.clientName},${a.instrumentCode},${a.score},${a.severity},${a.status}`)
                .join("\n");
              const blob = new Blob([`ID,Client,Instrument,Score,Severity,Status\n${csvData}`], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "assessments_report.csv";
              a.click();
            }}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSendDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#5e2be2] hover:bg-white/90 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Send Assessment</span>
          </button>
        </div>
      </PageHeader>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Assessments
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">148</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14% from last month
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">92.8%</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Avg completion in 1.4 days
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              High Risk Alerts
            </p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">1 Client</h3>
            <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> James Chen (GAD-7: 17)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg Symptom Reduction
            </p>
            <h3 className="text-2xl font-black text-primary mt-1">-36.4%</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Consistent improvement
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
            <BarChart2 className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by client name or assessment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-50/70 border-slate-200 text-sm focus:bg-white focus:border-primary transition-all rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs bg-slate-50 border-slate-200 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="highrisk">High Risk Flags</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Instrument:</span>
            <Select value={instrumentFilter} onValueChange={setInstrumentFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs bg-slate-50 border-slate-200 rounded-xl">
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                <SelectItem value="PHQ-9">PHQ-9 (Depression)</SelectItem>
                <SelectItem value="GAD-7">GAD-7 (Anxiety)</SelectItem>
                <SelectItem value="PCL-5">PCL-5 (PTSD)</SelectItem>
                <SelectItem value="AUDIT-C">AUDIT-C (Substance)</SelectItem>
                <SelectItem value="RDAS">RDAS (Couples)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Spacious Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 w-[25%]">Client</th>
                <th className="py-4 px-6 w-[20%]">Questionnaire</th>
                <th className="py-4 px-6 w-[22%]">Score &amp; Severity</th>
                <th className="py-4 px-6 w-[16%]">Progress Trend</th>
                <th className="py-4 px-6 w-[12%]">Completion Date</th>
                <th className="py-4 px-6 w-[5%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <ClipboardCheck className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="font-semibold text-sm text-slate-600">No assessment records found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Client Name & Category */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className={cn(
                          "w-10 h-10 rounded-full font-bold flex items-center justify-center text-xs shrink-0 shadow-sm",
                          item.avatarBg
                        )}>
                          {item.clientInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">
                              {item.clientName}
                            </span>
                            {item.flag === "High Risk" && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase">
                                High Risk
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.therapyType}</p>
                        </div>
                      </div>
                    </td>

                    {/* Questionnaire Tool */}
                    <td className="py-4.5 px-6">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-200/60 mb-1">
                          {item.instrumentCode}
                        </span>
                        <p className="text-xs text-slate-500 font-medium">{item.instrument}</p>
                      </div>
                    </td>

                    {/* Score & Severity */}
                    <td className="py-4.5 px-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-slate-900 text-base">
                            {item.score}
                          </span>
                          {getSeverityBadge(item.severityColor, item.severity)}
                        </div>
                        {item.numericScore !== null && (
                          <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                item.severityColor === "green" && "bg-emerald-500",
                                item.severityColor === "yellow" && "bg-amber-500",
                                item.severityColor === "orange" && "bg-orange-500",
                                item.severityColor === "red" && "bg-rose-500"
                              )}
                              style={{
                                width: `${Math.min(100, (item.numericScore / item.maxScore) * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Progress Trend */}
                    <td className="py-4.5 px-6">
                      {item.trend === "improved" && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>{item.trendDiff}</span>
                        </div>
                      )}
                      {item.trend === "worsened" && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{item.trendDiff}</span>
                        </div>
                      )}
                      {item.trend === "stable" && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <Minus className="w-3 h-3 text-slate-400" />
                          <span>Stable</span>
                        </div>
                      )}
                      {item.trend === "none" && (
                        <span className="text-xs text-slate-400 font-medium">--</span>
                      )}
                    </td>

                    {/* Completion Date & Status */}
                    <td className="py-4.5 px-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {item.completedDate}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Sent: {item.sentDate}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-semibold text-xs rounded-xl px-3 py-1.5 transition-all cursor-pointer"
                        onClick={() => setSelectedRecord(item)}
                      >
                        Details
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        {selectedRecord && (
          <DialogContent className="max-w-xl bg-white p-7 rounded-3xl shadow-2xl border border-slate-200">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span>{selectedRecord.clientName}</span>
                    <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-md font-extrabold border border-slate-200">
                      {selectedRecord.instrumentCode}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
                    Record Reference ID: {selectedRecord.id}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 pt-4">
              {/* Score Highlight Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Total Score Result
                  </p>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="text-3xl font-black text-slate-900">
                      {selectedRecord.score}
                    </span>
                    {getSeverityBadge(selectedRecord.severityColor, selectedRecord.severity)}
                  </div>
                </div>
                {selectedRecord.flag === "High Risk" && (
                  <div className="p-3 bg-rose-100 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2 max-w-[200px]">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                    <span>Clinical Risk Review Recommended</span>
                  </div>
                )}
              </div>

              {/* Questionnaire item breakdown if available */}
              {selectedRecord.questions && selectedRecord.questions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Item-by-Item Responses
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selectedRecord.questions.map((q, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-3 rounded-xl border text-xs flex items-center justify-between gap-4 transition-colors",
                          q.flagged
                            ? "bg-rose-50/80 border-rose-200 text-rose-900"
                            : "bg-white border-slate-200/80 text-slate-800"
                        )}
                      >
                        <span className="font-medium">{q.q}</span>
                        <span
                          className={cn(
                            "font-bold shrink-0 px-2.5 py-1 rounded-lg text-[11px]",
                            q.flagged
                              ? "bg-rose-200 text-rose-900"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {q.a}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl font-semibold"
                    onClick={() => {
                      alert(`Re-sent ${selectedRecord.instrumentCode} to ${selectedRecord.clientName}`);
                      setSelectedRecord(null);
                    }}
                  >
                    Re-assign
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
                    onClick={() => {
                      alert(`Downloading report for ${selectedRecord.clientName}`);
                    }}
                  >
                    Download PDF Report
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Send Assessment Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-md bg-white p-7 rounded-3xl shadow-2xl border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Send New Assessment</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Deliver a standardized outcome questionnaire directly to your client.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendAssessment} className="space-y-4 pt-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Client Name
              </label>
              <Input
                placeholder="e.g. Emma Martinez"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 text-sm rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Assessment Tool
              </label>
              <Select value={newInstrument} onValueChange={setNewInstrument}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-sm rounded-xl">
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHQ-9">PHQ-9 (Depression Scale)</SelectItem>
                  <SelectItem value="GAD-7">GAD-7 (Anxiety Scale)</SelectItem>
                  <SelectItem value="PCL-5">PCL-5 (PTSD Checklist)</SelectItem>
                  <SelectItem value="AUDIT-C">AUDIT-C (Substance Use)</SelectItem>
                  <SelectItem value="RDAS">RDAS (Dyadic Adjustment)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Response Due Date
              </label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 text-sm rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsSendDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
