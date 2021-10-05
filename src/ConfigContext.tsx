import React, { createContext, useState } from "react";
import { networks, Network } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";

import { LilyConfig } from "./types";

export const EMPTY_CONFIG = {
  name: "",
  version: "1.0.8",
  isEmpty: true,
  backup_options: {
    gDrive: false,
  },
  wallets: [],
  vaults: [],
  lightning: [],
  keys: [],
  exchanges: [],
} as LilyConfig;

export const ConfigContext = createContext({
  setConfigFile: (config: LilyConfig) => {},
  config: {} as LilyConfig,
  currentBitcoinPrice: new BigNumber(0),
  setCurrentBitcoinPrice: (bitcoinPrice: BigNumber) => {},
  currentBitcoinNetwork: {} as Network,
  setCurrentBitcoinNetwork: (network: Network) => {},
});

export const ConfigProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [config, setConfigFile] = useState(EMPTY_CONFIG);
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(
    new BigNumber(0)
  );
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(
    networks.bitcoin
  );

  const value = {
    config,
    setConfigFile,
    currentBitcoinPrice,
    setCurrentBitcoinPrice,
    currentBitcoinNetwork,
    setCurrentBitcoinNetwork,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
