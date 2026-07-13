import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text").notNull(),
  date: text("date").notNull(),
  therapistReply: text("therapist_reply"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
