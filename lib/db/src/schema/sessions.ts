import { pgTable, serial, integer, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";

export const sessionTypeEnum = pgEnum("session_type", ["CBT", "ACT", "EMDR", "Intake", "Couples Therapy", "Follow-up", "DBT", "Mindfulness"]);

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id),
  sessionType: text("session_type").notNull(),
  sessionSubtype: text("session_subtype"),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  sessionNumber: integer("session_number").notNull().default(1),
  isNext: boolean("is_next").notNull().default(false),
  reportSubmitted: boolean("report_submitted").notNull().default(false),
  status: text("status").notNull().default("upcoming"), // upcoming, completed, cancelled
  sessionDate: text("session_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessionReportsTable = pgTable("session_reports", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessionsTable.id),
  durationMinutes: integer("duration_minutes").notNull(),
  clientCooperation: text("client_cooperation").notNull(),
  clientEngagementLevel: text("client_engagement_level").notNull(),
  moodComparedToPrevious: text("mood_compared_to_previous").notNull(),
  progressTowardsGoals: text("progress_towards_goals").notNull(),
  techniquesUsed: text("techniques_used").array().notNull().default([]),
  topicsDiscussed: text("topics_discussed").array().notNull().default([]),
  riskFlags: text("risk_flags"),
  clinicalSummary: text("clinical_summary").notNull(),
  internalNotes: text("internal_notes"),
  homeworkActivity: text("homework_activity"),
  homeworkInstructions: text("homework_instructions"),
  homeworkFrequency: text("homework_frequency"),
  nextSessionRecommendation: text("next_session_recommendation").notNull(),
  followUpMessage: text("follow_up_message"),
  paymentEligible: boolean("payment_eligible").notNull().default(true),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
