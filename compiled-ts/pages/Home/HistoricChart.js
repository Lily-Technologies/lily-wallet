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
var recharts_1 = require("recharts");
var colors_1 = require("../../utils/colors");
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload, label = _a.label;
    if (active) {
        return (react_1.default.createElement(TooltipContainer, null,
            react_1.default.createElement(PriceTooltip, null, formatter.format(payload[0].value)),
            react_1.default.createElement(DateTooltip, null, moment_1.default(label).format('MMMM DD, YYYY'))));
    }
    return null;
};
exports.HistoricChart = function (_a) {
    var historicalBitcoinPrice = _a.historicalBitcoinPrice, currentBitcoinPrice = _a.currentBitcoinPrice;
    var _b = react_1.useState(0), currentDomain = _b[0], setCurrentDomain = _b[1];
    var _c = react_1.useState(false), animateChart = _c[0], setAnimateChart = _c[1];
    var oneMonthDomain = Object.keys(historicalBitcoinPrice).length - 31;
    var sixMonthDomain = Object.keys(historicalBitcoinPrice).length - (30 * 6);
    var oneYearDomain = Object.keys(historicalBitcoinPrice).length - 365;
    var allDomain = 0;
    var changeDomain = function (domain) {
        setAnimateChart(true);
        setCurrentDomain(domain);
    };
    var getChartInterval = function () {
        if (currentDomain === allDomain) {
            return 465;
        }
        else if (currentDomain === oneMonthDomain) {
            return 3;
        }
        else if (currentDomain === sixMonthDomain) {
            return 21;
        }
        else if (currentDomain === oneYearDomain) {
            return 35;
        }
    };
    return (react_1.default.createElement(ChartContainer, null,
        react_1.default.createElement(ChartInfo, null,
            react_1.default.createElement(CurrentBitcoinPriceContainer, null,
                react_1.default.createElement(CurrentPriceText, null, "Current Price:"),
                "1BTC = ",
                formatter.format(currentBitcoinPrice.toNumber())),
            react_1.default.createElement(ChartControlsContainer, null,
                react_1.default.createElement(ChartControlItem, { active: currentDomain === oneMonthDomain, onClick: function () { return changeDomain(oneMonthDomain); } }, "1M"),
                react_1.default.createElement(ChartControlItem, { active: currentDomain === sixMonthDomain, onClick: function () { return changeDomain(sixMonthDomain); } }, "6M"),
                react_1.default.createElement(ChartControlItem, { active: currentDomain === oneYearDomain, onClick: function () { return changeDomain(oneYearDomain); } }, "1Y"),
                react_1.default.createElement(ChartControlItem, { active: currentDomain === 0, onClick: function () { return changeDomain(0); } }, "ALL"))),
        react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 400 }, historicalBitcoinPrice.length ? ( // if the call to get historical price fails, then set loading or filler screen
        react_1.default.createElement(recharts_1.AreaChart, { width: 400, height: 400, data: historicalBitcoinPrice.slice(currentDomain, historicalBitcoinPrice.length) },
            react_1.default.createElement(recharts_1.YAxis, { hide: true, domain: ['dataMin - 500', 'dataMax + 500'] }),
            react_1.default.createElement(recharts_1.XAxis, { dataKey: "date", tickCount: 6, interval: getChartInterval(), tickLine: false, tickFormatter: function (date) {
                    if (currentDomain === oneMonthDomain) {
                        return moment_1.default(date).format('MMM D');
                    }
                    else if (currentDomain === sixMonthDomain) {
                        return moment_1.default(date).format('MMM D');
                    }
                    else {
                        return moment_1.default(date).format('MMM YYYY');
                    }
                } }),
            react_1.default.createElement(recharts_1.Area, { type: "monotone", dataKey: "price", stroke: colors_1.yellow500, strokeWidth: 2, isAnimationActive: animateChart, fill: colors_1.yellow100 }),
            react_1.default.createElement(recharts_1.Tooltip, { offset: -100, cursor: false, allowEscapeViewBox: { x: true, y: true }, wrapperStyle: {
                    marginLeft: -10
                }, content: CustomTooltip }))) : (react_1.default.createElement("div", null, "Error Loading")))));
};
var ChartInfo = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  padding: 2em 2em 0;\n  align-items: center;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  padding: 2em 2em 0;\n  align-items: center;\n"])));
var CurrentPriceText = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.5em;\n"], ["\n  color: ", ";\n  font-size: 0.5em;\n"])), colors_1.darkGray);
var ChartControlsContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var ChartControlItem = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  padding: 0.25em;\n  cursor: pointer;\n  margin: 0 0.25em;\n"], ["\n  color: ", ";\n  padding: 0.25em;\n  cursor: pointer;\n  margin: 0 0.25em;\n"])), function (p) { return p.active ? colors_1.green700 : colors_1.gray; });
var CurrentBitcoinPriceContainer = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 2em;\n  display: flex;\n  flex-direction: column;\n"], ["\n  font-size: 2em;\n  display: flex;\n  flex-direction: column;\n"])));
var ChartContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 0;\n  // border: 1px solid ", ";\n  background: ", ";\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-radius: 0.385em;\n"], ["\n  padding: 0;\n  // border: 1px solid ", ";\n  background: ", ";\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-radius: 0.385em;\n"])), colors_1.gray, colors_1.white);
var TooltipContainer = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  background: rgba(31, 31, 31, 0.75); // black\n  padding: 1em;\n  border-radius: 4px;\n  text-align: center;\n"], ["\n  background: rgba(31, 31, 31, 0.75); // black\n  padding: 1em;\n  border-radius: 4px;\n  text-align: center;\n"])));
var PriceTooltip = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.white);
var DateTooltip = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.75em;\n"], ["\n  color: ", ";\n  font-size: 0.75em;\n"])), colors_1.gray);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=HistoricChart.js.map