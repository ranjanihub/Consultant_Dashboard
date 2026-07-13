import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sessionsTable, sessionReportsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/sessions/:id/report", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const sessionId = parseInt(raw, 10);

  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const body = req.body;

  const [report] = await db
    .insert(sessionReportsTable)
    .values({
      sessionId,
      durationMinutes: body.durationMinutes ?? session.durationMinutes,
      clientCooperation: body.clientCooperation ?? "good",
      clientEngagementLevel: body.clientEngagementLevel ?? "medium",
      moodComparedToPrevious: body.moodComparedToPrevious ?? "same",
      progressTowardsGoals: body.progressTowardsGoals ?? "moderate",
      techniquesUsed: body.techniquesUsed ?? [],
      topicsDiscussed: body.topicsDiscussed ?? [],
      riskFlags: body.riskFlags ?? null,
      clinicalSummary: body.clinicalSummary ?? "",
      internalNotes: body.internalNotes ?? null,
      homeworkActivity: body.homeworkActivity ?? null,
      homeworkInstructions: body.homeworkInstructions ?? null,
      homeworkFrequency: body.homeworkFrequency ?? null,
      nextSessionRecommendation: body.nextSessionRecommendation ?? "1_week",
      followUpMessage: body.followUpMessage ?? null,
      paymentEligible: true,
    })
    .returning();

  // Mark session report as submitted
  await db
    .update(sessionsTable)
    .set({ reportSubmitted: true })
    .where(eq(sessionsTable.id, sessionId));

  res.status(201).json({
    id: report.id,
    sessionId: report.sessionId,
    submittedAt: report.submittedAt.toISOString(),
    paymentEligible: report.paymentEligible,
  });
});

export default router;
