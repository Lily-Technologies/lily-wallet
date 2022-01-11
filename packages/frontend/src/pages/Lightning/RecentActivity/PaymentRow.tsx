import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { gray50 } from 'src/utils/colors';

import PaymentTypeIcon from './PaymentTypeIcon';

const getFriendlyType = (
  type: 'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'PAYMENT_SEND' | 'PAYMENT_RECEIVE'
) => {
  if (type === 'PAYMENT_SEND') {
    return 'sent';
  } else if (type === 'PAYMENT_RECEIVE') {
    return 'received';
  } else if (type === 'CHANNEL_OPEN') {
    return 'open channel';
  } else {
    return 'close channel';
  }
};

interface Props {
  creation_date: number;
  title: string;
  value_sat: number;
  type: 'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'PAYMENT_SEND' | 'PAYMENT_RECEIVE';
  onClick: () => void;
}

const AcvitityRow = ({ onClick, type, creation_date, title, value_sat }: Props) => {
  return (
    <AcvitityRowWrapper onClick={() => onClick()}>
      <AcvitityRowContainer>
        <TxTypeIcon>
          <PaymentTypeIcon type={type} />
          <TxTypeTextWrapper>
            <TxTypeText>{getFriendlyType(type)}</TxTypeText>
            <TxTypeTime>{creation_date && moment.unix(creation_date).format('h:mm A')}</TxTypeTime>
          </TxTypeTextWrapper>
        </TxTypeIcon>
        <AddressWrapper>{title}</AddressWrapper>
        <AmountWrapper>{value_sat.toLocaleString()} sats</AmountWrapper>
      </AcvitityRowContainer>
    </AcvitityRowWrapper>
  );
};

const AcvitityRowWrapper = styled.div`
  border-bottom: 1px solid ${gray50};
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  align-items: center;
  flex-direction: column;
`;

const AcvitityRowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5em;

  &:hover {
    background: ${gray50};
    cursor: pointer;
  }
`;

const TxTypeIcon = styled.div`
  display: flex;
  flex: 0 0 10em;
  align-items: center;
`;

const TxTypeTextWrapper = styled.div`
  display: flex;
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
  font-size: 1em;
`;
const AddressWrapper = styled.div`
  display: flex;
  flex: 1;
  font-weight: 100;
  font-size: 1em;
  word-break: break-all;
  padding: 0 1em;
`;

export default AcvitityRow;
