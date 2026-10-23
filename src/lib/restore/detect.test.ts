import { describe, expect, it } from "vitest";

import type { WalletGenerator } from "../../types/wallet";
import { detectModule } from "./detect";
import { walletModules } from "../../wallets/registry";

const generators = import.meta.glob<WalletGenerator>(
  "../../wallets/*/generator.ts",
  { import: "default" },
);

async function generateRows(moduleId: string, count = 3) {
  const generate = await generators[`../../wallets/${moduleId}/generator.ts`]();
  return Promise.all(Array.from({ length: count }, () => generate({})));
}

describe("detectModule", () => {
  it.each(walletModules.map((module) => module.id))(
    "recognises a %s backup from its columns and values",
    async (moduleId) => {
      const rows = await generateRows(moduleId);

      expect(detectModule(rows, "backup.json")?.id).toBe(moduleId);
    },
  );

  it.each(["solana", "stellar"])(
    "recognises a %s backup made before mnemonics were added",
    async (moduleId) => {
      const rows = (await generateRows(moduleId)).map((row) => ({
        Address: row.Address,
        "Secret Key": row["Secret Key"],
      }));

      expect(detectModule(rows, "backup.json")?.id).toBe(moduleId);
    },
  );

  it("falls back to the module named in a legacy file name", () => {
    expect(
      detectModule([{ Unknown: "value" }], "keza-evm-wallets-2025.json")?.id,
    ).toBe("evm");
  });

  it("returns null for a backup that matches nothing", () => {
    expect(detectModule([{ Unknown: "value" }], "backup.json")).toBeNull();
  });
});
