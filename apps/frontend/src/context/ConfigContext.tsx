import React, { createContext, useState } from 'react';
import { networks, Network } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';

import { LilyConfig, EMPTY_CONFIG, NodeConfigWithBlockchainInfo } from '@lily/types';

export const ConfigContext = createContext({
  setConfigFile: (config: LilyConfig) => {},
  config: {} as LilyConfig,
  setNodeConfig: (nodeConfig: NodeConfigWithBlockchainInfo) => {},
  nodeConfig: {} as any,
  currentBitcoinPrice: new BigNumber(0),
  setCurrentBitcoinPrice: (bitcoinPrice: BigNumber) => {},
  currentBitcoinNetwork: {} as Network,
  setCurrentBitcoinNetwork: (network: Network) => {},
  password: {} as string,
  setPassword: (password: string) => {}
});

export const ConfigProvider = ({ children }: { children: React.ReactChild }) => {
  const [config, setConfigFile] = useState(EMPTY_CONFIG);
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(new BigNumber(0));
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(networks.bitcoin);
  const [nodeConfig, setNodeConfig] = useState<NodeConfigWithBlockchainInfo | undefined>(undefined);
  const [password, setPassword] = useState('');

  const value = {
    config,
    setConfigFile,
    nodeConfig,
    setNodeConfig,
    currentBitcoinPrice,
    setCurrentBitcoinPrice,
    currentBitcoinNetwork,
    setCurrentBitcoinNetwork,
    password,
    setPassword
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
