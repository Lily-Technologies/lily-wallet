import React, { createContext, useReducer, useCallback, useState } from 'react';

import { accountMapReducer, ACCOUNTMAP_UPDATE, ACCOUNTMAP_SET } from 'src/reducers/accountMap';

import { AccountMap, LilyAccount } from '@lily/types';

export const AccountMapContext = createContext({
  setAccountMap: (accountMap: AccountMap) => {},
  updateAccountMap: (account: LilyAccount) => {},
  setCurrentAccountId: (id: string) => {},
  accountMap: {} as AccountMap,
  currentAccount: {} as LilyAccount
});

export const AccountMapProvider = ({ children }: { children: React.ReactChild }) => {
  const [accountMap, dispatch] = useReducer(accountMapReducer, {});
  const [currentAccountId, setCurrentAccountId] = useState('satoshi');

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

  const value = {
    accountMap,
    updateAccountMap,
    setAccountMap,
    currentAccount,
    setCurrentAccountId
  };

  return <AccountMapContext.Provider value={value}>{children}</AccountMapContext.Provider>;
};
