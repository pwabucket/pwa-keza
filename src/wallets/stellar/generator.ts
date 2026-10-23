import { Keypair } from "@stellar/stellar-sdk";

import type { VanityGenerator, WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { StellarWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveEd25519Seed } from "../slip10";
import { presets } from "./presets";

/** Stellar account of a phrase at a path, following SEP-0005 by default */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const key = Keypair.fromRawEd25519Seed(await deriveEd25519Seed(seed, path));

  return {
    [StellarWallet.MNEMONIC]: mnemonic,
    [StellarWallet.ADDRESS]: key.publicKey(),
    [StellarWallet.SECRET_KEY]: key.secret(),
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);

/** Random key whose row is built only if its address is wanted */
export const vanity: VanityGenerator = async () => {
  const key = Keypair.random();
  const address = key.publicKey();

  return {
    address,
    toRow: async () => ({
      [StellarWallet.ADDRESS]: address,
      [StellarWallet.SECRET_KEY]: key.secret(),
    }),
  };
};
