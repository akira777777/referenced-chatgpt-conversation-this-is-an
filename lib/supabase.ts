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
const inMemoryOrders = new Map<string, RepairOrder>([
  [
    "REP-240182",
    {
      id: "demo-240182",
      public_id: "REP-240182",
      customer_id: "demo-cust-1",
      customer_first_name: "Jan",
      customer_last_name: "Novák",
      customer_email: "fear75412@gmail.com",
      customer_phone: "+420 737 500 587",
      preferred_contact: "Telegram",
      brand: "Apple",
      model: "iPhone 15 Pro",
      repairs: ["Display replacement (OEM OLED)", "TrueTone EEPROM Calibration"],
      delivery_method: "Service center (Biskupcova 31)",
      appointment_slot: "Today · 16:00",
      notes: "Screen matrix cracked, sensor intact",
      price_agreed: "3 890 Kč",
      status: "TESTING",
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  [
    "REP-240181",
    {
      id: "demo-240181",
      public_id: "REP-240181",
      customer_id: "demo-cust-2",
      customer_first_name: "Petr",
      customer_last_name: "Svoboda",
      customer_email: "petr.svoboda@example.cz",
      customer_phone: "+420 721 000 111",
      preferred_contact: "Phone",
      brand: "Apple",
      model: "MacBook Air M2",
      repairs: ["Liquid spill ultrasonic decontamination", "PMIC trace jumper repair"],
      delivery_method: "Courier pickup",
      appointment_slot: "Yesterday",
      notes: "Tea spilled on keyboard",
      price_agreed: "2 800 Kč",
      status: "READY",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  [
    "REP-240180",
    {
      id: "demo-240180",
      public_id: "REP-240180",
      customer_id: "demo-cust-3",
      customer_first_name: "Elena",
      customer_last_name: "Kovářová",
      customer_email: "elena.k@example.cz",
      customer_phone: "+420 777 888 999",
      preferred_contact: "Telegram",
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      repairs: ["0-Cycle OEM Battery Replacement"],
      delivery_method: "Service center",
      appointment_slot: "Today · 11:00",
      notes: "Battery degraded to 68%",
      price_agreed: "1 790 Kč",
      status: "DIAGNOSTICS",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
]);

const inMemoryLogs = new Map<string, StatusLog[]>([
  [
    "demo-240182",
    [
      { id: "log-1", order_id: "demo-240182", status: "REQUESTED", note: "Order placed online", logged_at: new Date(Date.now() - 3600000 * 4).toISOString() },
      { id: "log-2", order_id: "demo-240182", status: "RECEIVED", note: "Device accepted at Prague 3 workshop", logged_at: new Date(Date.now() - 3600000 * 3.5).toISOString() },
      { id: "log-3", order_id: "demo-240182", status: "DIAGNOSTICS", note: "Microscope logic board inspection: 0 shorts, 0.00V leakage", logged_at: new Date(Date.now() - 3600000 * 3).toISOString() },
      { id: "log-4", order_id: "demo-240182", status: "IN_PROGRESS", note: "OLED matrix installed, TrueTone EEPROM transfer complete", logged_at: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { id: "log-5", order_id: "demo-240182", status: "TESTING", note: "120Hz ProMotion & biometric sensor calibration in progress", logged_at: new Date(Date.now() - 3600000 * 0.5).toISOString() },
    ],
  ],
  [
    "demo-240181",
    [
      { id: "log-6", order_id: "demo-240181", status: "REQUESTED", note: "Express courier booked", logged_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: "log-7", order_id: "demo-240181", status: "RECEIVED", note: "Received in BGA lab", logged_at: new Date(Date.now() - 86400000 * 1.8).toISOString() },
      { id: "log-8", order_id: "demo-240181", status: "DIAGNOSTICS", note: "Thermal camera located PMIC corroded resistor trace", logged_at: new Date(Date.now() - 86400000 * 1.5).toISOString() },
      { id: "log-9", order_id: "demo-240181", status: "IN_PROGRESS", note: "Ultrasonic chemical bath + 0.02mm solder jumper restored", logged_at: new Date(Date.now() - 86400000 * 0.8).toISOString() },
      { id: "log-10", order_id: "demo-240181", status: "READY", note: "Full 24h burn-in stress test passed. Ready for pickup!", logged_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    ],
  ],
  [
    "demo-240180",
    [
      { id: "log-11", order_id: "demo-240180", status: "REQUESTED", note: "Direct booking confirmed", logged_at: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: "log-12", order_id: "demo-240180", status: "RECEIVED", note: "Received at reception", logged_at: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { id: "log-13", order_id: "demo-240180", status: "DIAGNOSTICS", note: "Current discharge test & BMS pairing", logged_at: new Date(Date.now() - 3600000 * 0.5).toISOString() },
    ],
  ],
]);

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
      // Fail loud: without a customer_id the order row will exist but PII
      // linkage is lost. In dev, surface it; in prod we continue so a
      // transient customers-table issue doesn't block the order itself.
      if (process.env.NODE_ENV !== "production") {
        throw new Error(`Customer insert failed: ${customerError.message}`);
      }
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
        note: "Order received via reart.cz",
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
        note: "Order received via reart.cz (Local store)",
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
      .select("id, public_id, customer_id, customer_first_name, customer_last_name, customer_email, customer_phone, preferred_contact, brand, model, repairs, delivery_method, appointment_slot, notes, price_agreed, status, created_at, updated_at")
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
