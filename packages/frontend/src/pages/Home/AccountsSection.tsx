import React, { Fragment, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Bitcoin } from '@styled-icons/boxicons-logos';
import { AddCircleOutline } from '@styled-icons/material';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import moment from 'moment';
import type { ChannelBalanceResponse } from '@lily-technologies/lnrpc';

import { AccountMapContext } from 'src/context/AccountMapContext';

import { StyledIcon } from 'src/components';

import { white, gray500, gray600, black } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

import {
  LilyAccount,
  LilyLightningAccount,
  LilyOnchainAccount,
  Transaction,
  LightningEvent
} from '@lily/types';

const getLastTransactionTime = (account: LilyAccount) => {
  if (account.config.type === 'onchain') {
    return getLastTransactionTimeOnchain((account as LilyOnchainAccount).transactions);
  } else {
    return getLastTransactionTimeLightning((account as LilyLightningAccount).events);
  }
};

const getLastTransactionTimeOnchain = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    // if no transactions yet
    return `No activity on this account yet`;
  } else if (!transactions[0].status.confirmed) {
    // if last transaction isn't confirmed yet
    return `Last transaction was moments ago`;
  } else {
    // if transaction is confirmed, give moments ago
    return `Last transaction was ${moment.unix(transactions[0].status.block_time).fromNow()}`;
  }
};

const getLastTransactionTimeLightning = (events: LightningEvent[]) => {
  if (events.length === 0) {
    // if no transactions yet
    return `No activity on this account yet`;
  } else {
    // if transaction is confirmed, give moments ago
    return `Last transaction was ${moment.unix(Number(events[0].creationDate)).fromNow()}`;
  }
};

export const AccountsSection = () => {
  const { accountMap, setCurrentAccountId } = useContext(AccountMapContext);

  return (
    <Fragment>
      <h1 className='flex-1 text-2xl font-bold text-gray-900 mt-12 mb-6'>Your Accounts</h1>
      <div className='grid grid-cols-12 gap-6'>
        {Object.values(accountMap).map((account) => {
          const url =
            account.config.type === 'onchain'
              ? `/vault/${account.config.id}`
              : `/lightning/${account.config.id}`;
          return (
            <Link
              className='col-span-12 lg:col-span-6 flex align-center dark:bg-gray-800 bg-white overflow-hidden shadow rounded-lg dark:hover:bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-offset-gray-100 focus:ring-green-500'
              to={url}
              onClick={() => setCurrentAccountId(account.config.id)}
              key={account.config.id}
            >
              <div className='flex align-center p-5'>
                <div className='flex items-center'>
                  <StyledIcon className='h-6 w-6 text-yellow-500' as={Bitcoin} size={48} />
                  <AccountInfoContainer>
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
                        {account.config.type === 'onchain'
                          ? `${satoshisToBitcoins(account.currentBalance as number).toFixed(8)} BTC`
                          : `${Number(
                              (account.currentBalance as ChannelBalanceResponse).balance
                            ).toLocaleString()} sats`}
                      </span>
                    )}
                    {!account.loading && (
                      <span className='text-xs font-medium dark:text-gray-300 text-gray-500'>
                        {getLastTransactionTime(account)}
                      </span>
                    )}
                  </AccountInfoContainer>
                </div>
              </div>
            </Link>
          );
        })}
        <Link
          className='col-span-12 lg:col-span-6 flex align-center dark:bg-gray-800 bg-white overflow-hidden shadow rounded-lg dark:hover:bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-offset-gray-100 focus:ring-green-500'
          to={`/setup`}
        >
          <div className='flex align-center p-5'>
            <div className='flex items-center'>
              <StyledIcon className='h-6 w-6 text-yellow-500' as={AddCircleOutline} size={48} />
              <AccountInfoContainer>
                <h4 className='text-md font-semibold dark:text-green-500 text-green-600 truncate'>
                  Add a new account
                </h4>
                <span className='text-xs font-medium dark:text-gray-300 text-gray-500'>
                  Create a new account to send, receive, and manage bitcoin
                </span>
              </AccountInfoContainer>
            </div>
          </div>
        </Link>
        {!accountMap.size && <InvisibleItem></InvisibleItem>}
      </div>
    </Fragment>
  );
};

const InvisibleItem = styled.div`
  height: 0;
  width: 0;
`;

const AccountInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;
