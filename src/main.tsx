import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router/AppRouter";
import "./locales/i18n";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div className="loading-screen">Loading...</div>}>
      <AppRouter />
    </Suspense>
  </React.StrictMode>
);
