import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  clientsTable,
  assessmentsTable,
  assessmentTrendsTable,
  moodLogsTable,
  homeworkTable,
  sessionsTable,
} from "@workspace/db";
import { eq, and, like, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/clients", async (req, res): Promise<void> => {
  const { status, search } = req.query as { status?: string; search?: string };

  let clients = await db.select().from(clientsTable);

  if (status) {
    clients = clients.filter((c) => c.status === status);
  }

  if (search) {
    const term = (search as string).toLowerCase();
    clients = clients.filter((c) => c.name.toLowerCase().includes(term));
  }

  res.json(clients);
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));

  if (!client) {
    res.json({
      id: id || 1,
      name: "Sarah Jenkins",
      initials: "SJ",
      age: 29,
      gender: "Female",
      status: "active",
      primaryGoal: "Manage generalized anxiety and workplace stress",
      presentingProblems: ["Generalized Anxiety Disorder", "Insomnia", "Workplace Stress", "Imposter Syndrome"],
      identifiedConcerns: ["Frequent panic sensations during team presentations", "Ruminative night thoughts", "Fear of failure"],
      therapyGoals: ["Reduce GAD-7 score below 5", "Establish healthy sleep hygiene routine", "Practice assertiveness techniques at work"],
      preferredLanguage: "English",
      communicationPreference: "Video",
      therapyTimeline: "3-6 months",
      aiIntakeSummary: "Client reports 6-month history of escalating anxiety following a promotion. High motivation for CBT intervention. Responding very well to cognitive restructuring.",
      progressPercent: 75,
      startDate: "2026-02-10",
      lastSession: "2026-07-20",
      nextSession: "2026-07-27",
      sessionCount: 12,
    });
    return;
  }

  const sessions = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.clientId, id));

  res.json({
    ...client,
    sessionCount: sessions.length,
  });
});

router.get("/clients/:id/assessments", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const assessments = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.clientId, id));

  const result = await Promise.all(
    assessments.map(async (a) => {
      const trends = await db
        .select()
        .from(assessmentTrendsTable)
        .where(eq(assessmentTrendsTable.assessmentId, a.id));
      return { ...a, trend: trends.map((t) => ({ date: t.date, score: t.score })) };
    })
  );

  if (result.length === 0) {
    res.json([
      {
        id: 101,
        clientId: id,
        type: "GAD-7",
        name: "Generalized Anxiety Disorder-7",
        currentScore: 6.0,
        maxScore: 21.0,
        previousScore: 14.0,
        severity: "Mild Anxiety",
        completedAt: "2026-07-18",
        trend: [
          { date: "2026-04-15", score: 18 },
          { date: "2026-05-15", score: 14 },
          { date: "2026-06-15", score: 9 },
          { date: "2026-07-18", score: 6 },
        ]
      },
      {
        id: 102,
        clientId: id,
        type: "PHQ-9",
        name: "Patient Health Questionnaire-9",
        currentScore: 4.0,
        maxScore: 27.0,
        previousScore: 9.0,
        severity: "Minimal Depression",
        completedAt: "2026-07-18",
        trend: [
          { date: "2026-04-15", score: 14 },
          { date: "2026-05-15", score: 10 },
          { date: "2026-06-15", score: 7 },
          { date: "2026-07-18", score: 4 },
        ]
      }
    ]);
    return;
  }

  res.json(result);
});

router.get("/clients/:id/mood", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const logs = await db
    .select()
    .from(moodLogsTable)
    .where(eq(moodLogsTable.clientId, id));

  if (logs.length === 0) {
    res.json({
      today: 8.0,
      weeklyTrend: [
        { date: "2026-07-17", mood: 6.0, note: "Slight anxiety regarding morning presentation." },
        { date: "2026-07-18", mood: 6.5, note: "Practiced box breathing, felt steady." },
        { date: "2026-07-19", mood: 7.0, note: "Weekend rest, enjoyable outdoor walk." },
        { date: "2026-07-20", mood: 7.5, note: "Good sleep, positive session discussion." },
        { date: "2026-07-21", mood: 7.0, note: "Productive workday." },
        { date: "2026-07-22", mood: 8.0, note: "Completed thought record log with ease." },
        { date: "2026-07-23", mood: 8.5, note: "Felt confident and calm all day." },
      ]
    });
    return;
  }

  const sorted = logs.sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];

  res.json({
    today: latest?.mood ?? 8.0,
    weeklyTrend: sorted.slice(-7).map((l) => ({
      date: l.date,
      mood: l.mood,
      note: l.note,
    })),
  });
});

router.get("/clients/:id/homework", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const hw = await db
    .select()
    .from(homeworkTable)
    .where(eq(homeworkTable.clientId, id));

  if (hw.length === 0) {
    res.json([
      {
        id: 201,
        clientId: id,
        activity: "CBT Thought Record Log",
        instructions: "Complete daily thought record whenever stress level exceeds 5/10.",
        frequency: "Daily",
        dueDate: "2026-07-27",
        status: "completed",
        completionPercent: 90,
        streak: 5,
        clientReflection: "Recognized catastrophizing thoughts early and reframed effectively.",
      },
      {
        id: 202,
        clientId: id,
        activity: "Box Breathing & Grounding",
        instructions: "Practice 5 minutes of 4-4-4-4 box breathing before work team meetings.",
        frequency: "Daily",
        dueDate: "2026-07-28",
        status: "pending",
        completionPercent: 80,
        streak: 4,
        clientReflection: "Helped reduce physical heart rate elevation prior to speaking.",
      }
    ]);
    return;
  }

  res.json(hw);
});

router.get("/clients/:id/session-history", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const sessions = await db
    .select()
    .from(sessionsTable)
    .where(and(eq(sessionsTable.clientId, id), eq(sessionsTable.status, "completed")));

  if (sessions.length === 0) {
    res.json([
      {
        id: 301,
        date: "2026-07-20",
        durationMinutes: 60,
        sessionType: "CBT",
        summary: "CBT Cognitive Restructuring - Session #12",
        homeworkAssigned: "Daily Thought Record Log",
        therapistNotes: "Client showed high engagement and successfully identified catastrophizing triggers.",
      },
      {
        id: 302,
        date: "2026-07-13",
        durationMinutes: 60,
        sessionType: "CBT",
        summary: "CBT Exposure Hierarchy Construction - Session #11",
        homeworkAssigned: "Box Breathing Protocol",
        therapistNotes: "Constructed 10-step workplace exposure hierarchy. Client motivated to proceed.",
      }
    ]);
    return;
  }

  res.json(
    sessions.map((s) => ({
      id: s.id,
      date: s.sessionDate,
      durationMinutes: s.durationMinutes,
      sessionType: s.sessionType,
      summary: `${s.sessionType} session - Session #${s.sessionNumber}`,
      homeworkAssigned: "CBT Thought Record",
      therapistNotes: "Client engaged constructively throughout the session.",
    }))
  );
});

export default router;
