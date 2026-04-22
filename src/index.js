import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/* ===== GLOBAL STYLES ===== */
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";

/* ===== THEME PROVIDER ===== */
import { ThemeProvider } from "./theme/ThemeContext";

/* ===== PWA SERVICE WORKER ===== */
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

/* ===== SESSION PERSISTENCE CHECK ===== */
function keepSessionAlive() {
  try {
    const token = localStorage.getItem("token");

    // If token exists → keep user logged in
    if (token) {
      console.log("✅ Session restored");
    }
  } catch {
    console.log("⚠️ Storage access issue");
  }
}

// Run before React renders
keepSessionAlive();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

/* ===== ENABLE OFFLINE PWA ===== */
serviceWorkerRegistration.register();
