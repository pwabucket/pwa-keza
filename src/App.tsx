import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Restore from "./pages/Restore";
import TermsOfUse from "./pages/TermsOfUse";
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
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
