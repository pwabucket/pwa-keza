import "../lib/polyfill.js";

import { Buffer } from "buffer";
import { WalletContractV4, WalletContractV5R1 } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

import { createWalletWorker } from "./createWalletWorker";

createWalletWorker(async () => {
  let mnemonic = await mnemonicNew();
  let keyPair = await mnemonicToPrivateKey(mnemonic);

  let workchain = 0;
  let walletV4 = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  });

  let walletV5 = WalletContractV5R1.create({
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
    ["Address V5"]: addressV5,
    ["Address V4"]: addressV4,
    ["Public Key"]: Buffer.from(keyPair.publicKey).toString("hex"),
    ["Secret Key"]: Buffer.from(keyPair.secretKey).toString("hex"),
    ["Phrase"]: mnemonic.join(" "),
  };
});
