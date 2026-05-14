import { timestamp } from 'drizzle-orm/pg-core';

export const timeStamps = {
    createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

    lastLogin: timestamp('last_login', { withTimezone: true }),

    deletedAt: timestamp('deleted_at', { withTimezone: true })
}