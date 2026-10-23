import { Route, Routes } from "@pwabucket/pwa-router";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Restore from "./pages/Restore";
import TermsOfUse from "./pages/TermsOfUse";
import { Toaster } from "react-hot-toast";
import WalletGenerator from "./pages/WalletGenerator";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="restore" element={<Restore />} />
        <Route path="generator/:id" element={<WalletGenerator />} />

        {/* Privacy Policy */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />

        {/* Terms of Use*/}
        <Route path="terms-of-use" element={<TermsOfUse />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
