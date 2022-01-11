import React, { createContext, useState } from 'react';
import { networks, Network } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';

import { LilyConfig, EMPTY_CONFIG } from '@lily/types';

export const ConfigContext = createContext({
  setConfigFile: (config: LilyConfig) => {},
  config: {} as LilyConfig,
  currentBitcoinPrice: new BigNumber(0),
  setCurrentBitcoinPrice: (bitcoinPrice: BigNumber) => {},
  currentBitcoinNetwork: {} as Network,
  setCurrentBitcoinNetwork: (network: Network) => {}
});

export const ConfigProvider = ({ children }: { children: React.ReactChild }) => {
  const [config, setConfigFile] = useState(EMPTY_CONFIG);
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(new BigNumber(0));
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(networks.bitcoin);

  const value = {
    config,
    setConfigFile,
    currentBitcoinPrice,
    setCurrentBitcoinPrice,
    currentBitcoinNetwork,
    setCurrentBitcoinNetwork
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
