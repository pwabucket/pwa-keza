import { describe, expect, it } from "vitest";

import { SuiWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveSuiWallet } from "./generator";

describe("deriveSuiWallet", () => {
  it("matches the published Sui vector for the test mnemonic", async () => {
    const wallet = await deriveSuiWallet(TEST_MNEMONIC);

    /* klever-io/kos-rs packages/kos/src/chains/sui/mod.rs */
    expect(wallet[SuiWallet.ADDRESS]).toBe(
      "0x5e93a736d04fbb25737aa40bee40171ef79f65fae833749e3c089fe7cc2161f1",
    );
    /* Same key computed with noble SLIP-10 and blake2b */
    expect(wallet[SuiWallet.PRIVATE_KEY]).toBe(
      "suiprivkey1qzyxnjc8z79lvlsg6lz2hh69fp7m7duunfzjlnkzsd59f062855mqacydfr",
    );
  });
});
