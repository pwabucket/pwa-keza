import App from "./App.tsx";
import { PWARouter } from "@pwabucket/pwa-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerServiceWorker } from "./registerServiceWorker";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PWARouter>
      <App />
    </PWARouter>
  </StrictMode>,
);
