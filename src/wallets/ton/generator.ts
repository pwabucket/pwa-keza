import { Buffer } from "buffer";
import { WalletContractV4, WalletContractV5R1 } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

import type { WalletDeriver, WalletGenerator } from "../../types/wallet";
import { TONWallet } from "./fields";

/** TON wallet of a TON-native 24-word phrase, which has a single key */
export const derive: WalletDeriver = async ({ mnemonic, testnet = false }) => {
  const words = mnemonic.split(" ");
  const keyPair = await mnemonicToPrivateKey(words);

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
    testOnly: testnet,
  });
  const addressV5 = walletV5.address.toString({
    bounceable: false,
    testOnly: testnet,
  });

  return {
    [TONWallet.ADDRESS_V5]: addressV5,
    [TONWallet.ADDRESS_V4]: addressV4,
    [TONWallet.PUBLIC_KEY]: Buffer.from(keyPair.publicKey).toString("hex"),
    [TONWallet.SECRET_KEY]: Buffer.from(keyPair.secretKey).toString("hex"),
    [TONWallet.PHRASE]: mnemonic,
  };
};

const generateTONWallet: WalletGenerator = async ({ testnet }) =>
  derive({
    mnemonic: (await mnemonicNew()).join(" "),
    seed: new Uint8Array(),
    index: 0,
    pathTemplate: "",
    testnet,
  });

export default generateTONWallet;
