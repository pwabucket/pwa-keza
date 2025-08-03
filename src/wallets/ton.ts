import { Buffer } from "buffer";
import { WalletContractV4, WalletContractV5R1 } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

import type { WalletResult } from "../types/wallet";

export const TONWallet = {
  ADDRESS_V5: "Address V5",
  ADDRESS_V4: "Address V4",
  PUBLIC_KEY: "Public Key",
  SECRET_KEY: "Secret Key",
  PHRASE: "Phrase",
} as const;

export type TONWalletResult = WalletResult<typeof TONWallet>;
export type TONWalletGeneratorArguments = Parameters<typeof generateTONWallet>;

export async function generateTONWallet(): Promise<TONWalletResult> {
  const mnemonic = await mnemonicNew();
  const keyPair = await mnemonicToPrivateKey(mnemonic);

  const workchain = 0;
  const walletV4 = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  });

  const walletV5 = WalletContractV5R1.create({
    workchain,
    publicKey: keyPair.publicKey,
  });

  const addressV4 = walletV4.address.toString({
    bounceable: false,
    testOnly: false,
  });
  const addressV5 = walletV5.address.toString({
    bounceable: false,
    testOnly: false,
  });

  return {
    [TONWallet.ADDRESS_V5]: addressV5,
    [TONWallet.ADDRESS_V4]: addressV4,
    [TONWallet.PUBLIC_KEY]: Buffer.from(keyPair.publicKey).toString("hex"),
    [TONWallet.SECRET_KEY]: Buffer.from(keyPair.secretKey).toString("hex"),
    [TONWallet.PHRASE]: mnemonic.join(" "),
  };
}
