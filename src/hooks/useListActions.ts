import { useCallback } from "react";

import useSession from "./useSession";
import useSessionStore from "./useSessionStore";
import { copyToClipboard } from "../lib/clipboard";

/** Display toggles and bulk actions for the whole wallet list */
export default function useListActions() {
  const store = useSessionStore();
  const expanded = useSession((state) => state.expanded);
  const revealAll = useSession((state) => state.revealAll);
  const toggleExpanded = useSession((state) => state.toggleExpanded);
  const toggleRevealAll = useSession((state) => state.toggleRevealAll);

  /* Reads the rows on click, so the toolbar doesn't follow them */
  const copyAll = useCallback(
    () =>
      copyToClipboard(JSON.stringify(store.getState().rows, null, 2), {
        secret: true,
      }),
    [store],
  );

  return { expanded, revealAll, toggleExpanded, toggleRevealAll, copyAll };
}
