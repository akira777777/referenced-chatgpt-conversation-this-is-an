import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const deviceBrands = sqliteTable("device_brands", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const deviceCategories = sqliteTable("device_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brandId: integer("brand_id").references(() => deviceBrands.id),
  name: text("name").notNull(),
});

export const deviceModels = sqliteTable("device_models", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => deviceCategories.id),
  name: text("name").notNull(),
  active: integer("active", { mode: "boolean" }).default(true),
});

export const repairServices = sqliteTable("repair_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});

export const repairPrices = sqliteTable("repair_prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceModelId: integer("device_model_id").references(() => deviceModels.id),
  repairServiceId: integer("repair_service_id").references(
    () => repairServices.id,
  ),
  amountCzk: integer("amount_czk").notNull(),
  durationMinutes: integer("duration_minutes"),
});

export const serviceLocations = sqliteTable("service_locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address").notNull(),
});

export const repairOrders = sqliteTable("repair_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  publicId: text("public_id").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  deviceModelId: integer("device_model_id").references(() => deviceModels.id),
  estimatedPrice: integer("estimated_price").notNull(),
  deliveryMethod: text("delivery_method").notNull(),
  notes: text("notes"),
  status: text("status", {
    enum: [
      "REQUESTED",
      "RECEIVED",
      "DIAGNOSTICS",
      "IN_PROGRESS",
      "TESTING",
      "READY",
      "COMPLETED",
    ],
  })
    .default("REQUESTED")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => repairOrders.id),
  locationId: integer("location_id").references(() => serviceLocations.id),
  startsAt: integer("starts_at", { mode: "timestamp" }).notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  role: text("role").default("admin").notNull(),
});
