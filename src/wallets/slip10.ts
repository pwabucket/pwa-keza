import { Buffer } from "buffer";
import { deriveEd25519Path } from "@ton/crypto";

/** Splits a fully hardened path such as m/44'/501'/0'/0' into its indices */
export function parseHardenedPath(path: string): number[] {
  const [root, ...segments] = path.split("/");

  if (root !== "m") {
    throw new Error(`Invalid derivation path: ${path}`);
  }

  return segments.map((segment) => {
    const match = /^(\d+)'$/.exec(segment);

    /* SLIP-0010 ed25519 only supports hardened indices */
    if (!match) {
      throw new Error(`Path must be fully hardened: ${path}`);
    }

    return Number(match[1]);
  });
}

/** 32-byte ed25519 private seed for a path, using SLIP-0010 */
export async function deriveEd25519Seed(
  seed: Uint8Array,
  path: string,
): Promise<Uint8Array> {
  return deriveEd25519Path(Buffer.from(seed), parseHardenedPath(path));
}
