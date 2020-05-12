import React, { useState, useEffect, Fragment, useRef } from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { payments, ECPair, networks } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';

import { StyledIcon, Button, PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';

import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  deriveChildExtendedPublicKey,
  getFingerprintFromPublicKey,
  deriveExtendedPublicKey,
  generateMultisigFromPublicKeys,
  satoshisToBitcoins,
  TESTNET
} from "unchained-bitcoin";

import RecentTransactions from '../../components/transactions/RecentTransactions';

import { getTransactionsFromMultisig } from '../../utils/transactions';
import { black, gray, white, blue, darkGray, darkOffWhite, lightBlue } from '../../utils/colors';



const Vault = ({ caravanFile, currentBitcoinPrice, transactions, currentBalance, loadingDataFromBlockstream }) => {
  document.title = `Vault - Coldcard Kitchen`;

  const [viewSettings, setViewSettings] = useState(false);

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>{caravanFile.name}</PageTitle>
          <VaultExplainerText>
            This is a vault account. Vaults require multiple devices to approve outgoing transactions and should be used to store Bitcoin savings.
        </VaultExplainerText>
        </HeaderLeft>
        <HeaderRight>
          <SendButton to="send"><StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 4 }} />Send</SendButton>
          <ReceiveButton to="receive"><StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 4 }} />Receive</ReceiveButton>
          <SettingsButton
            onClick={() => { setViewSettings(!viewSettings) }}
            active={viewSettings}
            color={darkGray}>
            <StyledIcon as={Settings} size={36} />
          </SettingsButton>
        </HeaderRight>
      </Header>

      {viewSettings ? (
        <ValueWrapper>
          <TotalValueHeader>Settings</TotalValueHeader>

          <SettingsHeadingItem>Vault Data</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>Addresses</SettingsHeader>
              <SettingsSubheader>View the addresses associated with this vault</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton>View Addresses</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>XPubs</SettingsHeader>
              <SettingsSubheader>View the xpubs associated with this vault</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton>View XPubs</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
        </ValueWrapper>

      ) : (
          <Fragment>
            <ValueWrapper>
              <TotalValueHeader>{satoshisToBitcoins(currentBalance.toNumber()).toFixed(8)} BTC</TotalValueHeader>
              <USDValueHeader>{currentBitcoinPrice.multipliedBy(satoshisToBitcoins(currentBalance)).toFixed(8)} USD</USDValueHeader>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart width={400} height={400} data={[...transactions].sort((a, b) => a.status.block_time - b.status.block_time)}>
                    <XAxis
                      dataKey="status.block_time"
                      tickFormatter={(blocktime) => {
                        return moment.unix(blocktime).format('MMM D')
                      }}
                    />
                    <YAxis
                      width={100}
                      axisLine={false} />
                    <Area type="monotone" dataKey="totalValue" stroke="#8884d8" strokeWidth={2} fill={lightBlue} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ValueWrapper>
            <RecentTransactions transactions={transactions} loading={loadingDataFromBlockstream} />
          </Fragment>
        )}
    </PageWrapper>
  )
}

const SettingsSection = styled.div`
  display: flex;
  margin: 18px 0;
  justify-content: space-between;
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

const TotalValueHeader = styled.div`
  font-size: 36px;
`;

const USDValueHeader = styled.div`
  font-size: 1em;
  color: ${gray};
`;

const ChartContainer = styled.div`
  padding: 64px 0 0;
`;

export default Vault;