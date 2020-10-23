import assert from 'assert';

import initialAccountMap from '../fixtures/initialAccountMap.json';
import loadedAccount from '../fixtures/loadedAccount.json';

import { accountMapReducer, ACCOUNTMAP_SET, ACCOUNTMAP_UPDATE } from '../../reducers/accountMap.js';


describe('Account Map Reducer', () => {
  test('setAccountMap sets initial state', () => {
    const action = {
      type: ACCOUNTMAP_SET,
      payload: initialAccountMap
    }
    const state = accountMapReducer({}, action);
    expect(state).toStrictEqual(initialAccountMap)
  })

  test('updateAccountMap updates account map', () => {
    const action = {
      type: ACCOUNTMAP_UPDATE,
      payload: {
        account: loadedAccount
      }
    }
    const state = accountMapReducer(initialAccountMap, action);
    expect(state).toStrictEqual({
      ...initialAccountMap,
      [loadedAccount.config.id]: loadedAccount
    })
  })
})