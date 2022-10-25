import { AccountMapAction } from 'src/types';
import { AccountMap, AddressTag, LilyAccount, LilyOnchainAccount } from '@lily/types';

export const ACCOUNTMAP_UPDATE = 'ACCOUNTMAP_UPDATE';
export const ACCOUNTMAP_SET = 'ACCOUNTMAP_SET';
export const ACCOUNT_ADDRESS_ADD_TAG = 'ACCOUNT_ADDRESS_ADD_TAG';
export const ACCOUNT_ADDRESS_DELETE_TAG = 'ACCOUNT_ADDRESS_DELETE_TAG';
export const ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION = 'ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION';

enum AddressLists {
  addresses = 'addresses',
  unusedAddresses = 'unusedAddresses',
  changeAddresses = 'changeAddresses',
  unusedChangeAddresses = 'unusedChangeAddresses'
}

const getAddressArrayNameAndIndex = (
  state: AccountMap,
  account: LilyAccount,
  tag: AddressTag
) => {};

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

  if (action.type === ACCOUNT_ADDRESS_ADD_TAG) {
    const account = state[action.payload.accountId];

    if (account.config.type === 'onchain') {
      const addressLists = Object.values(AddressLists);

      for (const addressList of addressLists) {
        const index = account[addressList].findIndex(
          (address) => address.address === action.payload.tag.address
        );

        if (index >= 0) {
          const addressListCopy = [
            ...(state[account.config.id] as LilyOnchainAccount)[addressList]
          ];

          addressListCopy[index] = {
            ...addressListCopy[index],
            tags: [...addressListCopy[index].tags, action.payload.tag]
          };

          return {
            ...state,
            [account.config.id]: {
              ...state[account.config.id],
              [addressList]: addressListCopy
            }
          };
        }
      }
    }
    return state;
  }

  if (action.type === ACCOUNT_ADDRESS_DELETE_TAG) {
    const account = state[action.payload.accountId];

    if (account.config.type === 'onchain') {
      const addressLists = Object.values(AddressLists);

      for (const addressList of addressLists) {
        const index = account[addressList].findIndex(
          (address) => address.address === action.payload.tag.address
        );

        if (index >= 0) {
          const addressListCopy = [
            ...(state[account.config.id] as LilyOnchainAccount)[addressList]
          ];

          addressListCopy[index] = {
            ...addressListCopy[index],
            tags: addressListCopy[index].tags.filter((tag) => tag.id !== action.payload.tag.id)
          };

          return {
            ...state,
            [account.config.id]: {
              ...state[account.config.id],
              [addressList]: addressListCopy
            }
          };
        }
      }
    }
    return state;
  }

  return state;
};
