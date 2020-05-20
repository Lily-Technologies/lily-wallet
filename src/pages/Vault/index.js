import React, { useState, Fragment } from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";
import styled, { css } from 'styled-components';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';
import { bip32, networks } from 'bitcoinjs-lib';
import { QRCode } from "react-qr-svg";

import { StyledIcon, Button, PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';

import AddressRow from './AddressRow';
import UtxoRow from './UtxoRow';

import { satoshisToBitcoins } from "unchained-bitcoin";

import RecentTransactions from '../../components/transactions/RecentTransactions';

import { black, gray, white, blue, darkGray, darkOffWhite, lightBlue } from '../../utils/colors';
import { mobile } from '../../utils/media';



const Vault = ({ currentAccount, currentBitcoinPrice, transactions, currentBalance, loadingDataFromBlockstream }) => {
  document.title = `Vault - Lily Wallet`;

  const [viewSettings, setViewSettings] = useState(false);
  const [viewAddresses, setViewAddresses] = useState(false);
  const [viewUtxos, setViewUtxos] = useState(false);

  // console.log('currentAccount: ', currentAccount);

  // const bip32interface = bip32.fromBase58(currentAccount.config.xpub, networks.testnet);
  // console.log('bip32interface: ', bip32interface.toWIF());

  // const qrValue = bip32interface.toWIF();

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>{currentAccount.name}</PageTitle>
          <VaultExplainerText>
            This is a vault account. Vaults require multiple devices to approve outgoing transactions and should be used to store Bitcoin savings.
        </VaultExplainerText>
        </HeaderLeft>
        <HeaderRight>
          <SendButton to="/send"><StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 4 }} />Send</SendButton>
          <ReceiveButton to="/receive"><StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 4 }} />Receive</ReceiveButton>
          <SettingsButton
            onClick={() => { setViewSettings(!viewSettings) }}
            active={viewSettings}
            color={darkGray}>
            <StyledIcon as={Settings} size={36} />
          </SettingsButton>
        </HeaderRight>
      </Header>

      {(viewSettings && viewAddresses) ? (
        <ValueWrapper>
          <TotalValueHeader style={{ cursor: 'pointer' }} onClick={() => setViewAddresses(false)}>Settings - Addresses</TotalValueHeader>
          <SettingsHeadingItem>Addresses</SettingsHeadingItem>
          <SettingsSection style={{ flexDirection: 'column' }}>
            {currentAccount.addresses.map((address) => (
              <AddressRow flat={true} address={address} />
            ))}
            {currentAccount.changeAddresses.map((address) => (
              <AddressRow flat={true} address={address} />
            ))}
          </SettingsSection>
        </ValueWrapper>
      ) : (viewSettings && viewUtxos) ? (
        <ValueWrapper>
          <TotalValueHeader style={{ cursor: 'pointer' }} onClick={() => setViewUtxos(false)}>Settings - Utxos</TotalValueHeader>
          <SettingsHeadingItem>UTXOs</SettingsHeadingItem>
          <SettingsSection style={{ flexDirection: 'column' }}>
            {currentAccount.availableUtxos.map((utxo) => (
              <UtxoRow flat={true} utxo={utxo} />
            ))}
          </SettingsSection>
        </ValueWrapper>
      ) : viewSettings ? (
        <ValueWrapper>
          <TotalValueHeader>Settings</TotalValueHeader>
          <SettingsHeadingItem>Vault Data</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>Addresses</SettingsHeader>
              <SettingsSubheader>View the addresses associated with this vault</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { setViewAddresses(true); console.log('currentAccount: ', currentAccount) }}>View Addresses</ViewAddressesButton>
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
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>UTXOs</SettingsHeader>
              <SettingsSubheader>View the UTXOs associated with this vault</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { setViewUtxos(true); console.log('currentAccount: ', currentAccount) }}>View UTXOs</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
          <SettingsSection>
            {/* <QRCode
              bgColor={white}
              fgColor={black}
              level="Q"
              style={{ width: 256 }}
              value={qrValue}
            /> */}
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