import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id),
  type: text("type").notNull(), // PHQ-9, GAD-7, PANAS, other
  name: text("name").notNull(),
  currentScore: real("current_score").notNull(),
  maxScore: real("max_score").notNull(),
  previousScore: real("previous_score"),
  severity: text("severity").notNull(),
  completedAt: text("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assessmentTrendsTable = pgTable("assessment_trends", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull().references(() => assessmentsTable.id),
  date: text("date").notNull(),
  score: real("score").notNull(),
});

export const moodLogsTable = pgTable("mood_logs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id),
  date: text("date").notNull(),
  mood: real("mood").notNull(), // 1-10
  note: text("note"),
});
