import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "organizer", "admin"]);
export const eventStatusEnum = pgEnum("event_status", ["draft", "published", "cancelled", "completed"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "expired", "cancelled"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["valid", "used", "refunded"]);
