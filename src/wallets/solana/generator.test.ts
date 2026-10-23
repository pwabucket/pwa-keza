import bs58 from "bs58";
import { Buffer } from "buffer";
import { describe, expect, it } from "vitest";

import { SolanaWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveSolanaWallet } from "./generator";

describe("deriveSolanaWallet", () => {
  it("matches Phantom's first account for the test mnemonic", async () => {
    const wallet = await deriveSolanaWallet(TEST_MNEMONIC);

    expect(wallet[SolanaWallet.ADDRESS]).toBe(
      "HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk",
    );
    /* hdwallet-io/python-hdwallet README; Keystone firmware solana/src/address.rs */
    expect(wallet[SolanaWallet.PRIVATE_KEY]).toBe(
      "27npWoNE4HfmLeQo1TyWcW7NEA28qnsnDK7kcttDQEWrCWnro83HMJ97rMmpvYYZRwDAvG4KRuB7hTBacvwD7bgi",
    );
  });

  it("encodes the same 64-byte secret key as hex and base58", async () => {
    const wallet = await deriveSolanaWallet(TEST_MNEMONIC);
    const hex = wallet[SolanaWallet.SECRET_KEY];
    const base58 = bs58.decode(wallet[SolanaWallet.PRIVATE_KEY]);

    expect(hex).toHaveLength(128);
    expect(Buffer.from(base58).toString("hex")).toBe(hex);
  });
});
