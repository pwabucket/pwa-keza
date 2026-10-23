import { describe, expect, it } from "vitest";

import { CosmosWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { presets } from "./presets";

describe("derive", () => {
  it("matches the published Cosmos and Osmosis vectors", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    /* Ledger Live cryptoassets abandonseed.ts (cosmos, osmo) */
    expect(wallet[CosmosWallet.COSMOS_ADDRESS]).toBe(
      "cosmos19rl4cm2hmr8afy4kldpxz3fka4jguq0auqdal4",
    );
    expect(wallet[CosmosWallet.OSMOSIS_ADDRESS]).toBe(
      "osmo19rl4cm2hmr8afy4kldpxz3fka4jguq0a5m7df8",
    );
    /* Same key computed with @scure/bip32 */
    expect(wallet[CosmosWallet.PRIVATE_KEY]).toBe(
      "c4a48e2fce1481cd3294b4490f6678090ea98d3d0e5cd984558ab0968741b104",
    );
  });
});
