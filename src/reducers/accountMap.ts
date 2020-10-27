import { AccountMapAction, AccountMap } from '../types'

export const ACCOUNTMAP_UPDATE = 'ACCOUNTMAP_UPDATE';
export const ACCOUNTMAP_SET = 'ACCOUNTMAP_SET';

export const accountMapReducer = (state: AccountMap, action: AccountMapAction) => {
  if (action.type === ACCOUNTMAP_UPDATE) {
    return {
      ...state,
      [action.payload.account.config.id]: {
        ...action.payload.account
      }
    }
  }

  if (action.type === ACCOUNTMAP_SET) {
    return {
      ...action.payload
    }
  }

  return state;
}