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
var material_1 = require("@styled-icons/material");
var _1 = require(".");
var colors_1 = require("../utils/colors");
exports.PurchaseLicenseSuccess = function (_a) {
    var config = _a.config, nodeConfig = _a.nodeConfig;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(IconWrapper, { style: { color: colors_1.green500 } },
            react_1.default.createElement(_1.StyledIcon, { as: material_1.CheckCircle, size: 100 })),
        react_1.default.createElement(SuccessText, null, "Payment Success!"),
        react_1.default.createElement(SuccessSubtext, null,
            "Thank you so much for purchasing a license for Lily Wallet!",
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            "Your payment helps fund the development and maitanance of this open source software."),
        react_1.default.createElement(_1.LicenseInformation, { config: config, nodeConfig: nodeConfig })));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"])));
var IconWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var SuccessText = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-top: 0.5em;\n  font-size: 1.5em;\n  color: ", "\n"], ["\n  margin-top: 0.5em;\n  font-size: 1.5em;\n  color: ", "\n"])), colors_1.gray700);
var SuccessSubtext = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  margin-top: 2rem;\n  margin-bottom: 1rem;\n  text-align: center;\n"], ["\n  color: ", ";\n  margin-top: 2rem;\n  margin-bottom: 1rem;\n  text-align: center;\n"])), colors_1.gray700);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=PurchaseLicenseSuccess.js.map