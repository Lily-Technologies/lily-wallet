"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNTMAP_UPDATE = 'ACCOUNTMAP_UPDATE';
exports.ACCOUNTMAP_SET = 'ACCOUNTMAP_SET';
exports.accountMapReducer = function (state, action) {
    var _a;
    if (action.type === exports.ACCOUNTMAP_UPDATE) {
        return __assign(__assign({}, state), (_a = {}, _a[action.payload.account.config.id] = __assign({}, action.payload.account), _a));
    }
    if (action.type === exports.ACCOUNTMAP_SET) {
        return __assign({}, action.payload);
    }
    return state;
};
//# sourceMappingURL=accountMap.js.map