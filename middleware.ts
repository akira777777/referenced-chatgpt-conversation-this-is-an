/**
 * CSP nonce middleware.
 *
 * Runs on every non-static request (standalone server AND Cloudflare worker,
 * since vinext executes middleware in both deployment modes).
 *
 * Flow:
 *   1. Generate a fresh 128-bit nonce for THIS request.
 *   2. Build the enforced Content-Security-Policy with 'nonce-X'.
 *   3. Attach the CSP to the *request* headers — vinext's app router reads
 *      it (getScriptNonceFromHeaderSources in vinext/dist/server/csp.js) and
 *      stamps the nonce onto every inline/module <script> it emits.
 *   4. Attach the same CSP to the *response* headers so the browser
 *      enforces it.
 *   5. Expose the nonce as `x-csp-nonce` for server components that render
 *      their own inline scripts (app/layout.tsx theme bootstrap, JSON-LD).
 *
 * Reading headers() in the root layout forces every page to render
 * per-request, which is exactly what per-request nonces require — a
 * statically prerendered page could never match a fresh nonce.
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  buildCspHeaderValue,
  generateNonce,
  NONCE_REQUEST_HEADER,
} from "./lib/security-headers";

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCspHeaderValue(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NONCE_REQUEST_HEADER, nonce);
  // vinext looks for the nonce in content-security-policy (or the
  // report-only variant) on the incoming request headers.
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Skip static assets: they carry no HTML, need no nonce, and skipping
  // keeps them cacheable. Everything else (pages, API routes, RSC flights)
  // passes through the middleware.
  matcher: [
    "/((?!_next/static|_next/image|_vinext/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|icon|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|woff|woff2|txt|xml|map|json)).*)",
  ],
};
