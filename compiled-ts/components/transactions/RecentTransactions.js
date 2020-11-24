"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var moment_1 = __importDefault(require("moment"));
var material_1 = require("@styled-icons/material");
var components_1 = require("../../components");
var TransactionRow_1 = __importDefault(require("./TransactionRow"));
var TransactionRowLoading_1 = __importDefault(require("./TransactionRowLoading"));
var colors_1 = require("../../utils/colors");
var shouldDisplayDate = function (transactions, index) {
    if (index === 0) {
        return true;
    }
    else {
        if (moment_1.default.unix(transactions[index].status.block_time).format('MMDDYYYY') !== moment_1.default.unix(transactions[index - 1].status.block_time).format('MMDDYYYY')) {
            return true;
        }
    }
    return false;
};
var RecentTransactions = function (_a) {
    var transactions = _a.transactions, loading = _a.loading, _b = _a.flat, flat = _b === void 0 ? false : _b, _c = _a.maxItems, maxItems = _c === void 0 ? Infinity : _c;
    return (react_1.default.createElement(RecentTransactionsWrapper, null,
        (loading || transactions.length > 0) && react_1.default.createElement(RecentTransactionsHeader, null, "Recent Activity"),
        loading && (react_1.default.createElement(TransactionRowLoading_1.default, { flat: flat })),
        react_1.default.createElement(TransactionsWrapper, null,
            transactions.map(function (transaction, index) {
                if (index < maxItems) {
                    return (react_1.default.createElement(TransactionRowWrapper, { key: index },
                        shouldDisplayDate(transactions, index) && react_1.default.createElement(DateWrapper, null, transaction.status.confirmed ? moment_1.default.unix(transaction.status.block_time).format('MMMM DD, YYYY') : 'Waiting for confirmation...'),
                        react_1.default.createElement(TransactionRow_1.default, { transaction: transaction, flat: flat })));
                }
            }),
            !loading && transactions.length === 0 && (react_1.default.createElement(NoTransasctionsSection, { flat: flat },
                react_1.default.createElement(NoTransactionsHeader, null, "No Transactions"),
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.RestaurantMenu, size: 96, style: { color: colors_1.darkGray } }),
                react_1.default.createElement(NoTransactionsSubtext, null, "No activity has been detected on this account yet."))))));
};
var RecentTransactionsWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n"], ["\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n"])));
var TransactionsWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n"], ["\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n"])));
var TransactionRowWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n"], ["\n"])));
var DateWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin: 1.5em 0 1em;\n  color: ", ";\n"], ["\n  margin: 1.5em 0 1em;\n  color: ", ";\n"])), colors_1.darkGray);
var RecentTransactionsHeader = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin-top: 1.5em;\n"], ["\n  font-size: 1.5em;\n  margin-top: 1.5em;\n"])));
var NoTransasctionsSection = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  font-weight: 100;\n  background: ", ";\n  box-shadow: ", ";\n  border-radius: 0.385em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  font-weight: 100;\n  background: ", ";\n  box-shadow: ", ";\n  border-radius: 0.385em;\n"])), function (p) { return p.flat ? 'transparent' : colors_1.white; }, function (p) { return p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);'; });
var NoTransactionsHeader = styled_components_1.default.h3(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.darkGray);
var NoTransactionsSubtext = styled_components_1.default.h4(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.darkGray);
exports.default = RecentTransactions;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=RecentTransactions.js.map