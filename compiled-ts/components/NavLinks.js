"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var styled_components_1 = __importStar(require("styled-components"));
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@styled-icons/material");
var fa_solid_1 = require("@styled-icons/fa-solid");
var remix_fill_1 = require("@styled-icons/remix-fill");
var remix_line_1 = require("@styled-icons/remix-line");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var _1 = require(".");
var AccountMapContext_1 = require("../AccountMapContext");
var colors_1 = require("../utils/colors");
var files_1 = require("../utils/files");
exports.NavLinks = function (_a) {
    var config = _a.config, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var pathname = react_router_dom_1.useLocation().pathname;
    var setCurrentAccountId = react_1.useContext(AccountMapContext_1.AccountMapContext).setCurrentAccountId;
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(WalletTitle, null,
            files_1.bitcoinNetworkEqual(currentBitcoinNetwork, bitcoinjs_lib_1.networks.testnet) ?
                react_1.default.createElement(LilyImageGray, { src: require('../assets/flower.svg') }) :
                react_1.default.createElement(LilyImage, { src: require('../assets/flower.svg') }),
            react_1.default.createElement(WalletTitleText, null,
                "Lily Wallet",
                files_1.bitcoinNetworkEqual(currentBitcoinNetwork, bitcoinjs_lib_1.networks.testnet) &&
                    ' (testnet)')),
        react_1.default.createElement(SidebarItemLink, { active: pathname === '/purchase', to: "/purchase" },
            react_1.default.createElement(_1.StyledIcon, { as: remix_line_1.Newspaper, size: 24, style: { marginRight: '.65rem' } }),
            "Buy License"),
        react_1.default.createElement(SidebarItem, { active: pathname === '/', to: "/", loading: false },
            react_1.default.createElement(_1.StyledIcon, { as: fa_solid_1.Home, size: 24, style: { marginRight: '.65rem' } }),
            "Home"),
        react_1.default.createElement(SidebarItemLink, { active: pathname === '/send', to: "/send" },
            react_1.default.createElement(_1.StyledIcon, { as: remix_fill_1.SendPlane, size: 24, style: { marginRight: '.65rem' } }),
            "Send"),
        react_1.default.createElement(SidebarItemLink, { active: pathname === '/receive', to: "/receive" },
            react_1.default.createElement(_1.StyledIcon, { as: material_1.VerticalAlignBottom, size: 24, style: { marginRight: '.65rem' } }),
            "Receive"),
        react_1.default.createElement(SidebarItemLink, { active: pathname === '/settings', to: "/settings" },
            react_1.default.createElement(_1.StyledIcon, { as: material_1.Settings, size: 24, style: { marginRight: '.65rem' } }),
            "Settings"),
        react_1.default.createElement(WalletsHeader, null, "Accounts"),
        react_1.default.createElement(AccountsContainer, null,
            config.wallets.map(function (wallet) { return (react_1.default.createElement(SidebarItemLink, { key: wallet.id, active: pathname.includes("/vault/" + wallet.id), onClick: function () {
                    setCurrentAccountId(wallet.id);
                }, to: "/vault/" + wallet.id },
                wallet.mnemonic ? (react_1.default.createElement(IconSvg, { fill: "currentColor", viewBox: "0 0 20 20" },
                    react_1.default.createElement("path", { fillRule: "evenodd", d: "M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z", clipRule: "evenodd" }))) : (react_1.default.createElement(IconSvg, { viewBox: "0 0 20 20", fill: "currentColor", className: "calculator w-6 h-6" },
                    react_1.default.createElement("path", { fillRule: "evenodd", d: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z", clipRule: "evenodd" }))),
                wallet.name)); }),
            config.vaults.map(function (vault) { return (react_1.default.createElement(SidebarItemLink, { key: vault.id, active: pathname.includes("/vault/" + vault.id), onClick: function () {
                    setCurrentAccountId(vault.id);
                }, to: "/vault/" + vault.id },
                react_1.default.createElement(IconSvg, { fill: "currentColor", viewBox: "0 0 20 20" },
                    react_1.default.createElement("path", { fillRule: "evenodd", d: "M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z", clipRule: "evenodd" })),
                vault.name)); })),
        react_1.default.createElement(SidebarItemLink, { active: pathname === '/setup', to: "/setup", loading: false },
            react_1.default.createElement(_1.StyledIcon, { as: material_1.AddCircleOutline, size: 24, style: { marginRight: '.65rem' } }),
            "New Account")));
};
var WalletTitleText = styled_components_1.default.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-left: 0.15em;\n  margin-top: 0.25em;\n"], ["\n  margin-left: 0.15em;\n  margin-top: 0.25em;\n"])));
var LilyImage = styled_components_1.default.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 36px;\n  height: 36px;\n  margin-right: .25em;\n"], ["\n  width: 36px;\n  height: 36px;\n  margin-right: .25em;\n"])));
var LilyImageGray = styled_components_1.default.img(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 36px;\n  height: 36px;\n  margin-right: .25em;\n  filter: grayscale(100%);\n"], ["\n  width: 36px;\n  height: 36px;\n  margin-right: .25em;\n  filter: grayscale(100%);\n"])));
var WalletsHeader = styled_components_1.default.h3(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  margin: 1.125em;\n  font-size: 1.125em;\n  font-weight: 100;\n"], ["\n  color: ", ";\n  margin: 1.125em;\n  font-size: 1.125em;\n  font-weight: 100;\n"])), colors_1.lightBlack);
var WalletTitle = styled_components_1.default(WalletsHeader)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  padding: 1.5em 0.5em 1.5em;\n  font-weight: 700;\n  margin: 0;\n"], ["\n  display: flex;\n  align-items: center;\n  padding: 1.5em 0.5em 1.5em;\n  font-weight: 700;\n  margin: 0;\n"])));
var IconSvg = styled_components_1.default.svg(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: #869198;\n  width: 1.25rem;\n  margin-right: .65rem;\n  height: 1.25rem;\n  flex-shrink: 0;\n"], ["\n  color: #869198;\n  width: 1.25rem;\n  margin-right: .65rem;\n  height: 1.25rem;\n  flex-shrink: 0;\n"])));
var AccountsContainer = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  overflow: scroll;\n  height: auto;\n"], ["\n  overflow: scroll;\n  height: auto;\n"])));
var SidebarItemStyle = styled_components_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  background: ", ";\n  border: ", ";\n  border-left: ", ";\n  margin-left: ", ";\n  border-right: none;\n  color: ", ";\n  padding: ", ";\n  text-decoration: none;\n  font-size: 0.9em;\n  display: flex;\n  align-items: center;\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  background: ", ";\n  border: ", ";\n  border-left: ", ";\n  margin-left: ", ";\n  border-right: none;\n  color: ", ";\n  padding: ", ";\n  text-decoration: none;\n  font-size: 0.9em;\n  display: flex;\n  align-items: center;\n\n  &:hover {\n    background: ", ";\n  }\n"])), function (p) { return p.active ? colors_1.green100 : colors_1.white; }, function (p) { return p.active ? "solid 0.0625em " + colors_1.darkOffWhite : 'none'; }, function (p) { return p.active ? "solid 0.6875em " + colors_1.green700 : 'none'; }, function (p) { return p.active ? "solid 0.6875em " + colors_1.green700 : 'none'; }, function (p) { return p.active ? 'inherit' : colors_1.darkGray; }, function (p) { return p.active ? "1em 1.2em 1.125em .5em" : '1em 1.2em'; }, colors_1.offWhite);
var SidebarItem = styled_components_1.default(function (_a) {
    var active = _a.active, p = __rest(_a, ["active"]);
    return react_1.default.createElement(react_router_dom_1.Link, __assign({}, p));
})(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), SidebarItemStyle);
var SidebarItemLink = styled_components_1.default(function (_a) {
    var active = _a.active, loading = _a.loading, p = __rest(_a, ["active", "loading"]);
    return react_1.default.createElement(react_router_dom_1.Link, __assign({}, p));
})(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  ", ";\n  text-decoration: none;\n  pointer-events: ", ";\n"], ["\n  ", ";\n  text-decoration: none;\n  pointer-events: ", ";\n"])), SidebarItemStyle, function (p) { return p.loading ? 'none' : 'auto'; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=NavLinks.js.map