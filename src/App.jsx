import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import EVMWalletGenerator from "./pages/EVMWalletGenerator";
import Home from "./pages/Home";
import SolanaWalletGenerator from "./pages/SolanaWalletGenerator";
import TONWalletGenerator from "./pages/TONWalletGenerator";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="generator">
          <Route path="evm" element={<EVMWalletGenerator />} />
          <Route path="ton" element={<TONWalletGenerator />} />
          <Route path="solana" element={<SolanaWalletGenerator />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
