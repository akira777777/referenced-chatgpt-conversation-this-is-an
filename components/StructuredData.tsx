/**
 * Renders a JSON-LD <script> for structured data.
 *
 * Under the enforced Content-Security-Policy, inline scripts are only
 * allowed with a per-request nonce. Server components that use this
 * component must pass the nonce from headers().get("x-csp-nonce")
 * (see middleware.ts / app/layout.tsx). When nonce is omitted the script
 * still renders (useful for tests and static contexts) but would be
 * blocked by the browser under the enforced policy.
 */
export function StructuredData({
  data,
  nonce,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
  nonce?: string;
}) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
