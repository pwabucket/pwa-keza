import {
  useBeforeUnload,
  useLocationState,
  useNavigateBack,
} from "@pwabucket/pwa-router";
import { useCallback, useEffect } from "react";

import useSession from "./useSession";
import useSessionStore from "./useSessionStore";
import { GuardStatus } from "../stores/session";

/** The guard entry is dropped after a reload, along with the wallets */
const GUARD_STATE_OPTIONS = { persist: false };

/**
 * Asks before leaving the page while wallets haven't been exported.
 * A guard history entry sits on top of the page; when back removes it, the
 * user confirms leaving or stays, and staying puts the guard back.
 */
export default function useUnsavedGuard() {
  const store = useSessionStore();
  const hasUnsaved = useSession(
    (state) => state.unsaved && state.rows.length > 0,
  );
  const guard = useSession((state) => state.guard);
  const setGuard = useSession((state) => state.setGuard);
  const [guarded, setGuarded] = useLocationState(
    "unsaved-guard",
    false,
    GUARD_STATE_OPTIONS,
  );
  const navigateBack = useNavigateBack();

  const leave = useCallback(() => {
    setGuard(GuardStatus.LEAVING);
    navigateBack();
  }, [setGuard, navigateBack]);

  const stay = useCallback(() => setGuarded(true), [setGuarded]);

  useEffect(() => {
    if (guarded || guard === GuardStatus.LEAVING) return;

    if (guard === GuardStatus.IDLE) {
      /* New unsaved wallets get a guard entry */
      if (hasUnsaved) {
        setGuard(GuardStatus.ARMED);
        setGuarded(true);
      }
    } else if (!hasUnsaved) {
      /* Back removed the guard after the wallets were saved: keep going */
      leave();
    }
  }, [guarded, guard, hasUnsaved, setGuard, setGuarded, leave]);

  /* Reloading or closing the tab gets the browser's own prompt */
  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        const { unsaved, rows } = store.getState();

        if (unsaved && rows.length > 0) {
          event.preventDefault();
        }
      },
      [store],
    ),
  );

  /* Back removed the guard while wallets are still unsaved */
  const isPrompting = guard === GuardStatus.ARMED && !guarded && hasUnsaved;

  return { isPrompting, stay, leave };
}
