"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var accountMap_1 = require("./reducers/accountMap");
exports.AccountMapContext = react_1.createContext({
    setAccountMap: function (accountMap) { },
    updateAccountMap: function (account) { },
    setCurrentAccountId: function (id) { },
    accountMap: {},
    currentAccount: {}
});
exports.AccountMapProvider = function (_a) {
    var children = _a.children;
    var _b = react_1.useReducer(accountMap_1.accountMapReducer, {}), accountMap = _b[0], dispatch = _b[1];
    var _c = react_1.useState('satoshi'), currentAccountId = _c[0], setCurrentAccountId = _c[1];
    var currentAccount = accountMap[currentAccountId] || { name: 'Loading...', loading: true, transactions: [], unusedAddresses: [], currentBalance: 0, config: {} };
    var updateAccountMap = react_1.useCallback(function (account) {
        dispatch({
            type: accountMap_1.ACCOUNTMAP_UPDATE,
            payload: {
                account: account
            }
        });
    }, [dispatch]);
    var setAccountMap = react_1.useCallback(function (accountMap) {
        dispatch({
            type: accountMap_1.ACCOUNTMAP_SET,
            payload: accountMap
        });
    }, [dispatch]);
    var value = { accountMap: accountMap, updateAccountMap: updateAccountMap, setAccountMap: setAccountMap, currentAccount: currentAccount, setCurrentAccountId: setCurrentAccountId };
    return react_1.default.createElement(exports.AccountMapContext.Provider, { value: value }, children);
};
//# sourceMappingURL=AccountMapContext.js.map