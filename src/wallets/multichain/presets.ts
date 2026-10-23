import type { DerivePreset } from "../../types/wallet";

/** Every chain uses its own default path with the same account index */
export const presets: DerivePreset[] = [
  {
    id: "account-index",
    title: "Default path of each chain",
    path: "{i}",
  },
];
