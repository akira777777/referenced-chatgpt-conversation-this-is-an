import { getOrderByPublicId, getOrderStatusLogs } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// REP- followed by alphanumeric chars (8-12 chars total after dash)
const ORDER_ID_RE = /^REP-[A-Z0-9]{4,12}$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limit: 30 lookups / 60s per IP
  const ip = getClientIp(request);
  const rl = rateLimit(ip, { limit: 30, windowSec: 60 });
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const { id } = await params;
  const normalizedId = id.toUpperCase();

  if (!ORDER_ID_RE.test(normalizedId)) {
    return Response.json(
      { error: "Invalid order ID format" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByPublicId(normalizedId);

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const logs = await getOrderStatusLogs(order.id);

    // Intentionally omit: customer_email, customer_phone, customer_last_name, notes
    return Response.json(
      {
        orderId:           order.public_id,
        status:            order.status,
        brand:             order.brand,
        model:             order.model,
        repairs:           order.repairs,
        deliveryMethod:    order.delivery_method,
        appointmentSlot:   order.appointment_slot,
        priceAgreed:       order.price_agreed,
        createdAt:         order.created_at,
        updatedAt:         order.updated_at,
        customerFirstName: order.customer_first_name,
        statusLogs: logs.map(l => ({
          status:   l.status,
          note:     l.note,
          loggedAt: l.logged_at,
        })),
      },
      {
        status: 200,
        headers: {
          // Cache for 10s on CDN edge so rapid refreshes don't hammer Supabase
          "Cache-Control": "public, max-age=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/orders/[id]] Error:", err);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
