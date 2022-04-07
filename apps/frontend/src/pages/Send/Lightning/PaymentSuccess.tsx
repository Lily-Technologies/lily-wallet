import React, { useContext } from 'react';
import styled from 'styled-components';
import { CheckCircle } from '@styled-icons/material';
import { Link } from 'react-router-dom';
import type { Payment } from '@lily-technologies/lnrpc';
import { decode } from 'bolt11';

import { Button, StyledIcon } from 'src/components';

import { white, green500, gray700 } from 'src/utils/colors';

import { LilyLightningAccount } from '@lily/types';
import { requireLightning } from 'src/hocs';

import { UnitContext } from 'src/context';

interface Props {
  currentAccount: LilyLightningAccount;
  payment: Payment;
}

const PaymentSuccess = ({ currentAccount, payment }: Props) => {
  const { getValue } = useContext(UnitContext);
  const decoded = decode(payment.paymentRequest);
  const description = decoded.tags.filter((item) => item.tagName === 'description')[0]?.data;

  return (
    <Wrapper>
      <IconWrapper style={{ color: green500 }}>
        <StyledIcon as={CheckCircle} size={100} />
      </IconWrapper>
      <SuccessText>Payment success!</SuccessText>
      <SuccessSubtext>
        You just paid {getValue(Number(payment.valueSat))} for {description}.
      </SuccessSubtext>
      <SuccessSubtext>
        <ReturnToDashboardButton
          background={green500}
          color={white}
          to={`/lightning/${currentAccount.config.id}`}
        >
          Return to dashboard
        </ReturnToDashboardButton>
      </SuccessSubtext>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${white};
  border-radius: 0.875em;
  padding: 1.5em 0.75em;
`;

const IconWrapper = styled.div``;

const SuccessText = styled.div`
  margin-top: 0.5em;
  font-size: 1.5em;
  color: ${gray700};
`;

const SuccessSubtext = styled.div`
  color: ${gray700};
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ReturnToDashboardButton = styled(Link)`
  ${Button}
  margin-top: 1rem;
`;

export default requireLightning(PaymentSuccess);
