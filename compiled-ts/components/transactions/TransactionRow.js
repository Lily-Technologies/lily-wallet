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
var moment_1 = __importDefault(require("moment"));
var material_1 = require("@styled-icons/material");
var boxicons_regular_1 = require("@styled-icons/boxicons-regular");
var components_1 = require("../../components");
var unchained_bitcoin_1 = require("unchained-bitcoin");
var colors_1 = require("../../utils/colors");
var TransactionRow = function (_a) {
    var transaction = _a.transaction, flat = _a.flat;
    var _b = react_1.useState(false), isOpen = _b[0], setIsOpen = _b[1];
    return (react_1.default.createElement(TransactionRowWrapper, { flat: flat },
        react_1.default.createElement(TransactionRowContainer, { flat: flat, isOpen: isOpen, onClick: function () { !flat && setIsOpen(!isOpen); } },
            react_1.default.createElement(TxTypeIcon, { flat: flat },
                transaction.type === 'received' && react_1.default.createElement(StyledIconModified, { as: material_1.VerticalAlignBottom, size: flat ? 36 : 48, receive: true }),
                transaction.type === 'sent' && react_1.default.createElement(StyledIconModified, { as: material_1.ArrowUpward, size: flat ? 36 : 48 }),
                transaction.type === 'moved' && react_1.default.createElement(StyledIconModified, { as: boxicons_regular_1.Transfer, size: flat ? 36 : 48, moved: true }),
                react_1.default.createElement(TxTypeTextWrapper, { flat: flat },
                    react_1.default.createElement(TxTypeText, null, transaction.type),
                    react_1.default.createElement(TxTypeTime, null, transaction.status.confirmed ? moment_1.default.unix(transaction.status.block_time).format('h:mm A') : 'Unconfirmed'))),
            react_1.default.createElement(AddressWrapper, { flat: flat }, transaction.address),
            react_1.default.createElement(AmountWrapper, { flat: flat },
                unchained_bitcoin_1.satoshisToBitcoins(transaction.value).toNumber(),
                " BTC")),
        isOpen && (react_1.default.createElement(TransactionMoreInfo, null,
            react_1.default.createElement("pre", null, JSON.stringify(transaction, null, 2))))));
};
var TransactionRowWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-bottom: 1px solid ", ";\n  background: ", ";\n  box-shadow: ", ";\n  align-items: center;\n  flex-direction: column;\n"], ["\n  border-bottom: 1px solid ", ";\n  background: ", ";\n  box-shadow: ", ";\n  align-items: center;\n  flex-direction: column;\n"])), colors_1.offWhite, function (p) { return p.flat ? 'transparent' : colors_1.white; }, function (p) { return p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)'; });
var TransactionRowContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  padding: ", ";\n\n  &:hover {\n    background: ", ";\n    cursor: ", ";\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  padding: ", ";\n\n  &:hover {\n    background: ", ";\n    cursor: ", ";\n  }\n"])), function (p) { return p.flat ? '.75em' : '1.5em'; }, function (p) { return !p.isOpen && !p.flat && colors_1.offWhite; }, function (p) { return !p.flat && 'pointer'; });
var TransactionMoreInfo = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  padding: .75em;\n  overflow: scroll;\n  background: ", ";\n"], ["\n  display: flex;\n  padding: .75em;\n  overflow: scroll;\n  background: ", ";\n"])), colors_1.gray100);
var StyledIconModified = styled_components_1.default(components_1.StyledIcon)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: .5em;\n  margin-right: .75em;\n  background: ", ";\n  border-radius: 50%;\n"], ["\n  padding: .5em;\n  margin-right: .75em;\n  background: ", ";\n  border-radius: 50%;\n"])), function (p) { return p.moved ? colors_1.gray : (p.receive ? colors_1.green : colors_1.red500); });
var TxTypeIcon = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex: ", ";;\n  align-items: center;\n"], ["\n  display: flex;\n  flex: ", ";;\n  align-items: center;\n"])), function (p) { return p.flat ? '0 0' : '0 0 10em'; });
var TxTypeTextWrapper = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: ", ";\n  flex-direction: column;\n"], ["\n  display: ", ";\n  flex-direction: column;\n"])), function (p) { return p.flat ? 'none' : 'flex'; });
var TxTypeText = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  text-transform: capitalize;\n"], ["\n  text-transform: capitalize;\n"])));
var TxTypeTime = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  font-size: 0.75em;\n"], ["\n  font-size: 0.75em;\n"])));
var AmountWrapper = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  display: flex;\n  text-align: right;\n  justify-content: flex-end;\n  font-size: ", ";\n"], ["\n  display: flex;\n  text-align: right;\n  justify-content: flex-end;\n  font-size: ", ";\n"])), function (p) { return p.flat ? '.75em' : '1em'; });
var AddressWrapper = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  display: flex;\n  flex: 1;\n  font-weight: 100;\n  font-size: ", ";\n  word-break: break-all;\n  padding: 0 1em;\n"], ["\n  display: flex;\n  flex: 1;\n  font-weight: 100;\n  font-size: ", ";\n  word-break: break-all;\n  padding: 0 1em;\n"])), function (p) { return p.flat ? '.75em' : '1em'; });
exports.default = TransactionRow;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=TransactionRow.js.map