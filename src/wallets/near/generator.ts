import * as bip39 from "bip39";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { keyPairFromSeed } from "@ton/crypto";

import type { WalletResult } from "../../types/wallet";
import { NEARWallet } from "./fields";
import { deriveEd25519Seed } from "../slip10";

export type NEARWalletResult = WalletResult<typeof NEARWallet>;

/** Path used by NEAR's seed phrase tooling, MyNearWallet and Meteor */
const NEAR_PATH = "m/44'/397'/0'";

/** NEAR implicit account of a mnemonic, with keys in NEAR's ed25519: form */
export async function deriveNEARWallet(
  mnemonic: string,
): Promise<NEARWalletResult> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keyPair = keyPairFromSeed(
    Buffer.from(await deriveEd25519Seed(seed, NEAR_PATH)),
  );

  return {
    [NEARWallet.MNEMONIC]: mnemonic,
    [NEARWallet.ACCOUNT_ID]: keyPair.publicKey.toString("hex"),
    [NEARWallet.PUBLIC_KEY]: `ed25519:${bs58.encode(keyPair.publicKey)}`,
    [NEARWallet.SECRET_KEY]: `ed25519:${bs58.encode(keyPair.secretKey)}`,
  };
}

export default function generateNEARWallet() {
  return deriveNEARWallet(bip39.generateMnemonic());
}
