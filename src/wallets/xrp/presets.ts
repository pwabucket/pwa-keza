import type { DerivePreset } from "../../types/wallet";

export const presets: DerivePreset[] = [
  {
    id: "xrpl",
    title: "Xaman, xrpl.js",
    path: "m/44'/144'/0'/0/{i}",
  },
  {
    id: "ledger-live",
    title: "Ledger Live",
    path: "m/44'/144'/{i}'/0/0",
  },
];
