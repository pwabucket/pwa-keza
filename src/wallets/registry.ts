import type { WalletModule } from "../types/wallet";

/** Every wallet module, in folder order */
export const walletModules: WalletModule[] = Object.values(
  import.meta.glob<WalletModule>("./*/index.ts", {
    eager: true,
    import: "default",
  }),
);

/** Wallet modules by id */
export const walletModulesById = new Map(
  walletModules.map((module) => [module.id, module]),
);
