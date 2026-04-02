import { Route, Routes } from "react-router";

import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Restore from "./pages/Restore";
import TermsOfUse from "./pages/TermsOfUse";
import { Toaster } from "react-hot-toast";
import WalletGenerator from "./pages/WalletGenerator";
import { usePWARouting } from "@pwabucket/pwa-router";

function App() {
  const { resolvedLocation } = usePWARouting();
  return (
    <>
      <Routes location={resolvedLocation}>
        <Route index element={<Home />} />
        <Route path="restore" element={<Restore />} />
        <Route path="generator/:id" element={<WalletGenerator />} />

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
