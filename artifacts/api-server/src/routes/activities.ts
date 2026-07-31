import { Router, type IRouter } from "express";
import { db, activitiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const HARDCODED_ACTIVITIES = [
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
    instructions: "1. Sit comfortably with back straight.\n2. Close your eyes and focus on natural breath rhythm.\n3. Notice physical sensations without judgment.\n4. Gently return focus to breath whenever mind wanders.",
    reflection: "",
    completedAt: null,
    createdAt: new Date("2026-07-31T08:00:00Z"),
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
    instructions: "1. Identify the triggering situation.\n2. Write down your automatic negative thought.\n3. Rate your emotional intensity (0-100%).\n4. List evidence for and against the thought.\n5. Write a compassionate, realistic alternative perspective.",
    reflection: "",
    completedAt: null,
    createdAt: new Date("2026-07-31T09:00:00Z"),
  },
  {
    id: 3,
    title: "Evening Gratitude Journaling",
    description: "Write down 3 things you felt grateful for today and reflect on why they mattered to your mental health.",
    category: "GRATITUDE",
    difficulty: "Easy",
    duration: "8 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Find a quiet space with your journal.\n2. Recall 3 positive moments or sensations from today.\n3. Detail why each moment brought comfort or joy.\n4. Take a deep breath to anchor the feeling.",
    reflection: "",
    completedAt: null,
    createdAt: new Date("2026-07-31T10:00:00Z"),
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
    instructions: "1. Inhale deeply through nose for 4 seconds.\n2. Hold breath gently for 7 seconds.\n3. Exhale fully through mouth with a quiet whoosh for 8 seconds.\n4. Repeat 4 full cycles.",
    reflection: "",
    completedAt: null,
    createdAt: new Date("2026-07-30T14:00:00Z"),
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
    instructions: "1. Lie flat on a yoga mat or bed.\n2. Tense feet for 5s, then release.\n3. Move up through calves, thighs, chest, and face.",
    reflection: "Felt a dramatic release in shoulder tension. Heart rate dropped noticeably.",
    completedAt: "2026-07-30 18:45",
    createdAt: new Date("2026-07-30T10:00:00Z"),
  }
];

// Memory fallback store for dynamic edits when db is not running
let memoryActivities = [...HARDCODED_ACTIVITIES];

// GET /activities or /api/activities
router.get("/activities", async (_req, res): Promise<void> => {
  try {
    const activities = await db.select().from(activitiesTable);
    if (!activities || activities.length === 0) {
      res.json(memoryActivities);
      return;
    }
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities, returning in-memory store fallback:", err);
    res.json(memoryActivities);
  }
});

// POST /activities or /api/activities
router.post("/activities", async (req, res): Promise<void> => {
  try {
    const { title, description, category, difficulty, duration, dueDate, imageUrl, instructions } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: "Title and description are required." });
      return;
    }

    const newActivity = {
      title,
      description,
      category: category || "MINDFULNESS",
      difficulty: difficulty || "Easy",
      duration: duration || "10 min",
      dueDate: dueDate || "Today",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      status: "pending",
      instructions: instructions || "Follow guided steps carefully.",
      reflection: "",
      completedAt: null,
    };

    try {
      const inserted = await db.insert(activitiesTable).values(newActivity).returning();
      if (inserted && inserted.length > 0) {
        res.status(201).json(inserted[0]);
        return;
      }
    } catch (dbErr) {
      console.warn("DB insert failed, storing in memoryActivities fallback:", dbErr);
    }

    const createdInMemory = {
      id: Date.now(),
      ...newActivity,
      createdAt: new Date(),
    };
    memoryActivities.unshift(createdInMemory);
    res.status(201).json(createdInMemory);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to create activity" });
  }
});

// PATCH /activities/:id/complete
router.patch("/activities/:id/complete", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reflection } = req.body;
    const completedAt = new Date().toLocaleString();

    try {
      const updated = await db
        .update(activitiesTable)
        .set({
          status: "completed",
          reflection: reflection || "Completed activity.",
          completedAt,
        })
        .where(eq(activitiesTable.id, id))
        .returning();

      if (updated && updated.length > 0) {
        res.json(updated[0]);
        return;
      }
    } catch (dbErr) {
      console.warn("DB update failed, updating memory store fallback:", dbErr);
    }

    const item = memoryActivities.find((a) => a.id === id);
    if (item) {
      item.status = "completed";
      item.reflection = reflection || "Completed activity.";
      item.completedAt = completedAt;
      res.json(item);
      return;
    }

    res.status(404).json({ error: "Activity not found" });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to complete activity" });
  }
});

// DELETE /activities/:id
router.delete("/activities/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    try {
      await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
    } catch (dbErr) {
      console.warn("DB delete failed, modifying memory store fallback:", dbErr);
    }
    memoryActivities = memoryActivities.filter((a) => a.id !== id);
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to delete activity" });
  }
});

export default router;
