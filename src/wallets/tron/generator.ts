import { utils } from "tronweb";
import type { WalletResult } from "../../types/wallet";
import { TronWallet } from "./fields";

export type TronWalletResult = WalletResult<typeof TronWallet>;
export type TronWalletGeneratorArguments = Parameters<
  typeof generateTronWallet
>;

export async function generateTronWallet(): Promise<TronWalletResult> {
  const account = utils.accounts.generateRandom();

  return {
    [TronWallet.ADDRESS]: account.address,
    [TronWallet.PUBLIC_KEY]: account.publicKey,
    [TronWallet.PRIVATE_KEY]: account.privateKey,
    [TronWallet.PHRASE]: account.mnemonic?.phrase || "",
  };
}

export default generateTronWallet;
