import {
  accountMapReducer,
  ACCOUNTMAP_SET,
  ACCOUNTMAP_UPDATE,
} from "../../reducers/accountMap";

import initialAccountMap from "../fixtures/initialAccountMap.json";
import { Multisig } from "../fixtures/";
import { createLilyAccount } from "../../../cypress/support/createConfig";

describe("Account Map Reducer", () => {
  test("setAccountMap sets initial state", () => {
    const action = {
      type: ACCOUNTMAP_SET,
      payload: initialAccountMap,
    };
    const state = accountMapReducer({}, action);
    expect(state).toStrictEqual(initialAccountMap);
  });

  test("updateAccountMap updates account map", () => {
    const action = {
      type: ACCOUNTMAP_UPDATE,
      payload: {
        account: createLilyAccount(Multisig),
      },
    };
    const state = accountMapReducer(initialAccountMap, action);
    expect(state).toStrictEqual({
      ...initialAccountMap,
      [Multisig.config.id]: createLilyAccount(Multisig),
    });
  });
});
