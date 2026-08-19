/**
 * Unit tests for pure logic shared by the /api/orders route.
 *
 * These cover the public contract of the order intake endpoint without
 * requiring Supabase, a server, or a network round-trip.
 *
 * - Zod validation schema: required fields, length limits, allowed enums
 * - Sanitize helper: strips HTML / control chars, trims, slices
 * - Rate limiter: windowed counter, returns retryAfter when exceeded
 * - Order ID regex: matches REP-XXXX, rejects malformed IDs
 */
import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { sanitizeText } from "../lib/sanitize.ts";
import {
  rateLimit,
  getClientIp,
  __resetRateLimitStoreForTests,
} from "../lib/rate-limit.ts";

// Mirror the production schema in app/api/orders/route.ts. Kept in lockstep
// so a contract change there must also be reflected here.
const orderSchema = z.object({
  brand: z.string().min(1).max(60),
  model: z.string().min(1).max(80),
  repairs: z.array(z.string().min(1).max(120)).min(1).max(10),
  estimatedPrice: z.union([z.number(), z.string()]).optional().default(0),
  method: z.enum(["Service center", "Courier pickup", "Send by mail"]),
  slot: z.string().max(60).optional(),
  customer: z.object({
    firstName: z.string().min(1).max(60),
    lastName: z.string().min(1).max(60),
    email: z.string().email().max(120),
    phone: z.string().min(5).max(30),
    contact: z.enum(["Telegram", "Phone", "SMS", "Email"]).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

const ORDER_ID_RE = /^REP-[A-Z0-9]{4,12}$/;

const validOrder = {
  brand: "Apple",
  model: "iPhone 15 Pro",
  repairs: ["Display replacement (OEM OLED)"],
  estimatedPrice: 0,
  method: "Service center",
  slot: "Tomorrow · 10:30",
  customer: {
    firstName: "Alexandr",
    lastName: "Novak",
    email: "alex.novak@example.cz",
    phone: "+420737000000",
    contact: "Telegram",
  },
};

// ─── Validation schema ────────────────────────────────────────────────────────

test("orderSchema accepts a complete valid order", () => {
  const result = orderSchema.safeParse(validOrder);
  assert.equal(result.success, true);
});

test("orderSchema rejects an order with an invalid email", () => {
  const { success, error } = orderSchema.safeParse({
    ...validOrder,
    customer: { ...validOrder.customer, email: "not-an-email" },
  });
  assert.equal(success, false);
  assert.ok(error);
  // The exact shape of flatten() is zod-version specific; just make sure the
  // failure is communicated to the client in a way that mentions email.
  const serialized = JSON.stringify(error.flatten().fieldErrors).toLowerCase();
  assert.match(serialized, /email/);
});

test("orderSchema rejects an empty repairs array", () => {
  const { success } = orderSchema.safeParse({ ...validOrder, repairs: [] });
  assert.equal(success, false);
});

test("orderSchema rejects more than 10 repairs", () => {
  const repairs = Array.from({ length: 11 }, (_, i) => `Repair ${i + 1}`);
  const { success } = orderSchema.safeParse({ ...validOrder, repairs });
  assert.equal(success, false);
});

test("orderSchema rejects unknown delivery methods", () => {
  const { success } = orderSchema.safeParse({
    ...validOrder,
    method: "Carrier pigeon",
  });
  assert.equal(success, false);
});

test("orderSchema rejects free-text fields that exceed length limits", () => {
  const tooLong = "x".repeat(61);
  const { success } = orderSchema.safeParse({
    ...validOrder,
    brand: tooLong,
  });
  assert.equal(success, false);
});

test("orderSchema defaults estimatedPrice to 0 when omitted", () => {
  const { brand, model, repairs, method, customer } = validOrder;
  const parsed = orderSchema.parse({
    brand,
    model,
    repairs,
    method,
    customer,
  });
  assert.equal(parsed.estimatedPrice, 0);
});

test("orderSchema accepts all valid contact methods", () => {
  for (const contact of ["Telegram", "Phone", "SMS", "Email"]) {
    const { success } = orderSchema.safeParse({
      ...validOrder,
      customer: { ...validOrder.customer, contact },
    });
    assert.equal(success, true, `expected ${contact} to be valid`);
  }
});

// ─── Sanitize helper ──────────────────────────────────────────────────────────

test("sanitizeText strips HTML tags", () => {
  assert.equal(sanitizeText("<script>alert(1)</script>hello"), "alert(1)hello");
});

test("sanitizeText strips control characters", () => {
  // \x00 and \x07 are removed, but normal whitespace (spaces, newlines) stays.
  assert.equal(sanitizeText("a\x00b\x07c"), "abc");
});

test("sanitizeText trims and slices to maxLen", () => {
  assert.equal(sanitizeText("  hello  ", 5), "hello");
  assert.equal(sanitizeText("abcdef", 3), "abc");
});

// ─── Rate limiter ─────────────────────────────────────────────────────────────

test("rateLimit allows requests under the limit and blocks after", () => {
  // Unique key per test run so it does not collide with other tests.
  const key = `test-rl-${Date.now()}-${Math.random()}`;
  const opts = { limit: 3, windowSec: 60 };
  assert.equal(rateLimit(key, opts).ok, true);
  assert.equal(rateLimit(key, opts).ok, true);
  assert.equal(rateLimit(key, opts).ok, true);
  const blocked = rateLimit(key, opts);
  assert.equal(blocked.ok, false);
  assert.ok(typeof blocked.retryAfter === "number" && blocked.retryAfter > 0);
});

test("rateLimit: separate keys have independent counters", () => {
  const opts = { limit: 1, windowSec: 60 };
  const a = `test-rl-a-${Date.now()}-${Math.random()}`;
  const b = `test-rl-b-${Date.now()}-${Math.random()}`;
  assert.equal(rateLimit(a, opts).ok, true);
  // Same key would now be blocked, but a different IP must still pass.
  assert.equal(rateLimit(b, opts).ok, true);
  assert.equal(rateLimit(a, opts).ok, false);
});

test("rateLimit: __resetRateLimitStoreForTests clears the in-memory store", () => {
  const key = `test-rl-reset-${Date.now()}-${Math.random()}`;
  const opts = { limit: 1, windowSec: 60 };
  assert.equal(rateLimit(key, opts).ok, true);
  assert.equal(rateLimit(key, opts).ok, false);
  __resetRateLimitStoreForTests();
  // After reset, the same key is treated as a fresh IP.
  assert.equal(rateLimit(key, opts).ok, true);
});

// ─── Order ID regex (used by /api/orders/[id]) ────────────────────────────────

test("ORDER_ID_RE accepts well-formed IDs (after uppercasing)", () => {
  // The production route calls id.toUpperCase() before matching.
  for (const id of ["rep-240182", "REP-240182", "REP-ABC123XYZ"]) {
    assert.match(id.toUpperCase(), ORDER_ID_RE);
  }
});

test("ORDER_ID_RE rejects malformed IDs", () => {
  for (const id of ["REP-", "REP-!!!", "ORD-1234", "REP-1234567890123"]) {
    assert.doesNotMatch(id.toUpperCase(), ORDER_ID_RE);
  }
});

// ─── getClientIp ──────────────────────────────────────────────────────────────

test("getClientIp prefers x-real-ip over x-forwarded-for", () => {
  const req = new Request("http://localhost", {
    headers: {
      "x-real-ip": "1.1.1.1",
      "x-forwarded-for": "2.2.2.2, 3.3.3.3",
    },
  });
  assert.equal(getClientIp(req), "1.1.1.1");
});

test("getClientIp falls back to the first x-forwarded-for entry", () => {
  const req = new Request("http://localhost", {
    headers: { "x-forwarded-for": "2.2.2.2, 3.3.3.3" },
  });
  assert.equal(getClientIp(req), "2.2.2.2");
});

test("getClientIp returns 'unknown' when no proxy headers are present", () => {
  const req = new Request("http://localhost");
  assert.equal(getClientIp(req), "unknown");
});
