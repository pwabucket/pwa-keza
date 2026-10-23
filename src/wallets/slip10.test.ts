import { describe, expect, it } from "vitest";

import { parseHardenedPath } from "./slip10";

describe("parseHardenedPath", () => {
  it("reads hardened indices without the hardened offset", () => {
    expect(parseHardenedPath("m/44'/501'/0'/0'")).toEqual([44, 501, 0, 0]);
  });

  it("rejects paths with unhardened indices", () => {
    expect(() => parseHardenedPath("m/44'/501'/0'/0")).toThrow();
  });

  it("rejects paths that don't start at the master key", () => {
    expect(() => parseHardenedPath("44'/501'")).toThrow();
  });
});
