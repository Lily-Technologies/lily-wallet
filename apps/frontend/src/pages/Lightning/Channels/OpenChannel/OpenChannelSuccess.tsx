import React from 'react';
import styled from 'styled-components';
import { CheckCircle } from '@styled-icons/material';
import { Link } from 'react-router-dom';

import { Button, StyledIcon } from 'src/components';

import { white, green500, gray700 } from 'src/utils/colors';

import { requireLightning } from 'src/hocs';
import { LilyLightningAccount } from '@lily/types';

interface Props {
  currentAccount: LilyLightningAccount;
}

const OpenChannelSuccess = ({ currentAccount }: Props) => (
  <div className='flex flex-col items-center bg-white dark:bg-gray-800 pt-12 pb-4'>
    <div className='text-green-500'>
      <StyledIcon as={CheckCircle} size={100} />
    </div>
    <div className='mt-3 text-center sm:mt-5'>
      <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-gray-100'>
        New channel opened!
      </h3>
      <div className='mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400'>
        <p>You just opened a new lightning network channel.</p>
      </div>
    </div>
    <div className='mt-8'>
      <ReturnToDashboardButton
        background={green500}
        color={white}
        to={`/lightning/${currentAccount.config.id}`}
      >
        Return to dashboard
      </ReturnToDashboardButton>
    </div>
  </div>
);

const ReturnToDashboardButton = styled(Link)`
  ${Button}
`;

export default requireLightning(OpenChannelSuccess);
