import { SigningKey, computeAddress, hexlify, randomBytes } from "ethers";

import type { VanityGenerator, WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { EVMWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveHDKey } from "../hdKey";
import { presets } from "./presets";

/** EVM account of a phrase at a path */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const key = deriveHDKey(seed, path);
  const publicKey = hexlify(key.publicKey!);

  return {
    [EVMWallet.ADDRESS]: computeAddress(publicKey),
    [EVMWallet.PUBLIC_KEY]: publicKey,
    [EVMWallet.PRIVATE_KEY]: hexlify(key.privateKey!),
    [EVMWallet.PHRASE]: mnemonic,
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);

/** Random key whose row is built only if its address is wanted */
export const vanity: VanityGenerator = async () => {
  const signingKey = new SigningKey(randomBytes(32));
  const address = computeAddress(signingKey.publicKey);

  return {
    address,
    toRow: async () => ({
      [EVMWallet.ADDRESS]: address,
      [EVMWallet.PUBLIC_KEY]: signingKey.compressedPublicKey,
      [EVMWallet.PRIVATE_KEY]: signingKey.privateKey,
      /* Vanity keys are random, so there is no phrase */
      [EVMWallet.PHRASE]: "",
    }),
  };
};
