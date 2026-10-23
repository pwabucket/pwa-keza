import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import BIP32Factory, { type BIP32Interface } from "bip32";
import { Buffer } from "buffer";

import type { UtxoChain } from "./networks";
import { isValidPath, resolvePath } from "../derive";

const bip32 = BIP32Factory(ecc);
bitcoin.initEccLib(ecc);

export const AddressType = {
  TAPROOT: "p2tr",
  NESTED_SEGWIT: "p2sh-p2wpkh",
  NATIVE_SEGWIT: "p2wpkh",
  LEGACY: "p2pkh",
} as const;

export type AddressType = (typeof AddressType)[keyof typeof AddressType];

/** BIP purpose for each address type: BIP86, BIP49, BIP84 and BIP44 */
const PURPOSES: Record<AddressType, number> = {
  [AddressType.TAPROOT]: 86,
  [AddressType.NESTED_SEGWIT]: 49,
  [AddressType.NATIVE_SEGWIT]: 84,
  [AddressType.LEGACY]: 44,
};

export interface UtxoAccount {
  address: string;
  path: string;
  /** Compressed public key, hex */
  publicKey: string;
  wif: string;
}

/** Address of a key for one address type */
function getAddress(key: BIP32Interface, type: AddressType, chain: UtxoChain) {
  const pubkey = Buffer.from(key.publicKey);
  const { network } = chain;

  switch (type) {
    case AddressType.TAPROOT:
      return bitcoin.payments.p2tr({
        internalPubkey: pubkey.subarray(1, 33),
        network,
      }).address;
    case AddressType.NESTED_SEGWIT:
      return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey, network }),
        network,
      }).address;
    case AddressType.NATIVE_SEGWIT:
      return bitcoin.payments.p2wpkh({ pubkey, network }).address;
    case AddressType.LEGACY:
      return bitcoin.payments.p2pkh({ pubkey, network }).address;
  }
}

/*
 * Root and parent keys by seed, then by chain and path. A derive job reuses
 * one seed object for every account, so accounts that differ only in their
 * last index share all the parent derivation. Entries go away with the seed.
 */
const cachedKeys = new WeakMap<Uint8Array, Map<string, BIP32Interface>>();

function getCachedKey(
  seed: Uint8Array,
  cacheKey: string,
  create: () => BIP32Interface,
) {
  let keys = cachedKeys.get(seed);

  if (!keys) {
    keys = new Map();
    cachedKeys.set(seed, keys);
  }

  let key = keys.get(cacheKey);

  if (!key) {
    key = create();
    keys.set(cacheKey, key);
  }

  return key;
}

/** Root key of a BIP39 seed for a chain */
export function getRootKey(seed: Uint8Array, chain: UtxoChain) {
  return getCachedKey(seed, `${chain.coinType}:m`, () =>
    bip32.fromSeed(Buffer.from(seed), chain.network),
  );
}

/** Key at a resolved path, reusing its parent from earlier calls */
function deriveCachedPath(seed: Uint8Array, chain: UtxoChain, path: string) {
  const cut = path.lastIndexOf("/");
  const parentPath = path.slice(0, cut);
  const parent = getCachedKey(seed, `${chain.coinType}:${parentPath}`, () =>
    getRootKey(seed, chain).derivePath(parentPath),
  );

  return parent.derivePath(path.slice(cut + 1));
}

/**
 * Derives an account of an address type. The template may use {purpose},
 * {coin} and {i}, e.g. m/{purpose}'/{coin}'/0'/0/{i}.
 */
export function deriveUtxoAccount(
  seed: Uint8Array,
  chain: UtxoChain,
  type: AddressType,
  pathTemplate: string,
  index: number,
): UtxoAccount {
  const path = resolvePath(pathTemplate, {
    purpose: PURPOSES[type],
    coin: chain.coinType,
    i: index,
  });

  if (!isValidPath(path)) {
    throw new Error(`Invalid derivation path: ${path}`);
  }

  const key = deriveCachedPath(seed, chain, path);

  return {
    address: getAddress(key, type, chain)!,
    path,
    publicKey: Buffer.from(key.publicKey).toString("hex"),
    wif: key.toWIF(),
  };
}
