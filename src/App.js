import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import { offWhite, black, gray } from './utils/colors';
import { mobile } from './utils/media';

import { Sidebar, MobileNavbar } from './components';

import { getDataFromMultisig, getDataFromXPub, getUnchainedNetworkFromBjslibNetwork } from './utils/transactions';

import { networks } from 'bitcoinjs-lib';

import configFixture from './fixtures/config';

// Pages
import Login from './pages/Login';
import GDriveImport from './pages/GDriveImport';
import Setup from './pages/Setup';
import Settings from './pages/Settings';
import Vault from './pages/Vault';
import Transfer from './pages/Transfer';
import Receive from './pages/Receive';
import Send from './pages/Send';
import ColdcardImportInstructions from './pages/ColdcardImportInstructions';
import Overview from './pages/Overview';

// Other display components
// import Header from './components/Nav/Header';
// import Footer from './components/footer';

function App() {
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(BigNumber(0));
  const [historicalBitcoinPrice, setHistoricalBitcoinPrice] = useState({});
  // const [config, setConfigFile] = useState(configFixture);
  // const [currentAccount, setCurrentAccount] = useState({ config: config.vaults[0] });
  const [config, setConfigFile] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountMap, setAccountMap] = useState(new Map());
  const [currentBitcoinNetwork, setCurrentBitcoinNetwork] = useState(networks.bitcoin)

  // WALLET DATA
  const [transactions, setTransactions] = useState([]);
  const [unusedAddresses, setUnusedAddresses] = useState([]);
  const [unusedChangeAddresses, setUnusedChangeAddresses] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(BigNumber(0));
  const [availableUtxos, setAvailableUtxos] = useState([]);
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(false);

  console.log('currentAccount, config: ', currentAccount, config);

  const ConfigRequired = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    if (!config && (pathname !== '/login' && pathname !== '/gdrive-import' && pathname !== '/setup')) {
      history.push('/login');
      window.location.reload();
    }
    return null;
  }

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  const setCurrentAccountFromMap = (vault) => {
    const newVault = accountMap.get(vault.id);
    setCurrentAccount(newVault);
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
    async function fetchHistoricalBitcoinPrice() {
      const historicalBitcoinPrice = await (await axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-01-01&end=${moment().format('YYYY-MM-DD')}`)).data;
      setHistoricalBitcoinPrice(historicalBitcoinPrice.bpi);
    }
    fetchHistoricalBitcoinPrice();
  }, []);

  useEffect(() => {
    if (config) {
      setLoadingDataFromBlockstream(true);
      async function fetchTransactionsFromBlockstream() {

        const accountMap = new Map();

        for (let i = 0; i < config.vaults.length; i++) {
          if (config.vaults[i].network === getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)) {
            const [addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getDataFromMultisig(config.vaults[i], currentBitcoinNetwork);

            const currentBalance = availableUtxos.reduce((accum, utxo) => accum.plus(utxo.value), BigNumber(0));

            const vaultData = {
              name: config.vaults[i].name,
              config: config.vaults[i],
              addresses,
              changeAddresses,
              availableUtxos,
              transactions,
              unusedAddresses,
              currentBalance,
              unusedChangeAddresses
            };

            accountMap.set(config.vaults[i].id, vaultData);
          }
        }

        for (let i = 0; i < config.wallets.length; i++) {
          const [addresses, changeAddresses, transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getDataFromXPub(config.wallets[i], currentBitcoinNetwork);

          const currentBalance = availableUtxos.reduce((accum, utxo) => accum.plus(utxo.value), BigNumber(0));

          const vaultData = {
            name: config.wallets[i].name,
            config: config.wallets[i],
            addresses,
            changeAddresses,
            availableUtxos,
            transactions,
            unusedAddresses,
            currentBalance,
            unusedChangeAddresses
          };

          accountMap.set(config.wallets[i].id, vaultData);
        }

        setLoadingDataFromBlockstream(false);
        setAccountMap(accountMap);
        setCurrentAccount(accountMap.get(config.vaults[0].id));
      }
      fetchTransactionsFromBlockstream();
    }
  }, [config, currentBitcoinNetwork]);

  useEffect(() => {
    if (currentAccount && accountMap.size) {
      console.log('currentAccount: ', currentAccount);
      setLoadingDataFromBlockstream(true);
      async function fetchTransactionsFromBlockstream() {
        console.log('accountMapx: ', accountMap);
        const newVault = accountMap.get(currentAccount.config.id);
        console.log('newVault xxx: ', newVault);

        setAvailableUtxos(newVault.availableUtxos);
        setUnusedAddresses(newVault.unusedAddresses);
        setTransactions(newVault.transactions);
        setCurrentBalance(newVault.currentBalance);
        setUnusedChangeAddresses(newVault.unusedChangeAddresses);
        setLoadingDataFromBlockstream(false);
      }
      fetchTransactionsFromBlockstream();
    }
  }, [currentAccount, config, currentBitcoinNetwork]);

  return (
    <Router>
      {/* <WindowWrapper> */}
      {/* <Header /> */}
      <PageWrapper id="page-wrapper">
        <ScrollToTop />
        <ConfigRequired />
        {config && <Sidebar config={config} setCurrentAccount={setCurrentAccountFromMap} loading={loadingDataFromBlockstream} />}
        {config && <MobileNavbar config={config} setCurrentAccount={setCurrentAccountFromMap} loading={loadingDataFromBlockstream} />}
        <Switch>
          <Route path="/vault/:id" component={() => <Vault config={config} setConfigFile={setConfigFile} currentAccount={currentAccount} currentBitcoinNetwork={currentBitcoinNetwork} currentBitcoinPrice={currentBitcoinPrice} transactions={transactions} currentBalance={currentBalance} loadingDataFromBlockstream={loadingDataFromBlockstream} />} />
          <Route path="/receive" component={() => <Receive config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinPrice={currentBitcoinPrice} transactions={transactions} currentBalance={currentBalance} loadingDataFromBlockstream={loadingDataFromBlockstream} unusedAddresses={unusedAddresses} />} />
          <Route path="/send" component={() => <Send config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} currentBitcoinPrice={currentBitcoinPrice} transactions={transactions} currentBalance={currentBalance} loadingDataFromBlockstream={loadingDataFromBlockstream} availableUtxos={availableUtxos} unusedChangeAddresses={unusedChangeAddresses} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/setup" component={() => <Setup config={config} setConfigFile={setConfigFile} currentBitcoinNetwork={currentBitcoinNetwork} />} />
          <Route path="/login" component={() => <Login setConfigFile={setConfigFile} />} />
          <Route path="/settings" component={() => <Settings config={config} currentBitcoinNetwork={currentBitcoinNetwork} changeCurrentBitcoinNetwork={changeCurrentBitcoinNetwork} />} />
          <Route path="/transfer" component={() => <Transfer config={config} currentAccount={currentAccount} setCurrentAccount={setCurrentAccountFromMap} />} />
          <Route path="/gdrive-import" component={() => <GDriveImport setConfigFile={setConfigFile} />} />
          <Route path="/coldcard-import-instructions" component={() => <ColdcardImportInstructions />} />
          <Route path="/" component={() => <Overview accountMap={accountMap} historicalBitcoinPrice={historicalBitcoinPrice} currentBitcoinPrice={currentBitcoinPrice} loading={loadingDataFromBlockstream} />} />
          <Route path="/" component={() => (
            <div>Not Found</div>
          )}
          />
        </Switch>
      </PageWrapper>
      <FooterWrapper>
        <ViewSourceCodeText href="https://github.com/KayBeSee/cc-kitchen-frontend" target="_blank">View Source Code</ViewSourceCodeText>
        <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
      </FooterWrapper>
      {/* <Footer /> */}
      {/* </WindowWrapper> */}
    </Router>
  );
}

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  background: ${offWhite};

  ${mobile(css`
    flex-direction: column;
  `)};
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${offWhite};
  padding: 3.5em;

  ${mobile(css`
    padding: 1.5em;
    font-size: 0.75em;
  `)};
`;

const ViewSourceCodeText = styled.a`
  color: ${ black};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.03em;
  font-family: 'Raleway', sans-serif;
`;

const DontTrustVerify = styled.span`
color: ${ gray};
`;

export default App;
