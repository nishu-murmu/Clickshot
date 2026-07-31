import React from "react";
import ReactDOM from "react-dom/client";
import EditWindow from "./EditWindow";
import "@/styles/index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <EditWindow />
  </React.StrictMode>,
);
