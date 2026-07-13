import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  content: text("content").notNull(),
  status: text("status").notNull().default("submitted"), // draft, submitted, published
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogOutlinesTable = pgTable("blog_outlines", {
  id: serial("id").primaryKey(),
  proposedTitle: text("proposed_title").notNull(),
  keyPoints: text("key_points").array().notNull().default([]),
  targetAudience: text("target_audience").notNull(),
  keywords: text("keywords").array().notNull().default([]),
  notes: text("notes"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
