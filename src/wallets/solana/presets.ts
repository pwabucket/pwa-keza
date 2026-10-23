import type { DerivePreset } from "../../types/wallet";

export const presets: DerivePreset[] = [
  {
    id: "phantom",
    title: "Phantom, Solflare, Backpack",
    path: "m/44'/501'/{i}'/0'",
  },
  {
    id: "ledger",
    title: "Ledger, Solana CLI",
    path: "m/44'/501'/{i}'",
  },
];
