import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin } from '@styled-icons/boxicons-logos';

import { LilyAccount } from '@lily/types';

import { AccountMapContext } from 'src/context/AccountMapContext';

import { getLastTransactionTime, getAccountBalance } from 'src/pages/Home/utils';

interface Props {
  url: string;
  account: LilyAccount;
}

export const AccountGridItem = ({ url, account }: Props) => {
  const { setCurrentAccountId } = useContext(AccountMapContext);
  return (
    <li className='col-span-12 lg:col-span-6'>
      <Link
        className='h-36 flex align-center dark:bg-gray-800 bg-white overflow-hidden shadow rounded-lg dark:hover:bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-offset-gray-100 focus:ring-green-500'
        to={url}
        onClick={() => setCurrentAccountId(account.config.id)}
        key={account.config.id}
      >
        <div className='flex align-center p-5'>
          <div className='flex items-center'>
            <Bitcoin className='h-12 w-12 text-yellow-500' />
            <div className='flex flex-col p-4'>
              <h4 className='text-md font-semibold dark:text-green-500 text-green-600 truncate'>
                {account.name}
              </h4>
              {account.loading && (
                <span className='text-sm font-medium dark:text-gray-300 text-gray-500'>
                  Loading...
                </span>
              )}
              {!account.loading && (
                <span className='text-lg font-medium dark:text-gray-100 text-gray-900'>
                  {getAccountBalance(account)}
                </span>
              )}
              {!account.loading && (
                <span className='text-xs font-medium dark:text-gray-300 text-gray-500'>
                  {getLastTransactionTime(account)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
