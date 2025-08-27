import PocketBase from "pocketbase";

export const pb = new PocketBase(import.meta.env.VITE_PB_URL ?? "http://127.0.0.1:8090");
// No auth for this assignment; add error handling if needed.