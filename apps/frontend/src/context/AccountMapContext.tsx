import React, { createContext, useContext, useReducer, useCallback, useState } from 'react';
import { PlatformContext } from 'src/context';

import {
  accountMapReducer,
  ACCOUNTMAP_UPDATE,
  ACCOUNTMAP_SET,
  ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION,
  ACCOUNT_ADDRESS_ADD_TAG,
  ACCOUNT_ADDRESS_DELETE_TAG
} from 'src/reducers/accountMap';

import { AccountMap, AddressTag, LilyAccount, LilyOnchainAccount } from '@lily/types';

export const AccountMapContext = createContext({
  setAccountMap: (accountMap: AccountMap) => {},
  updateAccountMap: (account: LilyAccount) => {},
  setCurrentAccountId: (id: string) => {},
  accountMap: {} as AccountMap,
  currentAccount: {} as LilyAccount,
  updateTransactionDescription: (
    account: LilyOnchainAccount,
    txid: string,
    description: string
  ) => {},
  addAddressTag: (accountId: string, address: string, tag: string) => {},
  deleteAddressTag: (accountId: string, tag: AddressTag) => {}
});

export const AccountMapProvider = ({ children }: { children: React.ReactChild }) => {
  const [accountMap, dispatch] = useReducer(accountMapReducer, {});
  const [currentAccountId, setCurrentAccountId] = useState('satoshi');

  const { platform } = useContext(PlatformContext);

  const currentAccount = accountMap[currentAccountId!] || {
    name: 'Loading...',
    loading: true,
    transactions: [],
    unusedAddresses: [],
    currentBalance: 0,
    config: {}
  };

  const updateAccountMap = useCallback(
    (account: LilyAccount) => {
      dispatch({
        type: ACCOUNTMAP_UPDATE,
        payload: {
          account
        }
      });
    },
    [dispatch]
  );

  const setAccountMap = useCallback(
    (accountMap: AccountMap) => {
      dispatch({
        type: ACCOUNTMAP_SET,
        payload: accountMap
      });
    },
    [dispatch]
  );

  const updateTransactionDescription = useCallback(
    async (account: LilyOnchainAccount, txid: string, description: string) => {
      await platform.addTransactionDescription(txid, description);
      dispatch({
        type: ACCOUNT_TRANSACTION_UPDATE_DESCRIPTION,
        payload: {
          accountId: account.config.id,
          txid,
          description
        }
      });
    },
    [dispatch]
  );

  const addAddressTag = useCallback(
    async (accountId: string, address: string, tag: string) => {
      const tagId = await platform.addAddressTag(address, tag);

      const tagWithId: AddressTag = {
        id: tagId,
        address,
        label: tag
      };

      dispatch({
        type: ACCOUNT_ADDRESS_ADD_TAG,
        payload: {
          accountId,
          tag: tagWithId
        }
      });
    },
    [dispatch]
  );

  const deleteAddressTag = useCallback(
    async (accountId: string, tag: AddressTag) => {
      await platform.deleteAddressTag(tag.id);

      dispatch({
        type: ACCOUNT_ADDRESS_DELETE_TAG,
        payload: {
          accountId,
          tag
        }
      });
    },
    [dispatch]
  );

  const value = {
    accountMap,
    updateAccountMap,
    setAccountMap,
    currentAccount,
    setCurrentAccountId,
    updateTransactionDescription,
    addAddressTag,
    deleteAddressTag
  };

  return <AccountMapContext.Provider value={value}>{children}</AccountMapContext.Provider>;
};
