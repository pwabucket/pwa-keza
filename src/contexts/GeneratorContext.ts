import { createContext } from "react";
import type { WalletModule } from "../types/wallet";

const GeneratorContext = createContext<WalletModule | null>(null);

export default GeneratorContext;
