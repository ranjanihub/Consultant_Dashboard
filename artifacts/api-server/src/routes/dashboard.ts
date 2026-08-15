import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  clientsTable,
  sessionsTable,
  homeworkTable,
  activityLogsTable,
} from "@workspace/db";
import { desc, eq, and } from "drizzle-orm";

const router: IRouter = Router();

const HARDCODED_STATS = {
  sessionsToday: 6,
  sessionsRemaining: 2,
  activeClients: 18,
  newClientsThisWeek: 3,
  pendingReports: 2,
  homeworkToReview: 5,
  homeworkDueToday: 5,
  therapyHoursThisWeek: 28,
  improvementAverage: 74.2,
  totalClientsCount: 24,
  therapistName: "Dr. Alex Harrison",
  therapistTitle: "Licensed Clinical Psychologist",
  isAvailable: true,
  therapyHoursToday: "5h 45m",
};

const HARDCODED_UPCOMING_SESSIONS = [
  {
    id: 1,
    clientName: "Sarah Jenkins",
    clientInitials: "SJ",
    sessionType: "CBT",
    sessionSubtype: "Cognitive Restructuring",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    durationMinutes: 60,
    countdownLabel: "in 12 min",
    sessionNumber: 12,
    isNext: true,
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientInitials: "MC",
    sessionType: "ACT",
    sessionSubtype: "Values Clarification",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
    durationMinutes: 60,
    countdownLabel: "in 1h 42m",
    sessionNumber: 8,
    isNext: false,
  },
  {
    id: 3,
    clientName: "David Kim",
    clientInitials: "DK",
    sessionType: "CBT",
    sessionSubtype: "Exposure Hierarchy",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    durationMinutes: 60,
    countdownLabel: "in 4h 15m",
    sessionNumber: 2,
    isNext: false,
  },
  {
    id: 4,
    clientName: "Emily Rodriguez",
    clientInitials: "ER",
    sessionType: "DBT",
    sessionSubtype: "Distress Tolerance",
    startTime: "04:30 PM",
    endTime: "05:30 PM",
    durationMinutes: 60,
    countdownLabel: "in 6h 45m",
    sessionNumber: 15,
    isNext: false,
  },
];

const HARDCODED_PENDING_REPORTS = [
  {
    sessionId: 101,
    clientName: "Emily Rodriguez",
    clientInitials: "ER",
    sessionDate: "2026-07-22",
    sessionTime: "02:00 PM",
    sessionType: "DBT Skills",
    sessionNumber: 15,
  },
  {
    sessionId: 102,
    clientName: "Michael Chen",
    clientInitials: "MC",
    sessionDate: "2026-07-21",
    sessionTime: "10:30 AM",
    sessionType: "ACT Protocol",
    sessionNumber: 7,
  },
  {
    sessionId: 103,
    clientName: "Sarah Jenkins",
    clientInitials: "SJ",
    sessionDate: "2026-07-20",
    sessionTime: "09:00 AM",
    sessionType: "CBT Session",
    sessionNumber: 11,
  },
];

const HARDCODED_WEEKLY_SCHEDULE = [
  { day: "Mon", booked: 4, completed: 4, available: 2 },
  { day: "Tue", booked: 6, completed: 3, available: 0 },
  { day: "Wed", booked: 5, completed: 5, available: 1 },
  { day: "Thu", booked: 7, completed: 7, available: 0 },
  { day: "Fri", booked: 4, completed: 4, available: 2 },
  { day: "Sat", booked: 2, completed: 2, available: 4 },
  { day: "Sun", booked: 0, completed: 0, available: 6 },
];

const HARDCODED_RECENT_ACTIVITY = [
  {
    id: 1,
    clientName: "Sarah Jenkins",
    clientInitials: "SJ",
    activityType: "homework_submission",
    description: "Submitted CBT Thought Record entries for anxiety tracking.",
    timeAgo: "25 min ago",
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientInitials: "MC",
    activityType: "mood_log",
    description: "Logged daily mood rating (7/10) with exercise notes.",
    timeAgo: "1 hour ago",
  },
  {
    id: 3,
    clientName: "Emily Rodriguez",
    clientInitials: "ER",
    activityType: "assessment_completed",
    description: "Completed weekly GAD-7 anxiety self-assessment.",
    timeAgo: "3 hours ago",
  },
  {
    id: 4,
    clientName: "David Kim",
    clientInitials: "DK",
    activityType: "appointment_booked",
    description: "Booked follow-up CBT consultation for Thursday.",
    timeAgo: "5 hours ago",
  },
];

