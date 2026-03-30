import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDatabase, hasDatabase } from "@/lib/db";
import { calendarSyncs, clients, invoices, ratings, sessions, userProfiles } from "@/lib/db/schema";
import { formatMonthYear } from "@/lib/format";
import { normalizeAppRole, type AppRole } from "@/lib/roles";

export type Actor = {
  clerkUserId: string;
  email?: string | null;
  displayName?: string | null;
  role?: AppRole;
  profileId?: string;
};

export type ClientInput = {
  name: string;
  billTo: string;
  rateCents: number;
  meetingsPerWeek: number;
  preferredDays: string;
  notes: string;
  status: string;
};

export type SessionInput = {
  clientId: string | null;
  title: string;
  startsAt: string;
  endsAt: string | null;
  status: "planned" | "completed" | "missed" | "rescheduled" | "partial";
  source: "manual" | "google";
  billable: boolean;
  amountCents: number;
  notes: string;
  externalEventId?: string | null;
};

export type RatingInput = {
  clientId: string | null;
  score: number;
  category: string;
  comment: string;
};

export type SyncEventInput = {
  externalEventId: string;
  clientId: string | null;
  title: string;
  startsAt: string;
  endsAt: string | null;
  billable: boolean;
  amountCents: number;
  notes: string;
};

export type WorkspaceProfileSummary = {
  id: string;
  clerkUserId: string;
  email: string | null;
  displayName: string;
  role: AppRole;
  createdAt: Date;
};

type ProfileRow = {
  id: string;
  clerkUserId: string;
  email: string | null;
  displayName: string;
  role: AppRole;
  createdAt: Date;
};

type ClientRow = {
  id: string;
  ownerUserId: string;
  name: string;
  billTo: string;
  rateCents: number;
  meetingsPerWeek: number;
  preferredDays: string;
  notes: string;
  status: string;
  createdAt: Date;
};

type SessionRow = {
  id: string;
  ownerUserId: string;
  clientId: string | null;
  title: string;
  startsAt: Date;
  endsAt: Date | null;
  status: "planned" | "completed" | "missed" | "rescheduled" | "partial";
  source: "manual" | "google";
  billable: boolean;
  amountCents: number;
  notes: string;
  externalEventId: string | null;
  createdAt: Date;
};

type RatingRow = {
  id: string;
  ownerUserId: string;
  clientId: string | null;
  score: number;
  category: string;
  comment: string;
  createdAt: Date;
};

type SyncRow = {
  id: string;
  ownerUserId: string;
  calendarId: string;
  lastSyncedAt: Date;
  eventsImported: number;
  statusMessage: string;
};

type InvoiceRow = {
  id: string;
  ownerUserId: string;
  clientId: string | null;
  periodStart: Date;
  periodEnd: Date;
  totalCents: number;
  status: "draft" | "sent" | "paid";
  fileName: string;
  createdAt: Date;
};

type MemoryWorkspace = {
  profile: ProfileRow;
  clients: ClientRow[];
  sessions: SessionRow[];
  ratings: RatingRow[];
  syncs: SyncRow[];
  invoices: InvoiceRow[];
};

type MemoryStore = {
  workspaces: Map<string, MemoryWorkspace>;
};

