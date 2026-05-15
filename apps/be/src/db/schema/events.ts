import { pgTable, uuid, varchar, text, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { eventStatusEnum } from "./shared.js";
import { users } from "./users.js";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizerId: uuid("organizer_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  posterUrl: text("poster_url"),
  status: eventStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketTiers = pgTable("ticket_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quota: integer("quota").notNull(),
  sold: integer("sold").default(0).notNull(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, { fields: [events.organizerId], references: [users.id] }),
  tiers: many(ticketTiers),
}));

export const ticketTiersRelations = relations(ticketTiers, ({ one, many }) => ({
  event: one(events, { fields: [ticketTiers.eventId], references: [events.id] }),
  tickets: many(tickets),
}));

// We need to import tickets for the relation, but to avoid circularity in types 
// Drizzle relations use a callback. We'll import the table at the top.
import { tickets } from "./orders.js"; 
