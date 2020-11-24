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
var react_qr_svg_1 = require("react-qr-svg");
var react_copy_to_clipboard_1 = __importDefault(require("react-copy-to-clipboard"));
var unchained_bitcoin_1 = require("unchained-bitcoin");
var components_1 = require("../../components");
var AccountMapContext_1 = require("../../AccountMapContext");
var colors_1 = require("../../utils/colors");
var Receive = function (_a) {
    var config = _a.config;
    document.title = "Receive - Lily Wallet";
    var _b = react_1.useState(0), unusedAddressIndex = _b[0], setUnusedAddressIndex = _b[1];
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var unusedAddresses = currentAccount.unusedAddresses, currentBalance = currentAccount.currentBalance;
    return (react_1.default.createElement(components_1.PageWrapper, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(components_1.Header, null,
                react_1.default.createElement(components_1.HeaderLeft, null,
                    react_1.default.createElement(components_1.PageTitle, null, "Receive to")),
                react_1.default.createElement(components_1.HeaderRight, null)),
            react_1.default.createElement(components_1.SelectAccountMenu, { config: config }),
            currentAccount.loading && react_1.default.createElement(components_1.Loading, { itemText: 'Receive Information' }),
            !currentAccount.loading && (react_1.default.createElement(components_1.GridArea, null,
                react_1.default.createElement(AccountReceiveContentLeft, null,
                    react_1.default.createElement(SendToAddressHeader, null, "Send bitcoin to"),
                    react_1.default.createElement(AddressDisplayWrapper, null,
                        react_1.default.createElement(BitcoinAddressLabel, null, "Bitcoin address:"),
                        unusedAddresses[unusedAddressIndex].address),
                    react_1.default.createElement(QRCodeWrapper, null,
                        react_1.default.createElement(react_qr_svg_1.QRCode, { bgColor: colors_1.white, fgColor: colors_1.black, level: "Q", style: { width: 192 }, value: unusedAddresses[unusedAddressIndex].address })),
                    react_1.default.createElement(ReceiveButtonContainer, null,
                        react_1.default.createElement(react_copy_to_clipboard_1.default, { text: unusedAddresses[unusedAddressIndex].address },
                            react_1.default.createElement(CopyAddressButton, { color: colors_1.white, background: colors_1.green600 }, "Copy Address")),
                        react_1.default.createElement(CopyAddressButton, { background: "transparent", color: colors_1.darkGray, onClick: function () { return setUnusedAddressIndex(unusedAddressIndex + 1); } }, "Generate New Address"))),
                react_1.default.createElement(AccountReceiveContentRight, null,
                    react_1.default.createElement(CurrentBalanceWrapper, null,
                        react_1.default.createElement(CurrentBalanceText, null, "Current Balance:"),
                        react_1.default.createElement(CurrentBalanceValue, null,
                            unchained_bitcoin_1.satoshisToBitcoins(currentBalance).toNumber(),
                            " BTC"))))))));
};
var BitcoinAddressLabel = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 0.75em;\n  color: ", ";\n  margin-bottom: 0.25em;\n"], ["\n  font-size: 0.75em;\n  color: ", ";\n  margin-bottom: 0.25em;\n"])), colors_1.gray800);
var ReceiveButtonContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 24px;\n"], ["\n  margin: 0 24px;\n"])));
var CopyAddressButton = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), components_1.Button);
var SendToAddressHeader = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 1em;\n  color: ", ";\n  margin: 12px;\n"], ["\n  font-size: 1em;\n  color: ", ";\n  margin: 12px;\n"])), colors_1.darkGray);
var QRCodeWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1em;\n"], ["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1em;\n"])));
var AddressDisplayWrapper = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  background: ", ";\n  padding: 0.75em;\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0 1em;\n  border-radius: 0.385em;\n  word-break: break-all;\n  flex-direction: column;\n"], ["\n  border: 1px solid ", ";\n  background: ", ";\n  padding: 0.75em;\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0 1em;\n  border-radius: 0.385em;\n  word-break: break-all;\n  flex-direction: column;\n"])), colors_1.darkOffWhite, colors_1.lightGray, colors_1.green700);
var AccountReceiveContentLeft = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  min-height: 400px;\n  padding: 1em;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  background: ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  border-radius: 0.385em;\n  justify-content: center;\n  width: 100%;\n"], ["\n  min-height: 400px;\n  padding: 1em;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  background: ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  border-radius: 0.385em;\n  justify-content: center;\n  width: 100%;\n"])), colors_1.white, colors_1.gray400);
var AccountReceiveContentRight = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n"], ["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n"])));
var CurrentBalanceWrapper = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding: 1.5em;\n  display: 'flex';\n  flex-direction: column;\n  border-radius: 0.385em;\n  background: ", ";\n  text-align: right;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n"], ["\n  padding: 1.5em;\n  display: 'flex';\n  flex-direction: column;\n  border-radius: 0.385em;\n  background: ", ";\n  text-align: right;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n"])), colors_1.white, colors_1.gray400);
var CurrentBalanceText = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  font-size: 1.5em;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  color: ", ";\n"])), colors_1.gray600);
var CurrentBalanceValue = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  font-size: 2em;\n"], ["\n  font-size: 2em;\n"])));
exports.default = Receive;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=index.js.map