import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { payments, ECPair, networks } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';

import { StyledIcon, Button } from '../../components';

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
import { black, gray, white, offWhite, darkGray, darkOffWhite, lightBlue } from '../../utils/colors';



const Vault = ({ caravanFile, currentBitcoinPrice }) => {
  document.title = `Vault - Coldcard Kitchen`;
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(true);
  const [transactionsFromBlockstream, setTransactionsFromBlockstream] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(BigNumber(0));

  useEffect(() => {
    async function fetchTransactionsFromBlockstream() {
      setLoadingDataFromBlockstream(true);
      const [transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getTransactionsFromMultisig(caravanFile);

      const currentBalance = availableUtxos.reduce((accum, utxo) => accum.plus(utxo.value), BigNumber(0));

      setCurrentBalance(currentBalance)
      setTransactionsFromBlockstream(transactions);
      setLoadingDataFromBlockstream(false);
    }
    fetchTransactionsFromBlockstream();
  }, []);

  return (
    <Wrapper>
      <WalletContent>
        <WalletHeader>
          <WalletHeaderLeft>
            <DeviceName>{caravanFile.name}</DeviceName>
            {/* <DeviceXPub>{currentDevice.xpub}</DeviceXPub> */}
          </WalletHeaderLeft>
          <WalletHeaderRight>
            <SendButton to="send"><StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 4 }} />Send</SendButton>
            <ReceiveButton to="receive"><StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 4 }} />Receive</ReceiveButton>
            <SettingsButton background='transparent' color={darkGray}><StyledIcon as={Settings} size={36} /></SettingsButton>
          </WalletHeaderRight>
        </WalletHeader>

        <VaultExplainerText>
          This is a vault account. Vaults require multiple devices to approve outgoing transactions and should be used to store Bitcoin savings.
        </VaultExplainerText>

        <ValueWrapper>
          <TotalValueHeader>{satoshisToBitcoins(currentBalance.toNumber()).toFixed(8)} BTC</TotalValueHeader>
          <USDValueHeader>{currentBitcoinPrice.multipliedBy(satoshisToBitcoins(currentBalance)).toFixed(8)} USD</USDValueHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart width={400} height={400} data={[...transactionsFromBlockstream].sort((a, b) => a.status.block_time - b.status.block_time)}>
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

        <RecentTransactions transactions={transactionsFromBlockstream} loading={loadingDataFromBlockstream} />
      </WalletContent>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  display: flex;
  flex: 1;
  // display: flex;
  min-height: 400px;
`;

const WalletContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 64px;
  overflow: scroll;
  flex: 1;
`;

const WalletHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const WalletHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
const WalletHeaderRight = styled.div`
  display: flex;
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
  // margin: 12px;
`;

const DeviceName = styled.div`
  font-size: 48px;
`;
const VaultExplainerText = styled.div`
  color: ${darkGray};
  font-size: 12px;
`;

const ValueWrapper = styled.div`
  background: ${white};
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin-top: 24px;
`;

const TotalValueHeader = styled.div`
  font-size: 36px;
`;

const USDValueHeader = styled.div`
  font-size: 16px;
  color: ${gray};
`;

const ChartContainer = styled.div`
  padding: 64px 0 0;
`;

export default Vault;