import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import CustomCursor from "./components/CustomCursor.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CustomCursor />
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
