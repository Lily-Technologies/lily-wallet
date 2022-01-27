import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { HashRouter as Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { networks } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';

import { gray50, green700 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

import { Sidebar, TitleBar, ScrollToTop, AlertBar } from 'src/components';

// Pages
import Login from 'src/pages/Login';
import Setup from 'src/pages/Setup';
import Settings from 'src/pages/Settings';
import Vault from 'src/pages/Vault';
import Lightning from 'src/pages/Lightning';
import Receive from 'src/pages/Receive';
import Send from 'src/pages/Send';
import Home from 'src/pages/Home';
import Purchase from 'src/pages/Purchase';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import {
  NodeConfigWithBlockchainInfo,
  File,
  AccountMap,
  LilyAccount,
  LilyLightningAccount,
  LilyOnchainAccount
} from '@lily/types';

const App = () => {
  document.title = `Lily Wallet`;
  const { setAccountMap, updateAccountMap } = useContext(AccountMapContext);
  const {
    config,
    setCurrentBitcoinPrice,
    currentBitcoinPrice,
    currentBitcoinNetwork,
    setCurrentBitcoinNetwork,
    setNodeConfig,
    nodeConfig
  } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const [historicalBitcoinPrice, setHistoricalBitcoinPrice] = useState({});
  const [encryptedConfigFile, setEncryptedConfigFile] = useState<File | null>(null);
  const [fetchingEncryptedConfig, setFetchingEncryptedConfig] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [flyInAnimation, setInitialFlyInAnimation] = useState(true);
  const [password, setPassword] = useState('');

  const ConfigRequired = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    if (config.isEmpty && !(pathname === '/login' || pathname === '/settings')) {
      history.push('/login');
    }
    return null;
  };

  const Overlay = () => {
    const { pathname } = useLocation();
    if (!config.isEmpty && pathname !== '/setup') {
      return <ColorOverlap />;
    } else if (config.isEmpty && pathname === '/settings') {
      return <ColorOverlap />;
    }
    return null;
  };

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  const getNodeConfig = useCallback(async () => {
    const response = await platform.getNodeConfig();
    setNodeConfig(response);
  }, [platform]);

  const prevSetFlyInAnimation = useRef() as { current: boolean };
  useEffect(() => {
    prevSetFlyInAnimation.current = flyInAnimation;
  });

  useEffect(() => {
    async function retrieveConfig() {
      if (config.isEmpty) {
        setFetchingEncryptedConfig(true);
        try {
          const { file, modifiedTime } = await platform.getConfig();
          setEncryptedConfigFile({ file: file.toString(), modifiedTime });
        } catch (e) {}
        setFetchingEncryptedConfig(false);
      }
    }
    retrieveConfig();
  }, [config.isEmpty, platform]);

  useEffect(() => {
    async function fetchBitcoinNetwork() {
      const isTestnet = await platform.isTestnet();
      setCurrentBitcoinNetwork(isTestnet ? networks.testnet : networks.bitcoin);
    }
    fetchBitcoinNetwork();
  }, [setCurrentBitcoinNetwork, platform]);

  useEffect(() => {
    if (!config.isEmpty) {
      setTimeout(() => {
        setInitialFlyInAnimation(false);
      }, 100);
    }
  }, [config]);

  useEffect(() => {
    async function fetchCurrentBitcoinPrice() {
      const currentBitcoinPrice = await platform.getCurrentBitcoinPrice();
      setCurrentBitcoinPrice(new BigNumber(currentBitcoinPrice));
    }
    fetchCurrentBitcoinPrice();
  }, [setCurrentBitcoinPrice, platform]);

  useEffect(() => {
    async function fetchHistoricalBTCPrice() {
      try {
        const response = await platform.getHistoricalBitcoinPrice();
        setHistoricalBitcoinPrice(response);
      } catch (e) {
        console.log('Error retrieving historical bitcoin price');
      }
    }
    fetchHistoricalBTCPrice();
  }, [platform]);

  useEffect(() => {
    async function fetchNodeConfig() {
      try {
        await getNodeConfig();
      } catch (e) {
        console.log(e);
      }
    }
    fetchNodeConfig();
  }, [getNodeConfig]);

  // fetch/build account data from config file
  useEffect(() => {
    const initialAccountMap: AccountMap = {};

    for (let i = 0; i < config.wallets.length; i++) {
      initialAccountMap[config.wallets[i].id] = {
        name: config.wallets[i].name,
        config: config.wallets[i],
        transactions: [],
        unusedAddresses: [],
        addresses: [],
        changeAddresses: [],
        availableUtxos: [],
        unusedChangeAddresses: [],
        currentBalance: 0,
        loading: true
      };

      platform.getOnchainData(config.wallets[i], (accountInfo: LilyAccount) => {
        updateAccountMap({
          ...accountInfo
        });
      });
    }

    for (let i = 0; i < config.vaults.length; i++) {
      initialAccountMap[config.vaults[i].id] = {
        name: config.vaults[i].name,
        config: config.vaults[i],
        transactions: [],
        unusedAddresses: [],
        addresses: [],
        changeAddresses: [],
        availableUtxos: [],
        unusedChangeAddresses: [],
        currentBalance: 0,
        loading: true
      };
      platform.getOnchainData(config.vaults[i], (accountInfo: LilyOnchainAccount) => {
        updateAccountMap({
          ...accountInfo
        });
      });
    }

    for (let i = 0; i < config.lightning.length; i++) {
      initialAccountMap[config.lightning[i].id] = {
        name: config.lightning[i].name,
        config: config.lightning[i],
        channels: [],
        pendingChannels: [],
        closedChannels: [],
        info: {},
        events: [],
        payments: [],
        invoices: [],
        balanceHistory: [],
        currentBalance: {
          balance: '0',
          pendingOpenBalance: '0'
        },
        loading: true
      };

      platform.getLightningData(config.lightning[i], (accountInfo: LilyLightningAccount) => {
        updateAccountMap({
          ...accountInfo
        });
      });
    }

    setAccountMap(initialAccountMap);
  }, [config, refresh, setAccountMap, updateAccountMap, platform]);

  return (
    <Router>
      <ScrollToTop />
      {process.env.REACT_APP_IS_ELECTRON ? (
        <TitleBar nodeConfig={nodeConfig} config={config} />
      ) : null}
      <ConfigRequired />
      <Overlay />
      {!config.isEmpty && <Sidebar currentBitcoinNetwork={currentBitcoinNetwork} />}
      <Switch>
        <Route
          path='/login'
          render={() => (
            <Login
              setPassword={setPassword}
              encryptedConfigFile={encryptedConfigFile}
              setEncryptedConfigFile={setEncryptedConfigFile}
              currentBlockHeight={nodeConfig && nodeConfig.blocks}
              fetchingEncryptedConfig={fetchingEncryptedConfig}
            />
          )}
        />

        <Route
          path='/vault/:id/purchase'
          render={() => (
            <Purchase
              currentBitcoinPrice={currentBitcoinPrice}
              password={password}
              nodeConfig={nodeConfig!}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          )}
        />
        <Route
          path='/vault/:id'
          render={() => (
            <Vault
              password={password}
              toggleRefresh={toggleRefresh}
              currentBitcoinNetwork={currentBitcoinNetwork}
              nodeConfig={nodeConfig!}
            />
          )}
        />
        <Route
          path='/lightning/:id'
          render={() => (
            <Lightning
              password={password}
              toggleRefresh={toggleRefresh}
              currentBitcoinNetwork={currentBitcoinNetwork}
              nodeConfig={nodeConfig!}
            />
          )}
        />
        <Route path='/receive' render={() => <Receive config={config} />} />
        {nodeConfig && (
          <Route
            path='/send'
            render={() => (
              <Send
                config={config}
                currentBitcoinPrice={currentBitcoinPrice}
                nodeConfig={nodeConfig}
                currentBitcoinNetwork={currentBitcoinNetwork}
              />
            )}
          />
        )}
        <Route
          path='/setup'
          render={() => (
            <Setup
              password={password}
              currentBlockHeight={nodeConfig! && nodeConfig.blocks!}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
          )}
        />
        <Route
          path='/settings'
          render={() => (
            <Settings
              nodeConfig={nodeConfig!}
              getNodeConfig={getNodeConfig}
              currentBitcoinNetwork={currentBitcoinNetwork}
              // @ts-ignore
              setNodeConfig={setNodeConfig}
              password={password}
            />
          )}
        />
        <Route
          path='/'
          render={() => (
            <Home
              flyInAnimation={flyInAnimation}
              prevFlyInAnimation={prevSetFlyInAnimation.current}
              historicalBitcoinPrice={historicalBitcoinPrice}
              currentBitcoinPrice={currentBitcoinPrice}
            />
          )}
        />
        <Route path='*' render={() => <div>Not Found</div>} />
      </Switch>
    </Router>
  );
};

const ColorOverlap = styled.div`
  background-image: ${`url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%2338a169' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E")`};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 19em;
  background-color: ${green700};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  ${mobile(css`
    height: 20em;
  `)}
`;

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  background: ${gray50};

  ${mobile(css`
    flex-direction: column;
  `)};
`;

export default App;
