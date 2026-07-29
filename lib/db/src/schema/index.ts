import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quoteRequestsTable = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  country: text("country"),
  website: text("website"),
  productsOfInterest: text("products_of_interest"),
  quantity: text("quantity"),
  packaging: text("packaging"),
  destCountry: text("dest_country"),
  destPort: text("dest_port"),
  incoterm: text("incoterm"),
  reqSpecs: text("req_specs"),
  reqDocs: text("req_docs"),
  expDate: text("exp_date"),
  buyerType: text("buyer_type"),
  message: text("message"),
  source: text("source").default("product_page"),
  extra: jsonb("extra"),
  emailSent: text("email_sent").default("no"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuoteRequestSchema = createInsertSchema(
  quoteRequestsTable,
).omit({ id: true, createdAt: true });
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequestsTable.$inferSelect;
