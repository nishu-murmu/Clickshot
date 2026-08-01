import React from "react";
import ReactDOM from "react-dom/client";
import SettingsWindow from "./SettingsWindow";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsWindow />
  </React.StrictMode>,
);
