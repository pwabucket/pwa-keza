import * as bip39 from "bip39";
import { Buffer } from "buffer";
import { HDKey } from "@scure/bip32";
import { deriveAddress } from "ripple-keypairs";

import type { WalletResult } from "../../types/wallet";
import { XRPWallet } from "./fields";

export type XRPWalletResult = WalletResult<typeof XRPWallet>;

/** Default XRPL path, as used by xrpl.js Wallet.fromMnemonic and Ledger */
const XRP_PATH = "m/44'/144'/0'/0/0";

const toUpperHex = (bytes: Uint8Array) =>
  Buffer.from(bytes).toString("hex").toUpperCase();

/** XRP account of a mnemonic, in the formats xrpl.js uses */
export async function deriveXRPWallet(
  mnemonic: string,
): Promise<XRPWalletResult> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const key = HDKey.fromMasterSeed(seed).derive(XRP_PATH);
  const publicKey = toUpperHex(key.publicKey!);

  return {
    [XRPWallet.MNEMONIC]: mnemonic,
    [XRPWallet.ADDRESS]: deriveAddress(publicKey),
    [XRPWallet.PUBLIC_KEY]: publicKey,
    /* xrpl.js prefixes secp256k1 private keys with 00 */
    [XRPWallet.PRIVATE_KEY]: `00${toUpperHex(key.privateKey!)}`,
  };
}

export default function generateXRPWallet() {
  return deriveXRPWallet(bip39.generateMnemonic());
}
