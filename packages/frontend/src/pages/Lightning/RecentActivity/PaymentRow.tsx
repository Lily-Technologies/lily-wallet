import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { gray50 } from 'src/utils/colors';

import PaymentTypeIcon from './PaymentTypeIcon';

const getFriendlyType = (
  type: 'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'PAYMENT_SEND' | 'PAYMENT_RECEIVE'
) => {
  if (type === 'PAYMENT_SEND') {
    return 'Sent';
  } else if (type === 'PAYMENT_RECEIVE') {
    return 'Received';
  } else if (type === 'CHANNEL_OPEN') {
    return 'Open channel';
  } else {
    return 'Close channel';
  }
};

interface Props {
  creation_date?: number;
  title: string;
  value_sat: number;
  type: 'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'PAYMENT_SEND' | 'PAYMENT_RECEIVE';
  onClick: () => void;
}

const AcvitityRow = ({ onClick, type, creation_date, title, value_sat }: Props) => {
  return (
    <li className='list-none border-b border-gray-100 shadow' onClick={() => onClick()}>
      <button className='block bg-white hover:bg-gray-50 w-full'>
        <div className='flex items-center px-4 py-4 sm:px-6'>
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <PaymentTypeIcon type={type} />
              </div>
            </div>
            <div className='hidden sm:flex flex-col items-start'>
              <p className='text-sm capitalize text-left w-16'>{getFriendlyType(type)}</p>
              <p className='text-xs whitespace-nowrap'>
                {creation_date && moment.unix(creation_date).format('h:mm A')}
              </p>
            </div>
            <div className='sm:flex sm:justify-between flex-wrap w-full items-center px-4 truncate'>
              <p className='text-left text-sm font-medium text-yellow-600 truncate'>{title}</p>
              <p className='hidden sm:flex items-center text-sm text-gray-900'>
                {value_sat ? `${value_sat.toLocaleString()} sats` : null}
              </p>
              <p className='flex sm:hidden items-center text-sm text-gray-900'>
                {type === 'PAYMENT_RECEIVE' || type === 'PAYMENT_SEND'
                  ? getFriendlyType(type)
                  : null}{' '}
                {value_sat.toLocaleString()} sats{' '}
                {creation_date ? `at ${moment.unix(creation_date).format('h:mm A')}` : ''}
              </p>
            </div>
            <div>
              <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </div>
          </div>
        </div>
      </button>
    </li>
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
