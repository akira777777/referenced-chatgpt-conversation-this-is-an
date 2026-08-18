/**
 * Admin authentication helper.
 * Verifies Bearer token against ADMIN_SECRET env var.
 * Usage: if (!isAdminAuthorized(request)) return unauthorizedResponse();
 */

export function isAdminAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false; // must be set in production

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return token === secret;
}

export function unauthorizedResponse(): Response {
  return Response.json(
    { error: "Unauthorized" },
    {
      status: 401,
      headers: { "WWW-Authenticate": 'Bearer realm="RE:Art Admin"' },
    }
  );
}
