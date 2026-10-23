import { describe, expect, it } from "vitest";

import { BitcoinWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { UTXO_PRESETS } from "../utxo/presets";

describe("derive", () => {
  it("matches the BIP44/49/84/86 mainnet vectors", async () => {
    const wallet = await deriveAccount(
      derive,
      TEST_MNEMONIC,
      UTXO_PRESETS[0].path,
    );

    /* https://github.com/bitcoin/bips/blob/master/bip-0086.mediawiki */
    expect(wallet[BitcoinWallet.TAPROOT_ADDRESS]).toBe(
      "bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr",
    );
    /* https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki */
    expect(wallet[BitcoinWallet.NATIVE_ADDRESS]).toBe(
      "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
    );
    expect(wallet[BitcoinWallet.NESTED_ADDRESS]).toBe(
      "37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf",
    );
    expect(wallet[BitcoinWallet.LEGACY_ADDRESS]).toBe(
      "1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA",
    );
    expect(wallet[BitcoinWallet.MNEMONIC]).toBe(TEST_MNEMONIC);
  });

  it("matches the BIP49/84 testnet vectors", async () => {
    const wallet = await deriveAccount(
      derive,
      TEST_MNEMONIC,
      UTXO_PRESETS[0].path,
      { testnet: true },
    );

    /* https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki */
    expect(wallet[BitcoinWallet.NATIVE_ADDRESS]).toBe(
      "tb1q6rz28mcfaxtmd6v789l9rrlrusdprr9pqcpvkl",
    );
    /* https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki */
    expect(wallet[BitcoinWallet.NESTED_ADDRESS]).toBe(
      "2Mww8dCYPUpKHofjgcXcBCEGmniw9CoaiD2",
    );
  });
});
