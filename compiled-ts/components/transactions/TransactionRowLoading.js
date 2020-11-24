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
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var TransactionRow = function (_a) {
    var flat = _a.flat;
    return (react_1.default.createElement(TransactionsWrapper, null,
        react_1.default.createElement(TransactionRowWrapper, { flat: flat },
            react_1.default.createElement(TransactionRowContainer, { flat: flat },
                react_1.default.createElement(components_1.GrayLoadingAnimation, null))),
        react_1.default.createElement(TransactionRowWrapper, { flat: flat },
            react_1.default.createElement(TransactionRowContainer, { flat: flat },
                react_1.default.createElement(components_1.GrayLoadingAnimation, null))),
        react_1.default.createElement(TransactionRowWrapper, { flat: flat },
            react_1.default.createElement(TransactionRowContainer, { flat: flat },
                react_1.default.createElement(components_1.GrayLoadingAnimation, null))),
        react_1.default.createElement(TransactionRowWrapper, { flat: flat },
            react_1.default.createElement(TransactionRowContainer, { flat: flat },
                react_1.default.createElement(components_1.GrayLoadingAnimation, null))),
        react_1.default.createElement(TransactionRowWrapper, { flat: flat },
            react_1.default.createElement(TransactionRowContainer, { flat: flat },
                react_1.default.createElement(components_1.GrayLoadingAnimation, null)))));
};
var TransactionsWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  margin-top: 1em;\n"], ["\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  margin-top: 1em;\n"])));
var TransactionRowWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-bottom: 1px solid ", ";\n  background: ", ";\n  box-shadow: ", ";\n  align-items: center;\n  flex-direction: column;\n  margin-top: 1em;\n"], ["\n  border-bottom: 1px solid ", ";\n  background: ", ";\n  box-shadow: ", ";\n  align-items: center;\n  flex-direction: column;\n  margin-top: 1em;\n"])), colors_1.offWhite, function (p) { return p.flat ? 'transparent' : colors_1.white; }, function (p) { return p.flat ? 'none' : 'rgba(43, 48, 64, 0.2) 0px 0.1rem 0.5rem 0px;'; });
var TransactionRowContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  // padding: ", ";\n\n  &:hover {\n    background: ", ";\n    cursor: ", ";\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  // padding: ", ";\n\n  &:hover {\n    background: ", ";\n    cursor: ", ";\n  }\n"])), function (p) { return p.flat ? '.75em' : '1.5em'; }, function (p) { return !p.flat && colors_1.offWhite; }, function (p) { return !p.flat && 'pointer'; });
exports.default = TransactionRow;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=TransactionRowLoading.js.map