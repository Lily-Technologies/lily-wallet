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
var boxicons_logos_1 = require("@styled-icons/boxicons-logos");
var material_1 = require("@styled-icons/material");
var unchained_bitcoin_1 = require("unchained-bitcoin");
var moment_1 = __importDefault(require("moment"));
var AccountMapContext_1 = require("../../AccountMapContext");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var getLastTransactionTime = function (transactions) {
    if (transactions.length === 0) { // if no transactions yet
        return "No activity on this account yet";
    }
    else if (!transactions[0].status.confirmed) { // if last transaction isn't confirmed yet
        return "Last transaction was moments ago";
    }
    else { // if transaction is confirmed, give moments ago
        return "Last transaction was " + moment_1.default.unix(transactions[0].status.block_time).fromNow();
    }
};
exports.AccountsSection = function () {
    var _a = react_1.useContext(AccountMapContext_1.AccountMapContext), accountMap = _a.accountMap, setCurrentAccountId = _a.setCurrentAccountId;
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(HomeHeadingItem, { style: { marginTop: '2.5em', marginBottom: '1em' } }, "Your Accounts"),
        react_1.default.createElement(AccountsWrapper, null,
            Object.values(accountMap).map(function (account) { return (react_1.default.createElement(AccountItem, { to: "/vault/" + account.config.id, onClick: function () { return setCurrentAccountId(account.config.id); }, key: account.config.id },
                react_1.default.createElement(components_1.StyledIcon, { as: boxicons_logos_1.Bitcoin, size: 48 }),
                react_1.default.createElement(AccountInfoContainer, null,
                    react_1.default.createElement(AccountName, null, account.name),
                    account.loading && 'Loading...',
                    !account.loading && react_1.default.createElement(CurrentBalance, null,
                        "Current Balance: ",
                        unchained_bitcoin_1.satoshisToBitcoins(account.currentBalance).toFixed(8),
                        " BTC"),
                    !account.loading && react_1.default.createElement(CurrentBalance, null, getLastTransactionTime(account.transactions))))); }),
            react_1.default.createElement(AccountItem, { to: "/setup" },
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.AddCircleOutline, size: 48 }),
                react_1.default.createElement(AccountInfoContainer, null,
                    react_1.default.createElement(AccountName, null, "Add a new account"),
                    react_1.default.createElement(CurrentBalance, null, "Create a new account to send, receive, and manage bitcoin"))),
            !accountMap.size && (react_1.default.createElement(InvisibleItem, null)))));
};
var HomeHeadingItem = styled_components_1.default.h3(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 4em 0 0;\n  font-weight: 400;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  margin: 4em 0 0;\n  font-weight: 400;\n  color: ", ";\n"])), colors_1.black);
var InvisibleItem = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: 0;\n  width: 0;\n"], ["\n  height: 0;\n  width: 0;\n"])));
var AccountItem = styled_components_1.default(react_router_dom_1.Link)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background: ", ";\n  padding: 1.5em;\n  cursor: pointer;\n  color: ", ";\n  text-decoration: none;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n\n  &:hover {\n    color: ", ";\n  }\n\n  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;\n  transition-timing-function: cubic-bezier(.4,0,.2,1);\n  transition-duration: .15s;\n\n  &:active {\n    transform: scale(.99);\n    outline: 0;\n  }\n"], ["\n  background: ", ";\n  padding: 1.5em;\n  cursor: pointer;\n  color: ", ";\n  text-decoration: none;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n\n  &:hover {\n    color: ", ";\n  }\n\n  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;\n  transition-timing-function: cubic-bezier(.4,0,.2,1);\n  transition-duration: .15s;\n\n  &:active {\n    transform: scale(.99);\n    outline: 0;\n  }\n"])), colors_1.white, colors_1.darkGray, colors_1.gray500);
var AccountInfoContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  padding: 1em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  padding: 1em;\n"])));
var AccountsWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n  grid-gap: 1em;\n"], ["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n  grid-gap: 1em;\n"])));
var AccountName = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 1.25em;\n"], ["\n  font-size: 1.25em;\n"])));
var CurrentBalance = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 0.65em;\n"], ["\n  font-size: 0.65em;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=AccountsSection.js.map