import { useState } from "react";
import { FolderOpen, Search, Plus, ExternalLink, Download, FileText, Headphones, Video, BookOpen, Clock, Tag, Globe, Lock, Bookmark, Star, ArrowRight, Info } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export interface ResourceItem {
  id: string;
  type: "article" | "worksheet" | "meditation" | "video" | "pdf";
  typeLabel: string;
  category: string;
  isRecommended?: boolean;
  isPublic?: boolean;
  title: string;
  description: string;
  fullContent?: string;
  duration: string;
  imageUrl: string;
  downloadUrl?: string;
  tags: string[];
}

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    type: "article",
    typeLabel: "ARTICLE",
    category: "Articles",
    isRecommended: true,
    title: "Understanding Panic & Somatic Grounding Techniques",
    description: "Practical step-by-step physical grounding tools to de-escalate panic attacks and physical hyperarousal.",
    fullContent: `Panic attacks can feel overwhelming, but somatic grounding techniques leverage your nervous system's natural calming pathways to restore emotional balance.

### 1. The 5-4-3-2-1 Sensory Grounding Technique
- **5 things you can SEE:** Look around and notice 5 specific visual details.
- **4 things you can TOUCH:** Feel the physical texture of your chair, clothes, or ground.
- **3 things you can HEAR:** Listen closely for subtle ambient sounds.
- **2 things you can SMELL:** Notice any aromas or fresh air.
- **1 thing you can TASTE:** Focus on the taste in your mouth or sip cool water.

### 2. Box Breathing (4-4-4-4)
Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and pause for 4 seconds. Repeat 4 cycles to stimulate the vagus nerve and slow elevated heart rate.`,
    duration: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    tags: ["Grounding", "Panic De-escalation", "Somatic", "CBT"]
  },
  {
    id: "res-2",
    type: "worksheet",
    typeLabel: "WORKSHEET",
    category: "Worksheets",
    isRecommended: true,
    title: "Cognitive Distortions Reference Guide & Worksheet",
    description: "Identify and reframe the 10 most common unhelpful thinking habits with real-life examples.",
    fullContent: `Cognitive distortions are biased ways of thinking that reinforce negative emotions. Use this guide to identify automatic thoughts and reframe them into objective perspectives.

### Common Distortions Covered:
1. **All-or-Nothing Thinking:** Seeing things in black-and-white categories.
2. **Catastrophizing:** Expecting the worst possible outcome.
3. **Mind Reading:** Assuming you know what others are thinking without evidence.
4. **Emotional Reasoning:** Assuming feelings reflect objective reality ("I feel anxious, so it must be dangerous").

### Practical Reframing Exercise:
Write down the triggering situation, your automatic thought, the cognitive distortion type, and an alternative balanced thought.`,
    duration: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    tags: ["CBT", "Reframing", "Cognitive Health", "Self-Reflection"]
  },
  {
    id: "res-3",
    type: "meditation",
    typeLabel: "MEDITATION",
    category: "Meditations",
    isRecommended: false,
    title: "15-Minute Progressive Muscle Relaxation (PMR)",
    description: "Guided audio session systematically tensing and relaxing major muscle groups to release somatic tension.",
    fullContent: `Progressive Muscle Relaxation (PMR) is an evidence-based exercise designed to reduce muscular tension and sympathetic nervous system activation.

### Guided Steps:
1. Sit or lie down comfortably in a quiet room.
2. Tense your toes and feet firmly for 5 seconds, then suddenly release completely. Notice the sensation of warmth and relaxation.
3. Move systematically upward through calf muscles, thighs, abdomen, chest, shoulders, arms, hands, neck, and face.
4. Conclude with 3 deep abdominal breaths, enjoying total body lightness.`,
    duration: "15 min listen",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    tags: ["Mindfulness", "PMR", "Stress Release", "Body Scan"]
  },
  {
    id: "res-4",
    type: "video",
    typeLabel: "VIDEO",
    category: "Videos",
    isRecommended: true,
    title: "Diaphragmatic Breathing & Vagus Nerve Stimulation",
    description: "Visual walkthrough and biofeedback demonstration for activating the parasympathetic nervous system.",
    fullContent: `Diaphragmatic breathing (belly breathing) expands the diaphragm, pulling air deep into the lower lungs and signaling safety to the autonomic nervous system.

### Key Takeaways:
- Place one hand on your upper chest and the other on your abdomen.
- Breathe in slowly through your nose so your abdominal hand rises while your chest hand stays quiet.
- Exhale slowly through pursed lips, allowing abdominal muscles to collapse inward.
- Practicing 5–10 minutes daily lowers cortisol levels and improves baseline heart rate variability (HRV).`,
    duration: "10 min video",
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
    tags: ["Vagus Nerve", "Breathing", "Biofeedback", "Autonomic Relief"]
  },
  {
    id: "res-5",
    type: "pdf",
    typeLabel: "PDF",
    category: "PDFs",
    isRecommended: false,
    title: "Sleep Hygiene & Circadian Rhythm Protocol",
    description: "Evidence-based checklist for evening wind-down rituals, light exposure management, and sleep tracking.",
    fullContent: `Quality sleep is foundational for emotional regulation and cognitive health. This protocol provides non-pharmacological guidelines for restorative rest.

### Core Guidelines:
- **Morning Sunlight:** Get 10–15 minutes of direct sunlight within 1 hour of waking.
- **Screen Cutoff:** Turn off blue-light emitting screens 60 minutes before bed.
- **Temperature Control:** Keep bedroom cool (around 65°F / 18°C).
- **Consistent Wake Time:** Wake up at the same time daily, even on weekends.`,
    duration: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80",
    tags: ["Sleep", "Circadian Rhythm", "Wellness", "Checklist"]
  },
  {
    id: "res-6",
    type: "worksheet",
    typeLabel: "WORKSHEET",
    category: "Worksheets",
    isRecommended: false,
    title: "5-Column CBT Thought Record & Restructuring",
    description: "Structured exercise to log distressing situations, catch automatic thoughts, and form balanced perspectives.",
    fullContent: `The 5-Column Thought Record is one of the most effective tools in Cognitive Behavioral Therapy for modifying unhelpful thought patterns.

### Column Structure:
1. **Situation:** Who, what, when, where?
2. **Automatic Thought:** What thoughts or images went through your mind? (Rate belief 0–100%)
3. **Emotion:** What did you feel? (Rate intensity 0–100%)
4. **Evidence:** Facts supporting vs. facts contradicting the automatic thought.
5. **Alternative Thought:** Objective, realistic perspective (Re-rate emotion intensity).`,
    duration: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=800&q=80",
    tags: ["CBT", "Thought Record", "Restructuring", "Journaling"]
  }
];

