import moment from 'moment';

import {
  LilyAccount,
  LilyLightningAccount,
  LilyOnchainAccount,
  Transaction,
  LightningEvent
} from '@lily/types';

export const getLastTransactionTime = (account: LilyAccount) => {
  if (account.config.type === 'onchain') {
    return getLastTransactionTimeOnchain((account as LilyOnchainAccount).transactions);
  } else {
    return getLastTransactionTimeLightning((account as LilyLightningAccount).events);
  }
};

export const getLastTransactionTimeOnchain = (transactions: Transaction[]) => {
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

export const getLastTransactionTimeLightning = (events: LightningEvent[]) => {
  if (!events || events.length === 0) {
    // if no transactions yet
    return `No activity on this account yet`;
  } else {
    // if transaction is confirmed, give moments ago
    return `Last transaction was ${moment.unix(Number(events[0].creationDate)).fromNow()}`;
  }
};

export const getAccountBalance = (account: LilyAccount) => {
  if (account.config.type === 'onchain') {
    return (account as LilyOnchainAccount).currentBalance;
  } else {
    return Number((account as LilyLightningAccount).currentBalance.balance);
  }
};
