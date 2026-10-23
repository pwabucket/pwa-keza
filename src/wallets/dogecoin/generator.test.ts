import { describe, expect, it } from "vitest";

import { DogecoinWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { UTXO_PRESETS } from "../utxo/presets";

describe("derive", () => {
  it("matches the published Dogecoin vector for the test mnemonic", async () => {
    const wallet = await deriveAccount(
      derive,
      TEST_MNEMONIC,
      UTXO_PRESETS[0].path,
    );

    /* Ledger Live coin-bitcoin constants.ts (dogecoin) */
    expect(wallet[DogecoinWallet.ADDRESS]).toBe(
      "DBus3bamQjgJULBJtYXpEzDWQRwF5iwxgC",
    );
    /* Same key computed with @scure/btc-signer */
    expect(wallet[DogecoinWallet.PRIVATE_KEY]).toBe(
      "QPkeC1ZfHx3c9g7WTj9cQ8gnvk2iSAfAcbq1aVAWjNTwDAKfZUzx",
    );
  });
});
