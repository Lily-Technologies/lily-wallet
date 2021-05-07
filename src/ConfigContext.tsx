import React, { createContext, useState } from "react";

import { LilyConfig } from "./types";

export const EMPTY_CONFIG = {
  name: "",
  version: "1.0.0",
  isEmpty: true,
  license: {
    license: "trial:0",
    signature: "",
  },
  backup_options: {
    gDrive: false,
  },
  wallets: [],
  vaults: [],
  keys: [],
  exchanges: [],
} as LilyConfig;

export const ConfigContext = createContext({
  setConfigFile: (config: LilyConfig) => {},
  config: {} as LilyConfig,
});

export const ConfigProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [config, setConfigFile] = useState(EMPTY_CONFIG);

  const value = {
    config,
    setConfigFile,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
