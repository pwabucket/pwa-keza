import { describe, expect, it } from "vitest";

import { MultiChainWallet } from "./fields";
import { TEST_MNEMONIC } from "../../test/vectors";
import { deriveAccount } from "../../test/derive";
import { derive } from "./generator";
import { derive as deriveEVM } from "../evm/generator";
import { presets } from "./presets";
import { presets as evmPresets } from "../evm/presets";

describe("derive", () => {
  it("matches each chain's published vector for account 0", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path);

    expect(wallet[MultiChainWallet.EVM_ADDRESS]).toBe(
      "0x9858EfFD232B4033E47d90003D41EC34EcaEda94",
    );
    expect(wallet[MultiChainWallet.TRON_ADDRESS]).toBe(
      "TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH",
    );
    expect(wallet[MultiChainWallet.BITCOIN_ADDRESS]).toBe(
      "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
    );
    expect(wallet[MultiChainWallet.BITCOIN_PRIVATE_KEY]).toBe(
      "KyZpNDKnfs94vbrwhJneDi77V6jF64PWPF8x5cdJb8ifgg2DUc9d",
    );
    expect(wallet[MultiChainWallet.SOLANA_ADDRESS]).toBe(
      "HAgk14JpMQLgt6rVgv7cBQFJWFto5Dqxi472uT3DKpqk",
    );
    expect(wallet[MultiChainWallet.STELLAR_ADDRESS]).toBe(
      "GB3JDWCQJCWMJ3IILWIGDTQJJC5567PGVEVXSCVPEQOTDN64VJBDQBYX",
    );
    expect(wallet[MultiChainWallet.ACCOUNT_INDEX]).toBe("0");
  });

  it("uses the same account index as each chain's own module", async () => {
    const wallet = await deriveAccount(derive, TEST_MNEMONIC, presets[0].path, {
      index: 2,
    });
    const evm = await deriveAccount(
      deriveEVM,
      TEST_MNEMONIC,
      evmPresets[0].path,
      {
        index: 2,
      },
    );

    expect(wallet[MultiChainWallet.EVM_ADDRESS]).toBe(evm.Address);
  });
});
