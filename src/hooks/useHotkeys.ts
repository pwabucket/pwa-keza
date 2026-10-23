import { useEffect, useRef } from "react";

/** Single keys mapped to actions, e.g. { "/": focusSearch } */
export type Hotkeys = Record<string, () => void>;

/** True when the key press belongs to a field the user is typing in */
function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
  );
}

/**
 * Runs an action when its key is pressed outside of text fields and without
 * modifiers. Open dialogs keep their own keys.
 */
export default function useHotkeys(hotkeys: Hotkeys) {
  const hotkeysRef = useRef(hotkeys);

  useEffect(() => {
    hotkeysRef.current = hotkeys;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTyping(event.target)) return;
      if (document.querySelector("[role=dialog]")) return;

      const action = hotkeysRef.current[event.key];

      if (action) {
        event.preventDefault();
        action();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
