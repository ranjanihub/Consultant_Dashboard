import { TrendingUp, Sparkles } from "lucide-react";

export default function Outcomes() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <TrendingUp className="w-10 h-10 text-primary" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Coming Soon</span>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-3">Outcomes & Analytics</h1>
      <p className="text-muted-foreground max-w-md text-[15px] leading-relaxed">
        In-depth client progress tracking, goal achievement rates, assessment trends,
        and caseload-wide outcome analytics — all in one place.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {["Client Progress Scores", "Goal Achievement Rates", "Assessment Trends", "Attendance Analytics", "Homework Adherence"].map(f => (
          <span key={f} className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-muted-foreground border border-border">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
