import { LetterCase } from "../wallets/vanity";
import { base58PrefixChance } from "./base58Chance";
import type { VanityCapability } from "../types/wallet";

/** Longest prefix plus suffix accepted, beyond which a search is hopeless */
export const MAX_VANITY_LENGTH = 10;

/** What the user asked for, before normalisation */
export interface VanityPattern {
  prefix: string;
  suffix: string;
  /** Only used for mixed-case (base58) addresses */
  matchCase: boolean;
}

/** What the worker matches addresses against */
export interface VanityMatcher {
  /** Includes the chain's fixed prefix */
  prefix: string;
  suffix: string;
  ignoreCase: boolean;
}

function ignoresCase(capability: VanityCapability, pattern: VanityPattern) {
  return capability.letterCase !== LetterCase.MIXED || !pattern.matchCase;
}

/** Puts the user's text into the letter case the chain's addresses use */
function normalizeText(capability: VanityCapability, text: string) {
  const trimmed = text.trim();

  switch (capability.letterCase) {
    case LetterCase.LOWER:
      return trimmed.toLowerCase();
    case LetterCase.UPPER:
      return trimmed.toUpperCase();
    case LetterCase.MIXED:
      return trimmed;
  }
}

/** Share of characters in a set that match a character */
function matchChance(char: string, characters: string, ignoreCase: boolean) {
  const folded = ignoreCase ? char.toLowerCase() : char;
  let matches = 0;

  for (const candidate of characters) {
    const value = ignoreCase ? candidate.toLowerCase() : candidate;
    if (value === folded) matches++;
  }

  return matches / characters.length;
}

/** Why a pattern can't be searched for, or null when it can */
export function getVanityError(
  capability: VanityCapability,
  pattern: VanityPattern,
) {
  const prefix = normalizeText(capability, pattern.prefix);
  const suffix = normalizeText(capability, pattern.suffix);
  const ignoreCase = ignoresCase(capability, pattern);

  if (!prefix && !suffix) {
    return "Enter a prefix, a suffix or both.";
  }

  if (prefix.length + suffix.length > MAX_VANITY_LENGTH) {
    return `Use at most ${MAX_VANITY_LENGTH} characters in total.`;
  }

  for (const char of prefix + suffix) {
    if (matchChance(char, capability.alphabet, ignoreCase) === 0) {
      return `"${char}" can't appear in these addresses.`;
    }
  }

  const first = capability.firstCharacters;

  if (prefix && first && matchChance(prefix[0], first, ignoreCase) === 0) {
    const allowed = [...first].join(", ");

    return capability.fixedPrefix
      ? `After ${capability.fixedPrefix}, the next character can only be ${allowed}.`
      : `Addresses can only start with ${allowed}.`;
  }

  if (
    prefix &&
    capability.base58Range &&
    base58PrefixChance(
      capability.fixedPrefix + prefix,
      capability.base58Range,
      ignoreCase,
    ) === 0
  ) {
    return `No address can start with ${capability.fixedPrefix}${prefix}.`;
  }

  return null;
}

/** The normalised matcher for a valid pattern */
export function createVanityMatcher(
  capability: VanityCapability,
  pattern: VanityPattern,
): VanityMatcher {
  const ignoreCase = ignoresCase(capability, pattern);
  const fold = (text: string) => (ignoreCase ? text.toLowerCase() : text);

  return {
    prefix: fold(
      capability.fixedPrefix + normalizeText(capability, pattern.prefix),
    ),
    suffix: fold(normalizeText(capability, pattern.suffix)),
    ignoreCase,
  };
}

/** True when an address matches */
export function matchesVanity(address: string, matcher: VanityMatcher) {
  const value = matcher.ignoreCase ? address.toLowerCase() : address;

  return value.startsWith(matcher.prefix) && value.endsWith(matcher.suffix);
}

/** Expected number of tries to find a match for a valid pattern */
export function getVanityDifficulty(
  capability: VanityCapability,
  pattern: VanityPattern,
) {
  const prefix = normalizeText(capability, pattern.prefix);
  const suffix = normalizeText(capability, pattern.suffix);
  const ignoreCase = ignoresCase(capability, pattern);

  return (
    1 /
    (getPrefixChance(capability, prefix, ignoreCase) *
      getSuffixChance(capability, suffix, ignoreCase))
  );
}

/** Chance that a random address starts with the user's prefix */
function getPrefixChance(
  capability: VanityCapability,
  prefix: string,
  ignoreCase: boolean,
) {
  if (capability.base58Range) {
    return base58PrefixChance(
      capability.fixedPrefix + prefix,
      capability.base58Range,
      ignoreCase,
    );
  }

  let chance = 1;

  [...prefix].forEach((char, index) => {
    const characters =
      index === 0 && capability.firstCharacters
        ? capability.firstCharacters
        : capability.alphabet;
    chance *= matchChance(char, characters, ignoreCase);
  });

  return chance;
}

/** Chance that a random address ends with the suffix; endings are uniform */
function getSuffixChance(
  capability: VanityCapability,
  suffix: string,
  ignoreCase: boolean,
) {
  let chance = 1;

  for (const char of suffix) {
    chance *= matchChance(char, capability.alphabet, ignoreCase);
  }

  return chance;
}

/** Seconds until there's an even chance of a match at a given rate */
export function getHalfChanceSeconds(
  difficulty: number,
  triesPerSecond: number,
) {
  return (Math.LN2 * difficulty) / triesPerSecond;
}