const globalForMemory = globalThis as typeof globalThis & {
  megaStarStore?: MemoryStore;
};

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function toMoney(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function resolveOwnedClientIdMemory(actor: Actor, clientId: string | null | undefined) {
  if (!clientId) {
    return null;
  }

  const workspace = getWorkspaceMemory(actor);
  return workspace.clients.some((client) => client.id === clientId) ? clientId : null;
}

async function resolveOwnedClientIdDb(actor: Actor, clientId: string | null | undefined) {
  if (!clientId) {
    return null;
  }

  const db = getDatabase();
  if (!db) {
    throw new Error("Database is not configured.");
  }

  const profile = await ensureProfileDb(actor);
  const rows = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.ownerUserId, profile.id)))
    .limit(1);

  return rows[0]?.id || null;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function buildDemoWorkspace(actor: Actor): MemoryWorkspace {
  const now = new Date();
  const role = normalizeAppRole(actor.role, "tutor");
  const base: MemoryWorkspace = {
    profile: {
      id: randomUUID(),
      clerkUserId: actor.clerkUserId,
      email: actor.email || "tutor@example.com",
      displayName: actor.displayName || "MegaStar Tutor",
      role,
      createdAt: now,
    },
    clients: [
      {
        id: randomUUID(),
        ownerUserId: "",
        name: "Client A",
        billTo: "Client A Family",
        rateCents: 1500,
        meetingsPerWeek: 3,
        preferredDays: "Mon, Wed, Fri",
        notes: "Reschedule if a Monday slot is missed.",
        status: "active",
        createdAt: new Date(now.getTime() - 6 * 86400000),
      },
      {
        id: randomUUID(),
        ownerUserId: "",
        name: "Client B",
        billTo: "Client B Ltd",
        rateCents: 1800,
        meetingsPerWeek: 2,
        preferredDays: "Tue, Thu",
        notes: "Needs a quiet slot after school.",
        status: "needs_attention",
        createdAt: new Date(now.getTime() - 5 * 86400000),
      },
    ],
    sessions: [
      {
        id: randomUUID(),
        ownerUserId: "",
        clientId: "",
        title: "Science revision",
        startsAt: new Date(now.getTime() - 2 * 86400000),
        endsAt: new Date(now.getTime() - 2 * 86400000 + 60 * 60000),
        status: "completed",
        source: "manual",
        billable: true,
        amountCents: 1500,
        notes: "Good progress on exam prep.",
        externalEventId: null,
        createdAt: new Date(now.getTime() - 2 * 86400000),
      },
      {
        id: randomUUID(),
        ownerUserId: "",
        clientId: "",
        title: "Math catch-up",
        startsAt: new Date(now.getTime() - 86400000),
        endsAt: new Date(now.getTime() - 86400000 + 60 * 60000),
        status: "missed",
        source: "google",
        billable: false,
        amountCents: 0,
        notes: "Client asked to reschedule.",
        externalEventId: "demo-google-1",
        createdAt: new Date(now.getTime() - 86400000),
      },
    ],
    ratings: [
      {
        id: randomUUID(),
        ownerUserId: "",
        clientId: "",
        score: 5,
        category: "communication",
        comment: "Very clear explanations.",
        createdAt: new Date(now.getTime() - 3 * 86400000),
      },
    ],
    syncs: [
      {
        id: randomUUID(),
        ownerUserId: "",
        calendarId: "primary",
        lastSyncedAt: new Date(now.getTime() - 6 * 3600000),
        eventsImported: 1,
        statusMessage: "Connected and ready.",
      },
    ],
    invoices: [
      {
        id: randomUUID(),
        ownerUserId: "",
        clientId: "",
        periodStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        periodEnd: new Date(now.getFullYear(), now.getMonth(), 0),
        totalCents: 3000,
        status: "draft",
        fileName: "MegaStar Tutoring Invoice March 2026.xlsx",
        createdAt: new Date(now.getTime() - 2 * 86400000),
      },
    ],
  };

  base.clients = base.clients.map((client) => ({ ...client, ownerUserId: base.profile.id }));
  base.sessions = base.sessions.map((session, index) => ({
    ...session,
    ownerUserId: base.profile.id,
    clientId: base.clients[index] ? base.clients[index].id : base.clients[0].id,
  }));
  base.ratings = base.ratings.map((rating) => ({
    ...rating,
    ownerUserId: base.profile.id,
    clientId: base.clients[0].id,
  }));
  base.syncs = base.syncs.map((sync) => ({ ...sync, ownerUserId: base.profile.id }));
  base.invoices = base.invoices.map((invoice) => ({
    ...invoice,
    ownerUserId: base.profile.id,
    clientId: base.clients[0].id,
  }));
  return base;
}

