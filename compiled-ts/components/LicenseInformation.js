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
var colors_1 = require("../utils/colors");
exports.LicenseInformation = function (_a) {
    var config = _a.config, nodeConfig = _a.nodeConfig;
    var blockDiff;
    if (nodeConfig) {
        blockDiff = config.license.expires - nodeConfig.blocks;
    }
    else {
        blockDiff = config.license.expires;
    }
    var blockDiffTimeEst = blockDiff * 10;
    var expireAsDate = moment_1.default().add(blockDiffTimeEst, "minutes").format('MMMM Do YYYY, h:mma');
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(ItemContainer, null,
            react_1.default.createElement(ItemLabel, null, "Payment Transaction"),
            react_1.default.createElement(ItemValue, null, config.license && config.license.txId)),
        react_1.default.createElement(ItemContainer, null,
            react_1.default.createElement(ItemLabel, null, "License Expires"),
            react_1.default.createElement(ItemValue, null,
                "Block ",
                config.license && config.license.expires.toLocaleString())),
        react_1.default.createElement(ItemContainer, null,
            react_1.default.createElement(ItemLabel, null, "Approximate Expire Date"),
            react_1.default.createElement(ItemValue, null, expireAsDate))));
};
var ItemContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: 1em 0;\n"], ["\n  margin: 1em 0;\n"])));
var ItemLabel = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 900;\n"], ["\n  color: ", ";\n  font-weight: 900;\n"])), colors_1.gray500);
var ItemValue = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.gray900);
var Wrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 1em 2em 2em;\n"], ["\n  padding: 1em 2em 2em;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=LicenseInformation.js.map