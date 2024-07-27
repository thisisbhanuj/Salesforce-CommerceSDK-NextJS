/**
 * Generates a unique Session ID based on the current timestamp.
 * @returns {string} The generated Session ID.
 */
export function createSessionId(): string {
  const sessionPrefix = "session";
  return `${sessionPrefix}-${new Date().toISOString().replace(/[-:.]/g, "")}`;
}
