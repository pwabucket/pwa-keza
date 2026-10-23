import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import BIP32Factory, { type BIP32Interface } from "bip32";
import { Buffer } from "buffer";

import type { UtxoChain } from "./networks";

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

/** Root key of a BIP39 seed for a chain */
export function getRootKey(seed: Uint8Array, chain: UtxoChain) {
  return bip32.fromSeed(Buffer.from(seed), chain.network);
}

/** Derives the first receiving account of an address type: m/purpose'/coin'/0'/0/0 */
export function deriveUtxoAccount(
  root: BIP32Interface,
  chain: UtxoChain,
  type: AddressType,
): UtxoAccount {
  const path = `m/${PURPOSES[type]}'/${chain.coinType}'/0'/0/0`;
  const key = root.derivePath(path);

  return {
    address: getAddress(key, type, chain)!,
    publicKey: Buffer.from(key.publicKey).toString("hex"),
    wif: key.toWIF(),
  };
}
