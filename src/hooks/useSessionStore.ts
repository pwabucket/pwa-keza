import { useContext } from "react";

import { SessionContext } from "../contexts/SessionContext";

/** The page's session store, for reading state in handlers without re-rendering */
export default function useSessionStore() {
  const store = useContext(SessionContext);

  if (!store) {
    throw new Error("useSessionStore must be used inside a SessionProvider");
  }

  return store;
}
