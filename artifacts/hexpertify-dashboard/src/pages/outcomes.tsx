import { LineChart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function Outcomes() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Clinical Outcomes & Analytics"
        description="In-depth client progress tracking, PHQ-9 / GAD-7 trends, and caseload-wide outcome analytics."
        badge="ANALYTICS & METRICS"
        icon={<LineChart className="w-4 h-4 text-purple-200" />}
      />

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 bg-white rounded-2xl border border-slate-200 p-12">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#5e2be2] flex items-center justify-center mb-6 border border-purple-100">
          <LineChart className="w-8 h-8" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#5e2be2]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#5e2be2]">Advanced Analytics Module</span>
          <Sparkles className="w-4 h-4 text-[#5e2be2]" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-3 text-slate-900">Comprehensive Progress Tracking</h2>
        <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-8">
          Detailed metrics for client improvement, goal achievement rates, session adherence, and automated clinical reports.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5">
          {["Client Progress Scores", "Goal Achievement Rates", "Assessment Trends", "Attendance Analytics", "Homework Adherence"].map(f => (
            <span key={f} className="px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
