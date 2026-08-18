import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, anonKey);
  }

  return cachedClient;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(url, serviceKey);
  }

  return cachedAdminClient;
}

export type OrderPayload = {
  orderId: string;
  brand: string;
  model: string;
  repairs: string[];
  estimatedPrice: number;
  method: string;
  slot?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    contact?: string;
    notes?: string;
  };
};

/**
 * Persists a new repair order to Supabase if configured.
 */
export async function saveOrderToSupabase(order: OrderPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseAdmin() ?? getSupabase();
  if (!supabase) {
    return { success: true }; // Graceful demo fallback
  }

  try {
    // 1. Upsert customer
    const { data: customerData } = await supabase
      .from("customers")
      .insert({
        first_name: order.customer.firstName,
        last_name: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
      })
      .select("id")
      .single();

    // 2. Insert repair order
    const { error: orderError } = await supabase.from("repair_orders").insert({
      public_id: order.orderId,
      customer_id: customerData?.id ?? null,
      customer_first_name: order.customer.firstName,
      customer_last_name: order.customer.lastName,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      preferred_contact: order.customer.contact ?? "Email",
      brand: order.brand,
      model: order.model,
      repairs: order.repairs,
      delivery_method: order.method,
      appointment_slot: order.slot ?? null,
      notes: order.customer.notes ?? null,
      price_agreed: "Price on request",
      status: "REQUESTED",
    });

    if (orderError) {
      console.error("Supabase insert error:", orderError);
      return { success: false, error: orderError.message };
    }

    return { success: true, id: order.orderId };
  } catch (err) {
    console.error("Supabase order error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Sends a Telegram notification when a new order is received if Telegram credentials exist.
 */
export async function sendTelegramOrderNotification(order: OrderPayload): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return false;
  }

  const messageText = [
    `🔧 *New Repair Request: ${order.orderId}*`,
    `📱 *Device:* ${order.brand} ${order.model}`,
    `🛠 *Services:* ${order.repairs.join(", ")}`,
    `🚚 *Delivery:* ${order.method}${order.slot ? ` (${order.slot})` : ""}`,
    `💰 *Price:* Price on request`,
    `👤 *Customer:* ${order.customer.firstName} ${order.customer.lastName}`,
    `📞 *Phone:* ${order.customer.phone}`,
    `✉️ *Email:* ${order.customer.email}`,
    order.customer.contact ? `💬 *Preferred Contact:* ${order.customer.contact}` : null,
    order.customer.notes ? `📝 *Notes:* ${order.customer.notes}` : null,
    `📍 *Location:* Biskupcova 31, Praha 3`,
    `💬 *Technician Telegram:* @liltrafficRUS`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "Markdown",
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("Telegram notification error:", err);
    return false;
  }
}
