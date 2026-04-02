import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDatabase, hasDatabase } from "@/lib/db";
import { calendarSyncs, clients, invoices, lessonArchives, ratings, scheduleRequests, sessions, userProfiles, workspacePreferences } from "@/lib/db/schema";
import { formatMonthYear } from "@/lib/format";
import { normalizeMarket } from "@/lib/market";
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

export type SessionStatusInput = {
  status: SessionInput["status"];
  notes?: string;
};

export type RatingInput = {
  clientId: string | null;
  sessionId: string | null;
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

export type LessonArchiveInput = {
  sessionId: string | null;
  clientId: string | null;
  title: string;
  summary: string;
  boardLabel: string;
  snapshotJson: string;
  fileName?: string | null;
};

export type WorkspacePreferenceInput = {
  market: string;
  preferredDays: string;
  lessonLengthMinutes: number;
  primaryGoal: string;
};

export type ScheduleRequestInput = {
  clientId: string | null;
  lessonTitle: string;
  requestedStartsAt: string;
  reason: string;
  details: string;
};

export type ScheduleRequestStatusInput = {
  status: "accepted" | "declined" | "planned";
  linkedSessionId?: string | null;
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
  sessionId: string | null;
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

type LessonArchiveRow = {
  id: string;
  ownerUserId: string;
  sessionId: string | null;
  clientId: string | null;
  title: string;
  summary: string;
  boardLabel: string;
  snapshotJson: string;
  fileName: string;
  createdAt: Date;
};

type WorkspacePreferenceRow = {
  id: string;
  ownerUserId: string;
  market: string;
  preferredDays: string;
  lessonLengthMinutes: number;
  primaryGoal: string;
  onboardingCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type ScheduleRequestRow = {
  id: string;
  ownerUserId: string;
  clientId: string | null;
  linkedSessionId: string | null;
  lessonTitle: string;
  requestedStartsAt: Date;
  reason: string;
  details: string;
  status: "pending" | "accepted" | "declined" | "planned";
  createdAt: Date;
};

type MemoryWorkspace = {
  profile: ProfileRow;
  preferences: WorkspacePreferenceRow;
  clients: ClientRow[];
  sessions: SessionRow[];
  ratings: RatingRow[];
  syncs: SyncRow[];
  invoices: InvoiceRow[];
  archives: LessonArchiveRow[];
  scheduleRequests: ScheduleRequestRow[];
};

type MemoryStore = {
  workspaces: Map<string, MemoryWorkspace>;
};

export type WorkspaceOverview = {
  profile: WorkspaceProfileSummary;
  preferences: WorkspacePreferenceRow;
  clientCount: number;
  sessionCount: number;
  activeSessionCount: number;
  missedSessionCount: number;
  completedSessionCount: number;
  billableTotal: number;
  ratingAverage: number;
  clients: ClientRow[];
  sessions: SessionRow[];
  ratings: RatingRow[];
  syncs: SyncRow[];
  archives: LessonArchiveRow[];
  scheduleRequests: ScheduleRequestRow[];
  upcomingSessions: SessionRow[];
  recentSessions: SessionRow[];
  recentClients: ClientRow[];
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
    preferences: {
      id: randomUUID(),
      ownerUserId: "",
      market: "uk",
      preferredDays: "Mon, Wed, Fri",
      lessonLengthMinutes: 60,
      primaryGoal: "Keep each lesson clear and well prepared.",
      onboardingCompletedAt: null,
      createdAt: now,
      updatedAt: now,
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
        sessionId: "",
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
    archives: [
      {
        id: randomUUID(),
        ownerUserId: "",
        sessionId: null,
        clientId: "",
        title: "First lesson record",
        summary: "A starter record for the classroom trail.",
        boardLabel: "Lesson board",
        snapshotJson: "[]",
        fileName: "MegaStar Tutoring Lesson Record.txt",
        createdAt: new Date(now.getTime() - 86400000),
      },
    ],
    scheduleRequests: [
      {
        id: randomUUID(),
        ownerUserId: "",
        clientId: "",
        linkedSessionId: null,
        lessonTitle: "Move Tuesday lesson",
        requestedStartsAt: new Date(now.getTime() + 2 * 86400000),
        reason: "Need a different time",
        details: "Student asked for a later start so the week stays balanced.",
        status: "pending",
        createdAt: new Date(now.getTime() - 4 * 3600000),
      },
    ],
  };

  base.clients = base.clients.map((client) => ({ ...client, ownerUserId: base.profile.id }));
  base.preferences = {
    ...base.preferences,
    market: "uk",
    ownerUserId: base.profile.id,
  };
  base.sessions = base.sessions.map((session, index) => ({
    ...session,
    ownerUserId: base.profile.id,
    clientId: base.clients[index] ? base.clients[index].id : base.clients[0].id,
  }));
  base.ratings = base.ratings.map((rating) => ({
    ...rating,
    ownerUserId: base.profile.id,
    clientId: base.clients[0].id,
    sessionId: base.sessions[0].id,
  }));
  base.syncs = base.syncs.map((sync) => ({ ...sync, ownerUserId: base.profile.id }));
  base.invoices = base.invoices.map((invoice) => ({
    ...invoice,
    ownerUserId: base.profile.id,
    clientId: base.clients[0].id,
  }));
  base.archives = base.archives.map((archive) => ({
    ...archive,
    ownerUserId: base.profile.id,
    clientId: base.clients[0].id,
    sessionId: base.sessions[0].id,
  }));
  base.scheduleRequests = base.scheduleRequests.map((request) => ({
    ...request,
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

function getWorkspacePreferencesMemory(actor: Actor): WorkspacePreferenceRow {
  return clone(getWorkspaceMemory(actor).preferences);
}

async function getWorkspacePreferencesDb(actor: Actor): Promise<WorkspacePreferenceRow> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const existing = await db.select().from(workspacePreferences).where(eq(workspacePreferences.ownerUserId, profile.id)).limit(1);
  if (existing[0]) {
    return existing[0] as WorkspacePreferenceRow;
  }

  const now = new Date();
  const inserted = await db
    .insert(workspacePreferences)
    .values({
      ownerUserId: profile.id,
      market: "uk",
      preferredDays: "",
      lessonLengthMinutes: 60,
      primaryGoal: "",
      onboardingCompletedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return inserted[0] as WorkspacePreferenceRow;
}

export async function getWorkspacePreferences(actor: Actor): Promise<WorkspacePreferenceRow> {
  const db = getDatabase();
  return db ? getWorkspacePreferencesDb(actor) : getWorkspacePreferencesMemory(actor);
}

async function saveWorkspacePreferencesDb(actor: Actor, input: WorkspacePreferenceInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const existing = await db.select().from(workspacePreferences).where(eq(workspacePreferences.ownerUserId, profile.id)).limit(1);
  const now = new Date();
  if (existing[0]) {
    const updated = await db
      .update(workspacePreferences)
      .set({
        market: normalizeMarket(input.market),
        preferredDays: input.preferredDays,
        lessonLengthMinutes: Math.max(15, Math.min(240, Math.floor(input.lessonLengthMinutes))),
        primaryGoal: input.primaryGoal,
        onboardingCompletedAt: now,
        updatedAt: now,
      })
      .where(eq(workspacePreferences.ownerUserId, profile.id))
      .returning();
    return updated[0] as WorkspacePreferenceRow;
  }

  const inserted = await db
    .insert(workspacePreferences)
    .values({
      ownerUserId: profile.id,
      market: normalizeMarket(input.market),
      preferredDays: input.preferredDays,
      lessonLengthMinutes: Math.max(15, Math.min(240, Math.floor(input.lessonLengthMinutes))),
      primaryGoal: input.primaryGoal,
      onboardingCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return inserted[0] as WorkspacePreferenceRow;
}

function saveWorkspacePreferencesMemory(actor: Actor, input: WorkspacePreferenceInput) {
  const workspace = getWorkspaceMemory(actor);
  workspace.preferences = {
    ...workspace.preferences,
    market: normalizeMarket(input.market),
    preferredDays: input.preferredDays,
    lessonLengthMinutes: Math.max(15, Math.min(240, Math.floor(input.lessonLengthMinutes))),
    primaryGoal: input.primaryGoal,
    onboardingCompletedAt: new Date(),
    updatedAt: new Date(),
  };
  return workspace.preferences;
}

export async function saveWorkspacePreferences(actor: Actor, input: WorkspacePreferenceInput) {
  const db = getDatabase();
  return db ? saveWorkspacePreferencesDb(actor, input) : saveWorkspacePreferencesMemory(actor, input);
}

function listArchivesMemory(actor: Actor): LessonArchiveRow[] {
  return clone(getWorkspaceMemory(actor).archives).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
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

function listClientsMemory(actor: Actor): ClientRow[] {
  return clone(getWorkspaceMemory(actor).clients).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

async function listClientsDb(actor: Actor): Promise<ClientRow[]> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(clients).where(eq(clients.ownerUserId, profile.id)).orderBy(desc(clients.createdAt));
}

export async function listClients(actor: Actor): Promise<ClientRow[]> {
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

async function listSessionsDb(actor: Actor): Promise<SessionRow[]> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db
    .select()
    .from(sessions)
    .where(eq(sessions.ownerUserId, profile.id))
    .orderBy(desc(sessions.startsAt), desc(sessions.createdAt));
}

function listSessionsMemory(actor: Actor): SessionRow[] {
  return clone(getWorkspaceMemory(actor).sessions).sort((left, right) => right.startsAt.getTime() - left.startsAt.getTime());
}

export async function listSessions(actor: Actor): Promise<SessionRow[]> {
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

async function updateSessionDb(actor: Actor, sessionId: string, input: SessionStatusInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const existing = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.ownerUserId, profile.id)))
    .limit(1);
  if (!existing.length) {
    return null;
  }

  const updated = await db
    .update(sessions)
    .set({
      status: input.status,
      notes: input.notes?.trim() || existing[0].notes,
    })
    .where(and(eq(sessions.id, sessionId), eq(sessions.ownerUserId, profile.id)))
    .returning();
  return updated[0] || null;
}

function updateSessionMemory(actor: Actor, sessionId: string, input: SessionStatusInput) {
  const workspace = getWorkspaceMemory(actor);
  const session = workspace.sessions.find((entry) => entry.id === sessionId);
  if (!session) {
    return null;
  }

  session.status = input.status;
  if (typeof input.notes === "string" && input.notes.trim()) {
    session.notes = input.notes.trim();
  }

  return session;
}

export async function updateSession(actor: Actor, sessionId: string, input: SessionStatusInput) {
  const db = getDatabase();
  return db ? updateSessionDb(actor, sessionId, input) : updateSessionMemory(actor, sessionId, input);
}

async function listRatingsDb(actor: Actor): Promise<RatingRow[]> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(ratings).where(eq(ratings.ownerUserId, profile.id)).orderBy(desc(ratings.createdAt));
}

function listRatingsMemory(actor: Actor): RatingRow[] {
  return clone(getWorkspaceMemory(actor).ratings).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function listRatings(actor: Actor): Promise<RatingRow[]> {
  const db = getDatabase();
  return db ? listRatingsDb(actor) : listRatingsMemory(actor);
}

async function createRatingDb(actor: Actor, input: RatingInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const completedSession = input.sessionId
    ? await db
        .select({ id: sessions.id, clientId: sessions.clientId })
        .from(sessions)
        .where(and(eq(sessions.id, input.sessionId), eq(sessions.ownerUserId, profile.id), eq(sessions.status, "completed")))
        .limit(1)
    : [];
  const resolvedClientId = completedSession[0]?.clientId
    ? completedSession[0].clientId
    : await resolveOwnedClientIdDb(actor, input.clientId);
  const inserted = await db
    .insert(ratings)
    .values({
      ownerUserId: profile.id,
      clientId: resolvedClientId,
      sessionId: completedSession[0]?.id || null,
      score: Math.min(5, Math.max(1, Math.floor(input.score))),
      category: input.category,
      comment: input.comment,
    })
    .returning();
  return inserted[0];
}

function createRatingMemory(actor: Actor, input: RatingInput) {
  const workspace = getWorkspaceMemory(actor);
  const completedSession = input.sessionId
    ? workspace.sessions.find((session) => session.id === input.sessionId && session.status === "completed")
    : null;
  const resolvedClientId = completedSession?.clientId || resolveOwnedClientIdMemory(actor, input.clientId);
  const resolvedSessionId = completedSession ? completedSession.id : null;
  const rating: RatingRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    clientId: resolvedClientId,
    sessionId: resolvedSessionId,
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

async function listScheduleRequestsDb(actor: Actor): Promise<ScheduleRequestRow[]> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db
    .select()
    .from(scheduleRequests)
    .where(eq(scheduleRequests.ownerUserId, profile.id))
    .orderBy(desc(scheduleRequests.requestedStartsAt), desc(scheduleRequests.createdAt));
}

function listScheduleRequestsMemory(actor: Actor): ScheduleRequestRow[] {
  return clone(getWorkspaceMemory(actor).scheduleRequests).sort((left, right) => right.requestedStartsAt.getTime() - left.requestedStartsAt.getTime());
}

export async function listScheduleRequests(actor: Actor): Promise<ScheduleRequestRow[]> {
  const db = getDatabase();
  return db ? listScheduleRequestsDb(actor) : listScheduleRequestsMemory(actor);
}

async function createScheduleRequestDb(actor: Actor, input: ScheduleRequestInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const resolvedClientId = await resolveOwnedClientIdDb(actor, input.clientId);
  const inserted = await db
    .insert(scheduleRequests)
    .values({
      ownerUserId: profile.id,
      clientId: resolvedClientId,
      linkedSessionId: null,
      lessonTitle: input.lessonTitle,
      requestedStartsAt: toDate(input.requestedStartsAt),
      reason: input.reason,
      details: input.details,
      status: "pending",
    })
    .returning();
  return inserted[0];
}

function createScheduleRequestMemory(actor: Actor, input: ScheduleRequestInput) {
  const workspace = getWorkspaceMemory(actor);
  const request: ScheduleRequestRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    clientId: resolveOwnedClientIdMemory(actor, input.clientId),
    linkedSessionId: null,
    lessonTitle: input.lessonTitle,
    requestedStartsAt: toDate(input.requestedStartsAt),
    reason: input.reason,
    details: input.details,
    status: "pending",
    createdAt: new Date(),
  };
  workspace.scheduleRequests.unshift(request);
  return request;
}

export async function createScheduleRequest(actor: Actor, input: ScheduleRequestInput) {
  const db = getDatabase();
  return db ? createScheduleRequestDb(actor, input) : createScheduleRequestMemory(actor, input);
}

async function updateScheduleRequestDb(actor: Actor, requestId: string, input: ScheduleRequestStatusInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const existing = await db
    .select()
    .from(scheduleRequests)
    .where(and(eq(scheduleRequests.id, requestId), eq(scheduleRequests.ownerUserId, profile.id)))
    .limit(1);
  const current = existing[0];
  if (!current) {
    return null;
  }

  const updated = await db
    .update(scheduleRequests)
    .set({
      status: input.status,
      linkedSessionId: input.linkedSessionId === undefined ? current.linkedSessionId : input.linkedSessionId,
    })
    .where(and(eq(scheduleRequests.id, requestId), eq(scheduleRequests.ownerUserId, profile.id)))
    .returning();
  return updated[0] || current;
}

function updateScheduleRequestMemory(actor: Actor, requestId: string, input: ScheduleRequestStatusInput) {
  const workspace = getWorkspaceMemory(actor);
  const request = workspace.scheduleRequests.find((entry) => entry.id === requestId);
  if (!request) {
    return null;
  }
  request.status = input.status;
  if (input.linkedSessionId !== undefined) {
    request.linkedSessionId = input.linkedSessionId;
  }
  return request;
}

export async function updateScheduleRequest(actor: Actor, requestId: string, input: ScheduleRequestStatusInput) {
  const db = getDatabase();
  return db ? updateScheduleRequestDb(actor, requestId, input) : updateScheduleRequestMemory(actor, requestId, input);
}

async function listSyncsDb(actor: Actor): Promise<SyncRow[]> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(calendarSyncs).where(eq(calendarSyncs.ownerUserId, profile.id)).orderBy(desc(calendarSyncs.lastSyncedAt));
}

function listSyncsMemory(actor: Actor): SyncRow[] {
  return clone(getWorkspaceMemory(actor).syncs).sort((left, right) => right.lastSyncedAt.getTime() - left.lastSyncedAt.getTime());
}

export async function listSyncs(actor: Actor): Promise<SyncRow[]> {
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

async function listLessonArchivesDb(actor: Actor): Promise<LessonArchiveRow[]> {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  return db.select().from(lessonArchives).where(eq(lessonArchives.ownerUserId, profile.id)).orderBy(desc(lessonArchives.createdAt));
}

export async function listLessonArchives(actor: Actor): Promise<LessonArchiveRow[]> {
  const db = getDatabase();
  return db ? listLessonArchivesDb(actor) : listArchivesMemory(actor);
}

async function createLessonArchiveDb(actor: Actor, input: LessonArchiveInput) {
  const db = getDatabase();
  if (!db) throw new Error("Database is not configured.");
  const profile = await ensureProfileDb(actor);
  const resolvedClientId = await resolveOwnedClientIdDb(actor, input.clientId);
  const resolvedSession = input.sessionId
    ? await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(and(eq(sessions.id, input.sessionId), eq(sessions.ownerUserId, profile.id)))
        .limit(1)
    : [];

  const inserted = await db
    .insert(lessonArchives)
    .values({
      ownerUserId: profile.id,
      sessionId: resolvedSession[0]?.id || null,
      clientId: resolvedClientId,
      title: input.title,
      summary: input.summary,
      boardLabel: input.boardLabel,
      snapshotJson: input.snapshotJson,
      fileName:
        input.fileName ||
        `${input.title.toLowerCase().replace(/\s+/g, "-")}-lesson-record.txt`,
    })
    .returning();
  return inserted[0];
}

function createLessonArchiveMemory(actor: Actor, input: LessonArchiveInput) {
  const workspace = getWorkspaceMemory(actor);
  const archive: LessonArchiveRow = {
    id: randomUUID(),
    ownerUserId: workspace.profile.id,
    sessionId: input.sessionId && workspace.sessions.some((session) => session.id === input.sessionId) ? input.sessionId : null,
    clientId: resolveOwnedClientIdMemory(actor, input.clientId),
    title: input.title,
    summary: input.summary,
    boardLabel: input.boardLabel,
    snapshotJson: input.snapshotJson,
    fileName:
      input.fileName ||
      `${input.title.toLowerCase().replace(/\s+/g, "-")}-lesson-record.txt`,
    createdAt: new Date(),
  };
  workspace.archives.unshift(archive);
  return archive;
}

export async function createLessonArchive(actor: Actor, input: LessonArchiveInput) {
  const db = getDatabase();
  return db ? createLessonArchiveDb(actor, input) : createLessonArchiveMemory(actor, input);
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

export async function getWorkspaceOverview(actor: Actor): Promise<WorkspaceOverview> {
  const profile = await ensureProfile(actor);
  const [preferences, clientList, sessionList, ratingList, syncList, archiveList, requestList] = await Promise.all([
    getWorkspacePreferences(actor),
    listClients(actor),
    listSessions(actor),
    listRatings(actor),
    listSyncs(actor),
    listLessonArchives(actor),
    listScheduleRequests(actor),
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
    preferences,
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
    archives: archiveList,
    scheduleRequests: requestList,
    upcomingSessions: activeSessions.slice(0, 5),
    recentSessions: sessionList.slice(0, 6),
    recentClients: clientList.slice(0, 4),
  };
}

export async function getInvoiceDrafts(actor: Actor): Promise<
  {
    client: ClientRow;
    sessionCount: number;
    totalCents: number;
    lastSession: SessionRow | null;
    lineItems: SessionRow[];
    fileName: string;
  }[]
> {
  const [clientList, sessionList, preferences] = await Promise.all([listClients(actor), listSessions(actor), getWorkspacePreferences(actor)]);
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
      fileName: `MegaStar Tutoring Invoice ${formatMonthYear(new Date(), preferences.market)}.xlsx`,
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
