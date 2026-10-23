import type { WalletModule, WalletRow } from "../../types/wallet";
import { walletModules, walletModulesById } from "../../wallets/registry";

/** Rows sampled when checking values against field patterns */
const SAMPLE_SIZE = 20;

/** Share of sampled values that match the module's field patterns */
function getPatternMatchRate(module: WalletModule, rows: WalletRow[]) {
  let checked = 0;
  let matched = 0;

  for (const row of rows.slice(0, SAMPLE_SIZE)) {
    for (const [label, value] of Object.entries(row)) {
      const pattern = module.fieldsByLabel.get(label)?.pattern;

      if (pattern) {
        checked++;
        if (pattern.test(value)) matched++;
      }
    }
  }

  return checked > 0 ? matched / checked : 0;
}

/** Module id from a legacy export name such as keza-evm-wallets-<date>.csv */
function getModuleIdFromFilename(filename: string) {
  return filename.replace("keza-", "").split("-wallet")[0];
}

/**
 * Finds the module a backup came from: modules whose columns the backup has,
 * ranked by how many columns they match and then by how well the values fit.
 * Falls back to the module named in the file name.
 */
export function detectModule(
  rows: WalletRow[],
  filename: string,
): WalletModule | null {
  const headers = new Set(rows.flatMap((row) => Object.keys(row)));

  const ranked = walletModules
    .filter((module) =>
      module.requiredLabels.every((label) => headers.has(label)),
    )
    .map((module) => ({
      module,
      columns: module.requiredLabels.length,
      matchRate: getPatternMatchRate(module, rows),
    }))
    .filter(({ matchRate }) => matchRate > 0)
    .sort((a, b) => b.columns - a.columns || b.matchRate - a.matchRate);

  return (
    ranked[0]?.module ??
    walletModulesById.get(getModuleIdFromFilename(filename)) ??
    null
  );
}
