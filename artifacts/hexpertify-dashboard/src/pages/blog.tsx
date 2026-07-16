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
import { PenTool, FileText, Send } from "lucide-react";

/* ── schemas ──────────────────────────────────────────────── */
const postSchema = z.object({
  title:         z.string().min(5, "Title must be at least 5 characters.").max(100),
  category:      z.string().min(1, "Please select a category."),
  tags:          z.string().optional(),
  content:       z.string().min(50, "Content must be at least 50 characters."),
  featuredImage: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
});

const outlineSchema = z.object({
  proposedTitle:  z.string().min(5, "Title must be at least 5 characters."),
  keyPoints:      z.string().min(10, "Please list a few key points."),
  targetAudience: z.string().min(3, "Please describe the audience."),
  keywords:       z.string().min(3, "Please provide keywords."),
  notes:          z.string().optional(),
});

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

/* ── Full blog form ───────────────────────────────────────── */
function FullBlogForm() {
  const { toast } = useToast();
  const submitPost = useSubmitBlogPost();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", category: "", tags: "", content: "", featuredImage: "" },
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

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <PenTool className="w-5 h-5 text-primary" />
          Post Editor
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Article Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your article content here..." className="min-h-[280px] resize-y font-mono text-sm" {...field} />
                </FormControl>
                <FormDescription>Supports Markdown formatting.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline">Save Draft</Button>
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
function OutlineForm() {
  const { toast } = useToast();
  const submitOutline = useSubmitBlogOutline();

  const form = useForm<z.infer<typeof outlineSchema>>({
    resolver: zodResolver(outlineSchema),
    defaultValues: { proposedTitle: "", keyPoints: "", targetAudience: "", keywords: "", notes: "" },
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

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-secondary/30 pb-4 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Article Proposal
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

            <div className="flex justify-end pt-4 border-t border-border">
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

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-1">Publish articles or pitch outlines to the Hexpertify patient portal.</p>
      </div>

      {/* Slider tabs */}
      <div className="flex items-center gap-3">
        <Tab active={tab === "post"}    onClick={() => setTab("post")}    icon={PenTool}  label="Full Blog Post" />
        <Tab active={tab === "outline"} onClick={() => setTab("outline")} icon={FileText} label="Blog Outline" />
      </div>

      {tab === "post" ? <FullBlogForm /> : <OutlineForm />}
    </div>
  );
}
