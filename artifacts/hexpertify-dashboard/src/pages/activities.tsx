import { useState, useEffect } from "react";
import { 
  Activity, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Search, 
  Brain, 
  Heart, 
  Wind, 
  Smile, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Check
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface ActivityItem {
  id: number | string;
  title: string;
  description: string;
  category: "MINDFULNESS" | "CBT" | "GRATITUDE" | "BREATHING" | "SOMATIC" | string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  duration: string;
  dueDate: string;
  imageUrl: string;
  status: "pending" | "completed" | string;
  instructions?: string;
  reflection?: string;
  completedAt?: string | null;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    title: "Morning Mindfulness Meditation",
    description: "10-minute guided breathing session focusing on awareness of breath and body sensations.",
    category: "MINDFULNESS",
    difficulty: "Easy",
    duration: "10 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Sit in a comfortable position with your spine upright but relaxed.\n2. Gently close your eyes and bring awareness to your breath.\n3. Observe the sensation of air flowing in through your nose and out through your mouth.\n4. Whenever your mind drifts to thoughts, acknowledge them without judgment and return to the breath.",
    reflection: ""
  },
  {
    id: 2,
    title: "CBT Thought Record Entry",
    description: "Document recent anxiety trigger and write a balanced, rational reframe using the 5-column technique.",
    category: "CBT",
    difficulty: "Medium",
    duration: "15 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Record the triggering situation (Where were you? Who was there?).\n2. Catch your automatic thought and rate how strongly you believed it (0-100%).\n3. Note down the emotional response and physical sensations.\n4. Challenge the thought by listing objective evidence for and against.\n5. Formulate a balanced, realistic replacement thought.",
    reflection: ""
  },
  {
    id: 3,
    title: "Evening Gratitude Journaling",
    description: "Write down 3 things you felt grateful for today and reflect on why they mattered.",
    category: "GRATITUDE",
    difficulty: "Easy",
    duration: "8 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Take 2 slow abdominal breaths.\n2. Write down 3 specific things from today that brought you warmth, joy, or relief.\n3. For each item, write 1-2 sentences about *why* it was meaningful.\n4. Rest quietly for a moment to absorb the positive emotions.",
    reflection: ""
  },
  {
    id: 4,
    title: "4-7-8 Parasympathetic Breathing",
    description: "Calm your nervous system using rhythmic 4-second inhale, 7-second hold, and 8-second exhale.",
    category: "BREATHING",
    difficulty: "Easy",
    duration: "5 min",
    dueDate: "Tomorrow",
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Place tip of tongue against ridge behind upper front teeth.\n2. Exhale completely through mouth with a gentle whoosh sound.\n3. Inhale silently through nose for 4 seconds.\n4. Hold breath for 7 seconds.\n5. Exhale through mouth for 8 seconds. Repeat 4 cycles.",
    reflection: ""
  },
  {
    id: 5,
    title: "Progressive Muscle Relaxation (PMR)",
    description: "Systematically tense and release muscle groups from toes to head to dissolve physical anxiety.",
    category: "SOMATIC",
    difficulty: "Medium",
    duration: "12 min",
    dueDate: "Completed",
    imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    instructions: "Tense each muscle group firmly for 5s, then release completely.",
    reflection: "Felt a dramatic release in shoulder tension. Heart rate dropped noticeably and mind felt much clearer.",
    completedAt: "Jul 30, 2026 at 6:45 PM"
  }
];

const CATEGORIES = ["All", "Pending", "Completed", "MINDFULNESS", "CBT", "GRATITUDE", "BREATHING", "SOMATIC"];

