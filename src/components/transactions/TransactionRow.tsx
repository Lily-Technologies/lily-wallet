import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { VerticalAlignBottom, ArrowUpward } from '@styled-icons/material';
import { Transfer } from '@styled-icons/boxicons-regular';
import { StyledIcon } from '../../components';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { white, offWhite, green, gray, gray100, red500 } from '../../utils/colors';

import { Transaction } from '../../types'

interface Props {
  transaction: Transaction
  flat: boolean
}

const TransactionRow = ({ transaction, flat }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TransactionRowWrapper flat={flat}>
      <TransactionRowContainer flat={flat} isOpen={isOpen} onClick={() => { !flat && setIsOpen(!isOpen) }}>
        <TxTypeIcon flat={flat}>
          {transaction.type === 'received' && <StyledIconModified as={VerticalAlignBottom} size={flat ? 36 : 48} receive={true} />}
          {transaction.type === 'sent' && <StyledIconModified as={ArrowUpward} size={flat ? 36 : 48} />}
          {transaction.type === 'moved' && <StyledIconModified as={Transfer} size={flat ? 36 : 48} moved={true} />}
          <TxTypeTextWrapper flat={flat}>
            <TxTypeText>{transaction.type}</TxTypeText>
            <TxTypeTime>{transaction.status.confirmed ? moment.unix(transaction.status.block_time).format('h:mm A') : 'Unconfirmed'}</TxTypeTime>
          </TxTypeTextWrapper>
        </TxTypeIcon>
        <AddressWrapper flat={flat}>{transaction.address}</AddressWrapper>
        <AmountWrapper flat={flat}>{satoshisToBitcoins(transaction.value).toNumber()} BTC</AmountWrapper>
      </TransactionRowContainer>
      {isOpen && (
        <TransactionMoreInfo>
          <pre>{JSON.stringify(transaction, null, 2)}</pre>
        </TransactionMoreInfo>
      )}
    </TransactionRowWrapper>
  )
}

const TransactionRowWrapper = styled.div<{ flat: boolean }>`
  border-bottom: 1px solid ${offWhite};
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)'};
  align-items: center;
  flex-direction: column;
`;

const TransactionRowContainer = styled.div<{ flat: boolean, isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: ${p => p.flat ? '.75em' : '1.5em'};

  &:hover {
    background: ${p => !p.isOpen && !p.flat && offWhite};
    cursor: ${p => !p.flat && 'pointer'};
  }
`;


const TransactionMoreInfo = styled.div`
  display: flex;
  padding: .75em;
  overflow: scroll;
  background: ${gray100};
`;

const StyledIconModified = styled(StyledIcon) <{ receive?: boolean, moved?: boolean }>`
  padding: .5em;
  margin-right: .75em;
  background: ${p => p.moved ? gray : (p.receive ? green : red500)};
  border-radius: 50%;
`;

const TxTypeIcon = styled.div<{ flat: boolean }>`
  display: flex;
  flex: ${p => p.flat ? '0 0' : '0 0 10em'};;
  align-items: center;
`;

const TxTypeTextWrapper = styled.div<{ flat: boolean }>`
  display: ${p => p.flat ? 'none' : 'flex'};
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
  font-size: ${p => p.flat ? '.75em' : '1em'};
`;
const AddressWrapper = styled.div<{ flat: boolean }>`
  display: flex;
  flex: 1;
  font-weight: 100;
  font-size: ${p => p.flat ? '.75em' : '1em'};
  word-break: break-all;
  padding: 0 1em;
`;

export default TransactionRow;