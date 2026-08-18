import { z } from "zod";
import { saveOrderToSupabase, sendTelegramOrderNotification } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

// ─── Validation schema ────────────────────────────────────────────────────────
const orderSchema = z.object({
  brand:  z.string().min(1).max(60),
  model:  z.string().min(1).max(80),
  repairs: z.array(z.string().min(1).max(120)).min(1).max(10),
  estimatedPrice: z.union([z.number(), z.string()]).optional().default(0),
  method: z.enum(["Service center", "Courier pickup", "Send by mail"]),
  slot:   z.string().max(60).optional(),
  customer: z.object({
    firstName: z.string().min(1).max(60),
    lastName:  z.string().min(1).max(60),
    email:     z.string().email().max(120),
    phone:     z.string().min(5).max(30),
    contact:   z.enum(["Telegram", "Phone", "SMS", "Email"]).optional(),
    notes:     z.string().max(1000).optional(),
  }),
});

// ─── CORS headers (same-origin is fine for Vercel) ───────────────────────────
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL ?? "https://reart.cz",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  // ── Rate limit: 5 orders / 10 min per IP ────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(ip, { limit: 5, windowSec: 600 });
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter), ...CORS_HEADERS } }
    );
  }

  try {
    const json = await request.json();
    const parsed = orderSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid repair request", fields: parsed.error.flatten().fieldErrors },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const data = parsed.data;

    // ── Generate collision-resistant order ID ────────────────────────────
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderId = `REP-${timestamp}${random}`;

    // ── Sanitize free-text fields ────────────────────────────────────────
    const orderPayload = {
      orderId,
      brand:  sanitizeText(data.brand, 60),
      model:  sanitizeText(data.model, 80),
      repairs: data.repairs.map(r => sanitizeText(r, 120)),
      estimatedPrice: data.estimatedPrice ?? 0,
      method: data.method,
      slot:   data.slot ? sanitizeText(data.slot, 60) : undefined,
      customer: {
        firstName: sanitizeText(data.customer.firstName, 60),
        lastName:  sanitizeText(data.customer.lastName, 60),
        email:     data.customer.email.toLowerCase().trim(),
        phone:     sanitizeText(data.customer.phone, 30),
        contact:   data.customer.contact,
        notes:     data.customer.notes ? sanitizeText(data.customer.notes, 1000) : undefined,
      },
    };

    // ── Save to Supabase ─────────────────────────────────────────────────
    const saveResult = await saveOrderToSupabase(orderPayload);

    if (!saveResult.success) {
      return Response.json(
        { error: "Failed to save order. Please try again or contact us via Telegram." },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // ── Telegram notification (fire-and-forget) ──────────────────────────
    sendTelegramOrderNotification(orderPayload).catch(err =>
      console.error("Telegram notification failed:", err)
    );

    return Response.json(
      { orderId, status: "REQUESTED" },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error("[POST /api/orders] Unhandled error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
