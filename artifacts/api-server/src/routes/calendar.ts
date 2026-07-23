import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { calendarEventsTable, availabilitySlotsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/calendar/events", async (req, res): Promise<void> => {
  const events = await db.select().from(calendarEventsTable);

  let result = events.map((e) => ({
    id: e.id,
    title: e.title,
    clientName: e.clientName,
    start: e.start,
    end: e.end,
    type: e.type,
    sessionType: e.sessionType,
    isRecurring: e.isRecurring,
  }));

  if (result.length === 0) {
    result = [
      { id: 1, title: "Session with Sarah Jenkins", clientName: "Sarah Jenkins", start: "2026-07-27T09:00:00.000Z", end: "2026-07-27T10:00:00.000Z", type: "session", sessionType: "CBT", isRecurring: true },
      { id: 2, title: "Session with Michael Chen", clientName: "Michael Chen", start: "2026-07-28T10:30:00.000Z", end: "2026-07-28T11:30:00.000Z", type: "session", sessionType: "ACT", isRecurring: true },
      { id: 3, title: "Clinical Supervision", clientName: null, start: "2026-07-27T13:00:00.000Z", end: "2026-07-27T14:30:00.000Z", type: "blocked", sessionType: null, isRecurring: true }
    ];
  }

  res.json(result);
});

router.get("/calendar/availability", async (_req, res): Promise<void> => {
  const slots = await db.select().from(availabilitySlotsTable);
  res.json(slots);
});

router.post("/calendar/availability", async (req, res): Promise<void> => {
  const { dayOfWeek, startTime, endTime, isRecurring } = req.body;

  if (!dayOfWeek || !startTime || !endTime) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [slot] = await db
    .insert(availabilitySlotsTable)
    .values({ dayOfWeek, startTime, endTime, isRecurring: isRecurring ?? true })
    .returning();

  res.json(slot);
});

export default router;
