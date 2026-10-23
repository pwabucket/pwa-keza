import type { DeriveRequest, WalletDeriver } from "../../types/wallet";
import { AddressType, deriveUtxoAccount } from "../utxo/derive";
import { BITCOIN } from "../utxo/networks";
import { EVMWallet } from "../evm/fields";
import { MultiChainWallet } from "./fields";
import { SolanaWallet } from "../solana/fields";
import { StellarWallet } from "../stellar/fields";
import { TronWallet } from "../tron/fields";
import { UTXO_PRESETS } from "../utxo/presets";
import { createBip39Generator } from "../derive";
import { presets } from "./presets";
import { derive as deriveEVM } from "../evm/generator";
import { derive as deriveSolana } from "../solana/generator";
import { derive as deriveStellar } from "../stellar/generator";
import { derive as deriveTron } from "../tron/generator";
import { presets as evmPresets } from "../evm/presets";
import { presets as solanaPresets } from "../solana/presets";
import { presets as stellarPresets } from "../stellar/presets";
import { presets as tronPresets } from "../tron/presets";

/** Derives a chain at its default path for the request's account index */
function atDefaultPath(
  derive: WalletDeriver,
  pathTemplate: string,
  request: DeriveRequest,
) {
  return derive({ ...request, pathTemplate });
}

/** One account index of a phrase on EVM, Tron, Bitcoin, Solana and Stellar */
export const derive: WalletDeriver = async (request) => {
  const [evm, tron, solana, stellar] = await Promise.all([
    atDefaultPath(deriveEVM, evmPresets[0].path, request),
    atDefaultPath(deriveTron, tronPresets[0].path, request),
    atDefaultPath(deriveSolana, solanaPresets[0].path, request),
    atDefaultPath(deriveStellar, stellarPresets[0].path, request),
  ]);
  const bitcoin = deriveUtxoAccount(
    request.seed,
    BITCOIN,
    AddressType.NATIVE_SEGWIT,
    UTXO_PRESETS[0].path,
    request.index,
  );

  return {
    [MultiChainWallet.MNEMONIC]: request.mnemonic,
    [MultiChainWallet.EVM_ADDRESS]: evm[EVMWallet.ADDRESS],
    [MultiChainWallet.EVM_PRIVATE_KEY]: evm[EVMWallet.PRIVATE_KEY],
    [MultiChainWallet.TRON_ADDRESS]: tron[TronWallet.ADDRESS],
    [MultiChainWallet.TRON_PRIVATE_KEY]: tron[TronWallet.PRIVATE_KEY],
    [MultiChainWallet.BITCOIN_ADDRESS]: bitcoin.address,
    [MultiChainWallet.BITCOIN_PRIVATE_KEY]: bitcoin.wif,
    [MultiChainWallet.SOLANA_ADDRESS]: solana[SolanaWallet.ADDRESS],
    [MultiChainWallet.SOLANA_PRIVATE_KEY]: solana[SolanaWallet.PRIVATE_KEY],
    [MultiChainWallet.STELLAR_ADDRESS]: stellar[StellarWallet.ADDRESS],
    [MultiChainWallet.STELLAR_SECRET_KEY]: stellar[StellarWallet.SECRET_KEY],
    [MultiChainWallet.ACCOUNT_INDEX]: String(request.index),
  };
};

export default createBip39Generator(derive, presets[0].path);
