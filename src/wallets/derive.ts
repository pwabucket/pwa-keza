import * as bip39 from "bip39";

import type { WalletDeriver, WalletGenerator } from "../types/wallet";

/** Which phrase format a module derives from */
export const MnemonicType = {
  BIP39: "bip39",
  /** TON's own 24-word phrases, which aren't BIP39 */
  TON: "ton",
} as const;

export type MnemonicType = (typeof MnemonicType)[keyof typeof MnemonicType];

/** Preset id for a path template the user typed in */
export const CUSTOM_PRESET_ID = "custom";

/** A derivation path: m followed by indices, each optionally hardened */
const PATH_PATTERN = /^m(\/\d+'?)+$/;

/** Largest BIP32 index before the hardened range */
const MAX_INDEX = 2 ** 31 - 1;

/** Fills {name} placeholders; unknown ones are left as they are */
export function resolvePath(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in values ? String(values[name]) : placeholder,
  );
}

/** Checks a fully resolved derivation path */
export function isValidPath(path: string) {
  return (
    PATH_PATTERN.test(path) &&
    path
      .slice(2)
      .split("/")
      .every((segment) => parseInt(segment, 10) <= MAX_INDEX)
  );
}

/** Fills {i} in a path template and checks the result */
export function resolveIndexPath(pathTemplate: string, index: number) {
  const path = resolvePath(pathTemplate, { i: index });

  if (!isValidPath(path)) {
    throw new Error(`Invalid derivation path: ${path}`);
  }

  return path;
}

/** Lowercases a phrase and collapses its whitespace */
export function normalizeMnemonic(mnemonic: string) {
  return mnemonic.normalize("NFKD").trim().toLowerCase().split(/\s+/).join(" ");
}

/**
 * Builds a generator that makes a new BIP39 phrase and derives its first
 * account at the given path template.
 */
export function createBip39Generator(
  derive: WalletDeriver,
  pathTemplate: string,
): WalletGenerator {
  return async ({ testnet }) => {
    const mnemonic = bip39.generateMnemonic();

    return derive({
      mnemonic,
      seed: await bip39.mnemonicToSeed(mnemonic),
      index: 0,
      pathTemplate,
      testnet,
    });
  };
}
