import React from 'react';
import styled from 'styled-components';
import { CheckCircle } from '@styled-icons/material';
import { Link } from 'react-router-dom';
import { requireLightning } from 'src/hocs';
import { decode } from 'bolt11';

import { Button, StyledIcon } from 'src/components';

import { white, green500, gray400, gray700 } from 'src/utils/colors';

import { LilyLightningAccount } from '@lily/types';

interface Props {
  currentAccount: LilyLightningAccount;
  paymentRequest: string;
}

const LightningReceiveSuccess = ({ currentAccount, paymentRequest }: Props) => {
  const decoded = decode(paymentRequest);

  return (
    <AccountReceiveContentLeft>
      <Wrapper>
        <IconWrapper style={{ color: green500 }}>
          <StyledIcon as={CheckCircle} size={100} />
        </IconWrapper>
        <SuccessText>Payment received!</SuccessText>
        <SuccessSubtext>
          You just received {decoded.satoshis?.toLocaleString()} sats!
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
    </AccountReceiveContentLeft>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${white};
  border-radius: 0.875em;
  padding: 1.5em 0.75em;
  width: 100%;
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
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

export default requireLightning(LightningReceiveSuccess);
