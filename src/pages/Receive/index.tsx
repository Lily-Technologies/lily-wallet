import React, { Fragment, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import { QRCode } from "react-qr-svg";
import CopyToClipboard from 'react-copy-to-clipboard';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft, Loading } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import { AccountMapContext } from '../../AccountMapContext';

import { black, gray, darkGray, white, darkOffWhite, lightGray, gray100, green600, gray800, green900, green700 } from '../../utils/colors';
import { mobile } from '../../utils/media';

import { LilyConfig } from '../../types'

const Receive = ({ config }: { config: LilyConfig }) => {
  document.title = `Receive - Lily Wallet`;
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);
  const { setCurrentAccountId, currentAccount } = useContext(AccountMapContext);
  const { transactions, unusedAddresses, currentBalance } = currentAccount;

  return (
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Receive to</PageTitle>
          </HeaderLeft>
          <HeaderRight>
          </HeaderRight>
        </Header>

        <ReceiveWrapper>
          <AccountMenu>
            {config.vaults.map((vault, index) => (
              <AccountMenuItemWrapper
                key={index}
                active={vault.id === currentAccount.config.id}
                borderRight={(index < config.vaults.length - 1)}
                onClick={() => setCurrentAccountId(vault.id)}>
                <StyledIcon as={Safe} size={48} />
                <AccountMenuItemName>{vault.name}</AccountMenuItemName>
              </AccountMenuItemWrapper>
            ))}
            {config.wallets.map((wallet, index) => (
              <AccountMenuItemWrapper
                key={index}
                active={wallet.id === currentAccount.config.id}
                borderRight={(index < config.wallets.length - 1)}
                onClick={() => setCurrentAccountId(wallet.id)}>
                <StyledIcon as={Wallet} size={48} />
                <AccountMenuItemName>{wallet.name}</AccountMenuItemName>
              </AccountMenuItemWrapper>
            ))}
          </AccountMenu>


          {currentAccount.loading && <Loading itemText={'Receive Information'} />}
          {!currentAccount.loading && (
            <GridArea>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CurrentBalanceWrapper displayDesktop={false} displayMobile={true} style={{ marginBottom: '1em' }}>
                  <CurrentBalanceText>
                    Current Balance:
              </CurrentBalanceText>
                  <CurrentBalanceValue>
                    {satoshisToBitcoins(currentBalance).toNumber()} BTC
                </CurrentBalanceValue>
                </CurrentBalanceWrapper>

                <AccountReceiveContentLeft>
                  <SendToAddressHeader>
                    Send bitcoin to
                </SendToAddressHeader>
                  <QRCodeWrapper>
                    <QRCode
                      bgColor={white}
                      fgColor={black}
                      level="Q"
                      style={{ width: 256 }}
                      value={unusedAddresses[unusedAddressIndex].address}
                    />
                  </QRCodeWrapper>
                  <AddressDisplayWrapper>
                    <BitcoinAddressLabel>Bitcoin address:</BitcoinAddressLabel>
                    {unusedAddresses[unusedAddressIndex].address}
                  </AddressDisplayWrapper>
                  <ReceiveButtonContainer>
                    <CopyToClipboard text={unusedAddresses[unusedAddressIndex].address}>
                      <CopyAddressButton color={white} background={green600}>Copy Address</CopyAddressButton>
                    </CopyToClipboard>
                    <CopyAddressButton background="transparent" color={darkGray} onClick={() => setUnusedAddressIndex(unusedAddressIndex + 1)}>Generate New Address</CopyAddressButton>
                  </ReceiveButtonContainer>

                </AccountReceiveContentLeft>
              </div>

              <AccountReceiveContentRight>
                <CurrentBalanceWrapper displayDesktop={true} displayMobile={false}>
                  <CurrentBalanceText>
                    Current Balance:
              </CurrentBalanceText>
                  <CurrentBalanceValue>
                    {satoshisToBitcoins(currentBalance).toNumber()} BTC
                </CurrentBalanceValue>
                </CurrentBalanceWrapper>
                <RecentTransactionContainer>
                  <RecentTransactions
                    transactions={transactions}
                    flat={true}
                    loading={currentAccount.loading}
                    maxItems={3} />
                </RecentTransactionContainer>
              </AccountReceiveContentRight>
            </GridArea>
          )}
        </ReceiveWrapper>
      </Fragment>
    </PageWrapper >
  )
}

const BitcoinAddressLabel = styled.div`
  font-size: 0.75em;
  color: ${gray800};
  margin-bottom: 0.25em;
`;

const RecentTransactionContainer = styled.div`
  padding: 0 1em;
`;

const ReceiveButtonContainer = styled.div`
  margin: 0 24px;
`;

const CopyAddressButton = styled.div`
  ${Button};
`;

const ReceiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border: 1px solid ${gray};
`;

const SendToAddressHeader = styled.div`
  font-size: 1em;
  color: ${darkGray};
  margin: 12px;
`;

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 24px 12px;
`;

const AddressDisplayWrapper = styled.div`
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 1.5em;
  color: ${green700};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  word-break: break-all;
  flex-direction: column;
`;

const AccountMenuItemWrapper = styled.div<{ active: boolean, borderRight: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? gray100 : white};
  color: ${p => p.active ? darkGray : gray};
  padding: .75em;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-top: ${p => p.active ? `solid 11px ${green900}` : `none`};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${gray}`};
  border-right: ${p => p.borderRight && `solid 1px ${gray}`};
`;

const AccountMenuItemName = styled.div``;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  border: 1px solid ${darkGray};
  border-radius: 4px;
  justify-content: center;
  width: 100%;
`;

const AccountReceiveContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

const CurrentBalanceWrapper = styled.div<{ displayDesktop: boolean, displayMobile: boolean }>`
  padding: 1.5em;
  display: ${p => p.displayDesktop ? 'flex' : 'none'};
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  text-align: right;

  ${mobile(css<{ displayMobile: boolean }>`
    display: ${p => p.displayMobile ? 'flex' : 'none'}
  `)};

`;


const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;



export default Receive;