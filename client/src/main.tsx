// client/src/main.tsx
/**
 * @file main.tsx
 * @description Punto de entrada principal de la aplicación React.
 * Configura el enrutador del navegador y renderiza el componente App.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
