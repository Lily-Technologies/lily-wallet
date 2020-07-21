import React, { useEffect, useState } from 'react';
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

import { Sidebar, MobileNavbar, ErrorBoundary } from './components';

// Pages
import Login from './pages/Login';
import GDriveImport from './pages/GDriveImport';
import Setup from './pages/Setup';
import Settings from './pages/Settings';
import Vault from './pages/Vault';
import Receive from './pages/Receive';
import Send from './pages/Send';
import ColdcardImportInstructions from './pages/ColdcardImportInstructions';
import Home from './pages/Home';

const emptyConfig = {
  name: "",
  version: "0.0.1",
  isEmpty: true,
  backup_options: {
    gDrive: false
  },
  wallets: [],
  vaults: [],
  keys: []
}

function App() {
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(BigNumber(0));
  const [historicalBitcoinPrice, setHistoricalBitcoinPrice] = useState({});
  // const [config, setConfigFile] = useState(configFixture);
  // const [currentAccount, setCurrentAccount] = useState({ config: config.vaults[0] });
  const [config, setConfigFile] = useState(emptyConfig);
  const [currentAccount, setCurrentAccount] = useState({ name: 'Loading...', loading: true });
  const [accountMap, setAccountMap] = useState(new Map());
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(networks.bitcoin);
  const [refresh, setRefresh] = useState(false);

  // WALLET DATA
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(false);

  const ConfigRequired = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    if (config.isEmpty && (pathname !== '/login' && pathname !== '/gdrive-import' && pathname !== '/setup')) {
      history.push('/login');
      window.location.reload();
    }
    return null;
  }

  const toggleRefresh = () => {
    setRefresh(!refresh)
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
    if (currentBitcoinNetwork === networks.bitcoin) {
      setCurrentBitcoinNetwork(networks.testnet);
    } else {
      setCurrentBitcoinNetwork(networks.bitcoin)
    }
  }

  useEffect(() => {
    async function fetchCurrentBitcoinPrice() {
      const currentBitcoinPrice = await (await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')).data.bpi.USD.rate;
      setCurrentBitcoinPrice(new BigNumber(currentBitcoinPrice.replace(',', '')));
    }
    fetchCurrentBitcoinPrice();
  }, []);

  useEffect(() => {
    async function fetchHistoricalBTCPrice() {
      const response = await window.ipcRenderer.invoke('/historical-btc-price');
      setHistoricalBitcoinPrice(response);
    }
    fetchHistoricalBTCPrice();
  }, []);

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
        window.ipcRenderer.send('/account-data', { config: config.wallets[i] })
      }

      for (let i = 0; i < config.vaults.length; i++) {
        initialAccountMap.set(config.vaults[i].id, {
          name: config.vaults[i].name,
          config: config.vaults[i],
          transactions: [],
          loading: true
        })
        window.ipcRenderer.send('/account-data', { config: config.vaults[i] })
      }

      setCurrentAccount(initialAccountMap.values().next().value)
      setAccountMap(initialAccountMap);
    }
  }, [config, currentBitcoinNetwork, refresh]);

  useEffect(() => {
    window.ipcRenderer.on('/account-data', (event, ...args) => {
      const accountInfo = args[0];
      accountMap.set(accountInfo.config.id, {
        ...accountInfo,
        loading: false
      });
      if (currentAccount.loading) { // set the first account that comes in as current account
        setCurrentAccount(accountMap.get(accountInfo.config.id));
      }
      setAccountMap(accountMap);
    });
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <PageWrapper id="page-wrapper">
          <ScrollToTop />
          <ConfigRequired />
          {!config.isEmpty && <Sidebar config={config} setCurrentAccount={setCurrentAccountFromMap} />}
          {!config.isEmpty && <MobileNavbar config={config} setCurrentAccount={setCurrentAccountFromMap} />}
          <Switch>
            <Route path="/vault/:id" component={() => <Vault config={config} setConfigFile={setConfigFile} toggleRefresh={toggleRefresh} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinNetwork={currentBitcoinNetwork} currentBitcoinPrice={currentBitcoinPrice} />} />
            <Route path="/receive" component={() => <Receive config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinPrice={currentBitcoinPrice} />} />
            <Route path="/send" component={() => <Send config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinPrice={currentBitcoinPrice} currentBitcoinNetwork={currentBitcoinNetwork} />} />
            <Route path="/setup" component={() => <Setup config={config} setConfigFile={setConfigFile} currentBitcoinNetwork={currentBitcoinNetwork} />} />
            <Route path="/login" component={() => <Login setConfigFile={setConfigFile} />} />
            <Route path="/settings" component={() => <Settings config={config} currentBitcoinNetwork={currentBitcoinNetwork} changeCurrentBitcoinNetwork={changeCurrentBitcoinNetwork} />} />
            <Route path="/gdrive-import" component={() => <GDriveImport setConfigFile={setConfigFile} />} />
            <Route path="/coldcard-import-instructions" component={() => <ColdcardImportInstructions />} />
            <Route path="/" component={() => <Home accountMap={accountMap} setCurrentAccount={setCurrentAccountFromMap} historicalBitcoinPrice={historicalBitcoinPrice} currentBitcoinPrice={currentBitcoinPrice} />} />
            <Route path="/" component={() => (
              <div>Not Found</div>
            )}
            />
          </Switch>
        </PageWrapper>
      </Router>
    </ErrorBoundary>
  );
}

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
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
