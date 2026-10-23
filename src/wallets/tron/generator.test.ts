import { describe, expect, it } from "vitest";

import { TEST_MNEMONIC } from "../../test/vectors";
import { TronWallet } from "./fields";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { presets } from "./presets";

describe("derive", () => {
  it("matches TronWeb and an independent derivation for the test mnemonic", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    /* tronweb 6.5.1 and @scure/bip32 with keccak agree on these */
    expect(wallet[TronWallet.ADDRESS]).toBe(
      "TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH",
    );
    expect(wallet[TronWallet.PRIVATE_KEY]).toBe(
      "0xb5a4cea271ff424d7c31dc12a3e43e401df7a40d7412a15750f3f0b6b5449a28",
    );
  });
});
