import { SECRET_KINDS } from "./fields";
import type { WalletModule } from "../types/wallet";

/** Labels of a module's secret fields; null when the module is unknown */
export function getSecretLabels(
  module: WalletModule | null,
): ReadonlySet<string> | null {
  if (!module) return null;

  return new Set(
    module.fields
      .filter((field) => SECRET_KINDS.has(field.kind))
      .map((field) => field.label),
  );
}

/** Whether a field is secret; every field counts when the module is unknown */
export function isSecretLabel(
  secretLabels: ReadonlySet<string> | null,
  label: string,
) {
  return secretLabels?.has(label) ?? true;
}
