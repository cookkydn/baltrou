import type { User } from '$lib/types/user';

export async function getUserInfo(): Promise<User | null> {
  const res = await fetch('/api/auth/login');
  if (res.ok) {
    const user: User = await res.json();
    return user;
  }
  return null;
}
