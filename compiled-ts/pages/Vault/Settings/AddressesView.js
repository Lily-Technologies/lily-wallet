"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var AccountMapContext_1 = require("../../../AccountMapContext");
var AddressRow_1 = __importDefault(require("./AddressRow"));
var Table_1 = require("../../../components/Table");
var AddressesView = function () {
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    return (react_1.default.createElement(Table_1.Table, null,
        react_1.default.createElement(Table_1.TableHeader, null,
            react_1.default.createElement(Table_1.TableRow, null,
                react_1.default.createElement(Table_1.TableHead, null, "Address"),
                react_1.default.createElement(Table_1.TableHead, null, "Path"))),
        react_1.default.createElement(Table_1.TableBody, null,
            currentAccount.addresses.map(function (address) { return (react_1.default.createElement(AddressRow_1.default, { address: address })); }),
            currentAccount.changeAddresses.map(function (address) { return (react_1.default.createElement(AddressRow_1.default, { address: address })); }))));
};
exports.default = AddressesView;
//# sourceMappingURL=AddressesView.js.map