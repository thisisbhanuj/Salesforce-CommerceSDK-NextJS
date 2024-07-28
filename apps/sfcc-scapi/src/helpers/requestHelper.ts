"use server";

/**
 * Get session ID from request.
 * @param request - The incoming request.
 * @returns The session ID.
 * @throws Error if the session ID is missing.
 **/
export async function getSessionIDfromRequest(
  request: Request,
): Promise<string> {
  const sessionId = request.headers.get("session_id")!;
  return sessionId;
}
