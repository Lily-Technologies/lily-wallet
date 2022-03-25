import React from 'react';
import moment from 'moment';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import { ChevronRightIcon } from '@heroicons/react/solid';

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

export default TransactionRow;