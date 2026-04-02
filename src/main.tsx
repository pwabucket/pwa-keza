import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { PWARoutingProvider } from "@pwabucket/pwa-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

/** Register Service Worker */
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PWARoutingProvider>
        <App />
      </PWARoutingProvider>
    </BrowserRouter>
  </StrictMode>,
);
