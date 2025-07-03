import { pgTable, integer, text, timestamp, serial, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').notNull().primaryKey(),
  name: text(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  no_telephone: text('telephone').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  telegram_chat_id: varchar('telegram_chat_id', { length: 255 }).unique(),
});

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const statuses = pgTable('statuses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const applicationSources = pgTable('applicationSources', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
});

export const jobTrackers = pgTable('jobTrackers', {
  id: serial('id').primaryKey(),
  company_name: text('company_name').notNull(),
  position_applied: text('position_applied').notNull(),
  url: text('url').notNull(),
  application_date: timestamp('application_date').notNull(),
  interview_date: timestamp('interview_date'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').defaultNow(),
  locationId: integer('locationId').references(() => locations.id),
  statusId: integer('statusId').references(() => statuses.id),
  sourceId: integer('sourceId').references(() => applicationSources.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  is_notification_enabled: boolean('is_notification_enabled').default(false).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  jobTrackers: many(jobTrackers),
}));
