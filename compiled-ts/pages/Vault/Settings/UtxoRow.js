"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var styled_components_1 = __importDefault(require("styled-components"));
var unchained_bitcoin_1 = require("unchained-bitcoin");
var Table_1 = require("../../../components/Table");
var colors_1 = require("../../../utils/colors");
var UtxoRow = function (_a) {
    var utxo = _a.utxo;
    var _b = react_1.useState(false), isOpen = _b[0], setIsOpen = _b[1];
    return (react_1.default.createElement(Table_1.TableRow, { onClick: function () { return setIsOpen(!isOpen); } },
        react_1.default.createElement(Table_1.TableColumnBold, null, utxo.address.address),
        react_1.default.createElement(Table_1.TableColumn, null, unchained_bitcoin_1.satoshisToBitcoins(utxo.value).toNumber() + " BTC"),
        isOpen && react_1.default.createElement(TransactionMoreInfo, null,
            react_1.default.createElement("pre", null, JSON.stringify(utxo, null, 2)))));
};
var TransactionMoreInfo = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  padding: .75em;\n  overflow: scroll;\n  background: ", ";\n"], ["\n  display: flex;\n  padding: .75em;\n  overflow: scroll;\n  background: ", ";\n"])), colors_1.gray100);
exports.default = UtxoRow;
var templateObject_1;
//# sourceMappingURL=UtxoRow.js.map