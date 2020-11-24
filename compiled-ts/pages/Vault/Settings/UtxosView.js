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
var Table_1 = require("../../../components/Table");
var UtxoRow_1 = __importDefault(require("./UtxoRow"));
var UtxosView = function () {
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    return (react_1.default.createElement(Table_1.Table, null,
        react_1.default.createElement(Table_1.TableHeader, null,
            react_1.default.createElement(Table_1.TableRow, null,
                react_1.default.createElement(Table_1.TableHead, null, "Address"),
                react_1.default.createElement(Table_1.TableHead, null, "Value"))),
        react_1.default.createElement(Table_1.TableBody, null, currentAccount.availableUtxos.map(function (utxo) { return (react_1.default.createElement(UtxoRow_1.default, { utxo: utxo })); }))));
};
exports.default = UtxosView;
//# sourceMappingURL=UtxosView.js.map