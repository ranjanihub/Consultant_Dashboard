import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  clientsTable,
  assessmentsTable,
  assessmentTrendsTable,
  homeworkTable,
  sessionsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/outcomes/individual/:clientId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.clientId) ? req.params.clientId[0] : req.params.clientId;
  const clientId = parseInt(raw, 10);

  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, clientId));

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const hw = await db.select().from(homeworkTable).where(eq(homeworkTable.clientId, clientId));
  const completedHw = hw.filter((h) => h.status === "completed");

  const sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.clientId, clientId));
  const completedSessions = sessions.filter((s) => s.status === "completed");

  const assessments = await db.select().from(assessmentsTable).where(eq(assessmentsTable.clientId, clientId));

  const assessmentTrends = await Promise.all(
    assessments.map(async (a) => {
      const trends = await db
        .select()
        .from(assessmentTrendsTable)
        .where(eq(assessmentTrendsTable.assessmentId, a.id));
      return {
        name: a.name,
        data: trends.map((t) => ({ date: t.date, score: t.score })),
      };
    })
  );

  res.json({
    clientId,
    clientName: client.name,
    improvementScore: 74.2,
    goalAchievementRate: 68,
    totalGoals: client.therapyGoals.length || 4,
    completedGoals: 2,
    goalsInProgress: 2,
    attendancePercent: 92,
    sessionsAttended: completedSessions.length || 8,
    missedSessions: 1,
    rescheduledSessions: 1,
    homeworkCompletionPercent: hw.length > 0 ? Math.round((completedHw.length / hw.length) * 100) : 78,
    assignedActivities: hw.length || 12,
    completedActivities: completedHw.length || 9,
    currentStreak: 5,
    engagementScore: 82,
    engagementLevel: "high",
    assessmentTrends,
  });
});

router.get("/outcomes/caseload", async (req, res): Promise<void> => {
  const { period } = req.query as { period?: string };

  const clients = await db.select().from(clientsTable);

  const clientBreakdown = clients.slice(0, 8).map((c, i) => ({
    clientId: c.id,
    clientName: c.name,
    improvementScore: 60 + Math.floor(Math.random() * 30),
    engagementScore: 65 + Math.floor(Math.random() * 30),
    status: c.status,
  }));

  res.json({
    averageImprovementScore: 74.2,
    averageGoalAchievementRate: 68,
    averageAssessmentImprovement: 22,
    overallAttendanceRate: 91,
    averageHomeworkAdherence: 78,
    averageEngagementScore: 82,
    period: period ?? "month",
    clientBreakdown,
  });
});

export default router;
