import { Low } from "lowdb";
import { JSONFile } from "lowdb/node"
import type { User } from "./user";

type ViewerRecord = {
    count: number;
    timestamp: number;
}

type Schema = {
    users: User[]
    viewer_history: ViewerRecord[],
}

const adapter = new JSONFile<Schema>('db.json');
const defaultData: Schema = {users: [],viewer_history: []};
export const db = new Low<Schema>(adapter,defaultData);

