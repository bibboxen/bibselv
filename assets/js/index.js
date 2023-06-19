/**
 * @file
 * Sets up react app.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import socketIOClient from "socket.io-client";

const rootElement = document.getElementById("reactjs-root");
const socket = socketIOClient(rootElement.getAttribute("data-socket-uri"));
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App
      uniqueId={rootElement.getAttribute("data-unique-id")}
      socket={socket}
    />
  </React.StrictMode>
);
