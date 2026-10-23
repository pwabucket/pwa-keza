import { Buffer } from "buffer";
import { deriveAddress } from "ripple-keypairs";

import type { WalletDeriver } from "../../types/wallet";
import { DERIVATION_PATH_FIELD } from "../fields";
import { XRPWallet } from "./fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { deriveHDKey } from "../hdKey";
import { presets } from "./presets";

const toUpperHex = (bytes: Uint8Array) =>
  Buffer.from(bytes).toString("hex").toUpperCase();

/** XRP account of a phrase at a path, in the formats xrpl.js uses */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const key = deriveHDKey(seed, path);
  const publicKey = toUpperHex(key.publicKey!);

  return {
    [XRPWallet.MNEMONIC]: mnemonic,
    [XRPWallet.ADDRESS]: deriveAddress(publicKey),
    [XRPWallet.PUBLIC_KEY]: publicKey,
    /* xrpl.js prefixes secp256k1 private keys with 00 */
    [XRPWallet.PRIVATE_KEY]: `00${toUpperHex(key.privateKey!)}`,
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);
