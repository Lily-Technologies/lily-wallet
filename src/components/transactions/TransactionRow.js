import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { VerticalAlignBottom, ArrowUpward } from '@styled-icons/material';
import { StyledIcon } from '../../components';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { white, offWhite, green, gray, lightBlue } from '../../utils/colors';

const TransactionRow = ({ transaction, flat }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TransactionRowWrapper flat={flat}>
      <TransactionRowContainer flat={flat} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <TxTypeIcon flat={flat}>
          {transaction.type === 'received' && <StyledIconModified as={VerticalAlignBottom} size={flat ? 12 : 24} receive={true} />}
          {transaction.type === 'sent' && <StyledIconModified as={ArrowUpward} size={flat ? 12 : 24} />}
          <TxTypeTextWrapper flat={flat}>
            <TxTypeText>{transaction.type}</TxTypeText>
            <TxTypeTime>{moment.unix(transaction.status.block_time).format('h:mm A')}</TxTypeTime>
          </TxTypeTextWrapper>
        </TxTypeIcon>
        <AddressWrapper flat={flat}>{transaction.address}</AddressWrapper>
        <AmountWrapper flat={flat}>{satoshisToBitcoins(transaction.value).toNumber()} BTC</AmountWrapper>
      </TransactionRowContainer>
      {isOpen && <TransactionMoreInfo>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
      </TransactionMoreInfo>}
    </TransactionRowWrapper>
  )
}

const TransactionRowWrapper = styled.div`
  border-bottom: 1px solid ${offWhite};
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'};;
  align-items: center;
  flex-direction: column;
`;

const TransactionRowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${p => p.flat ? '12px' : '24px'};

  &:hover {
    background: ${p => !p.isOpen && offWhite};
    cursor: pointer;
  }
`;


const TransactionMoreInfo = styled.div`
  display: flex;
  padding: 12px;
  overflow: scroll;
  background: ${lightBlue};
`;

const StyledIconModified = styled(StyledIcon)`
  padding: 8px;
  margin-right: 12px;
  background: ${p => p.receive ? green : gray};
  border-radius: 50%;
`;

const TxTypeIcon = styled.div`
  display: flex;
  flex: ${p => p.flat ? '0 0' : '0 0 200px'};;
  align-items: center;
`;

const TxTypeTextWrapper = styled.div`
  display: ${p => p.flat ? 'none' : 'flex'};
  flex-direction: column;
`;

const TxTypeText = styled.div`
  text-transform: capitalize;
`;


const TxTypeTime = styled.div``;



const AmountWrapper = styled.div`
  display: flex;
  flex: 1;
  text-align: right;
  justify-content: flex-end;
  font-size: ${p => p.flat ? '12px' : '16px'};
`;
const AddressWrapper = styled.div`
  display: flex;
  flex: 1;
  font-weight: 100;
  font-size: ${ p => p.flat ? '12px' : '16px'};
`;

export default TransactionRow;