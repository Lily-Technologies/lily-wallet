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
var crypto_1 = require("@styled-icons/crypto");
var entypo_1 = require("@styled-icons/entypo");
var _1 = require(".");
var colors_1 = require("../utils/colors");
var AccountMapContext_1 = require("../AccountMapContext");
exports.SelectAccountMenu = function (_a) {
    var config = _a.config;
    var _b = react_1.useContext(AccountMapContext_1.AccountMapContext), setCurrentAccountId = _b.setCurrentAccountId, currentAccount = _b.currentAccount;
    return (react_1.default.createElement(AccountMenu, null,
        config.vaults.map(function (vault, index) { return (react_1.default.createElement(AccountMenuItemWrapper, { key: index, active: vault.id === currentAccount.config.id, onClick: function () { return setCurrentAccountId(vault.id); } },
            react_1.default.createElement(IconWrapper, { active: vault.id === currentAccount.config.id },
                react_1.default.createElement(_1.StyledIcon, { as: crypto_1.Safe, size: 48 })),
            react_1.default.createElement(AccountMenuItemName, null, vault.name))); }),
        config.wallets.map(function (wallet, index) { return (react_1.default.createElement(AccountMenuItemWrapper, { key: index, active: wallet.id === currentAccount.config.id, onClick: function () { return setCurrentAccountId(wallet.id); } },
            react_1.default.createElement(IconWrapper, { active: wallet.id === currentAccount.config.id },
                react_1.default.createElement(_1.StyledIcon, { as: entypo_1.Wallet, size: 48 })),
            react_1.default.createElement(AccountMenuItemName, null, wallet.name))); })));
};
var IconWrapper = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  padding: 1.5em;\n  border-radius: 0.385em;\n  margin-bottom: 0.5em;\n  border: ", ";\n  cursor: pointer;V\n"], ["\n  background: ", ";\n  padding: 1.5em;\n  border-radius: 0.385em;\n  margin-bottom: 0.5em;\n  border: ", ";\n  cursor: pointer;V\n"])), colors_1.white, function (p) { return p.active ? "1px solid " + colors_1.orange600 : "1px solid " + colors_1.gray300; });
var AccountMenuItemWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  color: ", ";\n  padding: .5em;\n  flex: 1;\n  border-radius: 0.385em;\n  margin: 0 0.25em;\n  opacity: ", ";\n  cursor: pointer;\n\n  &:hover {\n    opacity: 1;\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  color: ", ";\n  padding: .5em;\n  flex: 1;\n  border-radius: 0.385em;\n  margin: 0 0.25em;\n  opacity: ", ";\n  cursor: pointer;\n\n  &:hover {\n    opacity: 1;\n  }\n"])), function (p) { return p.active ? colors_1.gray800 : colors_1.gray700; }, function (p) { return p.active ? 1 : 0.5; });
var AccountMenuItemName = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  font-size: 0.75em;\n"], ["\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  font-size: 0.75em;\n"])));
var AccountMenu = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-around;\n  background: ", ";\n  margin-bottom: 1em;\n  overflow: scroll;\n  padding: 0.75em;\n  border-radius: 0.385em;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n"], ["\n  display: flex;\n  justify-content: space-around;\n  background: ", ";\n  margin-bottom: 1em;\n  overflow: scroll;\n  padding: 0.75em;\n  border-radius: 0.385em;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n"])), colors_1.white, colors_1.gray400);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SelectAccountMenu.js.map