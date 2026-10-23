import bs58 from "bs58";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";

import type { WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { SolanaWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveEd25519Seed } from "../slip10";
import { presets } from "./presets";

/** Solana account of a phrase at a path, as Phantom derives it by default */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const key = await Keypair.fromSeed(await deriveEd25519Seed(seed, path));

  return {
    [SolanaWallet.MNEMONIC]: mnemonic,
    [SolanaWallet.ADDRESS]: key.publicKey.toBase58(),
    [SolanaWallet.PRIVATE_KEY]: bs58.encode(key.secretKey),
    [SolanaWallet.SECRET_KEY]: Buffer.from(key.secretKey).toString("hex"),
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);
