import { useContext } from "react";
import GeneratorContext from "../contexts/GeneratorContext";

export default function useGeneratorContext() {
  return useContext(GeneratorContext)!;
}