function getMemoryStore() {
  if (!globalForMemory.megaStarStore) {
    globalForMemory.megaStarStore = { workspaces: new Map() };
  }
  return globalForMemory.megaStarStore;
}

function getWorkspaceMemory(actor: Actor) {
  const store = getMemoryStore();
  let workspace = store.workspaces.get(actor.clerkUserId);
  if (!workspace) {
    workspace = buildDemoWorkspace(actor);
    store.workspaces.set(actor.clerkUserId, workspace);
  }
  return workspace;
}

function peekWorkspaceMemory(clerkUserId: string) {
  const store = getMemoryStore();
  return store.workspaces.get(clerkUserId) || null;
}

async function findProfileDb(clerkUserId: string): Promise<ProfileRow | null> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.clerkUserId, clerkUserId)).limit(1);
  return existing[0] ? (existing[0] as ProfileRow) : null;
}

export async function findWorkspaceProfileByClerkUserId(clerkUserId: string): Promise<ProfileRow | null> {
  const db = getDatabase();
  if (!db) {
    const workspace = peekWorkspaceMemory(clerkUserId);
    return workspace ? workspace.profile : null;
  }

  return findProfileDb(clerkUserId);
}

function listWorkspaceProfilesMemory(): WorkspaceProfileSummary[] {
  const store = getMemoryStore();
  return Array.from(store.workspaces.values())
    .map((workspace) => ({
      id: workspace.profile.id,
      clerkUserId: workspace.profile.clerkUserId,
      email: workspace.profile.email,
      displayName: workspace.profile.displayName,
      role: workspace.profile.role,
      createdAt: workspace.profile.createdAt,
    }))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function listWorkspaceProfiles(): Promise<WorkspaceProfileSummary[]> {
  const db = getDatabase();
  if (!db) {
    return listWorkspaceProfilesMemory();
  }

  const rows = await db.select().from(userProfiles).orderBy(desc(userProfiles.createdAt));
  return rows.map((row) => ({
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    displayName: row.displayName,
    role: row.role,
    createdAt: row.createdAt,
  }));
}

async function updateProfileRoleDb(profileId: string, role: AppRole) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const updated = await db
    .update(userProfiles)
    .set({ role })
    .where(eq(userProfiles.id, profileId))
    .returning();
  return updated[0] ? (updated[0] as ProfileRow) : null;
}

function updateProfileRoleMemory(clerkUserId: string, role: AppRole) {
  const store = getMemoryStore();
  const workspace = store.workspaces.get(clerkUserId);
  if (!workspace) {
    return null;
  }

  workspace.profile.role = role;
  return workspace.profile;
}

export async function setWorkspaceProfileRole(clerkUserId: string, role: AppRole) {
  const db = getDatabase();
  if (!db) {
    return updateProfileRoleMemory(clerkUserId, role);
  }

  const profile = await findProfileDb(clerkUserId);
  if (!profile) {
    return null;
  }

  return updateProfileRoleDb(profile.id, role);
}

async function ensureProfileDb(actor: Actor): Promise<ProfileRow> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");

  const existing = await db.select().from(userProfiles).where(eq(userProfiles.clerkUserId, actor.clerkUserId)).limit(1);
  if (existing[0]) {
    const profile = existing[0] as ProfileRow;
    const updated = await db
      .update(userProfiles)
      .set({
        email: actor.email || profile.email,
        displayName: actor.displayName || profile.displayName,
      })
      .where(eq(userProfiles.clerkUserId, actor.clerkUserId))
      .returning();
    return updated[0] as ProfileRow;
  }

  const inserted = await db
    .insert(userProfiles)
    .values({
      clerkUserId: actor.clerkUserId,
      email: actor.email || null,
      displayName: actor.displayName || actor.email || "Tutor",
      role: normalizeAppRole(actor.role, "tutor"),
    })
    .returning();

  return inserted[0] as ProfileRow;
}

