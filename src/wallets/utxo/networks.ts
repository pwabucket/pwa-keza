import * as bitcoin from "bitcoinjs-lib";

/** A UTXO chain: its address and key encodings, and its BIP44 coin type */
export interface UtxoChain {
  network: bitcoin.Network;
  coinType: number;
}

export const BITCOIN: UtxoChain = {
  network: bitcoin.networks.bitcoin,
  coinType: 0,
};

export const BITCOIN_TESTNET: UtxoChain = {
  network: bitcoin.networks.testnet,
  coinType: 1,
};

export const LITECOIN: UtxoChain = {
  network: {
    messagePrefix: "\x19Litecoin Signed Message:\n",
    bech32: "ltc",
    bip32: { public: 0x019da462, private: 0x019d9cfe },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  },
  coinType: 2,
};

export const DOGECOIN: UtxoChain = {
  network: {
    messagePrefix: "\x19Dogecoin Signed Message:\n",
    /* Dogecoin has no SegWit; the prefix is never used */
    bech32: "doge",
    bip32: { public: 0x02facafd, private: 0x02fac398 },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
  },
  coinType: 3,
};
