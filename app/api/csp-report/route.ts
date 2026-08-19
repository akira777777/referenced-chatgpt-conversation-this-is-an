/**
 * CSP violation report sink.
 *
 * Browsers POST a `application/csp-report` (or `application/reports+json`)
 * payload here whenever a directive in our Report-Only CSP would have
 * been violated. We accept anything, log a single line, and return 204
 * so the browser stops retrying.
 *
 * This is intentionally minimal: the report payload can be large and
 * attacker-controlled, so we extract only the fields we need and cap
 * the body size.
 */
import { z } from "zod";

const MAX_BODY_BYTES = 32 * 1024; // 32 KB is plenty for any real report

// Two report shapes are in use: the legacy csp-report object and the
// newer Reporting API reports+json. We accept either.
const cspReportSchema = z
  .object({
    "csp-report": z
      .object({
        "violated-directive": z.string().optional(),
        "blocked-uri": z.string().optional(),
        "document-uri": z.string().optional(),
        "original-policy": z.string().optional(),
        "source-file": z.string().optional(),
        "line-number": z.number().optional(),
        "column-number": z.number().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export async function POST(request: Request) {
  // Reject oversize bodies up front so an attacker can't OOM the worker.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 });
    }
    const parsed = cspReportSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      const r = parsed.data["csp-report"];
      // Single-line log so production log volumes stay sane.
      console.warn(
        "[csp-report]",
        r?.["violated-directive"] ?? "(unknown directive)",
        r?.["blocked-uri"] ?? "",
        r?.["document-uri"] ?? ""
      );
    }
  } catch {
    // Don't leak parser errors to the client; just drop the report.
  }
  return new Response(null, { status: 204 });
}
