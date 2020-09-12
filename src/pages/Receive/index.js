import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import { QRCode } from "react-qr-svg";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft, Loading } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import { black, gray, blue, darkGray, white, darkOffWhite, darkGreen, lightGray, lightBlue } from '../../utils/colors';
import { mobile } from '../../utils/media';

const Receive = ({ config, currentAccount, setCurrentAccount }) => {
  document.title = `Receive - Lily Wallet`;
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);

  const { transactions, unusedAddresses, currentBalance } = currentAccount;

  return (
    <PageWrapper>
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
            <AccountMenuItemWrapper active={vault.id === currentAccount.config.id} borderRight={(index < config.vaults.length - 1) || config.wallets.length} onClick={() => setCurrentAccount(vault.id)}>
              <StyledIcon as={Safe} size={48} />
              <AccountMenuItemName>{vault.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          ))}
          {config.wallets.map((wallet, index) => (
            <AccountMenuItemWrapper active={wallet.id === currentAccount.config.id} borderRight={(index < config.wallets.length - 1)} onClick={() => setCurrentAccount(wallet.id)}>
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

                <AddressDisplayWrapper>
                  {unusedAddresses[unusedAddressIndex] && unusedAddresses[unusedAddressIndex].address}
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
    </PageWrapper >
  )
}

const RecentTransactionContainer = styled.div`
  padding: 0 1em;
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
  margin: 1em;
  border-radius: 4px;
  word-break: break-all;
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
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
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
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
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

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: ${p => p.displayDesktop ? 'flex' : 'none'};
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  text-align: right;

  ${mobile(css`
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