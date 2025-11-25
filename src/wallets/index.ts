import type { WalletModule } from "../types/wallet";

const wallets: WalletModule[] = Object.values(
  import.meta.glob("./*/index.ts", {
    eager: true,
    import: "default",
  })
) as unknown as WalletModule[];

export default wallets;
