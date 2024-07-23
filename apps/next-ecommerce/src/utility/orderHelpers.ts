/**
 * Generates a unique cart ID based on the current timestamp.
 * @returns {string} The generated cart ID.
 */
export function createOrderId(): string {
  const orderNumberPrefix = 'ORDER';
  return `${orderNumberPrefix}-${new Date().toISOString().replace(/[-:.]/g, '')}`;
}
