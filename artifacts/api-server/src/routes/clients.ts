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
    res.status(404).json({ error: "Client not found" });
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

  res.json(result);
});

router.get("/clients/:id/mood", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const logs = await db
    .select()
    .from(moodLogsTable)
    .where(eq(moodLogsTable.clientId, id));

  const sorted = logs.sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];

  res.json({
    today: latest?.mood ?? null,
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

  res.json(hw);
});

router.get("/clients/:id/session-history", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const sessions = await db
    .select()
    .from(sessionsTable)
    .where(and(eq(sessionsTable.clientId, id), eq(sessionsTable.status, "completed")));

  res.json(
    sessions.map((s) => ({
      id: s.id,
      date: s.sessionDate,
      durationMinutes: s.durationMinutes,
      sessionType: s.sessionType,
      summary: `${s.sessionType} session - Session #${s.sessionNumber}`,
      homeworkAssigned: null,
      therapistNotes: null,
    }))
  );
});

export default router;
