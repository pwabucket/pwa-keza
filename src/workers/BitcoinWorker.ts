import "../lib/polyfill.ts";

import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import BIP32Factory from "bip32";
import { Buffer } from "buffer";

import { createWalletWorker } from "./createWalletWorker";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

createWalletWorker(async () => {
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
    ["Mnemonic Phrase"]: mnemonic,
    ["Taproot Address (P2TR)"]: taprootAddress!,
    ["Nested SegWit Address (P2SH-P2WPKH)"]: nestedAddress!,
    ["Native SegWit Address (P2WPKH)"]: segwitAddress!,
    ["Legacy Address (P2PKH)"]: legacyAddress!,
    ["Public Key"]: Buffer.from(taproot.publicKey).toString("hex"),
    ["Private Key (WIF)"]: taproot.toWIF(),
  };
});
