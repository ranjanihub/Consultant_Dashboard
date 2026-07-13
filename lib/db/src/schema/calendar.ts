import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const calendarEventsTable = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  clientName: text("client_name"),
  start: text("start").notNull(),
  end: text("end").notNull(),
  type: text("type").notNull().default("session"), // session, blocked, holiday, available
  sessionType: text("session_type"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const availabilitySlotsTable = pgTable("availability_slots", {
  id: serial("id").primaryKey(),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isRecurring: boolean("is_recurring").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
