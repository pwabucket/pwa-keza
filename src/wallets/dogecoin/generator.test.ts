import { describe, expect, it } from "vitest";

import { DogecoinWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveDogecoinWallet } from "./generator";

describe("deriveDogecoinWallet", () => {
  it("matches the published Dogecoin vector for the test mnemonic", async () => {
    const wallet = await deriveDogecoinWallet(TEST_MNEMONIC);

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
