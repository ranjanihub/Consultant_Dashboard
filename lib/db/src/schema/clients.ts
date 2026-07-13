import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const clientStatusEnum = pgEnum("client_status", ["active", "completed", "inactive", "high_priority", "new"]);

export const clientsTable = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  status: clientStatusEnum("status").notNull().default("active"),
  primaryGoal: text("primary_goal").notNull(),
  presentingProblems: text("presenting_problems").array().notNull().default([]),
  identifiedConcerns: text("identified_concerns").array().notNull().default([]),
  therapyGoals: text("therapy_goals").array().notNull().default([]),
  preferredLanguage: text("preferred_language").notNull().default("English"),
  communicationPreference: text("communication_preference").notNull().default("Video"),
  therapyTimeline: text("therapy_timeline").notNull().default("3-6 months"),
  aiIntakeSummary: text("ai_intake_summary").notNull().default(""),
  progressPercent: integer("progress_percent").notNull().default(0),
  startDate: text("start_date").notNull(),
  lastSession: text("last_session"),
  nextSession: text("next_session"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
