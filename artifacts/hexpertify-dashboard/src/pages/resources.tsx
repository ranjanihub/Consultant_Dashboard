import { FolderOpen, Sparkles, BookOpen, FileText, Download, Layers, ShieldCheck } from "lucide-react";

export default function Resources() {
  const upcomingFeatures = [
    {
      title: "Clinical Worksheets",
      description: "CBT, DBT, and ACT exercise templates ready to share with clients.",
      icon: FileText,
    },
    {
      title: "Psychoeducation Handouts",
      description: "Evidence-based guides on anxiety, trauma, sleep hygiene, and mindfulness.",
      icon: BookOpen,
    },
    {
      title: "Assessment Toolkits",
      description: "Standardized clinical questionnaires (PHQ-9, GAD-7, PCL-5) with auto-scoring.",
      icon: Layers,
    },
    {
      title: "Client Resource Portal",
      description: "One-click secure file sharing directly into client mobile applications.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 py-10 max-w-4xl mx-auto">
      {/* Icon Badge */}
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/20">
        <FolderOpen className="w-10 h-10 text-primary" />
      </div>

      {/* Pill Badge */}
      <div className="flex items-center gap-2 mb-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Coming Soon</span>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Clinical Resources Library</h1>
      <p className="text-muted-foreground max-w-lg text-base leading-relaxed mb-10">
        A centralized repository of evidence-based therapy worksheets, clinical protocols, 
        and patient educational materials tailored for your practice.
      </p>

      {/* Upcoming Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left mb-10">
        {upcomingFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.title} className="p-5 rounded-xl bg-white border border-border shadow-sm flex items-start gap-4 hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tags preview */}
      <div className="flex flex-wrap justify-center gap-2">
        {["CBT Worksheets", "Mindfulness Guides", "Relapse Prevention", "Intake Protocols", "Homework Packs"].map(f => (
          <span key={f} className="px-3.5 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground border border-border">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
