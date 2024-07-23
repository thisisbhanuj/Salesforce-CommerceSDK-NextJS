import { getServerSession } from 'next-auth';
import { options } from './options';

export function getSession() {
  return getServerSession(options);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function getCurrentSession() {
  const session = await getSession();
  return session;
}

export async function isAuthenticatd() {
  const isAuthenticatd = await getCurrentUser().then((user) => !!user);
  return !!isAuthenticatd;
}
