import bs58 from "bs58";
import { describe, expect, it } from "vitest";
import { utils } from "tronweb";

import { base58PrefixChance } from "./base58Chance";

const SAMPLES = 20_000;
const SOLANA = { bytes: 32 };
const TRON = { bytes: 25, leadingByte: 0x41 };

/** Share of sampled addresses that start with a prefix */
function sampledShare(addresses: string[], prefix: string) {
  return (
    addresses.filter((address) => address.startsWith(prefix)).length /
    addresses.length
  );
}

const solanaAddresses = Array.from({ length: SAMPLES }, () =>
  bs58.encode(crypto.getRandomValues(new Uint8Array(32))),
);

const tronAddresses = Array.from({ length: SAMPLES }, () =>
  utils.crypto.getBase58CheckAddress([
    0x41,
    ...crypto.getRandomValues(new Uint8Array(20)),
  ]),
);

describe("base58PrefixChance", () => {
  /* Within 25% of the sampled share, which is well inside sampling noise */
  it.each(["A", "2", "H", "z"])(
    "matches sampled Solana addresses for %s",
    (prefix) => {
      const chance = base58PrefixChance(prefix, SOLANA, false);
      const share = sampledShare(solanaAddresses, prefix);

      expect(chance / share).toBeGreaterThan(0.75);
      expect(chance / share).toBeLessThan(1.25);
    },
  );

  it.each(["TA", "TQ", "TZ"])(
    "matches sampled Tron addresses for %s",
    (prefix) => {
      const chance = base58PrefixChance(prefix, TRON, false);
      const share = sampledShare(tronAddresses, prefix);

      expect(chance / share).toBeGreaterThan(0.75);
      expect(chance / share).toBeLessThan(1.25);
    },
  );

  it("makes T9 far rarer than other Tron starts", () => {
    expect(base58PrefixChance("T9", TRON, false)).toBeLessThan(1 / 500);
    expect(base58PrefixChance("TA", TRON, false)).toBeGreaterThan(1 / 30);
  });

  it("rules out impossible starts", () => {
    expect(base58PrefixChance("Ta", TRON, false)).toBe(0);
    expect(base58PrefixChance("1", TRON, false)).toBe(0);
  });

  it("treats a leading 1 as a leading zero byte", () => {
    expect(base58PrefixChance("1", SOLANA, false)).toBeCloseTo(1 / 256, 6);
  });

  it("adds up every case when case is ignored", () => {
    const either = base58PrefixChance("a", SOLANA, true);

    expect(either).toBeCloseTo(
      base58PrefixChance("a", SOLANA, false) +
        base58PrefixChance("A", SOLANA, false),
      12,
    );
  });
});
