import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import { ChevronRightIcon } from '@heroicons/react/solid';

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
    <li
      className='list-none last:border-none border-b border-gray-100 dark:border-gray-700 shadow'
      onClick={() => onClick()}
    >
      <button className='block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-full'>
        <div className='flex items-center px-4 py-4 sm:px-6'>
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <TransactionTypeIcon transaction={transaction} flat={flat} />
              </div>
              <div className='hidden sm:flex flex-col items-start text-gray-900 dark:text-gray-300'>
                <p className='text-sm capitalize'>{transaction.type}</p>
                <p className='text-xs whitespace-nowrap'>
                  {transaction.status.confirmed
                    ? moment.unix(transaction.status.block_time).format('h:mm A')
                    : 'Unconfirmed'}
                </p>
              </div>
            </div>
            <div className='sm:flex sm:justify-between flex-wrap w-full items-center px-4 truncate'>
              <p className='text-left text-sm font-medium text-yellow-600 truncate'>
                {transaction.address}
              </p>
              <p className='hidden sm:flex items-center text-sm text-gray-900 dark:text-gray-300'>
                {satoshisToBitcoins(transaction.value).toNumber()} BTC
              </p>
              <p className='flex sm:hidden items-center text-sm text-gray-900 dark:text-gray-300'>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}{' '}
                {satoshisToBitcoins(transaction.value).toNumber()} BTC{' '}
                {transaction.status.confirmed
                  ? `at ${moment.unix(transaction.status.block_time).format('h:mm A')}`
                  : ''}
              </p>
            </div>
          </div>
          <div>
            <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
          </div>
        </div>
      </button>
    </li>
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
