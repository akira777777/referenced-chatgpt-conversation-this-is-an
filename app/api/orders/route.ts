import { z } from "zod";
import { saveOrderToSupabase, sendTelegramOrderNotification } from "@/lib/supabase";

const orderSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  repairs: z.array(z.string()).min(1),
  estimatedPrice: z.union([z.number(), z.string()]).optional().default(0),
  method: z.string().min(1),
  slot: z.string().optional(),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    contact: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = orderSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid repair request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const orderId = `REP-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      brand: data.brand,
      model: data.model,
      repairs: data.repairs,
      estimatedPrice: data.estimatedPrice ?? 0,
      method: data.method,
      slot: data.slot,
      customer: data.customer,
    };

    // 1. Persist to Supabase (required)
    const saveResult = await saveOrderToSupabase(orderPayload);

    if (!saveResult.success) {
      return Response.json(
        { error: "Failed to save order", details: saveResult.error },
        { status: 500 }
      );
    }

    // 2. Send Telegram notification (optional — fire and forget)
    sendTelegramOrderNotification(orderPayload).catch(console.error);

    return Response.json(
      {
        orderId,
        status: "REQUESTED",
        persistence: "supabase",
        telegramDispatched: Boolean(
          process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
        ),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order processing error:", err);
    return Response.json(
      { error: "Failed to process repair request" },
      { status: 500 }
    );
  }
}
