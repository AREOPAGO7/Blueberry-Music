import { cookies } from 'next/headers';
import { verifyToken } from '../lib/auth';

export function getAuthenticatedUser() {
  const token = cookies().get('token')?.value;

  if (!token) return null;

  return verifyToken(token);
}
