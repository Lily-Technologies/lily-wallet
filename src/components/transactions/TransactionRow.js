import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { VerticalAlignBottom, ArrowUpward } from '@styled-icons/material';
import { StyledIcon } from '../../components';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { white, offWhite, green, gray, gray100 } from '../../utils/colors';

const TransactionRow = ({ transaction, flat }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TransactionRowWrapper flat={flat}>
      <TransactionRowContainer flat={flat} isOpen={isOpen} onClick={() => { !flat && setIsOpen(!isOpen) }}>
        <TxTypeIcon flat={flat}>
          {transaction.type === 'received' && <StyledIconModified as={VerticalAlignBottom} size={flat ? 36 : 48} receive={true} />}
          {transaction.type === 'sent' && <StyledIconModified as={ArrowUpward} size={flat ? 36 : 48} />}
          <TxTypeTextWrapper flat={flat}>
            <TxTypeText>{transaction.type}</TxTypeText>
            <TxTypeTime>{transaction.status.confirmed ? moment.unix(transaction.status.block_time).format('h:mm A') : 'Unconfirmed'}</TxTypeTime>
          </TxTypeTextWrapper>
        </TxTypeIcon>
        <AddressWrapper flat={flat}>{transaction.address.address ? transaction.address.address : transaction.address}</AddressWrapper>
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

const TransactionRowWrapper = styled.div`
  border-bottom: 1px solid ${offWhite};
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)'};
  align-items: center;
  flex-direction: column;
`;

const TransactionRowContainer = styled.div`
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

const StyledIconModified = styled(StyledIcon)`
  padding: .5em;
  margin-right: .75em;
  background: ${p => p.receive ? green : gray};
  border-radius: 50%;
`;

const TxTypeIcon = styled.div`
  display: flex;
  flex: ${p => p.flat ? '0 0' : '0 0 10em'};;
  align-items: center;
`;

const TxTypeTextWrapper = styled.div`
  display: ${p => p.flat ? 'none' : 'flex'};
  flex-direction: column;
`;

const TxTypeText = styled.div`
  text-transform: capitalize;
`;


const TxTypeTime = styled.div`
  font-size: 0.75em;
`;



const AmountWrapper = styled.div`
  display: flex;
  text-align: right;
  justify-content: flex-end;
  font-size: ${p => p.flat ? '.75em' : '1em'};
`;
const AddressWrapper = styled.div`
  display: flex;
  flex: 1;
  font-weight: 100;
  font-size: ${p => p.flat ? '.75em' : '1em'};
  word-break: break-all;
  padding: 0 1em;
`;

export default TransactionRow;