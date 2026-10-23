import { Ed25519PrivateKey } from "@aptos-labs/ts-sdk/crypto";

import type { VanityGenerator, WalletDeriver } from "../../types/wallet";
import { AptosWallet } from "./fields";
import { DERIVATION_PATH_FIELD } from "../fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveEd25519Seed } from "../slip10";
import { presets } from "./presets";

/** Aptos account of a phrase at a path, with the AIP-80 key wallets import */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const privateKey = new Ed25519PrivateKey(await deriveEd25519Seed(seed, path));
  const publicKey = privateKey.publicKey();

  return {
    [AptosWallet.MNEMONIC]: mnemonic,
    [AptosWallet.ADDRESS]: publicKey.authKey().derivedAddress().toStringLong(),
    [AptosWallet.PUBLIC_KEY]: publicKey.toString(),
    [AptosWallet.PRIVATE_KEY]: privateKey.toAIP80String(),
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);

/** Random key whose row is built only if its address is wanted */
export const vanity: VanityGenerator = async () => {
  const privateKey = Ed25519PrivateKey.generate();
  const publicKey = privateKey.publicKey();
  const address = publicKey.authKey().derivedAddress().toStringLong();

  return {
    address,
    toRow: async () => ({
      /* Vanity keys are random, so there is no phrase */
      [AptosWallet.MNEMONIC]: "",
      [AptosWallet.ADDRESS]: address,
      [AptosWallet.PUBLIC_KEY]: publicKey.toString(),
      [AptosWallet.PRIVATE_KEY]: privateKey.toAIP80String(),
    }),
  };
};
