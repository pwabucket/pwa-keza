import type { DerivePreset } from "../../types/wallet";

/** BIP44-style presets; {purpose} picks BIP44/49/84/86 per address type */
export const UTXO_PRESETS: DerivePreset[] = [
  {
    id: "address-index",
    title: "Addresses of the first account",
    path: "m/{purpose}'/{coin}'/0'/0/{i}",
  },
  {
    id: "account-index",
    title: "First address of each account",
    path: "m/{purpose}'/{coin}'/{i}'/0/0",
  },
];
