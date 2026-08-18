import { z } from "zod";
import { allModels } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// ─── Schema ───────────────────────────────────────────────────────────────────
const priceSchema = z.object({
  id:          z.string().optional(),
  brand:       z.string().min(1).max(60),
  device:      z.string().min(1).max(80),
  service:     z.string().min(1).max(120),
  category:    z.string().optional().default("Other"),
  description: z.string().max(500).optional().default(""),
  priceFrom:   z.number().nonnegative().optional(),
  priceTo:     z.number().nonnegative().optional(),
  exactPrice:  z.number().nonnegative().optional(),
  priceFormat: z.enum(["range","from","approx","exact","custom"]).optional().default("range"),
  currency:    z.string().optional().default("CZK"),
  partsIncluded:                z.boolean().optional().default(true),
  laborIncluded:                z.boolean().optional().default(true),
  installationIncluded:         z.boolean().optional().default(true),
  testingIncluded:              z.boolean().optional().default(true),
  estimatedDuration:            z.string().optional().default("60–90 min"),
  qualityTier:                  z.enum(["standard","premium","original","all"]).optional().default("standard"),
  finalPriceRequiresConfirmation: z.boolean().optional().default(true),
  availability:                 z.enum(["in_stock","on_order","1_2_days"]).optional().default("in_stock"),
  customNote:                   z.string().max(300).optional(),
  diagnosticsPolicy:            z.enum(["included_if_repaired","free","standalone"]).optional().default("included_if_repaired"),
});

type PriceRow = z.infer<typeof priceSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildDefaultPrices(): PriceRow[] {
  return allModels.flatMap(model =>
    model.repairs.map(r => ({
      id:           `${model.id}-${r.id}`,
      brand:        model.brand,
      device:       model.name,
      service:      r.name,
      category:     r.category ?? "Other",
      description:  r.description ?? "",
      priceFrom:    r.priceFrom,
      priceTo:      r.priceTo,
      exactPrice:   r.exactPrice,
      priceFormat:  (r.priceFormat as PriceRow["priceFormat"]) ?? "range",
      currency:     r.currency ?? "CZK",
      partsIncluded:        r.partsIncluded ?? true,
      laborIncluded:        r.laborIncluded ?? true,
      installationIncluded: r.installationIncluded ?? true,
      testingIncluded:      r.testingIncluded ?? true,
      estimatedDuration:    r.estimatedDuration ?? r.time ?? "60–90 min",
      qualityTier:  (r.qualityTier as PriceRow["qualityTier"]) ?? "standard",
      finalPriceRequiresConfirmation: r.finalPriceRequiresConfirmation ?? true,
      availability: (r.availability as PriceRow["availability"]) ?? "in_stock",
      customNote:   r.customNote,
      diagnosticsPolicy: (r.diagnosticsPolicy as PriceRow["diagnosticsPolicy"]) ?? "included_if_repaired",
    }))
  );
}

/** Try to load price overrides from Supabase; falls back to code defaults */
async function loadPrices(): Promise<{ rows: PriceRow[]; fromDb: boolean }> {
  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("price_overrides")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !data?.length) throw new Error("empty");
    return { rows: data as PriceRow[], fromDb: true };
  } catch {
    return { rows: buildDefaultPrices(), fromDb: false };
  }
}

// ─── GET /api/admin/prices ────────────────────────────────────────────────────
export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  const { rows, fromDb } = await loadPrices();
  return Response.json({ prices: rows, count: rows.length, source: fromDb ? "database" : "defaults" });
}

// ─── POST /api/admin/prices  (upsert one entry) ───────────────────────────────
export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  const ip = getClientIp(request);
  const rl = rateLimit(ip, { limit: 60, windowSec: 60 });
  if (!rl.ok) return Response.json({ error: "Rate limit exceeded" }, { status: 429 });

  try {
    const json = await request.json();
    const parsed = priceSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const item: PriceRow = {
      ...parsed.data,
      id: parsed.data.id ??
        `${parsed.data.device.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${parsed.data.service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    };

    // Persist to Supabase price_overrides table
    try {
      const sb = getSupabaseAdmin();
      const { error } = await sb
        .from("price_overrides")
        .upsert({ ...item, updated_at: new Date().toISOString() }, { onConflict: "id" });
      if (error) console.warn("price_overrides upsert error:", error.message);
    } catch (e) {
      console.warn("Supabase price upsert failed:", e);
    }

    return Response.json({ success: true, item });
  } catch (err) {
    console.error("[POST /api/admin/prices]:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/prices?id=xxx ─────────────────────────────────────────
export async function DELETE(request: Request) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  const url  = new URL(request.url);
  const id   = url.searchParams.get("id");

  if (id === "reset_all") {
    try {
      const sb = getSupabaseAdmin();
      await sb.from("price_overrides").delete().neq("id", "__never__");
    } catch (e) { console.warn("reset_all failed:", e); }
    return Response.json({ success: true, reset: true });
  }

  if (!id) return Response.json({ error: "id is required" }, { status: 400 });

  try {
    const sb = getSupabaseAdmin();
    await sb.from("price_overrides").delete().eq("id", id);
    return Response.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("[DELETE /api/admin/prices]:", err);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
