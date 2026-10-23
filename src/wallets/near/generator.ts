import bs58 from "bs58";
import { Buffer } from "buffer";
import { keyPairFromSeed } from "@ton/crypto";

import type { WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { NEARWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveEd25519Seed } from "../slip10";
import { presets } from "./presets";

/** NEAR implicit account of a phrase, with keys in NEAR's ed25519: form */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const keyPair = keyPairFromSeed(
    Buffer.from(await deriveEd25519Seed(seed, path)),
  );

  return {
    [NEARWallet.MNEMONIC]: mnemonic,
    [NEARWallet.ACCOUNT_ID]: keyPair.publicKey.toString("hex"),
    [NEARWallet.PUBLIC_KEY]: `ed25519:${bs58.encode(keyPair.publicKey)}`,
    [NEARWallet.SECRET_KEY]: `ed25519:${bs58.encode(keyPair.secretKey)}`,
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);
