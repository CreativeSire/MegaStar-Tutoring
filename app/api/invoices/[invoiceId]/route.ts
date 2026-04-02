import { NextResponse } from "next/server";
import { z } from "zod";
import { buildInvoiceExportContent, getWorkspaceOverview, listClients, listInvoices, parseInvoiceLineItems, updateInvoiceStatus } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

const invoiceStatusSchema = z.object({
  status: z.enum(["draft", "sent", "paid"]),
});

export async function GET(request: Request, context: { params: Promise<{ invoiceId: string }> }) {
  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.invoices.detail", 60, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const { invoiceId } = await context.params;
  const [invoices, clients, overview] = await Promise.all([listInvoices(actor), listClients(actor), getWorkspaceOverview(actor)]);
  const invoice = invoices.find((entry) => entry.id === invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  const client = clients.find((entry) => entry.id === invoice.clientId) || null;
  const lineItems = parseInvoiceLineItems(invoice.lineItemsJson);
  const exportContent = buildInvoiceExportContent(
    invoice,
    client,
    lineItems.map((item) => ({
      id: item.sessionId || item.title || "line-item",
      ownerUserId: "",
      clientId: null,
      title: item.title || "Lesson",
      startsAt: new Date(item.startsAt || Date.now()),
      endsAt: null,
      status: "completed",
      source: "manual",
      billable: true,
      amountCents: item.amountCents || 0,
      notes: item.notes || "",
      externalEventId: null,
      createdAt: new Date(item.startsAt || Date.now()),
    })),
    overview.preferences.market,
  );
  const response = NextResponse.json({ invoice, client, exportContent });
  await recordAuditEvent(actor, request, "invoices.read", response.status, { invoiceId }).catch(() => undefined);
  return response;
}

export async function PATCH(request: Request, context: { params: Promise<{ invoiceId: string }> }) {
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
    await enforceRateLimit(actor, request, "api.invoices.update", 20, 60_000);
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

  const parsed = invoiceStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invoice status.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { invoiceId } = await context.params;
  const updated = await updateInvoiceStatus(actor, invoiceId, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const response = NextResponse.json({ invoice: updated }, { status: 200 });
  await recordAuditEvent(actor, request, "invoices.update", response.status, { invoiceId, status: parsed.data.status }).catch(() => undefined);
  return response;
}