async function ensureProfile(actor: Actor): Promise<ProfileRow> {
  const db = getDatabase();
  if (!db) {
    const workspace = getWorkspaceMemory(actor);
    return workspace.profile;
  }
  return ensureProfileDb(actor);
}

export async function getWorkspaceProfile(actor: Actor): Promise<ProfileRow> {
  return ensureProfile(actor);
}

function listClientsMemory(actor: Actor) {
  return clone(getWorkspaceMemory(actor).clients).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

async function listClientsDb(actor: Actor) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(clients).where(eq(clients.ownerUserId, profile.id)).orderBy(desc(clients.createdAt));
}

export async function listClients(actor: Actor) {
  const db = getDatabase();
  return db ? listClientsDb(actor) : listClientsMemory(actor);
}

async function createClientDb(actor: Actor, input: ClientInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const inserted = await db
    .insert(clients)
    .values({
      ownerUserId: profile.id,
      name: input.name,
      billTo: input.billTo,
      rateCents: toMoney(input.rateCents),
      meetingsPerWeek: Math.max(0, Math.floor(input.meetingsPerWeek)),
      preferredDays: input.preferredDays,
      notes: input.notes,
      status: input.status,
    })
    .returning();
  return inserted[0];
}

function createClientMemory(actor: Actor, input: ClientInput) {
  const workspace = getWorkspaceMemory(actor);
  const client: ClientRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    name: input.name,
    billTo: input.billTo,
    rateCents: toMoney(input.rateCents),
    meetingsPerWeek: Math.max(0, Math.floor(input.meetingsPerWeek)),
    preferredDays: input.preferredDays,
    notes: input.notes,
    status: input.status,
    createdAt: new Date(),
  };
  workspace.clients.unshift(client);
  return client;
}

export async function createClient(actor: Actor, input: ClientInput) {
  const db = getDatabase();
  return db ? createClientDb(actor, input) : createClientMemory(actor, input);
}

async function listSessionsDb(actor: Actor) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db
    .select()
    .from(sessions)
    .where(eq(sessions.ownerUserId, profile.id))
    .orderBy(desc(sessions.startsAt), desc(sessions.createdAt));
}

function listSessionsMemory(actor: Actor) {
  return clone(getWorkspaceMemory(actor).sessions).sort((left, right) => right.startsAt.getTime() - left.startsAt.getTime());
}

export async function listSessions(actor: Actor) {
  const db = getDatabase();
  return db ? listSessionsDb(actor) : listSessionsMemory(actor);
}

async function createSessionDb(actor: Actor, input: SessionInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const resolvedClientId = await resolveOwnedClientIdDb(actor, input.clientId);
  const inserted = await db
    .insert(sessions)
    .values({
      ownerUserId: profile.id,
      clientId: resolvedClientId,
      title: input.title,
      startsAt: toDate(input.startsAt),
      endsAt: input.endsAt ? toDate(input.endsAt) : null,
      status: input.status,
      source: input.source,
      billable: input.billable,
      amountCents: toMoney(input.amountCents),
      notes: input.notes,
      externalEventId: input.externalEventId || null,
    })
    .returning();
  return inserted[0];
}

function createSessionMemory(actor: Actor, input: SessionInput) {
  const workspace = getWorkspaceMemory(actor);
  const resolvedClientId = resolveOwnedClientIdMemory(actor, input.clientId);
  const session: SessionRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    clientId: resolvedClientId,
    title: input.title,
    startsAt: toDate(input.startsAt),
    endsAt: input.endsAt ? toDate(input.endsAt) : null,
    status: input.status,
    source: input.source,
    billable: input.billable,
    amountCents: toMoney(input.amountCents),
    notes: input.notes,
    externalEventId: input.externalEventId || null,
    createdAt: new Date(),
  };
  workspace.sessions.unshift(session);
  return session;
}

