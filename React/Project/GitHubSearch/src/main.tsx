import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { SearchHistoryProvider } from "./context/SearchHistoryContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SearchHistoryProvider>
        <App />
      </SearchHistoryProvider>
    </ThemeProvider>
  </StrictMode>
);
