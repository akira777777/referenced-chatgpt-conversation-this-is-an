import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/", options = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", ...(options.headers ?? {}) },
      ...options,
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the homepage with correct metadata and brand details", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /REFORM/i);
  assert.match(html, /LocalBusiness/);
  assert.match(html, /\+420 737 500 587/);
  assert.match(html, /fear75412@gmail\.com/);
  assert.match(html, /Biskupcova 31/);
  assert.match(html, /t\.me\/liltrafficRUS/);
});

test("server-renders the repair booking page", async () => {
  const response = await render("/repair");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /REFORM/i);
  assert.match(html, /Biskupcova 31/);
});

test("server-renders the pricing directory page", async () => {
  const response = await render("/prices");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Price on request|Cena na dotaz|Цена по запросу/i);
});

test("server-renders the contact page with location and Telegram information", async () => {
  const response = await render("/contact");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Biskupcova 31, Praha 3/);
  assert.match(html, /fear75412@gmail\.com/);
  assert.match(html, /@liltrafficRUS/);
  assert.match(html, /t\.me\/liltrafficRUS/);
});

test("server-renders the business and fleet service page", async () => {
  const response = await render("/business");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /B2B|business|fleet/i);
});

test("server-renders the FAQ page with FAQPage schema", async () => {
  const response = await render("/faq");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Frequently asked questions|Často kladené otázky/i);
  assert.match(html, /FAQPage/);
});

test("server-renders dynamic brand repair pages", async () => {
  const response = await render("/repair/apple");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Apple/i);
  assert.match(html, /iPhone/i);
});

test("server-renders repair tracking detail page", async () => {
  const response = await render("/track/REP-240182");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /REP-240182/);
  assert.match(html, /t\.me\/liltrafficRUS/);
});

test("processes order API requests", async () => {
  // Valid request
  const validResponse = await render("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      brand: "Apple",
      model: "iPhone 15 Pro",
      repairs: ["Display replacement"],
      estimatedPrice: 0,
      method: "Service center",
      slot: "Tomorrow · 10:30",
      customer: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+420737000000",
      },
    }),
  });

  assert.equal(validResponse.status, 201);
  const validData = await validResponse.json();
  assert.match(validData.orderId, /^REP-\d+/);
  assert.equal(validData.status, "REQUESTED");

  // Invalid request
  const invalidResponse = await render("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      brand: "Apple",
      // missing required fields
    }),
  });

  assert.equal(invalidResponse.status, 400);
});
