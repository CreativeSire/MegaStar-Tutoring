import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const roleEnum = pgEnum("role", ["tutor", "client", "admin"]);
export const sessionStatusEnum = pgEnum("session_status", ["planned", "completed", "missed", "rescheduled", "partial"]);
export const sessionSourceEnum = pgEnum("session_source", ["manual", "google"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "sent", "paid"]);

export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email"),
  displayName: text("display_name").notNull(),
  role: roleEnum("role").notNull().default("tutor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  billTo: text("bill_to").notNull(),
  rateCents: integer("rate_cents").notNull(),
  meetingsPerWeek: integer("meetings_per_week").notNull().default(1),
  preferredDays: text("preferred_days").notNull().default(""),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  status: sessionStatusEnum("status").notNull().default("planned"),
  source: sessionSourceEnum("source").notNull().default("manual"),
  billable: boolean("billable").notNull().default(true),
  amountCents: integer("amount_cents").notNull().default(0),
  notes: text("notes").notNull().default(""),
  externalEventId: text("external_event_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  ownerExternalEventIdx: uniqueIndex("sessions_owner_external_event_idx").on(table.ownerUserId, table.externalEventId),
}));

export const ratings = pgTable("ratings", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  score: integer("score").notNull(),
  category: text("category").notNull().default("overall"),
  comment: text("comment").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const calendarSyncs = pgTable("calendar_syncs", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  calendarId: text("calendar_id").notNull(),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }).notNull().defaultNow(),
  eventsImported: integer("events_imported").notNull().default(0),
  statusMessage: text("status_message").notNull().default(""),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  clientId: text("client_id").references(() => clients.id, { onDelete: "set null" }),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  totalCents: integer("total_cents").notNull().default(0),
  status: invoiceStatusEnum("status").notNull().default("draft"),
  fileName: text("file_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditEvents = pgTable("audit_events", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  actorClerkUserId: text("actor_clerk_user_id").notNull(),
  actorRole: roleEnum("actor_role").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull().default(""),
  resourceId: text("resource_id"),
  route: text("route").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  details: text("details").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rateLimitWindows = pgTable(
  "rate_limit_windows",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => userProfiles.id, { onDelete: "cascade" }),
    actorClerkUserId: text("actor_clerk_user_id").notNull(),
    scope: text("scope").notNull(),
    bucketKey: text("bucket_key").notNull(),
    hits: integer("hits").notNull().default(0),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    windowEndsAt: timestamp("window_ends_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    bucketIdx: uniqueIndex("rate_limit_windows_bucket_idx").on(table.bucketKey),
  }),
);

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  clients: many(clients),
  sessions: many(sessions),
  ratings: many(ratings),
  calendarSyncs: many(calendarSyncs),
  invoices: many(invoices),
  auditEvents: many(auditEvents),
  rateLimitWindows: many(rateLimitWindows),
}));
