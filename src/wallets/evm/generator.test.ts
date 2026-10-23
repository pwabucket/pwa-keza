import * as bip39 from "bip39";
import { HDKey } from "@scure/bip32";
import { computeAddress, hexlify } from "ethers";
import { describe, expect, it } from "vitest";

import { EVMWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { presets } from "./presets";

/** Address at a path computed with @scure/bip32, independent of ethers' HD code */
async function scureAddress(path: string) {
  const seed = await bip39.mnemonicToSeed(TEST_MNEMONIC);
  const key = HDKey.fromMasterSeed(seed).derive(path);
  return computeAddress(hexlify(key.publicKey!));
}

describe("derive", () => {
  it("matches the published EVM vector for the test mnemonic", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    /* hdwallet-io/python-hdwallet README; Nethereum.Wallet README */
    expect(wallet[EVMWallet.ADDRESS]).toBe(
      "0x9858EfFD232B4033E47d90003D41EC34EcaEda94",
    );
    expect(wallet[EVMWallet.PRIVATE_KEY]).toBe(
      "0x1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727",
    );
  });

  it.each(presets)("derives later accounts with $title", async (preset) => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, preset.path, {
      index: 3,
    });
    const path = preset.path.replace("{i}", "3");

    expect(wallet["Derivation Path"]).toBe(path);
    expect(wallet[EVMWallet.ADDRESS]).toBe(await scureAddress(path));
  });
});
