import { pgTable, uuid, timestamp, numeric, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orderStatusEnum, ticketStatusEnum } from "./shared.js";
import { users } from "./users.js";
import { events, ticketTiers } from "./events.js";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  eventId: uuid("event_id").references(() => events.id).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  tierId: uuid("tier_id").references(() => ticketTiers.id).notNull(),
  attendeeId: uuid("attendee_id").references(() => users.id).notNull(),
  qrPayload: text("qr_payload").notNull().unique(),
  status: ticketStatusEnum("status").default("valid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  event: one(events, { fields: [orders.eventId], references: [events.id] }),
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  order: one(orders, { fields: [tickets.orderId], references: [orders.id] }),
  tier: one(ticketTiers, { fields: [tickets.tierId], references: [ticketTiers.id] }),
  attendee: one(users, { fields: [tickets.attendeeId], references: [users.id] }),
}));
