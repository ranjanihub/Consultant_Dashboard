import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, blogOutlinesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/blog/posts", async (_req, res): Promise<void> => {
  const posts = await db.select().from(blogPostsTable);
  res.json(
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      tags: p.tags,
      content: p.content,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }))
  );
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
  res.json(
    outlines.map((o) => ({
      id: o.id,
      proposedTitle: o.proposedTitle,
      keyPoints: o.keyPoints,
      targetAudience: o.targetAudience,
      keywords: o.keywords,
      notes: o.notes,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }))
  );
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
