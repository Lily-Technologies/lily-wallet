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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_spring_1 = require("react-spring");
var components_1 = require("../../components");
var AccountsSection_1 = require("./AccountsSection");
var HistoricChart_1 = require("./HistoricChart");
var Home = function (_a) {
    var historicalBitcoinPrice = _a.historicalBitcoinPrice, currentBitcoinPrice = _a.currentBitcoinPrice, flyInAnimation = _a.flyInAnimation, prevFlyInAnimation = _a.prevFlyInAnimation;
    var _b = react_1.useState(false), initialLoad = _b[0], setInitialLoad = _b[1];
    react_1.useEffect(function () {
        if (flyInAnimation !== prevFlyInAnimation) { // if these values are different, change local
            setInitialLoad(true);
        }
    }, [flyInAnimation, prevFlyInAnimation]);
    var chartProps = react_spring_1.useSpring({ transform: initialLoad || (flyInAnimation === false && prevFlyInAnimation === false) ? 'translateY(0%)' : 'translateY(-120%)' });
    var accountsProps = react_spring_1.useSpring({ transform: initialLoad || (flyInAnimation === false && prevFlyInAnimation === false) ? 'translateY(0%)' : 'translateY(120%)' });
    return (react_1.default.createElement(components_1.PageWrapper, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(react_spring_1.animated.div, { style: __assign({}, chartProps) },
                react_1.default.createElement(HistoricChart_1.HistoricChart, { historicalBitcoinPrice: historicalBitcoinPrice, currentBitcoinPrice: currentBitcoinPrice })),
            react_1.default.createElement(react_spring_1.animated.div, { style: __assign({}, accountsProps) },
                react_1.default.createElement(AccountsSection_1.AccountsSection, null)))));
};
exports.default = Home;
//# sourceMappingURL=index.js.map