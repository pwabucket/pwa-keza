import type { DerivePreset } from "../../types/wallet";

export const presets: DerivePreset[] = [
  {
    id: "metamask",
    title: "MetaMask, Trust, Rabby",
    path: "m/44'/60'/0'/0/{i}",
  },
  {
    id: "ledger-live",
    title: "Ledger Live",
    path: "m/44'/60'/{i}'/0/0",
  },
];
