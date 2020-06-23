import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { VerticalAlignBottom, ArrowUpward, Settings, Refresh } from '@styled-icons/material';


import { StyledIcon, Button, PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';

import VaultView from './VaultView';
import AddressesView from './AddressesView';
import UtxosView from './UtxosView';
import VaultSettings from './VaultSettings';

import { darkGray, lightBlue } from '../../utils/colors';

const Vault = ({ config, setConfigFile, toggleRefresh, currentAccount, currentBitcoinPrice, transactions, currentBalance, loadingDataFromBlockstream, currentBitcoinNetwork }) => {
  document.title = `Vault - Lily Wallet`;
  const [viewSettings, setViewSettings] = useState(false);
  const [viewAddresses, setViewAddresses] = useState(false);
  const [viewUtxos, setViewUtxos] = useState(false);

  const toggleViewSettings = () => {
    setViewSettings(!viewSettings);
    setViewAddresses(false);
    setViewUtxos(false);
  }

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>{currentAccount.name}</PageTitle>
          <VaultExplainerText>
            {currentAccount.config.quorum.requiredSigners > 1 && 'This is a vault account. Vaults require multiple devices to approve outgoing transactions and should be used to store Bitcoin savings.'}
            {currentAccount.config.quorum.requiredSigners === 1 && 'This is a wallet account. Wallets are used for everyday transactions and should be used to store small amounts of discretionary money.'}
          </VaultExplainerText>
        </HeaderLeft>
        <HeaderRight>
          <SendButton to="/send"><StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 4 }} />Send</SendButton>
          <ReceiveButton to="/receive"><StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 4 }} />Receive</ReceiveButton>
          <SettingsButton
            onClick={() => toggleRefresh()}
            color={darkGray}
            style={{ padding: '1em 1em 1em 0' }}
            background={'transparent'}>
            <StyledIcon as={Refresh} size={36} />
          </SettingsButton>
          <SettingsButton
            onClick={() => toggleViewSettings()}
            active={viewSettings}
            color={darkGray}
            background={'transparent'}
            style={{ padding: 0 }}
          >
            <StyledIcon as={Settings} size={36} />
          </SettingsButton>
        </HeaderRight>
      </Header>

      {(viewSettings && viewAddresses) ? (
        <AddressesView
          setViewAddresses={setViewAddresses}
          currentAccount={currentAccount}
        />
      ) : (viewSettings && viewUtxos) ? (
        <UtxosView
          setViewUtxos={setViewUtxos}
          currentAccount={currentAccount}
        />
      ) : viewSettings ? (
        <VaultSettings
          config={config}
          setConfigFile={setConfigFile}
          currentAccount={currentAccount}
          setViewAddresses={setViewAddresses}
          setViewUtxos={setViewUtxos}
          currentBitcoinNetwork={currentBitcoinNetwork}
        />
      ) : (
              <VaultView
                currentBalance={currentBalance}
                currentBitcoinPrice={currentBitcoinPrice}
                transactions={transactions}
                loadingDataFromBlockstream={loadingDataFromBlockstream}
              />
            )}
    </PageWrapper>
  )
}

const SendButton = styled(Link)`
  ${Button}
  margin: 12px;
`;

const ReceiveButton = styled(Link)`
  ${Button}
  margin: 12px;
`;

const SettingsButton = styled.div`
  ${Button}
  background: ${p => p.active ? lightBlue : 'transparent'};
  border-radius: 25%;
`;

const VaultExplainerText = styled.div`
  color: ${darkGray};
  font-size: .75em;
`;

export default Vault;