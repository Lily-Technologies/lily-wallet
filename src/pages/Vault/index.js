import React, { useState, Fragment } from 'react';
import { Link, useHistory } from "react-router-dom";
import styled, { css } from 'styled-components';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';


import { StyledIcon, Button, PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';

import VaultView from './VaultView';
import AddressesView from './AddressesView';
import UtxosView from './UtxosView';
import VaultSettings from './VaultSettings';

import { black, gray, white, blue, darkGray, darkOffWhite, lightBlue } from '../../utils/colors';
import { mobile } from '../../utils/media';
import { saveFileToGoogleDrive } from '../../utils/google-drive';



const Vault = ({ config, setConfigFile, currentAccount, currentBitcoinPrice, transactions, currentBalance, loadingDataFromBlockstream, currentBitcoinNetwork }) => {
  document.title = `Vault - Lily Wallet`;
  const [viewSettings, setViewSettings] = useState(false);
  const [viewAddresses, setViewAddresses] = useState(false);
  const [viewUtxos, setViewUtxos] = useState(false);
  const history = useHistory();

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
            onClick={() => { setViewSettings(!viewSettings) }}
            active={viewSettings}
            color={darkGray}
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

const SettingsSection = styled.div`
  display: flex;
  margin: 18px 0;
  justify-content: space-between;

  ${mobile(css`
    flex-direction: column;
  `)};
`;

const SettingsSectionLeft = styled.div``;

const SettingsSectionRight = styled.div``;


const SettingsHeader = styled.div`
  display: flex;
  font-size: 1.125em;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${darkGray};
`;


const SettingsSubheader = styled.div`
  display: flex;
  font-size: 0.875em;
  color: ${darkGray};
  margin: 8px 0;
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${blue};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;


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

const ValueWrapper = styled.div`
  background: ${white};
  padding: 1.5em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-top: solid 11px ${blue};
`;

const ChartContainer = styled.div`
  padding: 64px 0 0;
`;

export default Vault;