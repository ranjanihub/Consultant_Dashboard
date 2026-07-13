import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  clientName: text("client_name").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("pending"), // paid, pending, overdue
  invoiceNumber: text("invoice_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
