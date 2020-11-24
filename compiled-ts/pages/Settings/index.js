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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var crypto_js_1 = require("crypto-js");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var files_1 = require("../../utils/files");
var media_1 = require("../../utils/media");
var Settings = function (_a) {
    var config = _a.config, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var _b = react_1.useState(false), downloadConfigModalIsOpen = _b[0], setDownloadConfigModalIsOpen = _b[1];
    var _c = react_1.useState(''), password = _c[0], setPassword = _c[1];
    var downloadCurrentConfig = function (password) {
        var encryptedConfigObject = crypto_js_1.AES.encrypt(JSON.stringify(config), password).toString();
        files_1.downloadFile(encryptedConfigObject, files_1.formatFilename('lily_wallet_config', currentBitcoinNetwork, 'txt'));
    };
    return (react_1.default.createElement(components_1.PageWrapper, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(components_1.Header, null,
                react_1.default.createElement(components_1.HeaderLeft, null,
                    react_1.default.createElement(components_1.PageTitle, null, "Settings"))),
            react_1.default.createElement(ValueWrapper, null,
                react_1.default.createElement(SettingsTabs, null,
                    react_1.default.createElement(TabItem, { active: true }, "Configuration"),
                    react_1.default.createElement(TabItem, { active: false }, "Mobile App"),
                    react_1.default.createElement(TabItem, { active: false }, "Backups"),
                    react_1.default.createElement(TabItem, { active: false }, "License")),
                react_1.default.createElement(SettingsHeadingItem, { style: { marginTop: '0.5em' } }, "Data and Backups"),
                react_1.default.createElement(SettingsSection, null,
                    react_1.default.createElement(SettingsSectionLeft, null,
                        react_1.default.createElement(SettingsHeader, null, "Export Current Configuration"),
                        react_1.default.createElement(SettingsSubheader, null, "Download your current vault configuration. This allows you to import your current configuration on a different machine running Lily.")),
                    react_1.default.createElement(SettingsSectionRight, null,
                        react_1.default.createElement(ViewAddressesButton, { onClick: function () { return setDownloadConfigModalIsOpen(true); } }, "Download Current Config")))),
            react_1.default.createElement(components_1.Modal, { isOpen: downloadConfigModalIsOpen, onRequestClose: function () { return setDownloadConfigModalIsOpen(false); } },
                react_1.default.createElement(ModalContentContainer, null,
                    react_1.default.createElement(PasswordWrapper, null,
                        react_1.default.createElement(PasswordText, null, "Almost done, just set a password to encrypt your setup file:"),
                        react_1.default.createElement(components_1.Input, { label: "Password", placeholder: "password", value: password, onChange: setPassword, type: "password" })),
                    react_1.default.createElement(WordContainer, null,
                        react_1.default.createElement(SaveWalletButton, { background: colors_1.green600, color: colors_1.white, onClick: function () { return downloadCurrentConfig(password); } }, "Download Encrypted Configuration File")))))));
};
var SettingsTabs = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  border-bottom: 1px solid ", ";\n"], ["\n  display: flex;\n  border-bottom: 1px solid ", ";\n"])), colors_1.gray200);
var TabItem = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  border-bottom: 2px solid ", ";\n  margin-left: 2rem;\n  cursor: pointer;\n  color: ", ";\n  font-weight: 600;\n\n  &:nth-child(1) {\n    margin-left: 0;\n  }\n\n  &:hover {\n    border-bottom: 2px solid ", ";\n    color: ", ";\n  }\n"], ["\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  border-bottom: 2px solid ", ";\n  margin-left: 2rem;\n  cursor: pointer;\n  color: ", ";\n  font-weight: 600;\n\n  &:nth-child(1) {\n    margin-left: 0;\n  }\n\n  &:hover {\n    border-bottom: 2px solid ", ";\n    color: ", ";\n  }\n"])), function (p) { return p.active ? colors_1.green500 : 'none'; }, function (p) { return p.active ? colors_1.green500 : colors_1.gray500; }, function (p) { return p.active ? 'none' : colors_1.gray300; }, function (p) { return p.active ? 'inherit' : colors_1.gray700; });
var ModalContentContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n"], ["\n  display: flex;\n  flex-direction: column;\n"])));
var ValueWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  background: ", ";\n  padding: 1.5em;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-top: solid 11px ", " !important;\n  border: 1px solid ", ";\n"], ["\n  background: ", ";\n  padding: 1.5em;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-top: solid 11px ", " !important;\n  border: 1px solid ", ";\n"])), colors_1.gray100, colors_1.green800, colors_1.darkGray);
var SettingsSection = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));\n  grid-gap: 5em;\n  margin: 3.125em 0;\n  justify-content: space-between;\n  padding: 1.5em;\n  background: ", ";\n  border: 1px solid ", ";\n  align-items: center;\n\n  ", ";\n"], ["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));\n  grid-gap: 5em;\n  margin: 3.125em 0;\n  justify-content: space-between;\n  padding: 1.5em;\n  background: ", ";\n  border: 1px solid ", ";\n  align-items: center;\n\n  ",
    ";\n"])), colors_1.white, colors_1.darkGray, media_1.mobile(styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  grid-gap: 2em;\n  "], ["\n  grid-gap: 2em;\n  "])))));
var SettingsSectionLeft = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\n"], ["\n\n"])));
var SettingsSectionRight = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n"])));
var SettingsHeader = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  display: flex;\n  font-size: 18px;\n"], ["\n  display: flex;\n  font-size: 18px;\n"])));
var SettingsHeadingItem = styled_components_1.default.h3(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 4em 0 0;\n  font-weight: 400;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  margin: 4em 0 0;\n  font-weight: 400;\n  color: ", ";\n"])), colors_1.darkGray);
var SettingsSubheader = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  display: flex;\n  font-size: .9em;\n  color: ", ";\n  margin: 8px 0;\n"], ["\n  display: flex;\n  font-size: .9em;\n  color: ", ";\n  margin: 8px 0;\n"])), colors_1.darkGray);
var ViewAddressesButton = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  \n  &:hover {\n    cursor: pointer;\n  }\n"], ["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  \n  &:hover {\n    cursor: pointer;\n  }\n"])), colors_1.green800);
var PasswordWrapper = styled_components_1.default.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  padding: 1.5em;\n  display: flex;\n  flex-direction: column;\n"], ["\n  padding: 1.5em;\n  display: flex;\n  flex-direction: column;\n"])));
var PasswordText = styled_components_1.default.h3(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  font-weight: 400;\n"], ["\n  font-weight: 400;\n"])));
var PasswordInput = styled_components_1.default.input(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  position: relative;\n  border: 1px solid ", ";\n  background: ", ";\n  padding: .75em;\n  text-align: center;\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1em;\n  border-radius: 4px;\n  font-size: 1.5em;\n  z-index: 1;\n  flex: 1;\n  font-family: 'Montserrat', sans-serif;\n\n  ::placeholder {\n    color: ", ";\n  }\n\n  :active, :focused {\n    outline: 0;\n    border: none;\n  }\n"], ["\n  position: relative;\n  border: 1px solid ", ";\n  background: ", ";\n  padding: .75em;\n  text-align: center;\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1em;\n  border-radius: 4px;\n  font-size: 1.5em;\n  z-index: 1;\n  flex: 1;\n  font-family: 'Montserrat', sans-serif;\n\n  ::placeholder {\n    color: ", ";\n  }\n\n  :active, :focused {\n    outline: 0;\n    border: none;\n  }\n"])), colors_1.darkOffWhite, colors_1.lightGray, colors_1.darkGray, colors_1.gray);
var SaveWalletButton = styled_components_1.default.div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  ", ";\n  flex: 1;\n"], ["\n  ", ";\n  flex: 1;\n"])), components_1.Button);
var WordContainer = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1.25em;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1.25em;\n"])));
exports.default = Settings;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
//# sourceMappingURL=index.js.map