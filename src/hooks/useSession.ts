import { useStore } from "zustand";

import useSessionStore from "./useSessionStore";
import type { SessionState } from "../stores/session";

/** Reads one slice of the page's wallet session */
export default function useSession<T>(selector: (state: SessionState) => T) {
  return useStore(useSessionStore(), selector);
}
