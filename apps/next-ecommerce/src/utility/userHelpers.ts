import { getCurrentUser } from '@/lib/session';

/**
 * Finds the user ID from the client session or server session.
 *
 * @param {string} userId - The user ID from the client.
 * @returns {string} The user ID.
 */
export async function findUserId(userId: string | undefined) {
  const userFromServerSession = await getCurrentUser(); // Await the promise
  if (userFromServerSession?.id) {
    if (userId === userFromServerSession.id) {
      console.info(
        'findUserId : User ID obtained from session and client matched',
      );
      return userFromServerSession.id;
    } else {
      console.error(
        'findUserId : User ID from client and server session do not match, hence returning userId from server',
      );
      return userFromServerSession.id;
    }
  } else {
    console.error('findUserId : No ID from server session found');
    return null;
  }
}
