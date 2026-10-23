import { parseUrl } from "./url";

/** Parcel URL from Environment Variables, null when it isn't configured */
export const PARCEL_URL = parseUrl(import.meta.env.VITE_PARCEL_URL);
