import React, { useEffect, useState, useRef, useContext } from 'react';
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

import { offWhite, green700 } from './utils/colors';
import { mobile } from './utils/media';

import { Sidebar, MobileNavbar, TitleBar, ScrollToTop, PurchaseLicenseModal } from './components';

// Pages
import Login from './pages/Login';
import Setup from './pages/Setup';
import Settings from './pages/Settings';
import Vault from './pages/Vault';
import Receive from './pages/Receive';
import Send from './pages/Send';
import Home from './pages/Home';

import { AccountMapContext } from './AccountMapContext';

import { LilyConfig, NodeConfig, File, AccountMap, LilyAccount } from './types';

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
} as LilyConfig;

const App = () => {
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(new BigNumber(0));
  const [historicalBitcoinPrice, setHistoricalBitcoinPrice] = useState({});
  const [config, setConfigFile] = useState<LilyConfig>(emptyConfig);
  const [encryptedConfigFile, setEncryptedConfigFile] = useState<File | null>(null);
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(networks.bitcoin);
  const [refresh, setRefresh] = useState(false);
  const [flyInAnimation, setInitialFlyInAnimation] = useState(true);
  const [nodeConfig, setNodeConfig] = useState<NodeConfig | undefined>(undefined);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [purchaseLicenseModalOpen, setPurchaseLicenseModalOpen] = useState(false);

  const { setAccountMap, updateAccountMap } = useContext(AccountMapContext);

  const ConfigRequired = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    if (config.isEmpty && (pathname !== '/login')) {
      history.push('/login');
    }
    return null;
  }

  const Overlay = () => {
    const { pathname } = useLocation();
    if (!config.isEmpty && (pathname !== '/setup')) {
      return <ColorOverlap />
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

  const prevSetFlyInAnimation = useRef() as { current: boolean };
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
  }, [config.isEmpty])

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

  // fetch/build account data from config file
  useEffect(() => {
    if (config.wallets.length || config.vaults.length) {
      const initialAccountMap = {} as AccountMap;

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
        }
        window.ipcRenderer.send('/account-data', { config: config.wallets[i], nodeConfig }) // TODO: allow setting nodeConfig to be dynamic later
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
        }
        window.ipcRenderer.send('/account-data', { config: config.vaults[i], nodeConfig }) // TODO: allow setting nodeConfig to be dynamic later
      }

      window.ipcRenderer.on('/account-data', (_event: any, ...args: any) => {
        const accountInfo = args[0] as LilyAccount;

        updateAccountMap({
          ...accountInfo,
          loading: false
        })
      });

      setAccountMap(initialAccountMap)
    }
  }, [config, refresh, nodeConfig, setAccountMap, updateAccountMap]);

  return (
    <Router>
      <ScrollToTop />
      <PurchaseLicenseModal isOpen={purchaseLicenseModalOpen} onRequestClose={() => setPurchaseLicenseModalOpen(false)} />
      <TitleBar setNodeConfig={setNodeConfig} nodeConfig={nodeConfig} setMobileNavOpen={setMobileNavOpen} config={config} setPurchaseLicenseModalOpen={setPurchaseLicenseModalOpen} connectToBlockstream={connectToBlockstream} connectToBitcoinCore={connectToBitcoinCore} getNodeConfig={getNodeConfig} resetConfigFile={resetConfigFile} />
      <PageWrapper id="page-wrapper">
        <ConfigRequired />
        <Overlay />
        {!config.isEmpty && <Sidebar config={config} flyInAnimation={flyInAnimation} currentBitcoinNetwork={currentBitcoinNetwork} />}
        {!config.isEmpty && <MobileNavbar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} config={config} currentBitcoinNetwork={currentBitcoinNetwork} />}
        <Switch>
          <Route path="/vault/:id" render={() => <Vault config={config} setConfigFile={setConfigFile} password={password} toggleRefresh={toggleRefresh} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/receive" component={() => <Receive config={config} />} />
          {nodeConfig && <Route path="/send" component={() => <Send config={config} currentBitcoinPrice={currentBitcoinPrice} nodeConfig={nodeConfig} currentBitcoinNetwork={currentBitcoinNetwork} />} />}
          <Route path="/setup" render={() => <Setup config={config} setConfigFile={setConfigFile} password={password} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/login" render={() => <Login config={config} setConfigFile={setConfigFile} setPassword={setPassword} encryptedConfigFile={encryptedConfigFile} setEncryptedConfigFile={setEncryptedConfigFile} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/settings" render={() => <Settings config={config} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/" render={() => <Home flyInAnimation={flyInAnimation} prevFlyInAnimation={prevSetFlyInAnimation.current} historicalBitcoinPrice={historicalBitcoinPrice} currentBitcoinPrice={currentBitcoinPrice} />} />
          <Route path="/" render={() => (
            <div>Not Found</div>
          )}
          />
        </Switch>
      </PageWrapper>
    </Router>
  );
}

const ColorOverlap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 25vh;
  background: ${green700};
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
`;

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  margin-top: 2.5rem;;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  background: ${offWhite};

  ${mobile(css`
    flex-direction: column;
  `)};
`;

export default App;
