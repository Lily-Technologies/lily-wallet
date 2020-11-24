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
var bootstrap_1 = require("@styled-icons/bootstrap");
var react_router_dom_1 = require("react-router-dom");
var components_1 = require("../../../components");
var AccountMapContext_1 = require("../../../AccountMapContext");
var media_1 = require("../../../utils/media");
var files_1 = require("../../../utils/files");
var colors_1 = require("../../../utils/colors");
var GeneralView = function (_a) {
    var config = _a.config, setConfigFile = _a.setConfigFile, password = _a.password;
    var _b = react_1.useState(false), viewDeleteAccount = _b[0], setViewDeleteAccount = _b[1];
    var _c = react_1.useState(''), accountNameConfirm = _c[0], setAccountNameConfirm = _c[1];
    var _d = react_1.useState(false), accountNameConfirmError = _d[0], setAccountNameConfirmError = _d[1];
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var history = react_router_dom_1.useHistory();
    var onInputEnter = function (e) {
        if (e.key === 'Enter') {
            removeAccountAndDownloadConfig();
        }
    };
    var removeAccountAndDownloadConfig = function () {
        if (accountNameConfirm === currentAccount.config.name) {
            var configCopy = __assign({}, config);
            if (currentAccount.config.quorum.totalSigners === 1) {
                configCopy.wallets = configCopy.wallets.filter(function (wallet) { return wallet.id !== currentAccount.config.id; });
            }
            else {
                configCopy.vaults = configCopy.vaults.filter(function (vault) { return vault.id !== currentAccount.config.id; });
            }
            files_1.saveConfig(configCopy, password);
            setConfigFile(__assign({}, configCopy));
            history.push('/');
        }
        else {
            setAccountNameConfirmError(true);
        }
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(SettingsHeadingItem, null, "Danger Zone"),
        react_1.default.createElement(SettingsSection, null,
            react_1.default.createElement(SettingsSectionLeft, null,
                react_1.default.createElement(SettingsItemHeader, null, "Delete Account"),
                react_1.default.createElement(SettingsSubheader, null, "Remove this account from your list of accounts.")),
            react_1.default.createElement(SettingsSectionRight, null,
                react_1.default.createElement(ViewAddressesButton, { style: { color: colors_1.red, border: "1px solid " + colors_1.red }, onClick: function () {
                        setViewDeleteAccount(true);
                    } }, "Delete Account")),
            react_1.default.createElement(components_1.Modal, { isOpen: viewDeleteAccount, onRequestClose: function () { return setViewDeleteAccount(false); } },
                react_1.default.createElement(ModalContentWrapper, null,
                    react_1.default.createElement(DangerIconContainer, null,
                        react_1.default.createElement(StyledIconCircle, null,
                            react_1.default.createElement(components_1.StyledIcon, { style: { color: colors_1.red600 }, as: bootstrap_1.ExclamationDiamond, size: 36 }))),
                    react_1.default.createElement(DangerTextContainer, null,
                        react_1.default.createElement(DangerText, null, "Delete Account"),
                        react_1.default.createElement(DangerSubtext, null,
                            "You are about to delete an account from this configuration.",
                            react_1.default.createElement("br", null),
                            "If there are any funds remaining in this account, they will be lost forever."),
                        react_1.default.createElement(components_1.Input, { label: "Type in the account's name to delete", autoFocus: true, type: "text", value: accountNameConfirm, onChange: setAccountNameConfirm, onKeyDown: function (e) { return onInputEnter(e); }, error: accountNameConfirmError }),
                        accountNameConfirmError && react_1.default.createElement(ConfirmError, null, "Account name doesn't match"),
                        react_1.default.createElement(DeleteAccountButton, { background: colors_1.red600, color: colors_1.white, onClick: function () { removeAccountAndDownloadConfig(); } }, "Delete Account")))))));
};
var SettingsSection = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  margin: 1em 0;\n  justify-content: space-between;\n"], ["\n  display: flex;\n  flex-direction: column;\n  margin: 1em 0;\n  justify-content: space-between;\n"])));
var DeleteAccountButton = styled_components_1.default.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", "\n  margin-top: 1rem;\n\n  ", ";\n"], ["\n  ", "\n  margin-top: 1rem;\n\n  ",
    ";\n"])), components_1.Button, media_1.mobile(styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 1.25rem;\n  "], ["\n  margin-top: 1.25rem;\n  "])))));
var ConfirmError = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.red500);
var DangerTextContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex: 1;\n  align-items: flex-start;\n  flex-direction: column;\n  margin-left: 1rem;\n\n  ", ";\n"], ["\n  display: flex;\n  flex: 1;\n  align-items: flex-start;\n  flex-direction: column;\n  margin-left: 1rem;\n\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    margin-top: 0.75rem;\n    margin-left: 0;\n  "], ["\n    margin-top: 0.75rem;\n    margin-left: 0;\n  "])))));
var ModalContentWrapper = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 1.5em;\n  align-items: flex-start;\n\n  ", ";  \n"], ["\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 1.5em;\n  align-items: flex-start;\n\n  ",
    ";  \n"])), media_1.mobile(styled_components_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    flex-direction: column;\n    align-items: center;\n    padding-top: 1.25em;\n    padding-bottom: 1em;\n    padding-left: 1em;\n    padding-right: 1em;\n    margin-left: 0;\n  "], ["\n    flex-direction: column;\n    align-items: center;\n    padding-top: 1.25em;\n    padding-bottom: 1em;\n    padding-left: 1em;\n    padding-right: 1em;\n    margin-left: 0;\n  "])))));
var DangerIconContainer = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject([""], [""])));
var StyledIconCircle = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  border-radius: 9999px;\n  background: ", ";\n  width: 3rem;\n  height: 3rem;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"], ["\n  border-radius: 9999px;\n  background: ", ";\n  width: 3rem;\n  height: 3rem;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"])), colors_1.red100);
var DangerText = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  font-size: 1.125rem;\n  text-align: center;\n  font-weight: 500;\n"], ["\n  font-size: 1.125rem;\n  text-align: center;\n  font-weight: 500;\n"])));
var DangerSubtext = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  padding-bottom: 2em;\n  margin-top: 0.5rem;\n  color: ", ";\n"], ["\n  padding-bottom: 2em;\n  margin-top: 0.5rem;\n  color: ", ";\n"])), colors_1.gray500);
var SettingsSectionLeft = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  grid-column: span 2;\n\n  ", ";\n"], ["\n  grid-column: span 2;\n\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n    grid-column: span 1;\n  "], ["\n    grid-column: span 1;\n  "])))));
var SettingsSectionRight = styled_components_1.default.div(templateObject_15 || (templateObject_15 = __makeTemplateObject([""], [""])));
var SettingsSubheader = styled_components_1.default.div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  display: flex;\n  font-size: 0.875em;\n  color: ", ";\n  margin: 8px 0;\n"], ["\n  display: flex;\n  font-size: 0.875em;\n  color: ", ";\n  margin: 8px 0;\n"])), colors_1.gray500);
var SettingsItemHeader = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  display: flex;\n  font-size: 1.125em;\n"], ["\n  display: flex;\n  font-size: 1.125em;\n"])));
var SettingsHeadingItem = styled_components_1.default.h3(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 64px 0 0;\n  font-weight: 400;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  margin: 64px 0 0;\n  font-weight: 400;\n  color: ", ";\n"])), colors_1.gray900);
var ViewAddressesButton = styled_components_1.default.div(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"], ["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"])), colors_1.green800);
exports.default = GeneralView;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19;
//# sourceMappingURL=GeneralView.js.map