export async function createSession(actor: Actor, input: SessionInput) {
  const db = getDatabase();
  return db ? createSessionDb(actor, input) : createSessionMemory(actor, input);
}

async function listRatingsDb(actor: Actor) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(ratings).where(eq(ratings.ownerUserId, profile.id)).orderBy(desc(ratings.createdAt));
}

function listRatingsMemory(actor: Actor) {
  return clone(getWorkspaceMemory(actor).ratings).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function listRatings(actor: Actor) {
  const db = getDatabase();
  return db ? listRatingsDb(actor) : listRatingsMemory(actor);
}

async function createRatingDb(actor: Actor, input: RatingInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const resolvedClientId = await resolveOwnedClientIdDb(actor, input.clientId);
  const inserted = await db
    .insert(ratings)
    .values({
      ownerUserId: profile.id,
      clientId: resolvedClientId,
      score: Math.min(5, Math.max(1, Math.floor(input.score))),
      category: input.category,
      comment: input.comment,
    })
    .returning();
  return inserted[0];
}

function createRatingMemory(actor: Actor, input: RatingInput) {
  const workspace = getWorkspaceMemory(actor);
  const resolvedClientId = resolveOwnedClientIdMemory(actor, input.clientId);
  const rating: RatingRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    clientId: resolvedClientId,
    score: Math.min(5, Math.max(1, Math.floor(input.score))),
    category: input.category,
    comment: input.comment,
    createdAt: new Date(),
  };
  workspace.ratings.unshift(rating);
  return rating;
}

export async function createRating(actor: Actor, input: RatingInput) {
  const db = getDatabase();
  return db ? createRatingDb(actor, input) : createRatingMemory(actor, input);
}

async function listSyncsDb(actor: Actor) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(calendarSyncs).where(eq(calendarSyncs.ownerUserId, profile.id)).orderBy(desc(calendarSyncs.lastSyncedAt));
}

function listSyncsMemory(actor: Actor) {
  return clone(getWorkspaceMemory(actor).syncs).sort((left, right) => right.lastSyncedAt.getTime() - left.lastSyncedAt.getTime());
}

export async function listSyncs(actor: Actor) {
  const db = getDatabase();
  return db ? listSyncsDb(actor) : listSyncsMemory(actor);
}

async function recordCalendarSyncDb(actor: Actor, calendarId: string, eventsImported: number, statusMessage: string) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const inserted = await db
    .insert(calendarSyncs)
    .values({
      ownerUserId: profile.id,
      calendarId,
      eventsImported,
      statusMessage,
    })
    .returning();
  return inserted[0];
}

function recordCalendarSyncMemory(actor: Actor, calendarId: string, eventsImported: number, statusMessage: string) {
  const workspace = getWorkspaceMemory(actor);
  const sync: SyncRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    calendarId,
    lastSyncedAt: new Date(),
    eventsImported,
    statusMessage,
  };
  workspace.syncs.unshift(sync);
  return sync;
}

