import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { AccountMapProvider } from "./AccountMapContext";
import { ConfigProvider } from "./ConfigContext";
import { ModalProvider } from "./ModalContext";

ReactDOM.render(
  <ConfigProvider>
    <AccountMapProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </AccountMapProvider>
  </ConfigProvider>,
  document.getElementById("root")
);
