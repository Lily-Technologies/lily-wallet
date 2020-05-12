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

import { StyledIcon, Button, GreenLoadingAnimation, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import { getTransactionsAndTotalValueFromXPub, getTransactionsFromMultisig } from '../../utils/transactions';
import { black, gray, offWhite, blue, darkGray, white, darkOffWhite, green, lightGreen, darkGreen, lightGray, lightBlue } from '../../utils/colors';

const Receive = ({ caravanFile, transactions, unusedAddresses, currentBalance, loadingDataFromBlockstream }) => {
  const [currentAccount, setCurrentAccount] = useState(caravanFile || null);
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);

  document.title = `Receive - Coldcard Kitchen`;

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>Receive to</PageTitle>
          {/* <DeviceXPub>{currentAccount.xpub}</DeviceXPub> */}
        </HeaderLeft>
        <HeaderRight>
          <SettingsButton background='transparent' color={darkGray}><StyledIcon as={Settings} size={36} /></SettingsButton>
        </HeaderRight>
      </Header>

      <ReceiveWrapper>
        <AccountMenu>
          <AccountMenuItemWrapper active={currentAccount.name === caravanFile.name}>
            <StyledIcon as={Safe} size={48} />
            <AccountMenuItemName>{caravanFile.name}</AccountMenuItemName>
          </AccountMenuItemWrapper>
        </AccountMenu>

        <GridArea>

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
                {satoshisToBitcoins(currentBalance).toNumber()} BTC
                </CurrentBalanceValue>
            </CurrentBalanceWrapper>

            <RecentTransactions
              transactions={transactions}
              flat={true}
              loading={loadingDataFromBlockstream}
              maxItems={3} />


          </AccountReceiveContentRight>
        </GridArea>
      </ReceiveWrapper>
    </PageWrapper>
  )
}

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
  // border: 1px solid ${lightGray};
`;

const SendToAddressHeader = styled.div`
  font-size: 1em;
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
  padding: 1.5em;
  color: ${darkGreen};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 4px;
  word-break: break-all;
`;

const SettingsButton = styled.div`
  ${Button}
  // margin: 12px;
`;

const AccountMenuItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? lightBlue : white};
  color: ${p => p.active ? darkGray : gray};
  padding: .75em;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${darkOffWhite}`};
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
`;

const AccountMenuItemName = styled.div``;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AccountReceiveContent = styled.div`
  min-height: 400px;
  padding: 1.5em;
  display: flex;
  background: ${lightBlue};
  flex-wrap: wrap;
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
  padding: 1.5em;
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
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: scroll;
`;

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  text-align: right;
`;


const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;



export default Receive;