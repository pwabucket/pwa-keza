import { describe, expect, it } from "vitest";

import { TEST_MNEMONIC } from "../../test/vectors";
import { XRPWallet } from "./fields";
import { deriveXRPWallet } from "./generator";

describe("deriveXRPWallet", () => {
  it("matches the published XRP vector for the test mnemonic", async () => {
    const wallet = await deriveXRPWallet(TEST_MNEMONIC);

    /* Ledger Live cryptoassets abandonseed.ts (ripple); also xrpl.js Wallet.fromMnemonic */
    expect(wallet[XRPWallet.ADDRESS]).toBe(
      "rHsMGQEkVNJmpGWs8XUBoTBiAAbwxZN5v3",
    );
    expect(wallet[XRPWallet.PUBLIC_KEY]).toBe(
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
    );
    expect(wallet[XRPWallet.PRIVATE_KEY]).toBe(
      "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4",
    );
  });
});
