import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { ViewGridIcon as ViewGridIconSolid, ViewListIcon } from '@heroicons/react/solid';

import { AccountMapContext } from 'src/context/AccountMapContext';

import { StyledIcon } from 'src/components';

import { AccountGridItem } from 'src/pages/Home/AccountGridItem';
import { AccountListItem } from 'src/pages/Home/AccountListItem';
import { useLocalStorage } from 'src/utils/useLocalStorage';
import { AddNewAccountGridItem } from './AddNewAccountGridItem';
import { AddNewAccountListItem } from './AddNewAccountListItem';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const AccountsSection = () => {
  const { accountMap } = useContext(AccountMapContext);
  const [viewType, setViewType] = useLocalStorage<'grid' | 'list'>('homepageAccountView', 'grid');

  return (
    <>
      <div className='flex mt-12 mb-6'>
        <h1 className='flex-1 text-2xl font-bold text-gray-900 dark:text-white'>Your Accounts</h1>
        <div className='ml-6 bg-gray-200 dark:bg-gray-800 p-0.5 rounded-lg flex items-center'>
          <button
            onClick={() => setViewType('list')}
            type='button'
            className={classNames(
              'ml-0.5 p-1.5 rounded-md text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500',
              viewType === 'list' ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm' : ''
            )}
          >
            <ViewListIcon className='h-5 w-5 fill-current' aria-hidden='true' />
            <span className='sr-only'>Use list view</span>
          </button>
          <button
            onClick={() => setViewType('grid')}
            type='button'
            className={classNames(
              'ml-0.5 p-1.5 rounded-md text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500',
              viewType === 'grid' ? 'bg-white dark:bg-gray-600 dark:text-white shadow-sm' : ''
            )}
          >
            <ViewGridIconSolid className='h-5 w-5' aria-hidden='true' />
            <span className='sr-only'>Use grid view</span>
          </button>
        </div>
      </div>
      <div
        className={classNames(
          viewType === 'list'
            ? 'bg-white dark:bg-gray-800 shadow rounded-t-lg rounded-b-lg overflow-hidden'
            : ''
        )}
      >
        <ul
          className={classNames(
            viewType === 'grid' ? 'grid grid-cols-12 gap-6' : '',
            viewType === 'list'
              ? 'border-t-0 border-gray-200 divide-y divide-gray-200 dark:divide-gray-600 mt-0'
              : ''
          )}
        >
          {Object.values(accountMap).map((account) => {
            const url =
              account.config.type === 'onchain'
                ? `/vault/${account.config.id}`
                : `/lightning/${account.config.id}`;
            if (viewType === 'grid') {
              return <AccountGridItem url={url} account={account} />;
            } else {
              return <AccountListItem url={url} account={account} />;
            }
          })}
          {viewType === 'grid' ? <AddNewAccountGridItem /> : <AddNewAccountListItem />}
        </ul>
      </div>
    </>
  );
};
