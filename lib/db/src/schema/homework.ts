import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";

export const homeworkTable = pgTable("homework", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id),
  activity: text("activity").notNull(),
  instructions: text("instructions").notNull(),
  frequency: text("frequency").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull().default("pending"), // completed, pending, missed
  completionPercent: integer("completion_percent").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  clientReflection: text("client_reflection"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogsTable = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clientsTable.id),
  activityType: text("activity_type").notNull(), // homework_completed, assessment_completed, mood_checkin, journal_shared, message_received
  description: text("description").notNull(),
  timeAgo: text("time_ago").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
