import {
  Secp256k1,
  Slip10,
  Slip10Curve,
  ripemd160,
  sha256,
  stringToPath,
} from "@cosmjs/crypto";
import { toBech32, toHex } from "@cosmjs/encoding";

import type { WalletDeriver } from "../../types/wallet";
import { CosmosWallet } from "./fields";
import { DERIVATION_PATH_FIELD } from "../fields";
import { createBip39Generator, resolveIndexPath } from "../derive";
import { presets } from "./presets";

/** Cosmos Hub and Osmosis addresses of a phrase, which share one key */
export const derive: WalletDeriver = async ({
  mnemonic,
  seed,
  index,
  pathTemplate,
}) => {
  const path = resolveIndexPath(pathTemplate, index);
  const { privkey } = Slip10.derivePath(
    Slip10Curve.Secp256k1,
    seed,
    stringToPath(path),
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
    [DERIVATION_PATH_FIELD.label]: path,
  };
};

export default createBip39Generator(derive, presets[0].path);
