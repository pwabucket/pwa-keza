import bs58 from "bs58";
import { Buffer } from "buffer";
import { describe, expect, it } from "vitest";

import { SolanaWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { presets } from "./presets";

describe("derive", () => {
  it("matches Phantom's first account for the test mnemonic", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    expect(wallet[SolanaWallet.ADDRESS]).toBe(
      "HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk",
    );
    /* hdwallet-io/python-hdwallet README; Keystone firmware solana/src/address.rs */
    expect(wallet[SolanaWallet.PRIVATE_KEY]).toBe(
      "27npWoNE4HfmLeQo1TyWcW7NEA28qnsnDK7kcttDQEWrCWnro83HMJ97rMmpvYYZRwDAvG4KRuB7hTBacvwD7bgi",
    );
  });

  it("matches Ledger's address for its path", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[1].path);

    /* Ledger Live cryptoassets abandonseed.ts (solana), m/44'/501'/0' */
    expect(wallet[SolanaWallet.ADDRESS]).toBe(
      "GjJyeC1r2RgkuoCWMyPYkCWSGSGLcz266EaAkLA27AhL",
    );
  });

  it("encodes the same 64-byte secret key as hex and base58", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);
    const hex = wallet[SolanaWallet.SECRET_KEY];
    const base58 = bs58.decode(wallet[SolanaWallet.PRIVATE_KEY]);

    expect(hex).toHaveLength(128);
    expect(Buffer.from(base58).toString("hex")).toBe(hex);
  });
});
