import { pgTable, serial, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const therapistProfileTable = pgTable("therapist_profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  qualifications: text("qualifications").array().notNull().default([]),
  experience: integer("experience").notNull().default(0),
  languages: text("languages").array().notNull().default([]),
  specializations: text("specializations").array().notNull().default([]),
  verificationStatus: text("verification_status").notNull().default("verified"), // verified, pending, unverified
  consultationFee: real("consultation_fee").notNull().default(0),
  workingDays: text("working_days").array().notNull().default([]),
  consultationHours: text("consultation_hours").notNull().default("9 AM - 6 PM"),
  isAvailable: boolean("is_available").notNull().default(true),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
