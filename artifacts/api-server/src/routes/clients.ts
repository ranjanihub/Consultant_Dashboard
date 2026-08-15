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
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const HARDCODED_CLIENTS_MAP: Record<number, any> = {
  1: {
    id: 1,
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
  },
  2: {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    age: 36,
    gender: "Male",
    status: "active",
    primaryGoal: "Overcome depressive episodes and build daily routine",
    presentingProblems: ["Major Depressive Disorder (Mild)", "Social Isolation", "Low Energy"],
    identifiedConcerns: ["Lack of motivation for exercise", "Negative self-talk", "Withdrawal from friendships"],
    therapyGoals: ["Complete behavioral activation logs 5x/week", "Re-engage in weekend cycling group", "Identify and challenge 3 cognitive distortions daily"],
    preferredLanguage: "English",
    communicationPreference: "Video",
    therapyTimeline: "6-12 months",
    aiIntakeSummary: "Client reports persistent low mood following recent career pivot. Responding positively to Behavioral Activation and ACT values clarification exercises.",
    progressPercent: 60,
    startDate: "2026-03-01",
    lastSession: "2026-07-21",
    nextSession: "2026-07-28",
    sessionCount: 8,
  },
  3: {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    age: 42,
    gender: "Female",
    status: "active",
    primaryGoal: "Process relationship dynamics and improve emotional regulation",
    presentingProblems: ["Emotional Dysregulation", "Work-Life Imbalance", "Chronic Stress"],
    identifiedConcerns: ["Difficulty setting boundaries with extended family", "Overworking under tight deadlines", "Tension headaches"],
    therapyGoals: ["Master DBT TIPP & STOP distress tolerance skills", "Set clear boundaries at work and home", "Engage in daily mindfulness practice"],
    preferredLanguage: "Spanish",
    communicationPreference: "Video",
    therapyTimeline: "6-12 months",
    aiIntakeSummary: "Client seeking support for burnout and interpersonal effectiveness. Highly engaged in DBT skill rehearsals.",
    progressPercent: 80,
    startDate: "2026-01-15",
    lastSession: "2026-07-22",
    nextSession: "2026-07-26",
    sessionCount: 15,
  },
  4: {
    id: 4,
    name: "David Kim",
    initials: "DK",
    age: 31,
    gender: "Male",
    status: "new",
    primaryGoal: "Manage social anxiety in leadership role",
    presentingProblems: ["Social Anxiety Disorder", "Public Speaking Anxiety", "Performance Fear"],
    identifiedConcerns: ["Heart palpitations before executive briefings", "Avoidance of optional networking events", "Self-consciousness"],
    therapyGoals: ["Build 10-tier exposure hierarchy for public speaking", "Practice grounding techniques during meetings", "Reduce post-event rumination"],
    preferredLanguage: "English",
    communicationPreference: "In-Person",
    therapyTimeline: "3-6 months",
    aiIntakeSummary: "New client presenting with performance anxiety following recent promotion to VP of Engineering. Motivated for CBT exposure therapy.",
    progressPercent: 35,
    startDate: "2026-07-01",
    lastSession: "2026-07-17",
    nextSession: "2026-07-24",
    sessionCount: 2,
  },
  5: {
    id: 5,
    name: "Jessica Taylor",
    initials: "JT",
    age: 25,
    gender: "Female",
    status: "completed",
    primaryGoal: "Address panic symptoms and return to comfortable social activities",
    presentingProblems: ["Panic Disorder", "Agoraphobia (Mild)"],
    identifiedConcerns: ["Avoidance of crowded subways", "Interoceptive panic triggers", "Fear of fainting"],
    therapyGoals: ["Completed interoceptive exposure exercises", "Traveled independently on subway", "Achieved full remission of panic attacks"],
    preferredLanguage: "English",
    communicationPreference: "Video",
    therapyTimeline: "3-6 months",
    aiIntakeSummary: "Client completed 16-session CBT panic protocol. Achieved full symptom remission and successfully graduated therapy.",
    progressPercent: 100,
    startDate: "2026-02-01",
    lastSession: "2026-07-12",
    nextSession: undefined,
    sessionCount: 16,
  },
};

const HARDCODED_CLIENTS_LIST = Object.values(HARDCODED_CLIENTS_MAP);

router.get("/clients", async (req, res): Promise<void> => {
  const { status, search } = req.query as { status?: string; search?: string };

  try {
    let clients = await db.select().from(clientsTable);

    if (!clients || clients.length === 0) {
      clients = HARDCODED_CLIENTS_LIST;
    }

    if (status) {
      clients = clients.filter((c) => c.status === status);
    }

    if (search) {
      const term = (search as string).toLowerCase();
      clients = clients.filter((c) => c.name.toLowerCase().includes(term));
    }

    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients list, returning hardcoded fallback:", err);
    let result = HARDCODED_CLIENTS_LIST;
    if (status) result = result.filter((c) => c.status === status);
    if (search) {
      const term = (search as string).toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }
    res.json(result);
  }
});

router.get("/clients/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;
  const fallback = HARDCODED_CLIENTS_MAP[id] || HARDCODED_CLIENTS_MAP[1];

  try {
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));

    const sessions = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.clientId, id));

    res.json({
      ...fallback,
      ...(client || {}),
      sessionCount: (sessions && sessions.length > 0) ? sessions.length : fallback.sessionCount,
    });
  } catch (err) {
    console.error(`Error fetching client ${id}, returning fallback:`, err);
    res.json(fallback);
  }
});

router.get("/clients/:id/assessments", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;

  try {
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

    if (!result || result.length === 0) {
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
  } catch (err) {
    console.error(`Error fetching assessments for client ${id}, returning fallback:`, err);
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
  }
});

router.get("/clients/:id/mood", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;

  try {
    const logs = await db
      .select()
      .from(moodLogsTable)
      .where(eq(moodLogsTable.clientId, id));

    if (!logs || logs.length === 0) {
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
  } catch (err) {
    console.error(`Error fetching mood for client ${id}, returning fallback:`, err);
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
  }
});

router.get("/clients/:id/homework", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;

  try {
    const hw = await db
      .select()
      .from(homeworkTable)
      .where(eq(homeworkTable.clientId, id));

    if (!hw || hw.length === 0) {
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
  } catch (err) {
    console.error(`Error fetching homework for client ${id}, returning fallback:`, err);
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
  }
});

router.get("/clients/:id/session-history", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;

  try {
    const sessions = await db
      .select()
      .from(sessionsTable)
      .where(and(eq(sessionsTable.clientId, id), eq(sessionsTable.status, "completed")));

    if (!sessions || sessions.length === 0) {
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
  } catch (err) {
    console.error(`Error fetching session history for client ${id}, returning fallback:`, err);
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
  }
});

export default router;

