import React, { useState } from "react";
import styled, { css } from "styled-components";
import { QRCode } from "react-qr-svg";
import CopyToClipboard from "react-copy-to-clipboard";
import { satoshisToBitcoins } from "unchained-bitcoin";

import {
  Button,
  GridArea,
} from "src/components";

import {
  black,
  white,
  gray100,
  gray200,
  gray400,
  green600,
  gray600,
  gray800,
  green700,
} from "src/utils/colors";
import { mobile } from "src/utils/media";

import { requireOnchain } from "src/hocs";
import { LilyOnchainAccount } from 'src/types';

interface Props {
  currentAccount: LilyOnchainAccount
}

export const OnchainReceive = ({ currentAccount }: Props) => {
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);
  const { unusedAddresses, currentBalance } = currentAccount;

  const getNewAddress = () => {
    if (unusedAddressIndex < 9) {
      setUnusedAddressIndex(unusedAddressIndex + 1);
    } else {
      setUnusedAddressIndex(0);
    }
  };

  return (
    <GridArea>
      <AccountReceiveContentLeft>
        <SendToAddressHeader>Send bitcoin to</SendToAddressHeader>
        <AddressDisplayWrapper>
          <BitcoinAddressLabel>Bitcoin address:</BitcoinAddressLabel>
          {unusedAddresses[unusedAddressIndex].address}
        </AddressDisplayWrapper>
        <QRCodeWrapper>
          <QRCode
            bgColor={white}
            fgColor={black}
            level="Q"
            style={{ width: 192 }}
            value={unusedAddresses[unusedAddressIndex].address}
          />
        </QRCodeWrapper>
        <ReceiveButtonContainer>
          <CopyToClipboard
            text={unusedAddresses[unusedAddressIndex].address}
          >
            <CopyAddressButton color={white} background={green600}>
              Copy Address
            </CopyAddressButton>
          </CopyToClipboard>
          <NewAddressButton
            background="transparent"
            color={gray600}
            onClick={() => getNewAddress()}
          >
            Generate New Address
          </NewAddressButton>
        </ReceiveButtonContainer>
      </AccountReceiveContentLeft>
      <AccountReceiveContentRight>
        <CurrentBalanceWrapper>
          <CurrentBalanceText>Current Balance:</CurrentBalanceText>
          <CurrentBalanceValue>
            {satoshisToBitcoins(currentBalance).toNumber()} BTC
          </CurrentBalanceValue>
        </CurrentBalanceWrapper>
      </AccountReceiveContentRight>
    </GridArea>
  )
}

const BitcoinAddressLabel = styled.div`
  font-size: 0.75em;
  color: ${gray800};
  margin-bottom: 0.25em;
`;

const ReceiveButtonContainer = styled.div`
  margin: 0 24px;
`;

const CopyAddressButton = styled.div`
  ${Button};
  font-weight: 500;
`;

const NewAddressButton = styled.div`
  ${Button};
`;

const SendToAddressHeader = styled.div`
  font-size: 1em;
  color: ${gray800};
  margin: 12px;
`;

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
`;

const AddressDisplayWrapper = styled.div`
  border: 1px solid ${gray200};
  background: ${gray100};
  padding: 0.75em;
  color: ${green700};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1em;
  border-radius: 0.385em;
  word-break: break-all;
  flex-direction: column;
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
  padding: 1em;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  border-radius: 0.385em;
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

  ${mobile(css`
    order: -1;
    min-height: auto;
  `)};
`;

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: "flex";
  flex-direction: column;
  border-radius: 0.385em;
  background: ${white};
  text-align: right;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
`;

const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${gray600};
`;

const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;

export default requireOnchain(OnchainReceive);