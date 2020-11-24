"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var styles_1 = require("./styles");
var layout_1 = require("../../components/layout");
var colors_1 = require("../../utils/colors");
var PageHeader = function (_a) {
    var headerText = _a.headerText, setStep = _a.setStep, step = _a.step, config = _a.config;
    var history = react_router_dom_1.useHistory();
    return (react_1.default.createElement(styles_1.HeaderWrapper, null,
        react_1.default.createElement(layout_1.Header, null,
            react_1.default.createElement(layout_1.HeaderLeft, null,
                react_1.default.createElement(styles_1.PageTitleSubtext, null, "New Account"),
                react_1.default.createElement(layout_1.PageTitle, { style: { color: colors_1.black } }, headerText)),
            react_1.default.createElement(layout_1.HeaderRight, null,
                config.isEmpty && react_1.default.createElement(styles_1.CancelButton, { onClick: function () { history.push('login'); } }, "Return to Main Menu"),
                !config.isEmpty && step > 1 && react_1.default.createElement(styles_1.CancelButton, { onClick: function () { setStep(0); } }, "Cancel")))));
};
exports.default = PageHeader;
//# sourceMappingURL=PageHeader.js.map