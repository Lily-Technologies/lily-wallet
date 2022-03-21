import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin } from '@styled-icons/boxicons-logos';

import { ChevronRightIcon } from '@heroicons/react/solid';

import { LilyAccount } from '@lily/types';

import { AccountMapContext } from 'src/context/AccountMapContext';

import { getLastTransactionTime, getAccountBalance } from 'src/pages/Home/utils';

interface Props {
  url: string;
  account: LilyAccount;
}

export const AccountListItem = ({ url, account }: Props) => {
  const { setCurrentAccountId } = useContext(AccountMapContext);

  return (
    <li key={account.config.id}>
      <Link
        to={url}
        onClick={() => setCurrentAccountId(account.config.id)}
        className='group block dark:hover:bg-gray-700 hover:bg-gray-50'
      >
        <div className='flex items-center py-2 px-3'>
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='flex-shrink-0'>
              <Bitcoin className='h-8 w-8 text-yellow-500' />
            </div>
            <div className='min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4'>
              <div>
                <p className='text-sm font-medium text-green-600 dark:text-green-500 truncate'>
                  {account.name}
                </p>
                <p className='flex items-center text-sm text-gray-500 dark:text-gray-300'>
                  <time dateTime={getLastTransactionTime(account)}>
                    {getLastTransactionTime(account)}
                  </time>
                </p>
              </div>
              <div className='hidden md:flex items-center justify-end'>
                <div>
                  <p className='text-sm text-gray-900 dark:text-gray-100'>
                    {getAccountBalance(account)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className='h-5 w-5 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
              aria-hidden='true'
            />
          </div>
        </div>
      </Link>
    </li>
  );
};
