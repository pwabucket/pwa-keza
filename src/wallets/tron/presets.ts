import type { DerivePreset } from "../../types/wallet";

export const presets: DerivePreset[] = [
  {
    id: "tronlink",
    title: "TronLink, Trust",
    path: "m/44'/195'/0'/0/{i}",
  },
  {
    id: "ledger-live",
    title: "Ledger Live",
    path: "m/44'/195'/{i}'/0/0",
  },
];
