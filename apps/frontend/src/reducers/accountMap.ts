import { AccountMapAction } from 'src/types';
import { AccountMap, LilyOnchainAccount } from '@lily/types';

export const ACCOUNTMAP_UPDATE = 'ACCOUNTMAP_UPDATE';
export const ACCOUNTMAP_SET = 'ACCOUNTMAP_SET';
export const ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION = 'ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION';

export const accountMapReducer = (state: AccountMap, action: AccountMapAction) => {
  if (action.type === ACCOUNTMAP_UPDATE) {
    return {
      ...state,
      [action.payload.account.config.id]: {
        ...action.payload.account
      }
    };
  }

  if (action.type === ACCOUNTMAP_SET) {
    return {
      ...action.payload
    };
  }

  if (action.type === ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION) {
    const accountTransactions = [
      ...(state[action.payload.accountId] as LilyOnchainAccount).transactions
    ];

    const index = accountTransactions.findIndex((tx) => tx.txid === action.payload.txid);

    accountTransactions[index] = {
      ...accountTransactions[index],
      description: action.payload.description
    };

    return {
      ...state,
      [action.payload.accountId]: {
        ...state[action.payload.accountId],
        transactions: accountTransactions
      }
    };
  }

  return state;
};
