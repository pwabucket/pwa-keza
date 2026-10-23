import { createStore } from "zustand/vanilla";

import type { WalletModule, WalletRow } from "../types/wallet";

/** Where the unsaved-wallets guard is in its cycle */
export const GuardStatus = {
  /** No guard history entry has been pushed */
  IDLE: "idle",
  /** A guard entry was pushed for the current wallets */
  ARMED: "armed",
  /** The user chose to leave; the page is navigating away */
  LEAVING: "leaving",
} as const;

export type GuardStatus = (typeof GuardStatus)[keyof typeof GuardStatus];

export interface SessionState {
  /** Module the rows belong to, null for a backup that wasn't recognised */
  module: WalletModule | null;
  rows: WalletRow[];
  /** Values wrap in full instead of being truncated */
  expanded: boolean;
  /** Rows were generated here and haven't been exported yet */
  unsaved: boolean;
  guard: GuardStatus;

  /** Replaces the rows; generated rows are unsaved, restored ones aren't */
  setRows: (rows: WalletRow[], unsaved: boolean) => void;
  setModule: (module: WalletModule | null) => void;
  toggleExpanded: () => void;
  markSaved: () => void;
  setGuard: (guard: GuardStatus) => void;
}

/** One session per page, so Generator and Restore never share rows */
export function createSessionStore(module: WalletModule | null) {
  return createStore<SessionState>()((set) => ({
    module,
    rows: [],
    expanded: module?.defaultExpanded ?? false,
    unsaved: false,
    guard: GuardStatus.IDLE,

    setRows: (rows, unsaved) => set({ rows, unsaved }),
    setModule: (module) =>
      set({ module, expanded: module?.defaultExpanded ?? false }),
    toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
    markSaved: () => set({ unsaved: false }),
    setGuard: (guard) => set({ guard }),
  }));
}

export type SessionStore = ReturnType<typeof createSessionStore>;
