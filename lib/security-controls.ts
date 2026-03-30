import { desc, eq, lt, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDatabase, hasDatabase } from "@/lib/db";
import { auditEvents, rateLimitWindows } from "@/lib/db/schema";
import { getWorkspaceProfile, type Actor } from "@/lib/repository";
import { normalizeAppRole } from "@/lib/roles";

type RequestContext = {
  route: string;
  method: string;
  ipAddress: string | null;
  userAgent: string | null;
};

type AuditDetails = Record<string, unknown>;

type AuditRecord = {
  id: string;
  ownerUserId: string;
  actorClerkUserId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  route: string;
  method: string;
  statusCode: number;
  ipAddress: string | null;
  userAgent: string | null;
  details: string;
  createdAt: Date;
};

type RateLimitRecord = {
  hits: number;
  windowEndsAt: number;
};

type SecurityWorkspace = {
  auditEvents: AuditRecord[];
  rateLimits: Map<string, RateLimitRecord>;
};

type SecurityMemory = {
  workspaces: Map<string, SecurityWorkspace>;
};

const globalForSecurity = globalThis as typeof globalThis & {
  megaStarSecurityStore?: SecurityMemory;
};

function getSecurityStore() {
  if (!globalForSecurity.megaStarSecurityStore) {
    globalForSecurity.megaStarSecurityStore = {
      workspaces: new Map(),
    };
  }

  return globalForSecurity.megaStarSecurityStore;
}

function getSecurityWorkspace(actor: Actor) {
  const store = getSecurityStore();
  let workspace = store.workspaces.get(actor.clerkUserId);
  if (!workspace) {
    workspace = {
      auditEvents: [],
      rateLimits: new Map(),
    };
    store.workspaces.set(actor.clerkUserId, workspace);
  }

  return workspace;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || request.headers.get("x-vercel-forwarded-for");
  const realIp = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip");
  const candidate = forwarded?.split(",")[0]?.trim() || realIp?.trim() || null;
  return candidate && candidate.length ? candidate : null;
}

export function getRequestContext(request: Request): RequestContext {
  const url = new URL(request.url);
  return {
    route: `${url.pathname}${url.search}`,
    method: request.method,
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent"),
  };
}

export async function recordAuditEvent(
  actor: Actor,
  request: Request,
  action: string,
  statusCode: number,
  details: AuditDetails = {},
) {
  const context = getRequestContext(request);
  const profile = await getWorkspaceProfile(actor);
  const role = normalizeAppRole(actor.role, profile.role);

  if (!hasDatabase()) {
    getSecurityWorkspace(actor).auditEvents.unshift({
      id: randomUUID(),
      ownerUserId: profile.id,
      actorClerkUserId: actor.clerkUserId,
      actorRole: role,
      action,
      resourceType: "",
      resourceId: null,
      route: context.route,
      method: context.method,
      statusCode,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      details: JSON.stringify(details),
      createdAt: new Date(),
    });
    return;
  }

  const db = getDatabase();
  if (!db) {
    return;
  }

  await db.insert(auditEvents).values({
    ownerUserId: profile.id,
    actorClerkUserId: actor.clerkUserId,
    actorRole: role,
    action,
    resourceType: "",
    resourceId: null,
    route: context.route,
    method: context.method,
    statusCode,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    details: JSON.stringify(details),
  });
}

export async function listAuditEvents(actor: Actor, limit = 25) {
  const profile = await getWorkspaceProfile(actor);
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

  if (!hasDatabase()) {
    return getSecurityWorkspace(actor).auditEvents.slice(0, safeLimit);
  }

  const db = getDatabase();
  if (!db) {
    return [];
  }

  return db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.ownerUserId, profile.id))
    .orderBy(desc(auditEvents.createdAt))
    .limit(safeLimit);
}

export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function enforceRateLimit(
  actor: Actor,
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const windowEndsAt = windowStart + windowMs;
  const requestContext = getRequestContext(request);
  const ipAddress = requestContext.ipAddress || "unknown";
  const bucketKey = [scope, actor.clerkUserId, ipAddress, windowStart].join(":");

  if (!hasDatabase()) {
    const workspace = getSecurityWorkspace(actor);
    const entry = workspace.rateLimits.get(bucketKey);
    if (!entry || entry.windowEndsAt <= now) {
      workspace.rateLimits.set(bucketKey, { hits: 1, windowEndsAt });
      return;
    }

    if (entry.hits >= limit) {
      throw new RateLimitError("Too many requests.", Math.max(1, Math.ceil((entry.windowEndsAt - now) / 1000)));
    }

    entry.hits += 1;
    return;
  }

  const db = getDatabase();
  if (!db) {
    return;
  }

  const profile = await getWorkspaceProfile(actor);
  await db.delete(rateLimitWindows).where(lt(rateLimitWindows.windowEndsAt, new Date(now - windowMs)));

  const [bucket] = await db
    .insert(rateLimitWindows)
    .values({
      ownerUserId: profile.id,
      actorClerkUserId: actor.clerkUserId,
      scope,
      bucketKey,
      hits: 1,
      windowStart: new Date(windowStart),
      windowEndsAt: new Date(windowEndsAt),
    })
    .onConflictDoUpdate({
      target: rateLimitWindows.bucketKey,
      set: {
        hits: sql`${rateLimitWindows.hits} + 1`,
        windowEndsAt: new Date(windowEndsAt),
      },
    })
    .returning({ hits: rateLimitWindows.hits });

  if ((bucket?.hits || 0) > limit) {
    throw new RateLimitError("Too many requests.", Math.max(1, Math.ceil((windowEndsAt - now) / 1000)));
  }
}
