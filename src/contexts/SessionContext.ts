import { createContext } from "react";

import type { SessionStore } from "../stores/session";

export const SessionContext = createContext<SessionStore | null>(null);
