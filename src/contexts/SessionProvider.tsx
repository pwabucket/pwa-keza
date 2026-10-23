import { useState } from "react";

import { SessionContext } from "./SessionContext";
import { createSessionStore } from "../stores/session";
import type { WalletModule } from "../types/wallet";

/** Gives the page its own wallet session */
export default function SessionProvider({
  module,
  children,
}: {
  module: WalletModule | null;
  children: React.ReactNode;
}) {
  const [store] = useState(() => createSessionStore(module));

  return (
    <SessionContext.Provider value={store}>{children}</SessionContext.Provider>
  );
}
