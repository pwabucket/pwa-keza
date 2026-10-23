import {
  BASE58,
  FieldKind,
  type WalletField,
  mnemonicPattern,
} from "../fields";

export const MultiChainWallet = {
  MNEMONIC: "Mnemonic Phrase",
  EVM_ADDRESS: "EVM Address",
  EVM_PRIVATE_KEY: "EVM Private Key",
  TRON_ADDRESS: "Tron Address",
  TRON_PRIVATE_KEY: "Tron Private Key",
  BITCOIN_ADDRESS: "Bitcoin Address (Native SegWit)",
  BITCOIN_PRIVATE_KEY: "Bitcoin Private Key (WIF)",
  SOLANA_ADDRESS: "Solana Address",
  SOLANA_PRIVATE_KEY: "Solana Private Key (Base58)",
  STELLAR_ADDRESS: "Stellar Address",
  STELLAR_SECRET_KEY: "Stellar Secret Key",
  ACCOUNT_INDEX: "Account Index",
} as const;

export const fields: WalletField[] = [
  {
    label: MultiChainWallet.MNEMONIC,
    kind: FieldKind.MNEMONIC,
    pattern: mnemonicPattern(12),
  },
  {
    label: MultiChainWallet.EVM_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^0x[0-9a-fA-F]{40}$/,
  },
  {
    label: MultiChainWallet.EVM_PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: MultiChainWallet.TRON_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^T${BASE58}{33}$`),
  },
  {
    label: MultiChainWallet.TRON_PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: /^0x[0-9a-f]{64}$/,
  },
  {
    label: MultiChainWallet.BITCOIN_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^bc1q[02-9ac-hj-np-z]{38}$/,
  },
  {
    label: MultiChainWallet.BITCOIN_PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: new RegExp(`^[KL]${BASE58}{51}$`),
  },
  {
    label: MultiChainWallet.SOLANA_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: new RegExp(`^${BASE58}{32,44}$`),
  },
  {
    label: MultiChainWallet.SOLANA_PRIVATE_KEY,
    kind: FieldKind.SECRET,
    pattern: new RegExp(`^${BASE58}{86,88}$`),
  },
  {
    label: MultiChainWallet.STELLAR_ADDRESS,
    kind: FieldKind.ADDRESS,
    pattern: /^G[A-Z2-7]{55}$/,
  },
  {
    label: MultiChainWallet.STELLAR_SECRET_KEY,
    kind: FieldKind.SECRET,
    pattern: /^S[A-Z2-7]{55}$/,
  },
  {
    label: MultiChainWallet.ACCOUNT_INDEX,
    kind: FieldKind.META,
    pattern: /^\d+$/,
  },
];
