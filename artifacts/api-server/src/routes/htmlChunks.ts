import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { htmlChunkPagesTable, htmlChunkRevisionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// Helper to validate identifier URL slug: unique, no spaces, lowercase, numbers, hyphens
export function validateIdentifierUrl(slug: string): { valid: boolean; message?: string } {
  if (!slug) {
    return { valid: false, message: "Identifier URL is required." };
  }
  if (/\s/.test(slug)) {
    return { valid: false, message: "Identifier URL cannot contain spaces." };
  }
  const validRegex = /^[a-z0-9-]+$/;
  if (!validRegex.test(slug)) {
    return { valid: false, message: "Identifier URL can only contain lowercase letters, numbers, and hyphens (-)." };
  }
  return { valid: true };
}

// Initial sample data if database table is empty
const SAMPLE_PAGES = [
  {
    id: 1,
    title: "Career Guidance",
    identifierUrl: "career-guidance",
    status: "published",
    seoDetails: {
      metaTitle: "Career Guidance & Professional Counseling | Hexpertify",
      metaDescription: "Transform your career path with personalized clinical psychology and professional guidance.",
      metaKeywords: "career guidance, professional growth, mentorship, hexpertify",
      canonicalUrl: "https://hexpertify.com/career-guidance",
      ogTitle: "Career Guidance | Hexpertify",
      ogDescription: "Expert career counseling anytime, anywhere.",
      ogImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
      ogAltText: "Career guidance workspace",
      robotsIndexing: "index, follow",
    },
    chunks: [
      {
        id: "chunk-hero-1",
        name: "Hero Header",
        type: "hero",
        order: 1,
        content: `
          <div class="bg-gradient-to-r from-teal-600 to-indigo-700 text-white py-16 px-8 rounded-2xl text-center shadow-lg my-4">
            <h1 class="text-4xl font-extrabold tracking-tight mb-4">Empower Your Professional Journey</h1>
            <p class="text-lg opacity-90 max-w-2xl mx-auto mb-6">Discover evidence-based career counseling and cognitive development tailored to your personal goals.</p>
            <a href="#book" class="inline-block bg-white text-teal-700 font-bold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">Book a Consultation</a>
          </div>
        `,
      },
      {
        id: "chunk-feature-1",
        name: "Key Benefits",
        type: "feature",
        order: 2,
        content: `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div class="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">01</div>
              <h3 class="text-xl font-bold mb-2">Personalized Roadmap</h3>
              <p class="text-gray-600 text-sm">Tailored assessments to map out actionable career milestones.</p>
            </div>
            <div class="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">02</div>
              <h3 class="text-xl font-bold mb-2">Leadership Skills</h3>
              <p class="text-gray-600 text-sm">Build emotional intelligence and resilience in corporate environments.</p>
            </div>
            <div class="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">03</div>
              <h3 class="text-xl font-bold mb-2">1-on-1 Mentorship</h3>
              <p class="text-gray-600 text-sm">Direct access to certified experts with ongoing feedback.</p>
            </div>
          </div>
        `,
      },
    ],
    createdBy: "Dr. Alex Harrison",
    lastModifiedBy: "Dr. Alex Harrison",
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-25T11:00:00.000Z",
  },
  {
    id: 2,
    title: "Corporate Training",
    identifierUrl: "corporate-training",
    status: "published",
    seoDetails: {
      metaTitle: "Enterprise Corporate Mental Health & Wellness | Hexpertify",
      metaDescription: "Scalable mental wellness programs for corporate teams.",
      metaKeywords: "corporate training, mental health, wellness workshops",
      canonicalUrl: "https://hexpertify.com/corporate-training",
      ogTitle: "Corporate Training Solutions",
      ogDescription: "Boost workplace productivity and psychological safety.",
      ogImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200",
      ogAltText: "Corporate workshop session",
      robotsIndexing: "index, follow",
    },
    chunks: [
      {
        id: "chunk-hero-2",
        name: "Corporate Hero",
        type: "hero",
        order: 1,
        content: `
          <div class="bg-slate-900 text-white py-16 px-8 rounded-2xl text-center shadow-xl my-4">
            <span class="bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase px-3 py-1 rounded-full tracking-wider border border-teal-500/30">Enterprise Programs</span>
            <h1 class="text-4xl font-extrabold tracking-tight mt-4 mb-4">Build Resilient & High-Performing Teams</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto mb-6">Science-backed corporate wellness workshops and executive coaching solutions.</p>
          </div>
        `,
      },
    ],
    createdBy: "Sarah Wilson",
    lastModifiedBy: "Dr. Alex Harrison",
    createdAt: "2026-07-22T09:30:00.000Z",
    updatedAt: "2026-07-24T14:15:00.000Z",
  },
  {
    id: 3,
    title: "Privacy Policy",
    identifierUrl: "privacy-policy",
    status: "draft",
    seoDetails: {
      metaTitle: "Privacy Policy | Hexpertify",
      metaDescription: "Our commitment to data protection, privacy, and confidentiality.",
      metaKeywords: "privacy policy, data protection, confidentiality",
      canonicalUrl: "https://hexpertify.com/privacy-policy",
      ogTitle: "Privacy Policy",
      ogDescription: "Hexpertify privacy commitment.",
      robotsIndexing: "noindex, follow",
    },
    chunks: [
      {
        id: "chunk-text-1",
        name: "Policy Overview",
        type: "text",
        order: 1,
        content: `
          <div class="prose max-w-4xl mx-auto py-8">
            <h2 class="text-2xl font-bold mb-4">Hexpertify Privacy Policy</h2>
            <p class="mb-4 text-gray-700 leading-relaxed">At Hexpertify, we prioritize patient confidentiality, HIPAA compliance, and data encryption. This policy outlines how personal and session data is handled.</p>
          </div>
        `,
      },
    ],
    createdBy: "Admin",
    lastModifiedBy: "Admin",
    createdAt: "2026-07-24T08:00:00.000Z",
    updatedAt: "2026-07-24T08:00:00.000Z",
  },
];

// Memory store fallback if DB is empty or disconnected
let memoryPages = [...SAMPLE_PAGES];
let memoryRevisions: Record<number, any[]> = {
  1: [
    {
      id: 101,
      pageId: 1,
      versionNumber: 1,
      snapshot: SAMPLE_PAGES[0],
      summaryOfChanges: "Initial published draft created",
      updatedBy: "Dr. Alex Harrison",
      createdAt: "2026-07-20T10:00:00.000Z",
    },
  ],
};

// GET /api/html-chunks/pages
router.get("/html-chunks/pages", async (req, res): Promise<void> => {
  try {
    const search = (req.query.search as string || "").toLowerCase();
    const status = (req.query.status as string || "").toLowerCase();

    let pagesFromDb: any[] = [];
    try {
      pagesFromDb = await db.select().from(htmlChunkPagesTable);
    } catch (_e) {

      // Database query error fallback to memory
    }

    let source = pagesFromDb.length > 0 ? pagesFromDb.map((p) => ({
      id: p.id,
      title: p.title,
      identifierUrl: p.identifierUrl,
      status: p.status,
      seoDetails: p.seoDetails,
      chunks: p.chunks,
      createdBy: p.createdBy,
      lastModifiedBy: p.lastModifiedBy,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    })) : memoryPages;

    if (search) {
      source = source.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.identifierUrl.toLowerCase().includes(search)
      );
    }

    if (status && status !== "all") {
      source = source.filter((p) => p.status.toLowerCase() === status);
    }

    res.json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch HTML Chunk pages" });
  }
});

