import { FieldKind, type WalletField, mnemonicPattern } from "../fields";

export const CosmosWallet = {
  MNEMONIC: "Mnemonic Phrase",
  COSMOS_ADDRESS: "Cosmos Hub Address",
  OSMOSIS_ADDRESS: "Osmosis Address",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key",
} as const;

/** Bech32 data characters */
const BECH32 = "[02-9ac-hj-np-z]";

export const fields: WalletField[] = [
  {
    label: CosmosWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: CosmosWallet.COSMOS_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^cosmos1${BECH32}{38}$`),
  },
  {
    label: CosmosWallet.OSMOSIS_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^osmo1${BECH32}{38}$`),
  },
  {
    label: CosmosWallet.PUBLIC_KEY,
    kind: FieldKind.PUBLIC_KEY,
    pattern: /^0[23][0-9a-f]{64}$/,
  },
  {
    label: CosmosWallet.PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^[0-9a-f]{64}$/,
  },
];
