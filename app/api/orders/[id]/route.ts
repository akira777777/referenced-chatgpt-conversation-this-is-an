import { getOrderByPublicId, getOrderStatusLogs } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !id.startsWith("REP-")) {
    return Response.json(
      { error: "Invalid order ID format. Expected: REP-XXXXXX" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByPublicId(id);

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const logs = await getOrderStatusLogs(order.id);

    // Return order data with sensitive fields stripped for public access
    return Response.json(
      {
        orderId: order.public_id,
        status: order.status,
        brand: order.brand,
        model: order.model,
        repairs: order.repairs,
        deliveryMethod: order.delivery_method,
        appointmentSlot: order.appointment_slot,
        priceAgreed: order.price_agreed,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        // Customer info — limited to first name for display
        customerFirstName: order.customer_first_name,
        statusLogs: logs.map((l: {status: string; note: string | null; logged_at: string}) => ({
          status: l.status,
          note: l.note,
          loggedAt: l.logged_at,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Order fetch error:", err);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
