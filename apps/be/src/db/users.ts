import {
  pgEnum,
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  index,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { timeStamps } from './shared.js';

const max255Length = 255;
const max20Length = 20;
const max12length = 12;

export enum userRoles {
    'customer',
    'organizer',
    'admin'
}

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    roles: varchar('roles')
    .array()
    .default(['customer'])
    .notNull()
    .$type<userRoles[]>(),
    fullName: varchar('full_name', { length: max255Length }).notNull(),
    email: varchar('email', { length: max255Length }).notNull().unique(),
    password: varchar('password', { length: max20Length}).notNull(),
    phoneNumber: varchar('phone_number', { length: max12length}),
    avatarUrl: text('avatar_url'),
    isActive: boolean('status').default(true),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    profileCompletedAt: timestamp('profile_completed_at', { withTimezone: true }),
    ...timeStamps
},
(table) => ({
    rolesIdx: index("users_roles_idx").using("gin", table.roles),
    nameTrgmIdx: index("users_name_trgm_idx").using("gin", sql`${table.fullName} gin_trgm_ops`),
    deletedIdx: index("users_deleted_idx").on(table.deletedAt),
    activeIdx: index("users_active_idx").on(table.isActive)
}));