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
    <AccountReceiveContentLeft className='bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700'>
      <Wrapper className='bg-white dark:bg-gray-800'>
        <IconWrapper style={{ color: green500 }}>
          <StyledIcon as={CheckCircle} size={100} />
        </IconWrapper>
        <SuccessText className='text-gray-700 dark:text-gray-200'>Payment received!</SuccessText>
        <SuccessSubtext className='text-gray-700 dark:text-gray-200'>
          You just received {decoded.satoshis?.toLocaleString()} sats!
        </SuccessSubtext>
        <SuccessSubtext className='text-gray-700 dark:text-gray-200'>
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
  border-radius: 0.875em;
  padding: 1.5em 0.75em;
  width: 100%;
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-radius: 0.385em;
  justify-content: center;
  width: 100%;
`;

const IconWrapper = styled.div``;

const SuccessText = styled.div`
  margin-top: 0.5em;
  font-size: 1.5em;
`;

const SuccessSubtext = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ReturnToDashboardButton = styled(Link)`
  ${Button}
  margin-top: 1rem;
`;

export default requireLightning(LightningReceiveSuccess);
