import React, { useState } from 'react';
import moment from 'moment';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { Unit, SlideOver } from 'src/components';
import { capitalize } from 'src/utils/other';

import TransactionTypeIcon from './TransactionTypeIcon';
import TxDetailsSlideover from './TxDetailsSlideover';

import { Transaction } from '@lily/types';

interface Props {
  transaction: Transaction;
  flat: boolean;
}

const TransactionRow = ({ transaction, flat }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  return (
    <li className='list-none last:border-none border-b border-gray-100 dark:border-gray-700 shadow rounded-2xl'>
      <button
        className='block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-full dark:highlight-white/10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-green-500'
        onClick={() => {
          openInModal(<TxDetailsSlideover transaction={transaction} setOpen={setModalIsOpen} />);
        }}
      >
        <div className='flex items-center px-4 py-4 sm:px-6'>
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <TransactionTypeIcon transaction={transaction} flat={flat} />
              </div>
              <div className='hidden sm:flex flex-col items-start text-gray-900 dark:text-gray-300 w-16'>
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
                {transaction.description ? transaction.description : transaction.address}
              </p>
              <p className='hidden sm:flex items-center text-sm text-gray-900 dark:text-gray-300'>
                <Unit value={transaction.value} />{' '}
              </p>
              <p className='flex sm:hidden items-center text-sm text-gray-900 dark:text-gray-300'>
                {capitalize(transaction.type)} <Unit className='mx-1' value={transaction.value} />{' '}
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
      <SlideOver open={modalIsOpen} setOpen={setModalIsOpen} content={modalContent} />
    </li>
  );
};

export default TransactionRow;
