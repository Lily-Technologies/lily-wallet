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
var react_qr_svg_1 = require("react-qr-svg");
var AccountMapContext_1 = require("../../../AccountMapContext");
var components_1 = require("../../../components");
var colors_1 = require("../../../utils/colors");
var media_1 = require("../../../utils/media");
var files_1 = require("../../../utils/files");
var ExportView = function (_a) {
    var currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var _b = react_1.useState(false), modalIsOpen = _b[0], setModalIsOpen = _b[1];
    var _c = react_1.useState(null), modalContent = _c[0], setModalContent = _c[1];
    var openInModal = function (component) {
        setModalIsOpen(true);
        setModalContent(component);
    };
    var closeModal = function () {
        setModalIsOpen(false);
        setModalContent(null);
    };
    var downloadColdcardMultisigFile = function () {
        if (currentAccount.config.extendedPublicKeys) {
            var ccFile = files_1.createColdCardBlob(currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners, currentAccount.config.name, currentAccount.config.extendedPublicKeys, currentBitcoinNetwork);
            files_1.downloadFile(ccFile, files_1.formatFilename(currentAccount.config.name + "-lily-coldcard-file", currentBitcoinNetwork, 'txt'));
        }
    };
    var downloadCaravanFile = function () {
        // need to add some properties to our config to use with Caravan
        var configCopy = __assign({}, currentAccount.config);
        configCopy.client = { type: 'public' };
        // need to have a name for each pubkey, so just use parentFingerprint
        if (configCopy.extendedPublicKeys !== undefined) {
            for (var i = 0; i < configCopy.extendedPublicKeys.length; i++) {
                configCopy.extendedPublicKeys[i].name = configCopy.extendedPublicKeys[i].parentFingerprint;
                // we need to populate the method field for caravan. if the device is of type trezor or ledger, put that in. else just put xpub.
                if (configCopy.extendedPublicKeys[i].device && (configCopy.extendedPublicKeys[i].device.type === 'trezor' || configCopy.extendedPublicKeys[i].device.type === 'ledger')) {
                    configCopy.extendedPublicKeys[i].method = configCopy.extendedPublicKeys[i].device.type;
                    configCopy.extendedPublicKeys[i].bip32Path = files_1.getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
                }
                else {
                    configCopy.extendedPublicKeys[i].method = 'xpub';
                }
            }
        }
        var caravanFile = JSON.stringify(configCopy);
        files_1.downloadFile(caravanFile, files_1.formatFilename('lily-caravan-file', currentBitcoinNetwork, 'json'));
    };
    var XpubQrCode = function () { return (react_1.default.createElement(react_qr_svg_1.QRCode, { bgColor: colors_1.white, fgColor: colors_1.black, level: "Q", style: { width: 256 }, value: currentAccount.config.xpub })); };
    var MnemonicQrCode = function () { return (react_1.default.createElement(ModalContentWrapper, null,
        react_1.default.createElement(react_qr_svg_1.QRCode, { bgColor: colors_1.white, fgColor: colors_1.black, level: "Q", style: { width: 256 }, value: currentAccount.config.mnemonic }),
        react_1.default.createElement(ScanInstructions, null, "Scan this QR code to import this wallet into BlueWallet"))); };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(components_1.Modal, { isOpen: modalIsOpen, onRequestClose: function () { return closeModal(); } }, modalContent),
        currentAccount.config.mnemonic && (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(SettingsHeadingItem, null, "Export Wallet"),
            react_1.default.createElement(SettingsSection, null,
                react_1.default.createElement(SettingsSectionLeft, null,
                    react_1.default.createElement(SettingsItemHeader, null, "Connect to BlueWallet"),
                    react_1.default.createElement(SettingsSubheader, null, "View a QR code to import this wallet into BlueWallet")),
                react_1.default.createElement(SettingsSectionRight, null,
                    react_1.default.createElement(ViewAddressesButton, { onClick: function () { openInModal(react_1.default.createElement(MnemonicQrCode, null)); } }, "View QR Code"))),
            react_1.default.createElement(SettingsSection, null,
                react_1.default.createElement(SettingsSectionLeft, null,
                    react_1.default.createElement(SettingsItemHeader, null, "View Mnemonic Seed"),
                    react_1.default.createElement(SettingsSubheader, null, "View the mnemonic phrase for this wallet. This can be used to import this wallet data into another application.")),
                react_1.default.createElement(SettingsSectionRight, null,
                    react_1.default.createElement(ViewAddressesButton, { onClick: function () {
                            openInModal(react_1.default.createElement(WordsContainer, null,
                                react_1.default.createElement(components_1.MnemonicWordsDisplayer, { mnemonicWords: currentAccount.config.mnemonic })));
                        } }, "View Wallet Mnemonic"))))),
        currentAccount.config.quorum.totalSigners > 1 && (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(SettingsHeadingItem, null, "Export Wallet"),
            react_1.default.createElement(SettingsSection, null,
                react_1.default.createElement(SettingsSectionLeft, null,
                    react_1.default.createElement(SettingsItemHeader, null, "Download Coldcard File"),
                    react_1.default.createElement(SettingsSubheader, null,
                        "Download the multisig wallet import file for Coldcard and place on microsd card. ",
                        react_1.default.createElement("br", null),
                        "Import via Settings > Multisig > Import from SD.")),
                react_1.default.createElement(SettingsSectionRight, null,
                    react_1.default.createElement(ViewAddressesButton, { onClick: function () { downloadColdcardMultisigFile(); } }, "Download Coldcard File"))),
            react_1.default.createElement(SettingsSection, null,
                react_1.default.createElement(SettingsSectionLeft, null,
                    react_1.default.createElement(SettingsItemHeader, null, "Download Caravan File"),
                    react_1.default.createElement(SettingsSubheader, null,
                        react_1.default.createElement("span", null,
                            "Download this vault's configuration file to use in ",
                            react_1.default.createElement(UnchainedCapitalLink, { href: "https://unchained-capital.com/", target: "_blank", rel: "noopener noreferrer" }, "Unchained Capital's"),
                            " ",
                            react_1.default.createElement(UnchainedCapitalLink, { href: "https://unchained-capital.github.io/caravan/#/", target: "_blank", rel: "noopener noreferrer" }, "Caravan"),
                            " multisig coordination software."))),
                react_1.default.createElement(SettingsSectionRight, null,
                    react_1.default.createElement(ViewAddressesButton, { onClick: function () { downloadCaravanFile(); } }, "Download Caravan File"))))),
        currentAccount.config.quorum.totalSigners === 1 && (react_1.default.createElement(SettingsSection, null,
            react_1.default.createElement(SettingsSectionLeft, null,
                react_1.default.createElement(SettingsItemHeader, null, "View XPub"),
                react_1.default.createElement(SettingsSubheader, null, "View the xpub associated with this vault. This can be given to other services to deposit money into your account or create a read-only wallet.")),
            react_1.default.createElement(SettingsSectionRight, null,
                react_1.default.createElement(ViewAddressesButton, { onClick: function () { openInModal(react_1.default.createElement(XpubQrCode, null)); } }, "View XPub"))))));
};
var SettingsSection = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));\n  grid-gap: 5em;\n  margin: 1em 0;\n  justify-content: space-between;\n  padding: 1.5em;\n  background: ", ";\n  align-items: center;\n  padding: 2.5em 2em;\n  // box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  // border-radius: 0.375em;\n\n  ", ";\n"], ["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));\n  grid-gap: 5em;\n  margin: 1em 0;\n  justify-content: space-between;\n  padding: 1.5em;\n  background: ", ";\n  align-items: center;\n  padding: 2.5em 2em;\n  // box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  // border-radius: 0.375em;\n\n  ",
    ";\n"])), colors_1.white, media_1.mobile(styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    grid-gap: 2em;\n  "], ["\n    grid-gap: 2em;\n  "])))));
var ModalContentWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 1.5em;\n  align-items: flex-start;\n\n  ", ";  \n"], ["\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 1.5em;\n  align-items: flex-start;\n\n  ",
    ";  \n"])), media_1.mobile(styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    flex-direction: column;\n    align-items: center;\n    padding-top: 1.25em;\n    padding-bottom: 1em;\n    padding-left: 1em;\n    padding-right: 1em;\n    margin-left: 0;\n  "], ["\n    flex-direction: column;\n    align-items: center;\n    padding-top: 1.25em;\n    padding-bottom: 1em;\n    padding-left: 1em;\n    padding-right: 1em;\n    margin-left: 0;\n  "])))));
var WordsContainer = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1.25em;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1.25em;\n  justify-content: center;\n"])));
var SettingsSectionLeft = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  grid-column: span 2;\n\n  ", ";\n"], ["\n  grid-column: span 2;\n\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    grid-column: span 1;\n  "], ["\n    grid-column: span 1;\n  "])))));
var UnchainedCapitalLink = styled_components_1.default.a(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 400;\n  text-decoration: none;\n\n  &:visited {\n    color: ", ";\n  }\n"], ["\n  color: ", ";\n  font-weight: 400;\n  text-decoration: none;\n\n  &:visited {\n    color: ", ";\n  }\n"])), colors_1.gray900, colors_1.gray900);
var SettingsSectionRight = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject([""], [""])));
var SettingsSubheader = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  display: flex;\n  font-size: 0.875em;\n  color: ", ";\n  margin: 8px 0;\n"], ["\n  display: flex;\n  font-size: 0.875em;\n  color: ", ";\n  margin: 8px 0;\n"])), colors_1.gray500);
var SettingsItemHeader = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  display: flex;\n  font-size: 1.125em;\n"], ["\n  display: flex;\n  font-size: 1.125em;\n"])));
var SettingsHeadingItem = styled_components_1.default.h3(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 64px 0 0;\n  font-weight: 400;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  margin: 64px 0 0;\n  font-weight: 400;\n  color: ", ";\n"])), colors_1.gray900);
var ViewAddressesButton = styled_components_1.default.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"], ["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"])), colors_1.green800);
var ScanInstructions = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  font-size: 0.5em;\n  padding: 1.5em 0;\n"], ["\n  font-size: 0.5em;\n  padding: 1.5em 0;\n"])));
exports.default = ExportView;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
//# sourceMappingURL=ExportView.js.map