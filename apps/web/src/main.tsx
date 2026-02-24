import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { setApiBaseUrl } from "@flockloop/api-client";
import "./styles/index.css";

// Configure API base URL from environment
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (apiBaseUrl) {
  setApiBaseUrl(apiBaseUrl);
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
