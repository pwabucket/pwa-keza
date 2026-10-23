import * as bip39 from "bip39";
import { Buffer } from "buffer";
import { describe, expect, it } from "vitest";

import { TEST_MNEMONIC } from "./vectors";
import { isValidPath, normalizeMnemonic, resolvePath } from "../wallets/derive";

describe("BIP39 passphrase", () => {
  it("matches the official TREZOR passphrase vector", async () => {
    /* https://github.com/trezor/python-mnemonic/blob/master/vectors.json */
    const seed = await bip39.mnemonicToSeed(TEST_MNEMONIC, "TREZOR");

    expect(Buffer.from(seed).toString("hex")).toBe(
      "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04",
    );
  });
});

describe("paths", () => {
  it("fills placeholders and leaves unknown ones", () => {
    expect(
      resolvePath("m/{purpose}'/{coin}'/0'/0/{i}", { coin: 0, i: 7 }),
    ).toBe("m/{purpose}'/0'/0'/0/7");
  });

  it.each([
    ["m/44'/60'/0'/0/0", true],
    ["m/0", true],
    ["m", false],
    ["44'/60'", false],
    ["m/44'/x'", false],
    [`m/${2 ** 31}'`, false],
  ])("checks %s", (path, valid) => {
    expect(isValidPath(path)).toBe(valid);
  });
});

describe("normalizeMnemonic", () => {
  it("lowercases and collapses whitespace", () => {
    expect(normalizeMnemonic("  Abandon\n ABANDON\tabout ")).toBe(
      "abandon abandon about",
    );
  });
});