export async function importCalendarEvents(actor: Actor, calendarId: string, events: SyncEventInput[]) {
  const db = getDatabase();
  if (db) {
    const profile = await ensureProfileDb(actor);
    const externalEventIds = events
      .map((event) => event.externalEventId)
      .filter((value): value is string => Boolean(value));
    const existing =
      externalEventIds.length === 0
        ? []
        : await db
            .select({ externalEventId: sessions.externalEventId })
            .from(sessions)
            .where(and(eq(sessions.ownerUserId, profile.id), inArray(sessions.externalEventId, externalEventIds)));
    const existingIds = new Set(existing.map((row) => row.externalEventId).filter((value): value is string => Boolean(value)));
    const rows = [];
    for (const event of events) {
      if (existingIds.has(event.externalEventId)) {
        continue;
      }

      rows.push({
        ownerUserId: profile.id,
        clientId: await resolveOwnedClientIdDb(actor, event.clientId),
        title: event.title,
        startsAt: toDate(event.startsAt),
        endsAt: event.endsAt ? toDate(event.endsAt) : null,
        status: (new Date(event.startsAt).getTime() <= Date.now() ? "completed" : "planned") as
          | "planned"
          | "completed"
          | "missed"
          | "rescheduled"
          | "partial",
        source: "google" as const,
        billable: event.billable,
        amountCents: toMoney(event.amountCents),
        notes: event.notes,
        externalEventId: event.externalEventId,
      });
    }

    if (rows.length) {
      await db.insert(sessions).values(rows);
    }

    const sync = await recordCalendarSyncDb(actor, calendarId, rows.length, rows.length ? "Calendar sync completed." : "No new events to import.");
    return { imported: rows.length, sync };
  }

  const workspace = getWorkspaceMemory(actor);
  const seen = new Set(workspace.sessions.map((session) => session.externalEventId).filter((value): value is string => Boolean(value)));
  let imported = 0;
  for (const event of events) {
    if (seen.has(event.externalEventId)) continue;
    createSessionMemory(actor, {
      clientId: resolveOwnedClientIdMemory(actor, event.clientId),
      title: event.title,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      status: new Date(event.startsAt).getTime() <= Date.now() ? "completed" : "planned",
      source: "google",
      billable: event.billable,
      amountCents: event.amountCents,
      notes: event.notes,
      externalEventId: event.externalEventId,
    });
    imported += 1;
  }
  const sync = recordCalendarSyncMemory(actor, calendarId, imported, imported ? "Calendar sync completed." : "No new events to import.");
  return { imported, sync };
}

export async function getWorkspaceOverview(actor: Actor) {
  const profile = await ensureProfile(actor);
  const [clientList, sessionList, ratingList, syncList] = await Promise.all([
    listClients(actor),
    listSessions(actor),
    listRatings(actor),
    listSyncs(actor),
  ]);

  const activeSessions = sessionList.filter((session) => session.status === "planned");
  const missedSessions = sessionList.filter((session) => session.status === "missed");
  const completedSessions = sessionList.filter((session) => session.status === "completed");
  const billableTotal = sessionList
    .filter((session) => session.billable)
    .reduce((total, session) => total + session.amountCents, 0);
  const ratingAverage = ratingList.length
    ? ratingList.reduce((total, rating) => total + rating.score, 0) / ratingList.length
    : 0;

  return {
    profile,
    clientCount: clientList.length,
    sessionCount: sessionList.length,
    activeSessionCount: activeSessions.length,
    missedSessionCount: missedSessions.length,
    completedSessionCount: completedSessions.length,
    billableTotal,
    ratingAverage,
    clients: clientList,
    sessions: sessionList,
    ratings: ratingList,
    syncs: syncList,
    upcomingSessions: activeSessions.slice(0, 5),
    recentSessions: sessionList.slice(0, 6),
    recentClients: clientList.slice(0, 4),
  };
}

export async function getInvoiceDrafts(actor: Actor) {
  const [clientList, sessionList] = await Promise.all([listClients(actor), listSessions(actor)]);
  return clientList.map((client) => {
    const clientSessions = sessionList.filter((session) => session.clientId === client.id && session.billable);
    const totalCents = clientSessions.reduce((total, session) => total + session.amountCents, 0);
    const lastSession = clientSessions[0] || null;
    return {
      client,
      sessionCount: clientSessions.length,
      totalCents,
      lastSession,
      lineItems: clientSessions,
      fileName: `MegaStar Tutoring Invoice ${formatMonthYear(new Date())}.xlsx`,
    };
  });
}

export async function getClientById(actor: Actor, clientId: string) {
  const clientList = await listClients(actor);
  return clientList.find((client) => client.id === clientId) || null;
}

export function isAppDatabaseReady() {
  return hasDatabase();
}