// GET /api/html-chunks/pages/:id
router.get("/html-chunks/pages/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    let page: any = null;

    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.id, id));
      if (rows.length > 0) {
        const p = rows[0];
        page = {
          id: p.id,
          title: p.title,
          identifierUrl: p.identifierUrl,
          status: p.status,
          seoDetails: p.seoDetails,
          chunks: p.chunks,
          createdBy: p.createdBy,
          lastModifiedBy: p.lastModifiedBy,
          createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
          updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
        };
      }
    } catch (_e) {
      // fallback
    }

    if (!page) {
      page = memoryPages.find((p) => p.id === id);
    }

    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    res.json(page);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/html-chunks/public/:slug
router.get("/html-chunks/public/:slug", async (req, res): Promise<void> => {
  try {
    const slug = req.params.slug;
    let page: any = null;

    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.identifierUrl, slug));
      if (rows.length > 0) {
        page = rows[0];
      }
    } catch (_e) {
      // fallback
    }

    if (!page) {
      page = memoryPages.find((p) => p.identifierUrl === slug);
    }

    if (!page || page.status !== "published") {
      res.status(404).json({ error: "Published page not found" });
      return;
    }

    res.json(page);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/html-chunks/pages
router.post("/html-chunks/pages", async (req, res): Promise<void> => {
  try {
    const { title, identifierUrl, status, seoDetails, chunks, createdBy } = req.body;

    if (!title) {
      res.status(400).json({ error: "Page title is required." });
      return;
    }

    const validation = validateIdentifierUrl(identifierUrl);
    if (!validation.valid) {
      res.status(400).json({ error: validation.message });
      return;
    }

    // Check duplicate slug
    let existingSlug = false;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.identifierUrl, identifierUrl));
      if (rows.length > 0) existingSlug = true;
    } catch (_e) {
      existingSlug = memoryPages.some((p) => p.identifierUrl === identifierUrl);
    }

    if (existingSlug) {
      res.status(400).json({ error: `Identifier URL '${identifierUrl}' already exists. Please choose a unique slug.` });
      return;
    }

    const now = new Date().toISOString();
    const newPageObj = {
      title,
      identifierUrl,
      status: status || "draft",
      seoDetails: seoDetails || {},
      chunks: chunks || [],
      createdBy: createdBy || "Dr. Alex Harrison",
      lastModifiedBy: createdBy || "Dr. Alex Harrison",
      createdAt: now,
      updatedAt: now,
    };

    let newId = memoryPages.length > 0 ? Math.max(...memoryPages.map((p) => p.id)) + 1 : 1;

    try {
      const [inserted] = await db.insert(htmlChunkPagesTable).values({
        title: newPageObj.title,
        identifierUrl: newPageObj.identifierUrl,
        status: newPageObj.status,
        seoDetails: newPageObj.seoDetails,
        chunks: newPageObj.chunks,
        createdBy: newPageObj.createdBy,
        lastModifiedBy: newPageObj.lastModifiedBy,
      }).returning();

      newId = inserted.id;
    } catch (_e) {
      // fallback
    }

    const createdPage = { id: newId, ...newPageObj };
    memoryPages.push(createdPage);

    // Initial Revision
    const initialRev = {
      id: Date.now(),
      pageId: newId,
      versionNumber: 1,
      snapshot: createdPage,
      summaryOfChanges: "Initial version created",
      updatedBy: createdPage.createdBy,
      createdAt: now,
    };
    if (!memoryRevisions[newId]) memoryRevisions[newId] = [];
    memoryRevisions[newId].push(initialRev);

    try {
      await db.insert(htmlChunkRevisionsTable).values({
        pageId: newId,
        versionNumber: 1,
        snapshot: createdPage,
        summaryOfChanges: "Initial version created",
        updatedBy: createdPage.createdBy,
      });
    } catch (_e) {}

    res.status(201).json(createdPage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/html-chunks/pages/:id
router.put("/html-chunks/pages/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, identifierUrl, status, seoDetails, chunks, lastModifiedBy, summaryOfChanges } = req.body;

    const validation = validateIdentifierUrl(identifierUrl);
    if (!validation.valid) {
      res.status(400).json({ error: validation.message });
      return;
    }

    // Check slug duplicate for other pages
    let duplicateSlug = false;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.identifierUrl, identifierUrl));
      if (rows.length > 0 && rows[0].id !== id) {
        duplicateSlug = true;
      }
    } catch (_e) {
      duplicateSlug = memoryPages.some((p) => p.identifierUrl === identifierUrl && p.id !== id);
    }

    if (duplicateSlug) {
      res.status(400).json({ error: `Identifier URL '${identifierUrl}' is already used by another page.` });
      return;
    }

    const now = new Date().toISOString();
    const existingIndex = memoryPages.findIndex((p) => p.id === id);

    let updatedPage: any = {
      id,
      title,
      identifierUrl,
      status,
      seoDetails,
      chunks,
      createdBy: existingIndex >= 0 ? memoryPages[existingIndex].createdBy : "Admin",
      lastModifiedBy: lastModifiedBy || "Dr. Alex Harrison",
      createdAt: existingIndex >= 0 ? memoryPages[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      memoryPages[existingIndex] = updatedPage;
    }

    try {
      await db.update(htmlChunkPagesTable)
        .set({
          title,
          identifierUrl,
          status,
          seoDetails,
          chunks,
          lastModifiedBy: updatedPage.lastModifiedBy,
          updatedAt: new Date(),
        })
        .where(eq(htmlChunkPagesTable.id, id));
    } catch (_e) {}

    // Add version revision
    const currentRevs = memoryRevisions[id] || [];
    const nextVersion = currentRevs.length > 0 ? Math.max(...currentRevs.map((r) => r.versionNumber)) + 1 : 1;

    const newRev = {
      id: Date.now(),
      pageId: id,
      versionNumber: nextVersion,
      snapshot: updatedPage,
      summaryOfChanges: summaryOfChanges || "Updated page content & settings",
      updatedBy: updatedPage.lastModifiedBy,
      createdAt: now,
    };

    if (!memoryRevisions[id]) memoryRevisions[id] = [];
    memoryRevisions[id].unshift(newRev);

    try {
      await db.insert(htmlChunkRevisionsTable).values({
        pageId: id,
        versionNumber: nextVersion,
        snapshot: updatedPage,
        summaryOfChanges: summaryOfChanges || "Updated page content & settings",
        updatedBy: updatedPage.lastModifiedBy,
      });
    } catch (_e) {}

    res.json(updatedPage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/html-chunks/pages/:id
router.delete("/html-chunks/pages/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    memoryPages = memoryPages.filter((p) => p.id !== id);
    delete memoryRevisions[id];

    try {
      await db.delete(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.id, id));
    } catch (_e) {}

    res.json({ message: "Page deleted successfully", id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/html-chunks/pages/:id/revisions
router.get("/html-chunks/pages/:id/revisions", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    let revisionsFromDb: any[] = [];

    try {

      revisionsFromDb = await db.select()
        .from(htmlChunkRevisionsTable)
        .where(eq(htmlChunkRevisionsTable.pageId, id))
        .orderBy(desc(htmlChunkRevisionsTable.versionNumber));
    } catch (_e) {}

    let list = revisionsFromDb.length > 0 ? revisionsFromDb.map((r) => ({
      id: r.id,
      pageId: r.pageId,
      versionNumber: r.versionNumber,
      snapshot: r.snapshot,
      summaryOfChanges: r.summaryOfChanges,
      updatedBy: r.updatedBy,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    })) : (memoryRevisions[id] || []);

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/html-chunks/pages/:id/restore/:version
router.post("/html-chunks/pages/:id/restore/:version", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const versionNumber = parseInt(req.params.version, 10);

    const revs = memoryRevisions[id] || [];
    const targetRev = revs.find((r) => r.versionNumber === versionNumber);

    if (!targetRev) {
      res.status(404).json({ error: `Revision v${versionNumber} not found for page #${id}` });
      return;
    }

    const restoredSnapshot = targetRev.snapshot;
    const now = new Date().toISOString();

    const updatedPage = {
      ...restoredSnapshot,
      id,
      lastModifiedBy: "Dr. Alex Harrison",
      updatedAt: now,
    };

    const idx = memoryPages.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryPages[idx] = updatedPage;
    } else {
      memoryPages.push(updatedPage);
    }

    // Add new revision entry for restore operation
    const nextVersion = revs.length > 0 ? Math.max(...revs.map((r) => r.versionNumber)) + 1 : 1;
    const restoreRev = {
      id: Date.now(),
      pageId: id,
      versionNumber: nextVersion,
      snapshot: updatedPage,
      summaryOfChanges: `Restored back to version v${versionNumber}`,
      updatedBy: "Dr. Alex Harrison",
      createdAt: now,
    };
    memoryRevisions[id].unshift(restoreRev);

    try {
      await db.update(htmlChunkPagesTable)
        .set({
          title: updatedPage.title,
          identifierUrl: updatedPage.identifierUrl,
          status: updatedPage.status,
          seoDetails: updatedPage.seoDetails,
          chunks: updatedPage.chunks,
          lastModifiedBy: updatedPage.lastModifiedBy,
          updatedAt: new Date(),
        })
        .where(eq(htmlChunkPagesTable.id, id));
    } catch (_e) {}

    res.json({ message: `Successfully restored version v${versionNumber}`, page: updatedPage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
