import bs58 from "bs58";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Ed25519PrivateKey } from "@aptos-labs/ts-sdk/crypto";
import { Keypair as SolanaKeypair } from "@solana/web3.js";
import { Keypair as StellarKeypair } from "@stellar/stellar-sdk";
import { SigningKey, computeAddress } from "ethers";
import { describe, expect, it } from "vitest";
import { utils } from "tronweb";

import type { VanityGenerator, WalletRow } from "../types/wallet";
import { vanity as aptos } from "./aptos/generator";
import { vanity as evm } from "./evm/generator";
import { vanity as solana } from "./solana/generator";
import { vanity as stellar } from "./stellar/generator";
import { vanity as sui } from "./sui/generator";
import { vanity as tron } from "./tron/generator";

/** Address recomputed from the candidate's own private key */
const fromKey: Record<string, (row: WalletRow) => Promise<string> | string> = {
  evm: (row) => computeAddress(new SigningKey(row["Private Key"]).publicKey),
  tron: (row) => utils.crypto.pkToAddress(row["Private Key"].slice(2)),
  solana: async (row) =>
    (
      await SolanaKeypair.fromSecretKey(
        bs58.decode(row["Private Key (Base58)"]),
      )
    ).publicKey.toBase58(),
  stellar: (row) => StellarKeypair.fromSecret(row["Secret Key"]).publicKey(),
  sui: (row) => Ed25519Keypair.fromSecretKey(row["Private Key"]).toSuiAddress(),
  aptos: (row) =>
    new Ed25519PrivateKey(row["Private Key"])
      .publicKey()
      .authKey()
      .derivedAddress()
      .toStringLong(),
};

const generators: Record<string, VanityGenerator> = {
  evm,
  tron,
  solana,
  stellar,
  sui,
  aptos,
};

describe("vanity candidates", () => {
  it.each(Object.keys(generators))(
    "%s builds a row whose key controls the matched address",
    async (id) => {
      const candidate = await generators[id]();
      const row = await candidate.toRow();

      expect(row.Address).toBe(candidate.address);
      expect(await fromKey[id](row)).toBe(candidate.address);
    },
  );
});
