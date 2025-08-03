import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import BIP32Factory from "bip32";
import { Buffer } from "buffer";

import type { WalletResult } from "../types/wallet";

export const BitcoinWallet = {
  MNEMONIC: "Mnemonic Phrase",
  TAPROOT_ADDRESS: "Taproot Address (P2TR)",
  NESTED_ADDRESS: "Nested SegWit Address (P2SH-P2WPKH)",
  NATIVE_ADDRESS: "Native SegWit Address (P2WPKH)",
  LEGACY_ADDRESS: "Legacy Address (P2PKH)",
  PUBLIC_KEY: "Public Key",
  PRIVATE_KEY: "Private Key (WIF)",
} as const;

export type BitcoinWalletResult = WalletResult<typeof BitcoinWallet>;
export type BitcoinWalletGeneratorArguments = Parameters<
  typeof generateBitcoinWallet
>;

// Initialize BIP32 with the ecc library
export const bip32 = BIP32Factory(ecc);

// Initialize bitcoinjs-lib with the ecc library
bitcoin.initEccLib(ecc);

export async function generateBitcoinWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);

  // BIP86 (Taproot P2TR) - m/86'/0'/0'/0/0
  const taproot = root.derivePath(`m/86'/0'/0'/0/0`);
  const taprootAddress = bitcoin.payments.p2tr({
    internalPubkey: Buffer.from(taproot.publicKey.slice(1, 33)),
    network: bitcoin.networks.bitcoin,
  }).address;

  // BIP49 (Nested SegWit P2SH-P2WPKH) - m/49'/0'/0'/0/0
  const nested = root.derivePath(`m/49'/0'/0'/0/0`);
  const nestedPayment = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(nested.publicKey),
      network: bitcoin.networks.bitcoin,
    }),
    network: bitcoin.networks.bitcoin,
  });
  const nestedAddress = nestedPayment.address;

  // BIP84 (Native SegWit P2WPKH) - m/84'/0'/0'/0/0
  const segwit = root.derivePath(`m/84'/0'/0'/0/0`);
  const segwitAddress = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(segwit.publicKey),
    network: bitcoin.networks.bitcoin,
  }).address;

  // BIP44 (Legacy P2PKH) - m/44'/0'/0'/0/0
  const legacy = root.derivePath(`m/44'/0'/0'/0/0`);
  const legacyAddress = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(legacy.publicKey),
    network: bitcoin.networks.bitcoin,
  }).address;

  return {
    [BitcoinWallet.MNEMONIC]: mnemonic,
    [BitcoinWallet.TAPROOT_ADDRESS]: taprootAddress!,
    [BitcoinWallet.NESTED_ADDRESS]: nestedAddress!,
    [BitcoinWallet.NATIVE_ADDRESS]: segwitAddress!,
    [BitcoinWallet.LEGACY_ADDRESS]: legacyAddress!,
    [BitcoinWallet.PUBLIC_KEY]: Buffer.from(taproot.publicKey).toString("hex"),
    [BitcoinWallet.PRIVATE_KEY]: taproot.toWIF(),
  };
}
