import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSubmitBlogPost, useSubmitBlogOutline } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PenTool, FileText, Send, Type, Upload, X, Clock, Trash2, Tag } from "lucide-react";

/* ── schemas ──────────────────────────────────────────────── */
const postSchema = z.object({
  title:         z.string().min(5, "Title must be at least 5 characters.").max(100),
  category:      z.string().min(1, "Please select a category."),
  tags:          z.string().optional(),
  content:       z.string().min(1, "Content is required."),
  featuredImage: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
});

const outlineSchema = z.object({
  proposedTitle:  z.string().min(5, "Title must be at least 5 characters."),
  keyPoints:      z.string().min(1, "Please list at least one key point."),
  targetAudience: z.string().min(1, "Please describe the audience."),
  keywords:       z.string().min(1, "Please provide keywords."),
  notes:          z.string().optional(),
});

/* ── draft types ──────────────────────────────────────────── */
interface PostDraft {
  id: string; kind: "post";
  title: string; category: string; tags?: string; content: string; savedAt: Date;
}
interface OutlineDraft {
  id: string; kind: "outline";
  proposedTitle: string; keyPoints: string; targetAudience: string; keywords: string; notes?: string; savedAt: Date;
}
type Draft = PostDraft | OutlineDraft;

function timeAgo(date: Date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

/* ── tab pill ─────────────────────────────────────────────── */
function Tab({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: React.ElementType; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all",
        active
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

/* ── Drafts panel ─────────────────────────────────────────── */
function DraftsPanel({
  drafts, onDelete, onRestore,
}: {
  drafts: Draft[];
  onDelete: (id: string) => void;
  onRestore: (draft: Draft) => void;
}) {
  if (!Array.isArray(drafts) || drafts.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Saved Drafts ({drafts.length})
      </p>
      <div className="space-y-2">
        {(Array.isArray(drafts) ? drafts : []).map(draft => {
          const title = draft.kind === "post" ? draft.title : draft.proposedTitle;
          const sub   = draft.kind === "post"
            ? draft.category || "No category"
            : (draft.keywords || "No keywords");
          return (
            <div
              key={draft.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-white hover:border-primary/30 hover:bg-primary/[0.02] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {draft.kind === "post"
                  ? <PenTool className="w-4 h-4 text-primary" />
                  : <FileText className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title || "Untitled draft"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{sub}</span>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{timeAgo(draft.savedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm" variant="ghost"
                  className="h-7 px-3 text-xs text-primary hover:bg-primary/10"
                  onClick={() => onRestore(draft)}
                >
                  Edit
                </Button>
                <button
                  onClick={() => onDelete(draft.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Full blog form ───────────────────────────────────────── */
function FullBlogForm({
  onSaveDraft, defaultValues,
}: {
  onSaveDraft: (values: z.infer<typeof postSchema>) => void;
  defaultValues?: Partial<z.infer<typeof postSchema>>;
}) {
  const { toast } = useToast();
  const submitPost = useSubmitBlogPost();
  const [contentMode, setContentMode] = useState<"text" | "file">("text");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "Understanding Cognitive Behavioral Therapy for Panic and Anxiety",
      category: "Anxiety",
      tags: "cbt, anxiety, coping-skills, mental-health",
      content: "Cognitive Behavioral Therapy (CBT) is an evidence-based psychological treatment that helps individuals identify and challenge negative thought patterns.\n\n### Key Concepts of CBT\n1. **Cognitive Triad**: Understanding the connection between thoughts, feelings, and behaviors.\n2. **Automatic Thoughts**: Uncovering habitual negative self-talk.\n3. **Behavioral Experiments**: Testing beliefs in real-world scenarios to reduce anxiety.\n\n### Practical Exercises\n- Daily Thought Logs\n- Gradual Exposure Tracking\n- Box Breathing Protocols (4-4-4-4)",
      featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop",
      ...defaultValues,
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    submitPost.mutate({
      data: {
        title: values.title,
        category: values.category,
        tags: values.tags ? values.tags.split(",").map(t => t.trim()) : [],
        content: values.content,
        featuredImage: values.featuredImage || null,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Blog post submitted!", description: "Your post is pending review." });
        form.reset();
      },
      onError: () => toast({ title: "Error", description: "Failed to submit post.", variant: "destructive" }),
    });
  }

  function handleSaveDraft() {
    const values = form.getValues();
    onSaveDraft(values);
    toast({ title: "Draft saved", description: "You can find it in the drafts list above." });
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <PenTool className="w-5 h-5 text-primary" /> Post Editor
        </CardTitle>
        <CardDescription>Articles should be evidence-based and written for a general audience.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Article Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Understanding the Mechanics of CBT" className="text-base font-medium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Anxiety">Anxiety & Stress</SelectItem>
                      <SelectItem value="Depression">Depression</SelectItem>
                      <SelectItem value="Relationships">Relationships</SelectItem>
                      <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="Therapy_Guide">Therapy Guide</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags <span className="text-muted-foreground font-normal">(comma separated)</span></FormLabel>
                  <FormControl><Input placeholder="cbt, anxiety, coping" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Content with Write / Upload toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none">Article Content</label>
                <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg border border-border">
                  <button type="button" onClick={() => { setContentMode("text"); setUploadedFile(null); }}
                    className={cn("flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all",
                      contentMode === "text" ? "bg-white text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}>
                    <Type className="w-3 h-3" /> Write
                  </button>
                  <button type="button" onClick={() => setContentMode("file")}
                    className={cn("flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all",
                      contentMode === "file" ? "bg-white text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}>
                    <Upload className="w-3 h-3" /> Upload
                  </button>
                </div>
              </div>

              {contentMode === "text" ? (
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Write your article content here..." className="min-h-[280px] resize-y text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ) : (
                uploadedFile ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button type="button" onClick={() => { setUploadedFile(null); form.setValue("content", ""); }}
                      className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 min-h-[180px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Drop your file here or <span className="text-primary">browse</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOC, DOCX — up to 10 MB</p>
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx" className="sr-only"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) { setUploadedFile(f); form.setValue("content", f.name); }
                      }} />
                  </label>
                )
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
              <Button type="submit" className="bg-primary text-white" disabled={submitPost.isPending}>
                {submitPost.isPending ? "Submitting…" : <><Send className="w-4 h-4 mr-2" />Submit for Review</>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

/* ── Outline form ─────────────────────────────────────────── */
function OutlineForm({
  onSaveDraft, defaultValues,
}: {
  onSaveDraft: (values: z.infer<typeof outlineSchema>) => void;
  defaultValues?: Partial<z.infer<typeof outlineSchema>>;
}) {
  const { toast } = useToast();
  const submitOutline = useSubmitBlogOutline();

  const form = useForm<z.infer<typeof outlineSchema>>({
    resolver: zodResolver(outlineSchema),
    defaultValues: {
      proposedTitle: "5 Practical Strategies to Prevent Clinical Burnout in Healthcare",
      keyPoints: "1. Identifying early physiological indicators of stress\n2. Setting clear professional boundaries with client schedules\n3. Implementing active recovery micro-breaks between sessions\n4. Re-evaluating caseload intensity and administrative protocols",
      targetAudience: "Healthcare professionals, clinical therapists, and social workers",
      keywords: "burnout, stress-management, self-care, clinical-practice",
      notes: "References recent 2024 APA research on practitioner wellbeing.",
      ...defaultValues,
    },
  });

  function onSubmit(values: z.infer<typeof outlineSchema>) {
    submitOutline.mutate({
      data: {
        proposedTitle:  values.proposedTitle,
        keyPoints:      values.keyPoints.split("\n").filter(p => p.trim()),
        targetAudience: values.targetAudience,
        keywords:       values.keywords.split(",").map(k => k.trim()),
        notes:          values.notes || null,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Outline pitched!", description: "Our editorial team will review it shortly." });
        form.reset();
      },
      onError: () => toast({ title: "Error", description: "Failed to pitch outline.", variant: "destructive" }),
    });
  }

  function handleSaveDraft() {
    const values = form.getValues();
    onSaveDraft(values);
    toast({ title: "Draft saved", description: "You can find it in the drafts list above." });
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Article Proposal
        </CardTitle>
        <CardDescription>Pitching ensures your topic aligns with our current content needs.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField control={form.control} name="proposedTitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Title</FormLabel>
                <FormControl><Input placeholder="E.g., 5 Signs of Burnout You Might Be Ignoring" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="keyPoints" render={({ field }) => (
              <FormItem>
                <FormLabel>Key Points to Cover</FormLabel>
                <FormControl>
                  <Textarea placeholder={"Point 1…\nPoint 2…\nPoint 3…"} className="min-h-[120px] resize-y" {...field} />
                </FormControl>
                <FormDescription>Put each point on a new line.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="targetAudience" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl><Input placeholder="E.g., Young professionals, Parents" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="keywords" render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords <span className="text-muted-foreground font-normal">(comma separated)</span></FormLabel>
                  <FormControl><Input placeholder="burnout, stress, work-life" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Any specific research you plan to cite?" className="min-h-[80px] resize-y" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
              <Button type="submit" className="bg-primary text-white" disabled={submitOutline.isPending}>
                {submitOutline.isPending ? "Pitching…" : <><Send className="w-4 h-4 mr-2" />Pitch Outline</>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Blog() {
  const [tab, setTab] = useState<"post" | "outline">("post");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [restoreValues, setRestoreValues] = useState<Partial<z.infer<typeof postSchema>> | Partial<z.infer<typeof outlineSchema>> | undefined>(undefined);
  const [restoreKey, setRestoreKey] = useState(0);

  const postDrafts    = drafts.filter(d => d.kind === "post")    as PostDraft[];
  const outlineDrafts = drafts.filter(d => d.kind === "outline") as OutlineDraft[];
  const visibleDrafts = tab === "post" ? postDrafts : outlineDrafts;

  function savePostDraft(values: z.infer<typeof postSchema>) {
    setDrafts(prev => [
      { id: crypto.randomUUID(), kind: "post", savedAt: new Date(), ...values },
      ...prev,
    ]);
  }

  function saveOutlineDraft(values: z.infer<typeof outlineSchema>) {
    setDrafts(prev => [
      { id: crypto.randomUUID(), kind: "outline", savedAt: new Date(), ...values },
      ...prev,
    ]);
  }

  function deleteDraft(id: string) {
    setDrafts(prev => prev.filter(d => d.id !== id));
  }

  function restoreDraft(draft: Draft) {
    if (draft.kind === "post") {
      const { id, kind, savedAt, ...values } = draft;
      setTab("post");
      setRestoreValues(values);
    } else {
      const { id, kind, savedAt, ...values } = draft;
      setTab("outline");
      setRestoreValues(values);
    }
    setRestoreKey(k => k + 1); // force form remount with new defaultValues
    deleteDraft(draft.id);
  }

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-1">Publish articles or pitch outlines to the Hexpertify client portal.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <Tab active={tab === "post"}    onClick={() => setTab("post")}    icon={PenTool}  label="Full Blog Post" />
        <Tab active={tab === "outline"} onClick={() => setTab("outline")} icon={FileText} label="Blog Outline" />
      </div>

      {/* Drafts for current tab */}
      <DraftsPanel drafts={visibleDrafts} onDelete={deleteDraft} onRestore={restoreDraft} />

      {/* Form */}
      {tab === "post" ? (
        <FullBlogForm
          key={`post-${restoreKey}`}
          onSaveDraft={savePostDraft}
          defaultValues={tab === "post" ? restoreValues as Partial<z.infer<typeof postSchema>> : undefined}
        />
      ) : (
        <OutlineForm
          key={`outline-${restoreKey}`}
          onSaveDraft={saveOutlineDraft}
          defaultValues={tab === "outline" ? restoreValues as Partial<z.infer<typeof outlineSchema>> : undefined}
        />
      )}
    </div>
  );
}
