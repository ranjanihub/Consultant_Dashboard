import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export interface HtmlChunkSeoDetails {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogAltText?: string;
  robotsIndexing?: string;
}

export interface HtmlChunkItem {
  id: string;
  name: string;
  type: string; // 'hero' | 'feature' | 'text' | 'cta' | 'faq' | 'testimonial' | 'custom'
  content: string;
  order: number;
  styles?: Record<string, string>;
}

export const htmlChunkPagesTable = pgTable("html_chunk_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  identifierUrl: text("identifier_url").notNull().unique(), // Slug
  status: text("status").notNull().default("draft"), // draft, published, archived
  seoDetails: jsonb("seo_details").$type<HtmlChunkSeoDetails>().notNull().default({}),
  chunks: jsonb("chunks").$type<HtmlChunkItem[]>().notNull().default([]),
  createdBy: text("created_by").notNull().default("Admin"),
  lastModifiedBy: text("last_modified_by").notNull().default("Admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const htmlChunkRevisionsTable = pgTable("html_chunk_revisions", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull(),
  versionNumber: integer("version_number").notNull(),
  snapshot: jsonb("snapshot").$type<{
    title: string;
    identifierUrl: string;
    status: string;
    seoDetails: HtmlChunkSeoDetails;
    chunks: HtmlChunkItem[];
  }>().notNull(),
  summaryOfChanges: text("summary_of_changes").notNull().default("Updated page content"),
  updatedBy: text("updated_by").notNull().default("Admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
