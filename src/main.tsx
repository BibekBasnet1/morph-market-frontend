import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <ErrorBoundary>
       <ThemeProvider>
      <App />
       </ThemeProvider>
    </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
