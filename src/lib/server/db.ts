import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import type { SoundFile } from './soundboard';
import type { User } from '$lib/types/user';

type Schema = {
	users: User[];
	sounds: SoundFile[];
};

const adapter = new JSONFile<Schema>('data/db.json');
const defaultData: Schema = { users: [], sounds: [] };
export const db = new Low<Schema>(adapter, defaultData);
