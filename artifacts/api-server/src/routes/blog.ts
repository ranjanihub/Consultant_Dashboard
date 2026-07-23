import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, blogOutlinesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/blog/posts", async (_req, res): Promise<void> => {
  const posts = await db.select().from(blogPostsTable);
  let result = posts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    tags: p.tags,
    content: p.content,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  }));

  if (result.length === 0) {
    result = [
      {
        id: 1,
        title: "5 Proven CBT Techniques to Overcome Workplace Burnout",
        category: "CBT Insights",
        tags: ["Burnout", "CBT", "Stress Management"],
        content: "Workplace burnout is a state of emotional, physical, and mental exhaustion caused by excessive stress...",
        status: "published",
        createdAt: "2026-07-20T10:00:00.000Z",
      },
      {
        id: 2,
        title: "Understanding Mindfulness in Modern Psychotherapy",
        category: "Mindfulness",
        tags: ["Mindfulness", "ACT", "Self-Care"],
        content: "Mindfulness has transitioned from ancient traditions into a core pillar of modern clinical psychology...",
        status: "published",
        createdAt: "2026-07-15T14:30:00.000Z",
      }
    ];
  }

  res.json(result);
});

router.post("/blog/posts", async (req, res): Promise<void> => {
  const { title, featuredImage, category, tags, content } = req.body;

  if (!title || !category || !content) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [post] = await db
    .insert(blogPostsTable)
    .values({ title, featuredImage: featuredImage ?? null, category, tags: tags ?? [], content, status: "submitted" })
    .returning();

  res.status(201).json({
    id: post.id,
    title: post.title,
    category: post.category,
    tags: post.tags,
    content: post.content,
    status: post.status,
    createdAt: post.createdAt.toISOString(),
  });
});

router.get("/blog/outlines", async (_req, res): Promise<void> => {
  const outlines = await db.select().from(blogOutlinesTable);
  let result = outlines.map((o) => ({
    id: o.id,
    proposedTitle: o.proposedTitle,
    keyPoints: o.keyPoints,
    targetAudience: o.targetAudience,
    keywords: o.keywords,
    notes: o.notes,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  if (result.length === 0) {
    result = [
      {
        id: 1,
        proposedTitle: "Navigating Life Transitions with Acceptance & Commitment Therapy (ACT)",
        keyPoints: ["Defining ACT", "Values clarification", "Defusion techniques"],
        targetAudience: "Adults dealing with major career or life changes",
        keywords: ["ACT", "Life Transitions", "Values"],
        notes: "Approved outline ready for draft.",
        status: "approved",
        createdAt: "2026-07-18T11:00:00.000Z",
      }
    ];
  }

  res.json(result);
});

router.post("/blog/outlines", async (req, res): Promise<void> => {
  const { proposedTitle, keyPoints, targetAudience, keywords, notes } = req.body;

  if (!proposedTitle || !targetAudience) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

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

  res.status(201).json({
    id: outline.id,
    proposedTitle: outline.proposedTitle,
    keyPoints: outline.keyPoints,
    targetAudience: outline.targetAudience,
    keywords: outline.keywords,
    notes: outline.notes,
    status: outline.status,
    createdAt: outline.createdAt.toISOString(),
  });
});

export default router;
