"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
var recharts_1 = require("recharts");
var unchained_bitcoin_1 = require("unchained-bitcoin");
var moment_1 = __importDefault(require("moment"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var AccountMapContext_1 = require("../../AccountMapContext");
var components_1 = require("../../components");
var RecentTransactions_1 = __importDefault(require("../../components/transactions/RecentTransactions"));
var colors_1 = require("../../utils/colors");
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload, label = _a.label;
    if (active) {
        return (react_1.default.createElement(TooltipContainer, null,
            react_1.default.createElement(PriceTooltip, null, (payload[0].value ? unchained_bitcoin_1.satoshisToBitcoins(payload[0].value) : 0) + " BTC"),
            react_1.default.createElement(DateTooltip, null, moment_1.default.unix(label).format('MMMM DD, YYYY'))));
    }
    return null;
};
var VaultView = function () {
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var currentBalance = currentAccount.currentBalance, transactions = currentAccount.transactions;
    var transactionsCopyForChart = __spreadArrays(transactions);
    var transactionsCopyForRecentTransactions = __spreadArrays(transactions);
    var sortedTransactions = transactionsCopyForChart.sort(function (a, b) { return a.status.block_time - b.status.block_time; });
    var dataForChart;
    if (transactions.length) {
        dataForChart = [{
                block_time: sortedTransactions[0].status.block_time - 1,
                totalValue: 0
            }];
        for (var i = 0; i < sortedTransactions.length; i++) {
            dataForChart.push({
                block_time: sortedTransactions[i].status.block_time,
                totalValue: new bignumber_js_1.default(sortedTransactions[i].totalValue).toNumber()
            });
        }
        dataForChart.push({
            block_time: Math.floor(Date.now() / 1000),
            totalValue: new bignumber_js_1.default(sortedTransactions[sortedTransactions.length - 1].totalValue).toNumber()
        });
    }
    return (react_1.default.createElement(react_1.Fragment, null,
        currentAccount.loading && (react_1.default.createElement(ValueWrapper, null,
            react_1.default.createElement(components_1.Loading, { style: { margin: '10em 0' }, itemText: 'Chart Data' }))),
        transactions.length > 0 && (react_1.default.createElement(ValueWrapper, null,
            react_1.default.createElement(CurrentBalanceContainer, null,
                react_1.default.createElement(CurrentBalanceText, null, "Current Balance:"),
                unchained_bitcoin_1.satoshisToBitcoins(currentBalance).toFixed(8),
                " BTC"),
            react_1.default.createElement(ChartContainer, null,
                react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 400 },
                    react_1.default.createElement(recharts_1.AreaChart, { width: 400, height: 400, data: dataForChart },
                        react_1.default.createElement(recharts_1.YAxis, { dataKey: "totalValue", hide: true, domain: ['dataMin', 'dataMax + 10000'] }),
                        react_1.default.createElement(recharts_1.XAxis, { dataKey: "block_time", height: 50, interval: 1, tickFormatter: function (blocktime) {
                                return moment_1.default.unix(blocktime).format('MMM D');
                            } }),
                        react_1.default.createElement(recharts_1.Area, { type: "monotone", dataKey: "totalValue", stroke: colors_1.yellow500, strokeWidth: 2, isAnimationActive: false, fill: colors_1.yellow100 }),
                        react_1.default.createElement(recharts_1.Tooltip, { offset: -100, cursor: false, allowEscapeViewBox: { x: true, y: true }, wrapperStyle: {
                                marginLeft: -10
                            }, content: CustomTooltip })))))),
        react_1.default.createElement(RecentTransactions_1.default, { transactions: transactionsCopyForRecentTransactions.sort(function (a, b) {
                if (!b.status.confirmed && !a.status.confirmed) {
                    return 0;
                }
                else if (!b.status.confirmed) {
                    return -1;
                }
                else if (!a.status.confirmed) {
                    return -1;
                }
                return b.status.block_time - a.status.block_time;
            }), loading: currentAccount.loading, flat: false })));
};
var ValueWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  border-radius: 0.385em;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n"], ["\n  background: ", ";\n  border-radius: 0.385em;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n"])), colors_1.white);
var ChartContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var CurrentBalanceContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 2em;\n  display: flex;\n  flex-direction: column;\n  padding: 1em 1em 0\n"], ["\n  font-size: 2em;\n  display: flex;\n  flex-direction: column;\n  padding: 1em 1em 0\n"])));
var CurrentBalanceText = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.5em;\n"], ["\n  color: ", ";\n  font-size: 0.5em;\n"])), colors_1.darkGray);
var TooltipContainer = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background: rgba(31, 31, 31, 0.75); // black\n  padding: 1em;\n  border-radius: 4px;\n  text-align: center;\n"], ["\n  background: rgba(31, 31, 31, 0.75); // black\n  padding: 1em;\n  border-radius: 4px;\n  text-align: center;\n"])));
var PriceTooltip = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.white);
var DateTooltip = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.75em;\n"], ["\n  color: ", ";\n  font-size: 0.75em;\n"])), colors_1.gray);
exports.default = VaultView;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=VaultView.js.map