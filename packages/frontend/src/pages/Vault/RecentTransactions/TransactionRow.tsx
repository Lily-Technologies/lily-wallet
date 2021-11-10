import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { white, gray50 } from 'src/utils/colors';

import TransactionTypeIcon from './TransactionTypeIcon';

import { Transaction } from '@lily/types';

interface Props {
  transaction: Transaction;
  flat: boolean;
  onClick: () => void;
}

const TransactionRow = ({ onClick, transaction, flat }: Props) => {
  return (
    <TransactionRowWrapper onClick={() => onClick()} flat={flat}>
      <TransactionRowContainer flat={flat}>
        <TxTypeIcon flat={flat}>
          <TransactionTypeIcon transaction={transaction} flat={flat} />
          <TxTypeTextWrapper flat={flat}>
            <TxTypeText>{transaction.type}</TxTypeText>
            <TxTypeTime>
              {transaction.status.confirmed
                ? moment.unix(transaction.status.block_time).format('h:mm A')
                : 'Unconfirmed'}
            </TxTypeTime>
          </TxTypeTextWrapper>
        </TxTypeIcon>
        <AddressWrapper flat={flat}>{transaction.address}</AddressWrapper>
        <AmountWrapper flat={flat}>
          {satoshisToBitcoins(transaction.value).toNumber()} BTC
        </AmountWrapper>
      </TransactionRowContainer>
    </TransactionRowWrapper>
  );
};

const TransactionRowWrapper = styled.div<{ flat: boolean }>`
  border-bottom: 1px solid ${gray50};
  background: ${(p) => (p.flat ? 'transparent' : white)};
  box-shadow: ${(p) =>
    p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)'};
  align-items: center;
  flex-direction: column;
`;

const TransactionRowContainer = styled.div<{ flat: boolean }>`
  display: flex;
  align-items: center;
  padding: ${(p) => (p.flat ? '.75em' : '1.5em')};

  &:hover {
    background: ${(p) => !p.flat && gray50};
    cursor: ${(p) => !p.flat && 'pointer'};
  }
`;

const TxTypeIcon = styled.div<{ flat: boolean }>`
  display: flex;
  flex: ${(p) => (p.flat ? '0 0' : '0 0 10em')};
  align-items: center;
`;

const TxTypeTextWrapper = styled.div<{ flat: boolean }>`
  display: ${(p) => (p.flat ? 'none' : 'flex')};
  flex-direction: column;
`;

const TxTypeText = styled.div`
  text-transform: capitalize;
`;

const TxTypeTime = styled.div`
  font-size: 0.75em;
`;

const AmountWrapper = styled.div<{ flat: boolean }>`
  display: flex;
  text-align: right;
  justify-content: flex-end;
  font-size: ${(p) => (p.flat ? '.75em' : '1em')};
`;
const AddressWrapper = styled.div<{ flat: boolean }>`
  display: flex;
  flex: 1;
  font-weight: 100;
  font-size: ${(p) => (p.flat ? '.75em' : '1em')};
  word-break: break-all;
  padding: 0 1em;
`;

export default TransactionRow;
