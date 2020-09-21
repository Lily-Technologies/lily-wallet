import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { networks } from 'bitcoinjs-lib';

import { offWhite } from './utils/colors';
import { mobile } from './utils/media';
import { bitcoinNetworkEqual } from './utils/transactions';

import { Sidebar, MobileNavbar, TitleBar } from './components';

// Pages
import Login from './pages/Login';
import Setup from './pages/Setup';
import Settings from './pages/Settings';
import Vault from './pages/Vault';
import Receive from './pages/Receive';
import Send from './pages/Send';
import ColdcardImportInstructions from './pages/ColdcardImportInstructions';
import Home from './pages/Home';

const emptyConfig = {
  name: "",
  version: "0.0.2",
  isEmpty: true,
  backup_options: {
    gDrive: false
  },
  wallets: [],
  vaults: [],
  keys: [],
  exchanges: []
}

function App() {
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(BigNumber(0));
  const [historicalBitcoinPrice, setHistoricalBitcoinPrice] = useState({});
  const [config, setConfigFile] = useState(emptyConfig);
  const [encryptedConfigFile, setEncryptedConfigFile] = useState(null);
  const [currentAccount, setCurrentAccount] = useState({ name: 'Loading...', loading: true });
  const [accountMap, setAccountMap] = useState(new Map());
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(networks.bitcoin);
  const [refresh, setRefresh] = useState(false);
  const [flyInAnimation, setInitialFlyInAnimation] = useState(true);
  const [nodeConfig, setNodeConfig] = useState(undefined);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [password, setPassword] = useState('');
  const history = useHistory();

  const ConfigRequired = () => {
    const { pathname } = useLocation();
    if (config.isEmpty && (pathname !== '/login' && pathname !== '/decrypt' && pathname !== '/setup')) {
      history.push('/login');
    }
    return null;
  }

  const toggleRefresh = () => {
    setRefresh(!refresh)
  }

  const resetConfigFile = async () => {
    setConfigFile(emptyConfig);
    const { file, modifiedTime } = await window.ipcRenderer.invoke('/get-config');
    setEncryptedConfigFile({ file: file.toString(), modifiedTime });
    setInitialFlyInAnimation(true);
    history.push('/login');
  }

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  const setCurrentAccountFromMap = (accountId) => {
    const newAccount = accountMap.get(accountId);
    if (newAccount) {
      setCurrentAccount(newAccount);
    }
  }

  const changeCurrentBitcoinNetwork = () => {
    if (bitcoinNetworkEqual(currentBitcoinNetwork, networks.bitcoin)) {
      setCurrentBitcoinNetwork(networks.testnet);
    } else {
      setCurrentBitcoinNetwork(networks.bitcoin)
    }
  }

  const connectToBlockstream = async () => {
    setNodeConfig(undefined);
    const response = await window.ipcRenderer.invoke('/changeNodeConfig', {
      nodeConfig: {
        provider: 'Blockstream'
      }
    });
    setNodeConfig(response)
  }

  const connectToBitcoinCore = async () => {
    setNodeConfig(undefined);
    const response = await window.ipcRenderer.invoke('/changeNodeConfig', {
      nodeConfig: {
        provider: 'Bitcoin Core'
      }
    });
    setNodeConfig(response)
  }

  const getNodeConfig = async () => {
    const response = await window.ipcRenderer.invoke('/getNodeConfig');
    setNodeConfig(response)
  }

  const prevSetFlyInAnimation = useRef();
  useEffect(() => {
    prevSetFlyInAnimation.current = flyInAnimation;
  })

  useEffect(() => {
    async function getConfig() {
      if (config.isEmpty) {
        try {
          const { file, modifiedTime } = await window.ipcRenderer.invoke('/get-config');
          setEncryptedConfigFile({ file: file.toString(), modifiedTime });
        } catch (e) {

        }
      }
    }
    getConfig()
  }, [])

  useEffect(() => {
    async function fetchBitcoinNetwork() {
      const bitcoinNetwork = await window.ipcRenderer.invoke('/bitcoin-network');
      setCurrentBitcoinNetwork(bitcoinNetwork);
    }
    fetchBitcoinNetwork();
  }, []);

  useEffect(() => {
    if (!config.isEmpty) {
      setTimeout(() => {
        setInitialFlyInAnimation(false);
      }, 100);
    }
  }, [config]);

  useEffect(() => {
    async function fetchCurrentBitcoinPrice() {
      const currentBitcoinPrice = await (await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')).data.bpi.USD.rate;
      setCurrentBitcoinPrice(new BigNumber(currentBitcoinPrice.replace(',', '')));
    }
    fetchCurrentBitcoinPrice();
  }, []);

  useEffect(() => {
    async function fetchHistoricalBTCPrice() {
      try {
        const response = await window.ipcRenderer.invoke('/historical-btc-price');
        setHistoricalBitcoinPrice(response);
      } catch (e) {
        console.log('Error retrieving historical bitcoin price')
      }
    }
    fetchHistoricalBTCPrice();
  }, []);

  useEffect(() => {
    async function fetchNodeConfig() {
      try {
        const response = await window.ipcRenderer.invoke('/getNodeConfig');
        setNodeConfig(response);
      } catch (e) {
        console.log(e.message)
      }
    }
    fetchNodeConfig();
  }, []);

  const updateAccountMap = useCallback(
    (accountInfo) => {
      accountMap.set(accountInfo.config.id, {
        ...accountInfo,
        loading: false
      });
      if (currentAccount.loading) {
        setCurrentAccount(accountMap.get(accountInfo.config.id));
      }
      setAccountMap(accountMap);
    }, [accountMap, currentAccount]
  );

  // fetch/build account data from config file
  useEffect(() => {
    if (config.wallets.length || config.vaults.length) {
      const initialAccountMap = new Map();

      for (let i = 0; i < config.wallets.length; i++) {
        initialAccountMap.set(config.wallets[i].id, {
          name: config.wallets[i].name,
          config: config.wallets[i],
          transactions: [],
          loading: true
        })
        window.ipcRenderer.send('/account-data', { config: config.wallets[i], nodeConfig }) // TODO: allow setting nodeConfig to be dynamic later
      }

      for (let i = 0; i < config.vaults.length; i++) {
        initialAccountMap.set(config.vaults[i].id, {
          name: config.vaults[i].name,
          config: config.vaults[i],
          transactions: [],
          loading: true
        })
        window.ipcRenderer.send('/account-data', { config: config.vaults[i], nodeConfig }) // TODO: allow setting nodeConfig to be dynamic later
      }

      window.ipcRenderer.on('/account-data', (event, ...args) => {
        const accountInfo = args[0];
        if (nodeConfig) {
          accountInfo.nodeConfig = {
            ...nodeConfig,
            wallet: accountInfo.config.name,
          };
        }
        updateAccountMap(args[0]);
        accountMap.set(accountInfo.config.id, {
          ...accountInfo,
          loading: false
        });
        if (currentAccount.loading) { // set the first account that comes in as current account
          setCurrentAccount(accountMap.get(accountInfo.config.id));
        }
        setAccountMap(new Map([...initialAccountMap, ...accountMap]));
      });

      setCurrentAccount(initialAccountMap.values().next().value)
      setAccountMap(initialAccountMap);
    }
  }, [config, refresh, nodeConfig]);

  return (
    <Router>
      <TitleBar setNodeConfig={setNodeConfig} nodeConfig={nodeConfig} setMobileNavOpen={setMobileNavOpen} config={config} connectToBlockstream={connectToBlockstream} connectToBitcoinCore={connectToBitcoinCore} getNodeConfig={getNodeConfig} resetConfigFile={resetConfigFile} />
      <PageWrapper id="page-wrapper">
        <ScrollToTop />
        <ConfigRequired />
        {!config.isEmpty && <Sidebar config={config} setCurrentAccount={setCurrentAccountFromMap} flyInAnimation={flyInAnimation} currentBitcoinNetwork={currentBitcoinNetwork} />}
        {!config.isEmpty && <MobileNavbar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} config={config} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinNetwork={currentBitcoinNetwork} />}
        <Switch>
          <Route path="/vault/:id" component={() => <Vault config={config} setConfigFile={setConfigFile} password={password} toggleRefresh={toggleRefresh} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinNetwork={currentBitcoinNetwork} currentBitcoinPrice={currentBitcoinPrice} />} />
          <Route path="/receive" component={() => <Receive config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinPrice={currentBitcoinPrice} />} />
          <Route path="/send" component={() => <Send config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} toggleRefresh={toggleRefresh} currentBitcoinPrice={currentBitcoinPrice} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/setup" component={() => <Setup config={config} setConfigFile={setConfigFile} setPassword={setPassword} password={password} encryptedConfigFile={encryptedConfigFile} setEncryptedConfigFile={setEncryptedConfigFile} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/login" component={() => <Login setConfigFile={setConfigFile} password={password} setPassword={setPassword} encryptedConfigFile={encryptedConfigFile} setEncryptedConfigFile={setEncryptedConfigFile} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/settings" component={() => <Settings config={config} currentBitcoinNetwork={currentBitcoinNetwork} changeCurrentBitcoinNetwork={changeCurrentBitcoinNetwork} />} />
          <Route path="/coldcard-import-instructions" component={() => <ColdcardImportInstructions />} />
          <Route path="/" component={() => <Home flyInAnimation={flyInAnimation} prevFlyInAnimation={prevSetFlyInAnimation.current} accountMap={accountMap} setCurrentAccount={setCurrentAccountFromMap} historicalBitcoinPrice={historicalBitcoinPrice} currentBitcoinPrice={currentBitcoinPrice} />} />
          <Route path="/" component={() => (
            <div>Not Found</div>
          )}
          />
        </Switch>
      </PageWrapper>
    </Router>
  );
}

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  margin-top: 2.5rem;;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  background: ${offWhite};
  cursor: ${p => p.loading ? 'wait' : 'auto'};
  pointer-events: ${p => p.loading ? 'none' : 'auto'};

  ${mobile(css`
    flex-direction: column;
  `)};
`;

export default App;