export default function ActivitiesPage() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Start / Perform Activity Modal
  const [activeActivity, setActiveActivity] = useState<ActivityItem | null>(null);
  const [reflectionInput, setReflectionInput] = useState<string>("");

  // Add Activity Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("MINDFULNESS");
  const [newDifficulty, setNewDifficulty] = useState("Easy");
  const [newDuration, setNewDuration] = useState("10 min");
  const [newDueDate, setNewDueDate] = useState("Today");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newInstructions, setNewInstructions] = useState("");

  // Fetch activities from backend API if available
  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setActivities(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch activities from backend API, using client fallback:", err);
      });
  }, []);

  const handleStartActivity = (act: ActivityItem) => {
    setActiveActivity(act);
    setReflectionInput(act.reflection || "");
  };

  const handleCompleteActivity = async () => {
    if (!activeActivity) return;

    const completedTimestamp = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

    try {
      await fetch(`/api/activities/${activeActivity.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection: reflectionInput })
      });
    } catch (err) {
      console.warn("API complete failed, updating client state directly:", err);
    }

    setActivities((prev) =>
      prev.map((item) =>
        item.id === activeActivity.id
          ? {
              ...item,
              status: "completed",
              reflection: reflectionInput.trim() || "Completed activity.",
              completedAt: completedTimestamp,
              dueDate: "Completed"
            }
          : item
      )
    );

    toast({
      title: "Activity Completed! 🎉",
      description: `Great job completing "${activeActivity.title}". Your progress has been logged.`,
    });

    setActiveActivity(null);
    setReflectionInput("");
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const defaultImages: Record<string, string> = {
      MINDFULNESS: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      CBT: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
      GRATITUDE: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
      BREATHING: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
      SOMATIC: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80"
    };

    const newAct: ActivityItem = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      duration: newDuration.trim() || "10 min",
      dueDate: newDueDate.trim() || "Today",
      imageUrl: newImageUrl.trim() || defaultImages[newCategory] || defaultImages.MINDFULNESS,
      status: "pending",
      instructions: newInstructions.trim() || "Complete exercises as prescribed.",
      reflection: ""
    };

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAct)
      });
      const saved = await res.json();
      if (saved && saved.id) {
        setActivities((prev) => [saved, ...prev]);
      } else {
        setActivities((prev) => [newAct, ...prev]);
      }
    } catch (err) {
      setActivities((prev) => [newAct, ...prev]);
    }

    toast({
      title: "Activity Created",
      description: `"${newTitle}" has been added to your daily activities list.`,
    });

    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewInstructions("");
    setNewImageUrl("");
  };

  const filteredActivities = activities.filter((act) => {
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Pending"
        ? act.status === "pending"
        : selectedCategory === "Completed"
        ? act.status === "completed"
        : act.category === selectedCategory;

    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const pendingActivities = filteredActivities.filter((a) => a.status === "pending");
  const completedActivities = filteredActivities.filter((a) => a.status === "completed");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "MINDFULNESS":
        return <Brain className="w-3.5 h-3.5" />;
      case "CBT":
        return <Sparkles className="w-3.5 h-3.5" />;
      case "GRATITUDE":
        return <Heart className="w-3.5 h-3.5" />;
      case "BREATHING":
        return <Wind className="w-3.5 h-3.5" />;
      case "SOMATIC":
        return <Smile className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Title & Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Activities
          </h1>
          <p className="text-slate-500 text-base mt-1.5 font-medium">
            Daily exercises tailored to your wellness goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-slate-200 bg-white shadow-sm focus-visible:ring-[#5b32e4] h-10 text-sm"
            />
          </div>

          {/* Add Activity Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto rounded-full bg-[#5b32e4] hover:bg-[#4c28c8] text-white font-bold h-10 px-5 shadow-md shadow-purple-500/20 shrink-0 gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Activity</span>
          </Button>
        </div>
      </div>

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
                  ? "bg-[#5b32e4] text-white shadow-md shadow-purple-500/20 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              }
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Pending Activities Section */}
      {(selectedCategory === "All" || selectedCategory === "Pending" || !["Completed"].includes(selectedCategory)) && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#5b32e4] stroke-[2.5]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pending Activities
            </h2>
            <span className="bg-purple-100 text-[#5b32e4] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {pendingActivities.length}
            </span>
          </div>

          {pendingActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingActivities.map((act) => (
                <div
                  key={act.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Container */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={act.imageUrl}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Category Tag (Top Left) */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-slate-900 flex items-center gap-1.5 shadow-sm border border-white/40">
                      {getCategoryIcon(act.category)}
                      <span>{act.category}</span>
                    </div>

                    {/* Difficulty Tag (Top Right) */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-800 shadow-sm border border-white/40">
                      {act.difficulty}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#5b32e4] transition-colors leading-snug mb-2">
                        {act.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {act.description}
                      </p>
                    </div>

                    {/* Meta info & Action */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{act.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4 text-slate-400" />
                          <span>{act.dueDate}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleStartActivity(act)}
                        className="w-full h-11 rounded-2xl border-2 border-[#5b32e4]/20 hover:border-[#5b32e4] bg-purple-50/50 hover:bg-[#5b32e4] text-[#5b32e4] hover:text-white font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        Start Activity
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <p className="text-slate-500 font-medium text-sm">No pending activities found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Completed Activities Section */}
      {(selectedCategory === "All" || selectedCategory === "Completed" || completedActivities.length > 0) && (
        <div className="space-y-5 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Completed Activities
            </h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {completedActivities.length}
            </span>
          </div>

          {completedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-200 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                        {act.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Done</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {act.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {act.description}
                    </p>

                    {act.reflection && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block">Your Reflection:</span>
                        <p className="italic">"{act.reflection}"</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Duration: {act.duration}</span>
                    <span>{act.completedAt || "Recently completed"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <p className="text-slate-500 font-medium text-sm">No completed activities yet. Complete your first exercise above!</p>
            </div>
          )}
        </div>
      )}

      {/* Start / Perform Activity Modal */}
      <Dialog open={!!activeActivity} onOpenChange={() => setActiveActivity(null)}>
        {activeActivity && (
          <DialogContent className="max-w-xl p-0 rounded-3xl overflow-hidden border-none shadow-2xl">
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={activeActivity.imageUrl}
                alt={activeActivity.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                  {getCategoryIcon(activeActivity.category)}
                  <span>{activeActivity.category} • {activeActivity.duration}</span>
                </div>
                <h2 className="text-2xl font-bold leading-tight text-white">
                  {activeActivity.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-6 bg-white">
              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Exercise Instructions & Steps
                </h3>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {activeActivity.instructions || activeActivity.description}
                </div>
              </div>

              {/* Reflection Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Reflection (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="How did this activity make you feel? Any insights or changes in mood?"
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b32e4] focus:border-transparent transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveActivity(null)}
                  className="rounded-2xl border-slate-200 font-semibold text-slate-700 h-11 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCompleteActivity}
                  className="rounded-2xl bg-[#5b32e4] hover:bg-[#4c28c8] text-white font-bold h-11 px-6 shadow-md shadow-purple-500/20 gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Complete Activity</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Add New Activity Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg p-6 sm:p-7 rounded-3xl bg-white border-none shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              Create New Activity
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm font-medium">
              Add a custom therapeutic activity or exercise to your daily wellness schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateActivity} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Activity Title *
              </label>
              <Input
                type="text"
                placeholder="e.g. 5-4-3-2-1 Sensory Grounding"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="rounded-2xl border-slate-200 h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5b32e4]"
                >
                  <option value="MINDFULNESS">MINDFULNESS</option>
                  <option value="CBT">CBT</option>
                  <option value="GRATITUDE">GRATITUDE</option>
                  <option value="BREATHING">BREATHING</option>
                  <option value="SOMATIC">SOMATIC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Difficulty
                </label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5b32e4]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Duration
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 10 min"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="rounded-2xl border-slate-200 h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Due Date
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Today or Tomorrow"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="rounded-2xl border-slate-200 h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Summary Description *
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of the exercise and its goal..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b32e4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Step-by-Step Instructions
              </label>
              <textarea
                rows={3}
                placeholder="1. Sit comfortably...\n2. Inhale deeply..."
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5b32e4]"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-2xl border-slate-200 font-semibold h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-2xl bg-[#5b32e4] hover:bg-[#4c28c8] text-white font-bold h-11 px-6 shadow-md shadow-purple-500/20 cursor-pointer"
              >
                Create Activity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
