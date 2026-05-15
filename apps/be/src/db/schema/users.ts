import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roleEnum } from "./shared.js";
import { events } from "./events.js";
import { orders } from "./orders.js";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  orders: many(orders),
}));
