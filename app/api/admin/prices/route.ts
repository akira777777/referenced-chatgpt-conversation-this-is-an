import { z } from "zod";
import { allModels } from "@/lib/data";

const priceConfigSchema = z.object({
  id: z.string().optional(),
  brand: z.string().min(1),
  device: z.string().min(1),
  service: z.string().min(1),
  category: z.string().optional().default("Other"),
  description: z.string().optional().default(""),
  priceFrom: z.number().nonnegative().optional(),
  priceTo: z.number().nonnegative().optional(),
  exactPrice: z.number().nonnegative().optional(),
  priceFormat: z.enum(["range", "from", "approx", "exact", "custom"]).optional().default("range"),
  currency: z.string().optional().default("CZK"),
  partsIncluded: z.boolean().optional().default(true),
  laborIncluded: z.boolean().optional().default(true),
  installationIncluded: z.boolean().optional().default(true),
  testingIncluded: z.boolean().optional().default(true),
  estimatedDuration: z.string().optional().default("60–90 min"),
  qualityTier: z.enum(["standard", "premium", "original", "all"]).optional().default("standard"),
  finalPriceRequiresConfirmation: z.boolean().optional().default(true),
  availability: z.enum(["in_stock", "on_order", "1_2_days"]).optional().default("in_stock"),
  customNote: z.string().optional(),
  diagnosticsPolicy: z.enum(["included_if_repaired", "free", "standalone"]).optional().default("included_if_repaired"),
});

// In-memory runtime override store
let customPricesStore: z.infer<typeof priceConfigSchema>[] = [];

export async function GET() {
  // Flatten default initial prices
  const defaultItems = allModels.flatMap(model =>
    model.repairs.map(r => ({
      id: `${model.id}-${r.id}`,
      brand: model.brand,
      device: model.name,
      service: r.name,
      category: r.category || "Other",
      description: r.description || "",
      priceFrom: r.priceFrom,
      priceTo: r.priceTo,
      exactPrice: r.exactPrice,
      priceFormat: r.priceFormat || "range",
      currency: r.currency || "CZK",
      partsIncluded: r.partsIncluded ?? true,
      laborIncluded: r.laborIncluded ?? true,
      installationIncluded: r.installationIncluded ?? true,
      testingIncluded: r.testingIncluded ?? true,
      estimatedDuration: r.estimatedDuration || r.time || "60–90 min",
      qualityTier: r.qualityTier || "standard",
      finalPriceRequiresConfirmation: r.finalPriceRequiresConfirmation ?? true,
      availability: r.availability || "in_stock",
      customNote: r.customNote,
      diagnosticsPolicy: r.diagnosticsPolicy || "included_if_repaired",
    }))
  );

  return Response.json({
    prices: customPricesStore.length > 0 ? customPricesStore : defaultItems,
    count: customPricesStore.length > 0 ? customPricesStore.length : defaultItems.length,
    isCustomized: customPricesStore.length > 0,
  });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = priceConfigSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid price configuration", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const item = {
      ...parsed.data,
      id: parsed.data.id || `${parsed.data.device.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${parsed.data.service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    };

    // If store is empty, initialize from defaults
    if (customPricesStore.length === 0) {
      customPricesStore = allModels.flatMap(model =>
        model.repairs.map(r => ({
          id: `${model.id}-${r.id}`,
          brand: model.brand,
          device: model.name,
          service: r.name,
          category: r.category || "Other",
          description: r.description || "",
          priceFrom: r.priceFrom,
          priceTo: r.priceTo,
          exactPrice: r.exactPrice,
          priceFormat: r.priceFormat || "range",
          currency: r.currency || "CZK",
          partsIncluded: r.partsIncluded ?? true,
          laborIncluded: r.laborIncluded ?? true,
          installationIncluded: r.installationIncluded ?? true,
          testingIncluded: r.testingIncluded ?? true,
          estimatedDuration: r.estimatedDuration || r.time || "60–90 min",
          qualityTier: r.qualityTier || "standard",
          finalPriceRequiresConfirmation: r.finalPriceRequiresConfirmation ?? true,
          availability: r.availability || "in_stock",
          customNote: r.customNote,
          diagnosticsPolicy: r.diagnosticsPolicy || "included_if_repaired",
        }))
      );
    }

    const existingIndex = customPricesStore.findIndex(p => p.id === item.id);
    if (existingIndex >= 0) {
      customPricesStore[existingIndex] = item;
    } else {
      customPricesStore.unshift(item);
    }

    return Response.json({ success: true, item }, { status: 200 });
  } catch (err) {
    console.error("Admin price update error:", err);
    return Response.json({ error: "Failed to update price" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id === "reset_all") {
      customPricesStore = [];
      return Response.json({ success: true, reset: true });
    }

    if (!id) {
      return Response.json({ error: "ID required" }, { status: 400 });
    }

    customPricesStore = customPricesStore.filter(p => p.id !== id);
    return Response.json({ success: true, deletedId: id });
  } catch (_err) {
    return Response.json({ error: "Failed to delete price entry" }, { status: 500 });
  }
}
