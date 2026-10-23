import { describe, expect, it } from "vitest";

import { NEARWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveNEARWallet } from "./generator";

describe("deriveNEARWallet", () => {
  it("matches the published NEAR vector for the test mnemonic", async () => {
    const wallet = await deriveNEARWallet(TEST_MNEMONIC);

    /* gemwalletcom/wallet core/crates/gem_near/src/address.rs; near-seed-phrase agrees */
    expect(wallet[NEARWallet.PUBLIC_KEY]).toBe(
      "ed25519:6j4b6zUaty6fD1awqcGCCU9JYGCWYUgdJhQrzfZhqE25",
    );
    expect(wallet[NEARWallet.ACCOUNT_ID]).toBe(
      "5510e2b44cae6eb807e3e0e45d579dda058c274abcba15e5cb84636f5d1ee412",
    );
    expect(wallet[NEARWallet.SECRET_KEY]).toBe(
      "ed25519:F1kPR175szkGxEL52A9H6Z5ocS2BtaipprK2Hiob9DjGzHTkScrBb1yt44baXPZ3LxyHcsTPdBjHmn6zx147txH",
    );
  });
});
