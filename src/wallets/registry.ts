import type { WalletModule } from "../types/wallet";

/** Order of a module on Home; unordered modules come last */
const getOrder = (module: WalletModule) => module.order ?? Infinity;

/** Every wallet module, ordered by `order` and then by title */
export const walletModules: WalletModule[] = Object.values(
  import.meta.glob<WalletModule>("./*/index.ts", {
    eager: true,
    import: "default",
  }),
).sort((a, b) => getOrder(a) - getOrder(b) || a.title.localeCompare(b.title));

/** Wallet modules by id */
export const walletModulesById = new Map(
  walletModules.map((module) => [module.id, module]),
);
