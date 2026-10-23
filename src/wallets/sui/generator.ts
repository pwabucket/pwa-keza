import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import type { VanityGenerator, WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { SuiWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { presets } from "./presets";

/** Sui account of a phrase at a path, with the bech32 key wallets import */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const keypair = Ed25519Keypair.deriveKeypairFromSeed(seed, path);

  return {
    [SuiWallet.MNEMONIC]: mnemonic,
    [SuiWallet.ADDRESS]: keypair.toSuiAddress(),
    [SuiWallet.PRIVATE_KEY]: keypair.getSecretKey(),
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);

/** Random key whose row is built only if its address is wanted */
export const vanity: VanityGenerator = async () => {
  const keypair = Ed25519Keypair.generate();
  const address = keypair.toSuiAddress();

  return {
    address,
    toRow: async () => ({
      /* Vanity keys are random, so there is no phrase */
      [SuiWallet.MNEMONIC]: "",
      [SuiWallet.ADDRESS]: address,
      [SuiWallet.PRIVATE_KEY]: keypair.getSecretKey(),
    }),
  };
};