const HARDCODED_CLIENT_IMPROVEMENT = {
  score: 74.2,
  changePercent: 12.4,
  changeDirection: "up",
  trend: [
    { month: "Jan", score: 58 },
    { month: "Feb", score: 62 },
    { month: "Mar", score: 65 },
    { month: "Apr", score: 68 },
    { month: "May", score: 71 },
    { month: "Jun", score: 74.2 },
  ],
};

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  try {
    const clients = await db.select().from(clientsTable);
    const activeClients = clients.filter((c) => c.status === "active");
    const newClients = clients.filter((c) => c.status === "new");
    const pendingSessions = await db
      .select()
      .from(sessionsTable)
      .where(and(eq(sessionsTable.status, "completed"), eq(sessionsTable.reportSubmitted, false)));
    const homeworkPending = await db.select().from(homeworkTable).where(eq(homeworkTable.status, "pending"));

    res.json({
      sessionsToday: 6,
      sessionsRemaining: 2,
      activeClients: activeClients.length || HARDCODED_STATS.activeClients,
      newClientsThisWeek: newClients.length || HARDCODED_STATS.newClientsThisWeek,
      pendingReports: pendingSessions.length || HARDCODED_STATS.pendingReports,
      homeworkToReview: homeworkPending.length || HARDCODED_STATS.homeworkToReview,
      homeworkDueToday: 5,
      therapyHoursThisWeek: 28,
      improvementAverage: 74.2,
      totalClientsCount: clients.length || HARDCODED_STATS.totalClientsCount,
      therapistName: "Dr. Alex Harrison",
      therapistTitle: "Licensed Clinical Psychologist",
      isAvailable: true,
      therapyHoursToday: "5h 45m",
    });
  } catch (err) {
    console.error("Error fetching dashboard stats, returning fallback:", err);
    res.json(HARDCODED_STATS);
  }
});

router.get("/dashboard/upcoming-sessions", async (_req, res): Promise<void> => {
  try {
    const sessions = await db
      .select({
        session: sessionsTable,
        client: clientsTable,
      })
      .from(sessionsTable)
      .innerJoin(clientsTable, eq(sessionsTable.clientId, clientsTable.id))
      .where(eq(sessionsTable.status, "upcoming"))
      .limit(6);

    const result = sessions.map((row, i) => ({
      id: row.session.id,
      clientName: row.client.name,
      clientInitials: row.client.initials,
      sessionType: row.session.sessionType,
      sessionSubtype: row.session.sessionSubtype ?? undefined,
      startTime: row.session.startTime,
      endTime: row.session.endTime,
      durationMinutes: row.session.durationMinutes,
      countdownLabel: i === 0 ? "in 12 min" : i === 1 ? "in 1h 42m" : i === 2 ? "in 3h 57m" : "in 5h 42m",
      sessionNumber: row.session.sessionNumber,
      isNext: i === 0,
    }));

    if (!result || result.length === 0) {
      res.json(HARDCODED_UPCOMING_SESSIONS);
      return;
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching upcoming sessions, returning fallback:", err);
    res.json(HARDCODED_UPCOMING_SESSIONS);
  }
});

router.get("/dashboard/pending-reports", async (_req, res): Promise<void> => {
  try {
    const sessions = await db
      .select({
        session: sessionsTable,
        client: clientsTable,
      })
      .from(sessionsTable)
      .innerJoin(clientsTable, eq(sessionsTable.clientId, clientsTable.id))
      .where(and(eq(sessionsTable.status, "completed"), eq(sessionsTable.reportSubmitted, false)))
      .limit(5);

    const result = sessions.map((row) => ({
      sessionId: row.session.id,
      clientName: row.client.name,
      clientInitials: row.client.initials,
      sessionDate: row.session.sessionDate,
      sessionTime: row.session.startTime,
      sessionType: row.session.sessionType,
      sessionNumber: row.session.sessionNumber,
    }));

    if (!result || result.length === 0) {
      res.json(HARDCODED_PENDING_REPORTS);
      return;
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching pending reports, returning fallback:", err);
    res.json(HARDCODED_PENDING_REPORTS);
  }
});

router.get("/dashboard/weekly-schedule", async (_req, res): Promise<void> => {
  try {
    res.json(HARDCODED_WEEKLY_SCHEDULE);
  } catch (err) {
    console.error("Error fetching weekly schedule, returning fallback:", err);
    res.json(HARDCODED_WEEKLY_SCHEDULE);
  }
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  try {
    const activities = await db
      .select({
        activity: activityLogsTable,
        client: clientsTable,
      })
      .from(activityLogsTable)
      .innerJoin(clientsTable, eq(activityLogsTable.clientId, clientsTable.id))
      .orderBy(desc(activityLogsTable.createdAt))
      .limit(10);

    const result = activities.map((row) => ({
      id: row.activity.id,
      clientName: row.client.name,
      clientInitials: row.client.initials,
      activityType: row.activity.activityType,
      description: row.activity.description,
      timeAgo: row.activity.timeAgo,
    }));

    if (!result || result.length === 0) {
      res.json(HARDCODED_RECENT_ACTIVITY);
      return;
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching recent activity, returning fallback:", err);
    res.json(HARDCODED_RECENT_ACTIVITY);
  }
});

router.get("/dashboard/client-improvement", async (_req, res): Promise<void> => {
  try {
    res.json(HARDCODED_CLIENT_IMPROVEMENT);
  } catch (err) {
    console.error("Error fetching client improvement, returning fallback:", err);
    res.json(HARDCODED_CLIENT_IMPROVEMENT);
  }
});

export default router;

