import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SearchIcon } from '@heroicons/react/outline';
import moment from 'moment';

import { Button, TransactionRowsLoading } from 'src/components';

import TransactionRow from './TransactionRow';

import { gray800 } from 'src/utils/colors';
import { getMyAddressesFromTx } from 'src/utils/accountMap';

import { LilyOnchainAccount, Transaction } from '@lily/types';
import { classNames, normalizedIncludes } from 'src/utils/other';
import { AccountMapContext } from 'src/context';

import NoTransactionsEmptyState from './NoTransactionsEmptyState';
import NoFilteredTransactionsEmptyState from './NoFilteredTransactionsEmptyState';

const shouldDisplayDate = (transactions: Transaction[], index: number) => {
  if (index === 0) {
    return true;
  } else {
    if (
      moment.unix(transactions[index].status.block_time).format('MMDDYYYY') !==
      moment.unix(transactions[index - 1].status.block_time).format('MMDDYYYY')
    ) {
      return true;
    }
  }
  return false;
};

interface Props {
  transactions: Transaction[];
  loading: boolean;
  flat: boolean;
  openRescanModal?: () => void;
  maxItems?: number;
}

const RecentTransactions = ({
  transactions,
  loading,
  flat = false,
  maxItems = Infinity
}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentAccount } = useContext(AccountMapContext);
  const { addresses, changeAddresses } = currentAccount as LilyOnchainAccount;
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  useEffect(() => {
    const currentFilteredTxs = transactions.filter((tx) => {
      const txMatch =
        normalizedIncludes(tx.txid, searchQuery) || normalizedIncludes(tx.description, searchQuery);
      const myAddresses = getMyAddressesFromTx(tx, [...addresses, ...changeAddresses]);

      const tagOrAddrMatchIndex = myAddresses.findIndex((address) => {
        const labelMatch = address.tags.some((tag) => normalizedIncludes(tag.label, searchQuery));
        const addressMatch = normalizedIncludes(address.address, searchQuery);

        return labelMatch || addressMatch;
      });

      const tagOrAddrMatch = tagOrAddrMatchIndex >= 0;

      return txMatch || tagOrAddrMatch;
    });

    setFilteredTransactions(currentFilteredTxs);
  }, [searchQuery, transactions]);

  return (
    <div className='flex flex-col flex-1'>
      {(loading || transactions.length > 0) && (
        <div className='flex lg:flex-row flex-col items-start lg:items-center mt-12 mb-2 space-y-4 lg:space-y-0'>
          <h2 className='flex-1 text-2xl font-bold text-gray-900 dark:text-white'>
            Recent Activity
          </h2>
          <div className='group flex w-full lg:w-2/3 lg:justify-end'>
            <label htmlFor='search' className='sr-only'>
              Search
            </label>
            <div
              className={classNames(
                !!searchQuery ? '!w-full' : '',
                'relative focus-within:w-full w-full lg:w-48 transform duration-200 flex justify-end'
              )}
            >
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <SearchIcon
                  className='h-5 w-5 text-gray-400'
                  style={{ zIndex: 1 }}
                  aria-hidden='true'
                />
              </div>
              <input
                id='search'
                name='search'
                className='w-full block transform duration-200 rounded-2xl border hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 hover:cursor-pointer border-gray-300 dark:border-slate-100/10 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-green-500 focus:text-gray-900 dark:focus:text-slate-100 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm'
                placeholder='Search'
                type='search'
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                onFocus={(e) => (e.target.placeholder = 'Search by txid, description, or tags')}
                onBlur={(e) => (e.target.placeholder = 'Search')}
              />
            </div>
          </div>
        </div>
      )}
      {loading && <TransactionRowsLoading />}
      <div className='flex flex-col flex-1 space-y-2 pb-20'>
        {!loading &&
          filteredTransactions.map((transaction, index) => {
            // eslint-disable-line
            if (index < maxItems) {
              return (
                <div key={transaction.txid} className='rounded-2xl'>
                  {shouldDisplayDate(filteredTransactions, index) && (
                    <DateWrapper className='text-gray-800 dark:text-gray-200'>
                      {transaction.status.confirmed
                        ? moment.unix(transaction.status.block_time).format('MMMM DD, YYYY')
                        : 'Waiting for confirmation...'}
                    </DateWrapper>
                  )}
                  <TransactionRow transaction={transaction} flat={flat} />
                </div>
              );
            }
            return null;
          })}
        {!loading && transactions.length === 0 && <NoTransactionsEmptyState />}
        {!loading && filteredTransactions.length === 0 && <NoFilteredTransactionsEmptyState />}
      </div>
    </div>
  );
};

const DateWrapper = styled.div`
  margin: 1.5em 0 1em;
`;

export default RecentTransactions;
