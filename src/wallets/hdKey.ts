import { HDKey } from "@scure/bip32";

/** Value added to an index to make it hardened */
const HARDENED_OFFSET = 0x80000000;

/*
 * Parent keys by seed, then by path. A derive job reuses one seed object for
 * every account, so accounts that differ only in their last index share all
 * the parent derivation. Entries go away with the seed.
 */
const parentKeys = new WeakMap<Uint8Array, Map<string, HDKey>>();

function getParentKey(seed: Uint8Array, parentPath: string) {
  let keys = parentKeys.get(seed);

  if (!keys) {
    keys = new Map();
    parentKeys.set(seed, keys);
  }

  let key = keys.get(parentPath);

  if (!key) {
    key = HDKey.fromMasterSeed(seed).derive(parentPath);
    keys.set(parentPath, key);
  }

  return key;
}

/** secp256k1 BIP32 key at a resolved path, reusing its parent across calls */
export function deriveHDKey(seed: Uint8Array, path: string): HDKey {
  const cut = path.lastIndexOf("/");
  const parentPath = path.slice(0, cut);
  const segment = path.slice(cut + 1);
  const isHardened = segment.endsWith("'");
  const index = parseInt(segment, 10) + (isHardened ? HARDENED_OFFSET : 0);

  return getParentKey(seed, parentPath).deriveChild(index);
}
