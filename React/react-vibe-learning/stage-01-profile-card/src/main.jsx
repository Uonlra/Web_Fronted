import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>  {/*StrictMode 是 React 的一个工具，用于帮助开发者发现潜在的问题和不安全的生命周期方法。它不会渲染任何 UI，但会在开发模式下激活额外的检查和警告。 */}
    <App />
  </StrictMode>
);
