/**
 * GET  /api/admin/orders          — list all orders (paginated)
 * GET  /api/admin/orders?id=REP-X — single order with full details
 * PATCH /api/admin/orders         — update order status + add log
 */
import { z } from "zod";
import { getSupabaseAdmin, OrderStatus } from "@/lib/supabase";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ORDER_STATUSES: OrderStatus[] = [
  "REQUESTED", "RECEIVED", "DIAGNOSTICS",
  "IN_PROGRESS", "TESTING", "READY", "COMPLETED", "CANCELLED",
];

const patchSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "REQUESTED", "RECEIVED", "DIAGNOSTICS",
    "IN_PROGRESS", "TESTING", "READY", "COMPLETED", "CANCELLED",
  ]),
  note: z.string().max(500).optional(),
  priceAgreed: z.string().max(100).optional(),
});

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  const url    = new URL(request.url);
  const id     = url.searchParams.get("id");
  const page   = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit  = Math.min(50, parseInt(url.searchParams.get("limit") ?? "20"));
  const status = url.searchParams.get("status") as OrderStatus | null;
  const offset = (page - 1) * limit;

  const sb = getSupabaseAdmin();

  // Single order
  if (id) {
    const { data, error } = await sb
      .from("repair_orders")
      .select("*, repair_status_logs(*)")
      .eq("public_id", id.toUpperCase())
      .single();
    if (error) return Response.json({ error: "Order not found" }, { status: 404 });
    return Response.json({ order: data });
  }

  // Paginated list
  let query = sb
    .from("repair_orders")
    .select("id, public_id, brand, model, repairs, status, delivery_method, appointment_slot, price_agreed, customer_first_name, customer_last_name, customer_email, customer_phone, preferred_contact, created_at, updated_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && ORDER_STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("Admin orders fetch:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return Response.json({
    orders: data,
    pagination: { page, limit, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) },
  });
}

export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  const ip = getClientIp(request);
  const rl = rateLimit(ip, { limit: 30, windowSec: 60 });
  if (!rl.ok) return Response.json({ error: "Rate limit" }, { status: 429 });

  try {
    const json   = await request.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Validation failed", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { orderId, status, note, priceAgreed } = parsed.data;
    const sb = getSupabaseAdmin();

    // Get order UUID
    const { data: order, error: fetchErr } = await sb
      .from("repair_orders")
      .select("id")
      .eq("public_id", orderId.toUpperCase())
      .single();

    if (fetchErr || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Update status (and optionally price_agreed)
    const updatePayload: Record<string, unknown> = { status };
    if (priceAgreed) updatePayload.price_agreed = priceAgreed;

    const { error: updateErr } = await sb
      .from("repair_orders")
      .update(updatePayload)
      .eq("id", order.id);

    if (updateErr) {
      return Response.json({ error: "Failed to update order" }, { status: 500 });
    }

    // Append status log
    await sb.from("repair_status_logs").insert({
      order_id: order.id,
      status,
      note: note ?? null,
    });

    return Response.json({ success: true, orderId, status });
  } catch (err) {
    console.error("[PATCH /api/admin/orders]:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
