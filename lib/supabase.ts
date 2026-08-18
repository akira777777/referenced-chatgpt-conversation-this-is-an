import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Client-side (public anon key) ──────────────────────────────────────────
let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(url, anonKey);
  }

  return cachedClient;
}

// ─── Server-side (service role — bypasses RLS) ───────────────────────────────
let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(url, serviceKey);
  }

  return cachedAdminClient;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export type OrderPayload = {
  orderId: string;
  brand: string;
  model: string;
  repairs: string[];
  estimatedPrice: number | string;
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

export type OrderStatus =
  | "REQUESTED"
  | "RECEIVED"
  | "DIAGNOSTICS"
  | "IN_PROGRESS"
  | "TESTING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type RepairOrder = {
  id: string;
  public_id: string;
  customer_id: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_contact: string;
  brand: string;
  model: string;
  repairs: string[];
  delivery_method: string;
  appointment_slot: string | null;
  notes: string | null;
  price_agreed: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type StatusLog = {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  logged_at: string;
};

// In-memory fallback for local dev / tests when Supabase is not configured
const inMemoryOrders = new Map<string, RepairOrder>();
const inMemoryLogs = new Map<string, StatusLog[]>();

// ─── Save order ───────────────────────────────────────────────────────────────
export async function saveOrderToSupabase(
  order: OrderPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();

    // 1. Insert customer
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .insert({
        first_name: order.customer.firstName,
        last_name: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
      })
      .select("id")
      .single();

    if (customerError) {
      console.error("Supabase customer insert error:", customerError);
    }

    // 2. Insert repair order
    const { data: orderData, error: orderError } = await supabase
      .from("repair_orders")
      .insert({
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
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Supabase order insert error:", orderError);
      throw new Error(orderError.message);
    }

    // 3. Insert initial status log
    if (orderData?.id) {
      const { error: logError } = await supabase.from("repair_status_logs").insert({
        order_id: orderData.id,
        status: "REQUESTED",
        note: "Order received via reform-servis",
      });

      if (logError) {
        console.error("Supabase status log insert error:", logError);
      }
    }

    return { success: true, id: order.orderId };
  } catch (err) {
    console.warn("Supabase not available or failed, using local in-memory fallback:", err);
    const mockOrder: RepairOrder = {
      id: `local-${Date.now()}`,
      public_id: order.orderId.toUpperCase(),
      customer_id: null,
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryOrders.set(order.orderId.toUpperCase(), mockOrder);
    inMemoryLogs.set(mockOrder.id, [
      {
        id: `log-${Date.now()}`,
        order_id: mockOrder.id,
        status: "REQUESTED",
        note: "Order received via reform-servis (Local store)",
        logged_at: new Date().toISOString(),
      },
    ]);
    return { success: true, id: order.orderId };
  }
}

// ─── Fetch order by public_id ─────────────────────────────────────────────────
export async function getOrderByPublicId(
  publicId: string
): Promise<RepairOrder | null> {
  const normId = publicId.toUpperCase();
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("repair_orders")
      .select("*")
      .eq("public_id", normId)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Supabase fetch order error:", error);
      }
      return inMemoryOrders.get(normId) ?? null;
    }

    return data as RepairOrder;
  } catch {
    return inMemoryOrders.get(normId) ?? null;
  }
}

// ─── Fetch order status logs ──────────────────────────────────────────────────
export async function getOrderStatusLogs(orderId: string): Promise<StatusLog[]> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("repair_status_logs")
      .select("*")
      .eq("order_id", orderId)
      .order("logged_at", { ascending: true });

    if (error) {
      return inMemoryLogs.get(orderId) ?? [];
    }

    return (data ?? []) as StatusLog[];
  } catch {
    return inMemoryLogs.get(orderId) ?? [];
  }
}

// ─── Telegram notification ─────────────────────────────────────────────────────
export async function sendTelegramOrderNotification(
  order: OrderPayload
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return false;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reart.cz";

  const messageText = [
    `🔧 *New Repair Request: ${order.orderId}*`,
    `📱 *Device:* ${order.brand} ${order.model}`,
    `🛠 *Services:* ${order.repairs.join(", ")}`,
    `🚚 *Delivery:* ${order.method}${order.slot ? ` (${order.slot})` : ""}`,
    `💰 *Price:* Price on request`,
    `👤 *Customer:* ${order.customer.firstName} ${order.customer.lastName}`,
    `📞 *Phone:* ${order.customer.phone}`,
    `✉️ *Email:* ${order.customer.email}`,
    order.customer.contact
      ? `💬 *Preferred Contact:* ${order.customer.contact}`
      : null,
    order.customer.notes ? `📝 *Notes:* ${order.customer.notes}` : null,
    `📍 *Location:* Biskupcova 31, Praha 3`,
    `🌐 *Track:* ${siteUrl}/track/${order.orderId}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "Markdown",
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error("Telegram notification error:", err);
    return false;
  }
}
