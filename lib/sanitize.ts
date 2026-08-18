/**
 * Minimal server-side sanitization helpers.
 * Strips HTML tags and trims whitespace.
 */

/** Strip all HTML/script tags and trim */
export function sanitizeText(input: string, maxLen = 500): string {
  return input
    .replace(/<[^>]*>/g, "")  // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLen);
}

/** Sanitize an object's string fields */
export function sanitizeRecord<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === "string" ? sanitizeText(v) : v,
    ])
  ) as T;
}
