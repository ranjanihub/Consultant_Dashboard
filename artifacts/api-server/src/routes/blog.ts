import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, blogOutlinesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

let memoryPosts: any[] = [
  {
    id: 1,
    title: "5 Proven CBT Techniques to Overcome Workplace Burnout",
    category: "Anxiety",
    tags: ["Burnout", "CBT", "Stress Management"],
    content: "Workplace burnout is a state of emotional, physical, and mental exhaustion caused by excessive stress in corporate environments.\n\n### Key Interventions\n- **Cognitive Reframing**: Identify all-or-nothing thinking cycles.\n- **Pacing Protocols**: Establish strict calendar boundaries between therapy sessions.",
    featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop",
    status: "published",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Understanding Mindfulness & Acceptance in Modern Psychotherapy",
    category: "Mindfulness",
    tags: ["Mindfulness", "ACT", "Self-Care"],
    content: "Mindfulness has transitioned from ancient traditions into a core pillar of modern clinical psychology...",
    featuredImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    status: "published",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-15T14:30:00.000Z",
  },
  {
    id: 3,
    title: "Navigating Trauma-Informed Care: Best Practices for Clinical Therapists",
    category: "Therapy_Guide",
    tags: ["trauma", "clinical-guide", "patient-care"],
    content: "Trauma-informed care shifts the clinical focus from 'What is wrong with you?' to 'What happened to you?' This approach incorporates key principles of safety, choice, and empowerment.",
    featuredImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
    status: "submitted",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-25T09:15:00.000Z",
  },
];

let memoryOutlines: any[] = [
  {
    id: 1,
    proposedTitle: "Navigating Life Transitions with Acceptance & Commitment Therapy (ACT)",
    keyPoints: ["Defining ACT Principles", "Values Clarification Matrix", "Cognitive Defusion Exercises"],
    targetAudience: "Adults dealing with major career or life transitions",
    keywords: ["ACT", "Life Transitions", "Values"],
    notes: "Approved outline ready for full draft.",
    status: "approved",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-18T11:00:00.000Z",
  },
];

router.get("/blog/posts", async (_req, res): Promise<void> => {
  try {
    const posts = await db.select().from(blogPostsTable);
    if (posts.length > 0) {
      const result = posts.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        tags: p.tags,
        content: p.content,
        featuredImage: p.featuredImage,
        status: p.status,
        author: "Dr. Alex Harrison",
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      }));
      res.json(result);
      return;
    }
  } catch (_e) {
    // fallback to memory
  }

  res.json(memoryPosts);
});

router.post("/blog/posts", async (req, res): Promise<void> => {
  const { title, featuredImage, category, tags, content } = req.body;

  if (!title || !category || !content) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const now = new Date().toISOString();
  let createdPost: any = null;

  try {
    const [post] = await db
      .insert(blogPostsTable)
      .values({ title, featuredImage: featuredImage ?? null, category, tags: tags ?? [], content, status: "submitted" })
      .returning();

    createdPost = {
      id: post.id,
      title: post.title,
      category: post.category,
      tags: post.tags,
      content: post.content,
      featuredImage: post.featuredImage,
      status: post.status,
      author: "Dr. Alex Harrison",
      createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : now,
    };
  } catch (_e) {
    const newId = memoryPosts.length > 0 ? Math.max(...memoryPosts.map((p) => p.id)) + 1 : 1;
    createdPost = {
      id: newId,
      title,
      category,
      tags: tags ?? [],
      content,
      featuredImage: featuredImage || null,
      status: "submitted",
      author: "Dr. Alex Harrison",
      createdAt: now,
    };
    memoryPosts.unshift(createdPost);
  }

  res.status(201).json(createdPost);
});

router.delete("/blog/posts/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  memoryPosts = memoryPosts.filter((p) => p.id !== id);

  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  } catch (_e) {}

  res.json({ message: "Post deleted successfully", id });
});

router.get("/blog/outlines", async (_req, res): Promise<void> => {
  try {
    const outlines = await db.select().from(blogOutlinesTable);
    if (outlines.length > 0) {
      const result = outlines.map((o) => ({
        id: o.id,
        proposedTitle: o.proposedTitle,
        keyPoints: o.keyPoints,
        targetAudience: o.targetAudience,
        keywords: o.keywords,
        notes: o.notes,
        status: o.status,
        author: "Dr. Alex Harrison",
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      }));
      res.json(result);
      return;
    }
  } catch (_e) {
    // fallback
  }

  res.json(memoryOutlines);
});

router.post("/blog/outlines", async (req, res): Promise<void> => {
  const { proposedTitle, keyPoints, targetAudience, keywords, notes } = req.body;

  if (!proposedTitle || !targetAudience) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const now = new Date().toISOString();
  let createdOutline: any = null;

  try {
    const [outline] = await db
      .insert(blogOutlinesTable)
      .values({
        proposedTitle,
        keyPoints: keyPoints ?? [],
        targetAudience,
        keywords: keywords ?? [],
        notes: notes ?? null,
        status: "pending",
      })
      .returning();

    createdOutline = {
      id: outline.id,
      proposedTitle: outline.proposedTitle,
      keyPoints: outline.keyPoints,
      targetAudience: outline.targetAudience,
      keywords: outline.keywords,
      notes: outline.notes,
      status: outline.status,
      author: "Dr. Alex Harrison",
      createdAt: outline.createdAt instanceof Date ? outline.createdAt.toISOString() : now,
    };
  } catch (_e) {
    const newId = memoryOutlines.length > 0 ? Math.max(...memoryOutlines.map((o) => o.id)) + 1 : 1;
    createdOutline = {
      id: newId,
      proposedTitle,
      keyPoints: keyPoints ?? [],
      targetAudience,
      keywords: keywords ?? [],
      notes: notes || null,
      status: "pending",
      author: "Dr. Alex Harrison",
      createdAt: now,
    };
    memoryOutlines.unshift(createdOutline);
  }

  res.status(201).json(createdOutline);
});

export default router;
