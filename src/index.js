import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { AccountMapProvider } from "./AccountMapContext";
import { ConfigProvider } from "./ConfigContext";

ReactDOM.render(
  <ConfigProvider>
    <AccountMapProvider>
      <App />
    </AccountMapProvider>
  </ConfigProvider>,
  document.getElementById("root")
);
