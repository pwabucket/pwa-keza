import { describe, expect, it } from "vitest";

import { StellarWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { presets } from "./presets";

/* https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md#test-cases */
const SEP5_MNEMONIC =
  "illness spike retreat truth genius clock brain pass fit cave bargain toe";

describe("derive", () => {
  it("matches the first SEP-0005 test vector", async () => {
    const wallet = await deriveAccount(derive, SEP5_MNEMONIC, presets[0].path);

    expect(wallet[StellarWallet.ADDRESS]).toBe(
      "GDRXE2BQUC3AZNPVFSCEZ76NJ3WWL25FYFK6RGZGIEKWE4SOOHSUJUJ6",
    );
    expect(wallet[StellarWallet.SECRET_KEY]).toBe(
      "SBGWSG6BTNCKCOB3DIFBGCVMUPQFYPA2G4O34RMTB343OYPXU5DJDVMN",
    );
  });

  it("matches SEP-0005 test 5 for the test mnemonic", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    expect(wallet[StellarWallet.ADDRESS]).toBe(
      "GB3JDWCQJCWMJ3IILWIGDTQJJC5567PGVEVXSCVPEQOTDN64VJBDQBYX",
    );
    expect(wallet[StellarWallet.SECRET_KEY]).toBe(
      "SBUV3MRWKNS6AYKZ6E6MOUVF2OYMON3MIUASWL3JLY5E3ISDJFELYBRZ",
    );
  });
});
