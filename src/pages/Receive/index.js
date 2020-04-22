import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import { QRCode } from "react-qr-svg";
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import BigNumber from 'bignumber.js';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  satoshisToBitcoins,
  TESTNET
} from "unchained-bitcoin";
import { payments, ECPair, networks } from 'bitcoinjs-lib';

import { StyledIcon, Button, GreenLoadingAnimation } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import { getTransactionsAndTotalValueFromXPub, getTransactionsFromMultisig } from '../../utils/transactions';
import { black, gray, offWhite, blue, darkGray, white, darkOffWhite, green, lightGreen, darkGreen, lightGray, lightBlue } from '../../utils/colors';

const Receive = ({ caravanFile, currentBitcoinPrice }) => {
  const [currentAccount, setCurrentAccount] = useState(caravanFile.extendedPublicKeys[0] || null);
  const [transactionsFromBlockstream, setTransactionsFromBlockstream] = useState([]);
  const [unusedAddresses, setUnusedAddresses] = useState([]);
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(true);
  const [totalValue, setTotalValue] = useState(BigNumber(0));

  document.title = `Receive - Coldcard Kitchen`;

  useEffect(() => {
    async function fetchTransactionsFromBlockstream() {
      setLoadingDataFromBlockstream(true);
      let transactions, totalValue, unusedAddresses;
      if (currentAccount.name === caravanFile.name) {
        [transactions, totalValue, unusedAddresses] = await getTransactionsFromMultisig(currentAccount);
      } else {
        [transactions, totalValue, unusedAddresses] = await getTransactionsAndTotalValueFromXPub(currentAccount);
      }
      console.log('transactions, totalValue, unusedAddresses: ', transactions, totalValue, unusedAddresses);
      setUnusedAddresses(unusedAddresses);
      setTransactionsFromBlockstream(transactions);
      setTotalValue(totalValue);
      setLoadingDataFromBlockstream(false);
    }
    fetchTransactionsFromBlockstream();
  }, [currentAccount]);

  return (
    <Wrapper>
      <ReceiveContent>
        <WalletHeader>
          <WalletHeaderLeft>
            <PageTitle>Receive to</PageTitle>
            {/* <DeviceXPub>{currentAccount.xpub}</DeviceXPub> */}
          </WalletHeaderLeft>
          <WalletHeaderRight>
            <SettingsButton background='transparent' color={darkGray}><StyledIcon as={Settings} size={36} /></SettingsButton>
          </WalletHeaderRight>
        </WalletHeader>

        <ReceiveWrapper>
          <AccountMenu>
            {caravanFile.extendedPublicKeys.map((xpub) => (
              <AccountMenuItemWrapper active={currentAccount.name === xpub.name} onClick={() => {
                setCurrentAccount(xpub);
                setTransactionsFromBlockstream([]);
                setUnusedAddresses([]);
                setUnusedAddressIndex(0);
                setTotalValue(BigNumber(0))
              }}>
                <StyledIcon as={Wallet} size={48} />
                <AccountMenuItemName>{xpub.name}</AccountMenuItemName>
              </AccountMenuItemWrapper>
            ))}
            <AccountMenuItemWrapper active={currentAccount.name === caravanFile.name} onClick={() => {
              setCurrentAccount(caravanFile)
              setTransactionsFromBlockstream([]);
              setUnusedAddresses([]);
              setUnusedAddressIndex(0);
              setTotalValue(BigNumber(0));
            }}>
              <StyledIcon as={Safe} size={48} />
              <AccountMenuItemName>{caravanFile.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          </AccountMenu>

          <AccountReceiveContent>

            <AccountReceiveContentLeft>
              <SendToAddressHeader>
                Send bitcoin to
              </SendToAddressHeader>

              <AddressDisplayWrapper>
                {unusedAddresses[unusedAddressIndex] && unusedAddresses[unusedAddressIndex].address}
                {loadingDataFromBlockstream && (
                  <GreenLoadingAnimation>
                    {/* tb1qy8glxuvc7nqqlxmuucnpv93fekyv4lth6k3v3p */}
                  </GreenLoadingAnimation>
                )}
              </AddressDisplayWrapper>

              <QRCodeWrapper>
                <QRCode
                  bgColor={white}
                  fgColor={black}
                  level="Q"
                  style={{ width: 256 }}
                  value={unusedAddresses[unusedAddressIndex] && unusedAddresses[unusedAddressIndex].address}
                />
              </QRCodeWrapper>

              <ReceiveButtonContainer>
                <CopyToClipboard text={unusedAddresses[unusedAddressIndex] && unusedAddresses[unusedAddressIndex].address}><CopyAddressButton>Copy Address</CopyAddressButton></CopyToClipboard>
                <CopyAddressButton background="transparent" color={darkGray} onClick={() => setUnusedAddressIndex(unusedAddressIndex + 1)}>Generate New Address</CopyAddressButton>
              </ReceiveButtonContainer>

            </AccountReceiveContentLeft>

            <AccountReceiveContentRight>
              <CurrentBalanceWrapper>
                <CurrentBalanceText>
                  Current Balance:
              </CurrentBalanceText>
                <CurrentBalanceValue>
                  {satoshisToBitcoins(totalValue.toFixed(8)).toNumber()} BTC
                </CurrentBalanceValue>
              </CurrentBalanceWrapper>

              <RecentTransactions
                transactions={transactionsFromBlockstream.slice(0, 5)}
                flat={true}
                loading={loadingDataFromBlockstream}
                maxItems={5} />


            </AccountReceiveContentRight>
          </AccountReceiveContent>


        </ReceiveWrapper>
      </ReceiveContent>
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
  flex-direction: column;
`;

const ReceiveContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 64px;
  overflow: scroll;
  flex: 1;
`;

const ReceiveButtonContainer = styled.div`
  margin: 24px;
`;

const CopyAddressButton = styled.div`
  ${Button};
`;

const ReceiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin-top: 24px;
  border: 1px solid ${lightGray};
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

const SendToAddressHeader = styled.div`
  font-size: 16px;
  color: ${gray};
  margin: 12px;
`;

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;

const AddressDisplayWrapper = styled.div`
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 24px;
  color: ${darkGreen};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 4px;
`;

const SettingsButton = styled.div`
  ${Button}
  // margin: 12px;
`;

const PageTitle = styled.div`
  font-size: 48px;
`;

const AccountMenuItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? lightBlue : white};
  color: ${p => p.active ? darkGray : gray};
  padding: 12px;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${darkOffWhite}`};
`;

const AccountMenuItemName = styled.div``;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AccountReceiveContent = styled.div`
  min-height: 400px;
  padding: 24px;
  display: flex;
  background: ${lightBlue};
  flex-wrap: wrap;
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  border: solid 1px ${gray};
  border-radius: 4px;
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  justify-content: center;
`;

const AccountReceiveContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  margin-left: 64px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: scroll;
`;

const CurrentBalanceWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  text-align: right;
`;


const CurrentBalanceText = styled.div`
  font-size: 24px;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 36px;
`;



export default Receive;