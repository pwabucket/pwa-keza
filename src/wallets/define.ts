import type { WalletModule, WalletModuleDefinition } from "../types/wallet";

/** Builds a wallet module, adding the field lookups used across the app */
export function defineWalletModule(
  definition: WalletModuleDefinition,
): WalletModule {
  return {
    ...definition,
    fieldsByLabel: new Map(
      definition.fields.map((field) => [field.label, field]),
    ),
    requiredLabels: definition.fields
      .filter((field) => !field.optional)
      .map((field) => field.label),
  };
}
