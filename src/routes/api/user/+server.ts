import { getUserFromCookies } from '$lib/server/auth';
import { editUserInfo } from '$lib/server/user.js';
import type { User } from '$lib/types/user.js';
import { error, json } from '@sveltejs/kit';

export async function PATCH({cookies, request}) {
  const user = await getUserFromCookies(cookies);
  if (!user) return error(401, 'You must be connected');
  const userModifications: Partial<User> = await request.json();
  const editedUser = await editUserInfo({...userModifications,id:user.id});
  return json(editedUser);
}