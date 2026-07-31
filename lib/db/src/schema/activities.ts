import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // MINDFULNESS, CBT, GRATITUDE, BREATHING, SLEEP, SOMATIC
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  duration: text("duration").notNull(), // e.g. "10 min"
  dueDate: text("due_date").notNull(), // e.g. "Today"
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed
  instructions: text("instructions"), // JSON or newline separated step instructions
  reflection: text("reflection"), // Client reflection note upon completion
  completedAt: text("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
