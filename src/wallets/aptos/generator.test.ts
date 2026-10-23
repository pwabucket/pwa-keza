import { describe, expect, it } from "vitest";

import { AptosWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { presets } from "./presets";

describe("derive", () => {
  it("matches the published Aptos vector for the test mnemonic", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    /* aptos-labs/aptos-rust-sdk crates/aptos-sdk/src/account/mnemonic.rs */
    expect(wallet[AptosWallet.ADDRESS]).toBe(
      "0xeb663b681209e7087d681c5d3eed12aaa8e1915e7c87794542c3f96e94b3d3bf",
    );
    /* Same key computed with noble SLIP-10 */
    expect(wallet[AptosWallet.PRIVATE_KEY]).toBe(
      "ed25519-priv-0xcc92c0eaf80206d817f150e21917f797e49cf644a33ac514de3c316baa2f1bf5",
    );
  });
});
