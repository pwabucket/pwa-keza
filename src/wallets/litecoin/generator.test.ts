import { describe, expect, it } from "vitest";

import { LitecoinWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { UTXO_PRESETS } from "../utxo/presets";

describe("derive", () => {
  it("matches the published Litecoin vectors for the test mnemonic", async () => {
    const wallet = await deriveAccount(
      derive,
      TEST_MNEMONIC,
      UTXO_PRESETS[0].path,
    );

    /* Keystone firmware rust/apps/bitcoin/src/addresses/mod.rs */
    expect(wallet[LitecoinWallet.NATIVE_ADDRESS]).toBe(
      "ltc1qjmxnz78nmc8nq77wuxh25n2es7rzm5c2rkk4wh",
    );
    expect(wallet[LitecoinWallet.NESTED_ADDRESS]).toBe(
      "M7wtsL7wSHDBJVMWWhtQfTMSYYkyooAAXM",
    );
    /* Ledger Live coin-bitcoin constants.ts (litecoin) */
    expect(wallet[LitecoinWallet.LEGACY_ADDRESS]).toBe(
      "LUWPbpM43E2p7ZSh8cyTBEkvpHmr3cB8Ez",
    );
    /* Same key computed with @scure/btc-signer */
    expect(wallet[LitecoinWallet.PRIVATE_KEY]).toBe(
      "T5ZCYhLqXu6EJKk2nhjvwsaLH357CisixhLGWpKXEiqWTUtzte6o",
    );
  });
});
