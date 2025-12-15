import { Activities } from "$lib/features/activities/activities.svelte";
import { createContext } from "svelte";

export class App {
  activities: Activities;
  constructor() {
    console.log("[APP] Starting app...")
    this.activities = new Activities(this);
    console.log("[APP] Started")
  }
}

export const [getApp, initApp] = createContext<App>();
