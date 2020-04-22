import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';

import { StyledIcon, Button } from '../../components';

import RecentTransactions from '../../components/transactions/RecentTransactions';

import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  satoshisToBitcoins,
  TESTNET
} from "unchained-bitcoin";

import { getTransactionsAndTotalValueFromXPub } from '../../utils/transactions';
import { black, gray, white, darkGray, lightBlue } from '../../utils/colors';


const Wallet = ({ caravanFile, currentBitcoinPrice }) => {
  document.title = `Wallet - Coldcard Kitchen`;
  const [transactionsFromBlockstream, setTransactionsFromBlockstream] = useState([]);
  const [unusedAddresses, setUnusedAddresses] = useState([]);
  const [totalValue, setTotalValue] = useState(BigNumber(0));
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);
  const { name } = useParams();
  const [currentWallet, setCurrentWallet] = useState(caravanFile.extendedPublicKeys.filter((xpub) => xpub.name === name)[0]);
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(true);

  useEffect(() => {
    setCurrentWallet(caravanFile.extendedPublicKeys.filter((xpub) => xpub.name === name)[0])
  }, [name])

  useEffect(() => {
    async function fetchTransactionsFromBlockstream() {
      setLoadingDataFromBlockstream(true);
      const [transactions, totalValue] = await getTransactionsAndTotalValueFromXPub(currentWallet);
      setTransactionsFromBlockstream(transactions);
      setTotalValue(totalValue);
      setLoadingDataFromBlockstream(false);
    }
    fetchTransactionsFromBlockstream();
  }, [currentWallet]);

  return (
    <Wrapper>
      <WalletContent>
        <WalletHeader>
          <WalletHeaderLeft>
            <DeviceName>{currentWallet.name}</DeviceName>
          </WalletHeaderLeft>
          <WalletHeaderRight>
            <SendButton><StyledIcon as={ArrowUpward} size={24} style={{ marginRight: 4 }} />Send</SendButton>
            <ReceiveButton onClick={() => setUnusedAddressIndex(unusedAddressIndex + 1)}><StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: 4 }} />Receive</ReceiveButton>
            <SettingsButton background='transparent' color={darkGray}><StyledIcon as={Settings} size={36} /></SettingsButton>
          </WalletHeaderRight>
        </WalletHeader>

        <ValueWrapper>
          <TotalValueHeader>{satoshisToBitcoins(totalValue.toNumber()).toFixed(8)} BTC</TotalValueHeader>
          <USDValueHeader>{currentBitcoinPrice && currentBitcoinPrice.multipliedBy(satoshisToBitcoins(totalValue)).toFixed(8)} USD</USDValueHeader>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart width={400} height={400} data={transactionsFromBlockstream}>
              <XAxis dataKey="status.block_time" />
              <YAxis />
              <Area type="monotone" dataKey="totalValue" stroke="#8884d8" fill={lightBlue} />
            </AreaChart>
          </ResponsiveContainer>
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
  display: flex;
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
const SendButton = styled.div`
  ${Button}
  margin: 12px;
`;
const ReceiveButton = styled.div`
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

const DeviceXPub = styled.div`
  font-size: 8px;
`;

const ReceiveAddressWrapper = styled.div`

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
  font-size: 12px;
  color: ${gray};
`;

export default Wallet;