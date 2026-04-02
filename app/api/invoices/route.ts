import { NextResponse } from "next/server";
import { z } from "zod";
import { buildInvoiceExportContent, createInvoice, getInvoiceDrafts, getWorkspacePreferences, listClients, listInvoices } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

const invoiceSchema = z.object({
  clientId: z.string().trim().min(1),
  periodStart: z.string().trim().min(1),
  periodEnd: z.string().trim().min(1),
  exportFormat: z.enum(["csv", "xlsx", "pdf"]).default("csv"),
});

export async function GET(request: Request) {
  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.invoices.read", 60, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const [drafts, invoices, clients] = await Promise.all([getInvoiceDrafts(actor), listInvoices(actor), listClients(actor)]);
  const response = NextResponse.json({ drafts, invoices, clients });
  await recordAuditEvent(actor, request, "invoices.list", response.status, { count: invoices.length }).catch(() => undefined);
  return response;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.invoices.create", 15, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  let body = null;
  try {
    body = await readJsonBody(request);
  } catch {
    return NextResponse.json({ error: "Request body too large or invalid." }, { status: 413 });
  }

  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invoice request.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await createInvoice(actor, parsed.data);
  const preferences = await getWorkspacePreferences(actor);
  const exportContent = buildInvoiceExportContent(result.invoice, result.client, result.sessions, preferences.market);
  const response = NextResponse.json({ ...result, exportContent, fileName: result.fileName }, { status: 201 });
  await recordAuditEvent(actor, request, "invoices.create", response.status, {
    invoiceId: result.invoice.id,
    clientId: result.invoice.clientId,
    totalCents: result.invoice.totalCents,
  }).catch(() => undefined);
  return response;
}