const CATEGORIES = ["All Resources", "Saved", "Articles", "Videos", "Worksheets", "Meditations", "PDFs"];

export default function Resources() {
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Resources");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["res-1", "res-2"]);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  // Add Resource Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"article" | "worksheet" | "meditation" | "video" | "pdf">("article");
  const [newDuration, setNewDuration] = useState("5 min read");
  const [newDescription, setNewDescription] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [newTags, setNewTags] = useState("");

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const categoryMap: Record<string, string> = {
      article: "Articles",
      worksheet: "Worksheets",
      meditation: "Meditations",
      video: "Videos",
      pdf: "PDFs",
    };

    const typeLabelMap: Record<string, string> = {
      article: "ARTICLE",
      worksheet: "WORKSHEET",
      meditation: "MEDITATION",
      video: "VIDEO",
      pdf: "PDF",
    };

    const defaultImages: Record<string, string> = {
      article: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      worksheet: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
      meditation: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
      video: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
      pdf: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80",
    };

    const newResource: ResourceItem = {
      id: `res-${Date.now()}`,
      type: newType,
      typeLabel: typeLabelMap[newType],
      category: categoryMap[newType],
      isPublic: newIsPublic,
      title: newTitle.trim(),
      description: newDescription.trim(),
      fullContent: newContent.trim() || newDescription.trim(),
      duration: newDuration.trim() || "5 min read",
      imageUrl: newImageUrl.trim() || defaultImages[newType],
      tags: newTags
        ? newTags.split(",").map((t) => t.trim()).filter(Boolean)
        : ["General", typeLabelMap[newType]],
    };

    setResources((prev) => [newResource, ...prev]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewDescription("");
    setNewContent("");
    setNewTags("");
    setNewImageUrl("");
    setNewIsPublic(false);
  };

  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      selectedCategory === "All Resources"
        ? true
        : selectedCategory === "Saved"
        ? bookmarkedIds.includes(res.id)
        : res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "worksheet":
        return <FileText className="w-3.5 h-3.5" />;
      case "meditation":
        return <Headphones className="w-3.5 h-3.5" />;
      case "video":
        return <Video className="w-3.5 h-3.5" />;
      case "pdf":
        return <Download className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Resource Library"
        description="Clinical guides, worksheets, psychoeducation materials, and client toolkits."
        badge="THERAPY RESOURCES"
        icon={<FolderOpen className="w-4 h-4 text-purple-200" />}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-slate-200 bg-white text-slate-900 shadow-sm focus-visible:ring-[#5e2be2] h-9 text-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#5e2be2] hover:bg-white/90 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Resource</span>
          </button>
        </div>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 rounded-full px-5 py-2 text-sm font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                  : "bg-white text-muted-foreground hover:text-foreground hover:bg-slate-50 border border-border rounded-full px-5 py-2 text-sm font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              }
            >
              {cat === "Saved" && (
                <Bookmark className={`w-3.5 h-3.5 ${isActive ? "fill-white text-white" : "text-muted-foreground"}`} />
              )}
              <span>{cat}</span>
              {cat === "Saved" && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {bookmarkedIds.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid of Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isBookmarked = bookmarkedIds.includes(res.id);
            return (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res)}
                className="group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Top Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={res.imageUrl}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

                  {/* Type Label (Top-Left) */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/40">
                    {getTypeIcon(res.type)}
                    <span>{res.typeLabel}</span>
                  </div>

                  {/* Bookmark Button (Top-Right) */}
                  <button
                    onClick={(e) => toggleBookmark(res.id, e)}
                    title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-white/40 transition-all hover:scale-110 active:scale-95"
                  >
                    <Bookmark
                      className={
                        isBookmarked
                          ? "w-4 h-4 fill-primary text-primary"
                          : "w-4 h-4 text-slate-600"
                      }
                    />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>

                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {res.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {res.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{res.duration}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-border text-center px-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No resources found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            We couldn't find any resources matching your search or selected filter.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Resources");
            }}
            className="rounded-full"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Resource Detail Modal */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        {selectedResource && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl gap-0">
            {/* Header Image */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-100">
              <img
                src={selectedResource.imageUrl}
                alt={selectedResource.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 shadow-sm">
                {getTypeIcon(selectedResource.type)}
                <span>{selectedResource.typeLabel}</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  {selectedResource.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-b border-border pb-4">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedResource.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-auto">
                  {selectedResource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                <p className="font-medium text-base text-foreground leading-snug">
                  {selectedResource.description}
                </p>

                {selectedResource.fullContent && (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 text-sm space-y-3">
                    {selectedResource.fullContent}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => toggleBookmark(selectedResource.id, e)}
                  className="rounded-full gap-2"
                >
                  <Bookmark
                    className={
                      bookmarkedIds.includes(selectedResource.id)
                        ? "w-4 h-4 fill-primary text-primary"
                        : "w-4 h-4"
                    }
                  />
                  <span>
                    {bookmarkedIds.includes(selectedResource.id) ? "Saved" : "Save Bookmark"}
                  </span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full gap-2 font-semibold bg-primary hover:bg-primary/90"
                    onClick={() => setSelectedResource(null)}
                  >
                    <span>Close</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Add Resource Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Resource</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Create a new clinical article, worksheet, meditation, video, or PDF resource for your library.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddResource} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Title *
              </label>
              <Input
                type="text"
                placeholder="e.g. Grounding Exercises for Acute Anxiety"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Resource Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="article">Article</option>
                  <option value="worksheet">Worksheet</option>
                  <option value="meditation">Meditation</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Duration / Read Time
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 8 min read"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Short Summary *
              </label>
              <textarea
                rows={2}
                placeholder="Brief 1-2 sentence overview of the resource content..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Full Content / Detailed Guide (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Detailed steps, exercise instructions, or full article text..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Cover Image URL (Optional)
              </label>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Tags (Comma separated)
              </label>
              <Input
                type="text"
                placeholder="e.g. Anxiety, Grounding, Mindfulness"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="make-public-check"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="make-public-check" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                  Make As Public
                </label>
              </div>

              {newIsPublic && (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-2 rounded-lg transition-all animate-in fade-in duration-200">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Note: Submitted resource will go live after admin review.</span>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90 font-bold px-6">
                Create Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
