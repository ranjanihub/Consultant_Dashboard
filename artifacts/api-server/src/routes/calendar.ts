import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { calendarEventsTable, availabilitySlotsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/calendar/events", async (req, res): Promise<void> => {
  const events = await db.select().from(calendarEventsTable);

  res.json(
    events.map((e) => ({
      id: e.id,
      title: e.title,
      clientName: e.clientName,
      start: e.start,
      end: e.end,
      type: e.type,
      sessionType: e.sessionType,
      isRecurring: e.isRecurring,
    }))
  );
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
