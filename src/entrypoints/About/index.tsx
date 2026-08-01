import React from "react";
import ReactDOM from "react-dom/client";
import AboutWindow from "./AboutWindow";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AboutWindow />
  </React.StrictMode>,
);
