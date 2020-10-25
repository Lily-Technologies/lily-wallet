import React, { createContext, useReducer, useCallback, useState } from 'react';

import {
  accountMapReducer,
  ACCOUNTMAP_UPDATE,
  ACCOUNTMAP_SET
} from './reducers/accountMap';

export const AccountMapContext = createContext();

export const AccountMapProvider = ({ children }) => {
  const [accountMap, dispatch] = useReducer(accountMapReducer, {});
  const [currentAccountId, setCurrentAccountId] = useState(undefined);

  const currentAccount = accountMap[currentAccountId] || { name: 'Loading...', loading: true, transactions: [], unusedAddresses: [], currentBalance: 0, config: {} };

  const updateAccountMap = useCallback(account => {
    dispatch({
      type: ACCOUNTMAP_UPDATE,
      payload: {
        account
      }
    })
  }, [dispatch])

  const setAccountMap = useCallback(accountMap => {
    dispatch({
      type: ACCOUNTMAP_SET,
      payload: accountMap
    })
  }, [dispatch])

  const value = { accountMap, updateAccountMap, setAccountMap, currentAccount, setCurrentAccountId }

  return <AccountMapContext.Provider value={value}>{children}</AccountMapContext.Provider>
}
