import toast from "react-hot-toast";
import { useCallback, useMemo, useState } from "react";

import {
  createVanityMatcher,
  getVanityDifficulty,
  getVanityError,
} from "../lib/vanity";
import type { VanityCapability } from "../types/wallet";

/** State, validation and difficulty of the vanity form for one chain */
export default function useVanityForm(capability: VanityCapability) {
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [matchCase, setMatchCase] = useState(true);

  const pattern = useMemo(
    () => ({ prefix, suffix, matchCase }),
    [prefix, suffix, matchCase],
  );
  const error = useMemo(
    () => getVanityError(capability, pattern),
    [capability, pattern],
  );
  const difficulty = useMemo(
    () => (error ? null : getVanityDifficulty(capability, pattern)),
    [capability, pattern, error],
  );

  const handlePrefixChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setPrefix(event.target.value),
    [],
  );
  const handleSuffixChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSuffix(event.target.value),
    [],
  );
  const toggleMatchCase = useCallback(() => setMatchCase((prev) => !prev), []);

  /** The matcher to search with, or null after showing why it can't run */
  const buildMatcher = useCallback(() => {
    if (error) {
      toast.error(error, { id: "vanity" });
      return null;
    }

    return createVanityMatcher(capability, pattern);
  }, [capability, pattern, error]);

  return {
    prefix,
    suffix,
    matchCase,
    handlePrefixChange,
    handleSuffixChange,
    toggleMatchCase,
    error,
    difficulty,
    buildMatcher,
  };
}
