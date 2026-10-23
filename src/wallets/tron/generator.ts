import { SigningKey, getBytes, hexlify, randomBytes } from "ethers";
import { utils } from "tronweb";

import type { VanityGenerator, WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { TronWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveHDKey } from "../hdKey";
import { presets } from "./presets";

/** Tron account of a phrase at a path, in the formats TronWeb uses */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const privateKey = hexlify(deriveHDKey(seed, path).privateKey!);

  return {
    [TronWallet.ADDRESS]: utils.crypto.pkToAddress(privateKey.slice(2)),
    /* Uncompressed, as TronWeb reports it */
    [TronWallet.PUBLIC_KEY]: SigningKey.computePublicKey(privateKey),
    [TronWallet.PRIVATE_KEY]: privateKey,
    [TronWallet.PHRASE]: mnemonic,
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);

/** Random key whose row is built only if its address is wanted */
export const vanity: VanityGenerator = async () => {
  const signingKey = new SigningKey(randomBytes(32));
  const address = utils.crypto.getBase58CheckAddress(
    utils.crypto.computeAddress(getBytes(signingKey.publicKey)),
  );

  return {
    address,
    toRow: async () => ({
      [TronWallet.ADDRESS]: address,
      [TronWallet.PUBLIC_KEY]: signingKey.publicKey,
      [TronWallet.PRIVATE_KEY]: signingKey.privateKey,
      /* Vanity keys are random, so there is no phrase */
      [TronWallet.PHRASE]: "",
    }),
  };
};
