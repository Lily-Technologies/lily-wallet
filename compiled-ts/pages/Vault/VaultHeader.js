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
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@styled-icons/material");
var AccountMapContext_1 = require("../../AccountMapContext");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var SettingsHeader = function (_a) {
    var toggleRefresh = _a.toggleRefresh;
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var url = react_router_dom_1.useRouteMatch().url;
    console.log(url + "/settings");
    return (react_1.default.createElement(components_1.Header, null,
        react_1.default.createElement(components_1.HeaderLeft, null,
            react_1.default.createElement(components_1.PageTitle, null, currentAccount.name),
            react_1.default.createElement(VaultExplainerText, null,
                currentAccount.config.quorum.totalSigners > 1 && (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(IconSvg, { fill: "currentColor", viewBox: "0 0 20 20" },
                        react_1.default.createElement("path", { fillRule: "evenodd", d: "M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z", clipRule: "evenodd" })),
                    currentAccount.config.quorum.requiredSigners,
                    " of ",
                    currentAccount.config.quorum.totalSigners,
                    " Multisignature Vault")),
                currentAccount.config.quorum.totalSigners === 1 && currentAccount.config.mnemonic && (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(IconSvg, { fill: "currentColor", viewBox: "0 0 20 20" },
                        react_1.default.createElement("path", { fillRule: "evenodd", d: "M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z", clipRule: "evenodd" })),
                    react_1.default.createElement("span", null, "Hot Wallet"))),
                currentAccount.config.quorum.totalSigners === 1 && currentAccount.config.device && (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(IconSvg, { viewBox: "0 0 20 20", fill: "currentColor", className: "calculator w-6 h-6" },
                        react_1.default.createElement("path", { fillRule: "evenodd", d: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z", clipRule: "evenodd" })),
                    react_1.default.createElement("span", null, "Hardware Wallet"))))),
        react_1.default.createElement(components_1.HeaderRight, null,
            react_1.default.createElement(SendButton, { to: "/send", color: colors_1.white, background: colors_1.green900 },
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.ArrowUpward, size: 24, style: { marginRight: '.5rem', marginLeft: '-0.25rem' } }),
                "Send"),
            react_1.default.createElement(ReceiveButton, { to: "/receive", color: colors_1.white, background: colors_1.green900 },
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.VerticalAlignBottom, size: 24, style: { marginRight: '.5rem', marginLeft: '-0.25rem' } }),
                "Receive"),
            react_1.default.createElement(RefreshButton, { onClick: function () { return toggleRefresh(); }, color: colors_1.white, background: 'transparent' },
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.Refresh, size: 36 })),
            react_1.default.createElement(SettingsButton, { to: url + "/settings", color: colors_1.white, background: 'transparent' },
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.Settings, size: 36 })))));
};
var IconSvg = styled_components_1.default.svg(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n  width: 1.25rem;\n  margin-right: .375rem;\n  height: 1.25rem;\n  flex-shrink: 0;\n"], ["\n  color: ", ";\n  width: 1.25rem;\n  margin-right: .375rem;\n  height: 1.25rem;\n  flex-shrink: 0;\n"])), colors_1.gray300);
var SendButton = styled_components_1.default(react_router_dom_1.Link)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n  margin: 12px;\n  padding-top: 0.5em;\n  padding-bottom: 0.5em;\n  padding-left: 1em;\n  padding-right: 1em;\n"], ["\n  ", "\n  margin: 12px;\n  padding-top: 0.5em;\n  padding-bottom: 0.5em;\n  padding-left: 1em;\n  padding-right: 1em;\n"])), components_1.Button);
var ReceiveButton = styled_components_1.default(react_router_dom_1.Link)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n  margin: 12px;\n  padding-top: 0.5em;\n  padding-bottom: 0.5em;\n  padding-left: 1em;\n  padding-right: 1em;\n"], ["\n  ", "\n  margin: 12px;\n  padding-top: 0.5em;\n  padding-bottom: 0.5em;\n  padding-left: 1em;\n  padding-right: 1em;\n"])), components_1.Button);
var SettingsButton = styled_components_1.default(react_router_dom_1.Link)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n  border-radius: 25%;\n"], ["\n  ", "\n  border-radius: 25%;\n"])), components_1.Button);
var RefreshButton = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n  border-radius: 25%;\n"], ["\n  ", "\n  border-radius: 25%;\n"])), components_1.Button);
var VaultExplainerText = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  font-size: .75em;\n  display: flex;\n  align-items: center;\n  font-size: 1em;\n    margin-top: .5em;\n"], ["\n  color: ", ";\n  font-size: .75em;\n  display: flex;\n  align-items: center;\n  font-size: 1em;\n    margin-top: .5em;\n"])), colors_1.gray300);
exports.default = SettingsHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=VaultHeader.js.map