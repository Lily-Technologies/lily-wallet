import React from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { Button } from '../';

import TransactionTypeIcon from './TransactionTypeIcon';

import {
  white,
  lightGray,
  darkOffWhite,
  green600,
  green800,
  darkGray,
  gray700,
  gray800
} from '../../utils/colors';

import { Transaction } from '../../types';

interface Props {
  transaction: Transaction
}

const TxDetailsModal = ({ transaction }: Props) => {
  console.log('transaction: ', transaction);
  return (
    <Wrapper>
      <HeaderWrapper>
        <TransactionTypeIcon transaction={transaction} flat={false} />
        <HeaderInfo>
          <Header>Transaction Details</Header>
          <TransactionId>{transaction.txid}</TransactionId>
        </HeaderInfo>
      </HeaderWrapper>

      <MoreDetailsSection>
        <MoreDetailsHeader>Inputs</MoreDetailsHeader>
        {transaction.vin.map(input => {
          return (
            <OutputItem>
              <OutputAddress>{`${input.prevout.scriptpubkey_address}:${input.vout}`}</OutputAddress>
              <OutputAmount>{satoshisToBitcoins(input.prevout.value).toNumber()} BTC</OutputAmount>
            </OutputItem>
          )
        })}
      </MoreDetailsSection>
      <MoreDetailsSection>
        <MoreDetailsHeader>Outputs</MoreDetailsHeader>
        {transaction.vout.map(output => {
          return (
            <OutputItem>
              <OutputAddress>{output.scriptpubkey_address}</OutputAddress>
              <OutputAmount>{satoshisToBitcoins(output.value).toNumber()} BTC</OutputAmount>
            </OutputItem>
          )
        })}
      </MoreDetailsSection>
      <MoreDetailsSection>
        <MoreDetailsHeader>Status</MoreDetailsHeader>
        <StatusItem>{transaction.status.confirmed ? `Confirmed in block ${transaction.status.block_height}` : 'Unconfirmed'}</StatusItem>
        <StatusItem>Paid {satoshisToBitcoins(transaction.fee).toNumber()} BTC in fees</StatusItem>
      </MoreDetailsSection>
      <Buttons>
        <ViewExplorerButton
          background={green600}
          color={white}
          onClick={() => window.open(`https://blockstream.info/tx/${transaction.txid}`, '_blank', 'nodeIntegration=no')}>
          View on Blockstream
          </ViewExplorerButton>
      </Buttons>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.25em 1.5em;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.25em;
`;

const Header = styled.h1`
  color: ${gray800};
  margin: 0;
`;

const TransactionId = styled.h5`
  color: ${gray700};
  margin: 0;
  font-weight: 500;
  margin-top: 0.25em;
`;

const ViewExplorerButton = styled.button`
  ${Button};
`;

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  margin: 12px 0;
  background: ${lightGray};
  border: 1px solid ${darkOffWhite};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const OutputAddress = styled.span`
  color: ${green800};
  flex: 2;
  word-break: break-word;
`;

const OutputAmount = styled.span`
  flex: 1;
  text-align: right;
`;

const MoreDetailsSection = styled.div`
  margin-top: 1.5em;
`;

const MoreDetailsHeader = styled.div`
  color: ${darkGray};
  font-size: 1.5em;
`;

const StatusItem = styled.h4`
  color: ${gray700};
  margin: 0;
  font-weight: 500;
  margin-top: 0.5em;
  margin-left: 0.5em;
`;

const Buttons = styled.div`
  margin-top: 0.5em;
  display: flex;
  justify-content: flex-end;
`;

export default TxDetailsModal;