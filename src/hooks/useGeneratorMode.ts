import { useCallback } from "react";
import { useLocationState } from "@pwabucket/pwa-router";

import { GeneratorMode } from "../components/generator/generatorMode";

/**
 * The generator page's mode, kept in history so back returns from the
 * phrase form to Generate. Only the mode name is stored, never the phrase.
 */
export default function useGeneratorMode() {
  const [mode, setMode] = useLocationState<GeneratorMode>(
    "generator-mode",
    GeneratorMode.GENERATE,
  );

  const changeMode = useCallback(
    (next: GeneratorMode) => {
      if (next === mode) return;

      /* Generate is the base entry, so going back to it pops the form */
      if (next === GeneratorMode.GENERATE) {
        setMode(undefined);
      } else {
        /* Moving between the other modes keeps one entry above Generate */
        setMode(next, { replace: mode !== GeneratorMode.GENERATE });
      }
    },
    [mode, setMode],
  );

  return [mode, changeMode] as const;
}
