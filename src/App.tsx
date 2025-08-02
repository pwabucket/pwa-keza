import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import BitcoinWalletGenerator from "./pages/BitcoinWalletGenerator";
import EVMWalletGenerator from "./pages/EVMWalletGenerator";
import Home from "./pages/Home";
import MnemonicWalletGenerator from "./pages/MnemonicWalletGenerator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Restore from "./pages/Restore";
import SolanaWalletGenerator from "./pages/SolanaWalletGenerator";
import StellarWalletGenerator from "./pages/StellarWalletGenerator";
import TONWalletGenerator from "./pages/TONWalletGenerator";
import TermsOfUse from "./pages/TermsOfUse";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="restore" element={<Restore />} />
        <Route path="generator">
          <Route path="bitcoin" element={<BitcoinWalletGenerator />} />
          <Route path="evm" element={<EVMWalletGenerator />} />
          <Route path="solana" element={<SolanaWalletGenerator />} />
          <Route path="ton" element={<TONWalletGenerator />} />
          <Route path="stellar" element={<StellarWalletGenerator />} />
          <Route
            path="12-word-mnemonic"
            element={<MnemonicWalletGenerator strength={12} />}
          />
          <Route
            path="24-word-mnemonic"
            element={<MnemonicWalletGenerator strength={24} />}
          />
        </Route>
        {/* Privacy Policy */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />

        {/* Terms of Use*/}
        <Route path="terms-of-use" element={<TermsOfUse />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
