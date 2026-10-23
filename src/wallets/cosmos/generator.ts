import * as bip39 from "bip39";
import {
  Secp256k1,
  Slip10,
  Slip10Curve,
  ripemd160,
  sha256,
  stringToPath,
} from "@cosmjs/crypto";
import { toBech32, toHex } from "@cosmjs/encoding";

import type { WalletResult } from "../../types/wallet";
import { CosmosWallet } from "./fields";

export type CosmosWalletResult = WalletResult<typeof CosmosWallet>;

/** Cosmos Hub path, shared by Osmosis and used by Keplr */
const COSMOS_PATH = stringToPath("m/44'/118'/0'/0/0");

/** Cosmos Hub and Osmosis addresses of a mnemonic, which share one key */
export async function deriveCosmosWallet(
  mnemonic: string,
): Promise<CosmosWalletResult> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const { privkey } = Slip10.derivePath(
    Slip10Curve.Secp256k1,
    seed,
    COSMOS_PATH,
  );
  const { pubkey } = await Secp256k1.makeKeypair(privkey);
  const publicKey = Secp256k1.compressPubkey(pubkey);
  const rawAddress = ripemd160(sha256(publicKey));

  return {
    [CosmosWallet.MNEMONIC]: mnemonic,
    [CosmosWallet.COSMOS_ADDRESS]: toBech32("cosmos", rawAddress),
    [CosmosWallet.OSMOSIS_ADDRESS]: toBech32("osmo", rawAddress),
    [CosmosWallet.PUBLIC_KEY]: toHex(publicKey),
    [CosmosWallet.PRIVATE_KEY]: toHex(privkey),
  };
}

export default function generateCosmosWallet() {
  return deriveCosmosWallet(bip39.generateMnemonic());
}
