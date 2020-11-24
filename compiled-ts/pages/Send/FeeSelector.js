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
var unchained_bitcoin_1 = require("unchained-bitcoin");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var coinselect_1 = __importDefault(require("coinselect"));
var components_1 = require("../../components");
var send_1 = require("../../utils/send");
var colors_1 = require("../../utils/colors");
exports.FeeSelector = function (_a) {
    var currentAccount = _a.currentAccount, finalPsbt = _a.finalPsbt, feeRates = _a.feeRates, availableUtxos = _a.availableUtxos, recipientAddress = _a.recipientAddress, sendAmount = _a.sendAmount, closeModal = _a.closeModal, createTransactionAndSetState = _a.createTransactionAndSetState, currentBitcoinPrice = _a.currentBitcoinPrice;
    var fee = send_1.getFee(finalPsbt, currentAccount.transactions);
    var _b = react_1.useState(fee), customFee = _b[0], setCustomFee = _b[1];
    var _c = react_1.useState(false), customFeeError = _c[0], setCustomFeeError = _c[1];
    var _d = react_1.useState(unchained_bitcoin_1.bitcoinsToSatoshis(fee)), customFeeBtc = _d[0], setCustomFeeBtc = _d[1];
    var _e = react_1.useState(false), showEditCustomFee = _e[0], setShowEditCustomFee = _e[1];
    var fastestFee;
    var normalFee;
    var slowFee;
    if (currentAccount.config.quorum.totalSigners > 1) {
        fastestFee = send_1.getFeeForMultisig(feeRates.fastestFee, currentAccount.config.addressType, finalPsbt.txInputs.length, finalPsbt.txOutputs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(bignumber_js_1.default.ROUND_CEIL);
        normalFee = send_1.getFeeForMultisig(feeRates.halfHourFee, currentAccount.config.addressType, finalPsbt.txInputs.length, finalPsbt.txOutputs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(bignumber_js_1.default.ROUND_CEIL);
        slowFee = send_1.getFeeForMultisig(feeRates.hourFee, currentAccount.config.addressType, finalPsbt.txInputs.length, finalPsbt.txOutputs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(bignumber_js_1.default.ROUND_CEIL);
    }
    else {
        fastestFee = coinselect_1.default(availableUtxos, [{ address: recipientAddress, value: unchained_bitcoin_1.bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.fastestFee).fee;
        normalFee = coinselect_1.default(availableUtxos, [{ address: recipientAddress, value: unchained_bitcoin_1.bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.halfHourFee).fee;
        slowFee = coinselect_1.default(availableUtxos, [{ address: recipientAddress, value: unchained_bitcoin_1.bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.hourFee).fee;
    }
    var validateCustomFee = function () {
        if (!unchained_bitcoin_1.satoshisToBitcoins(customFee).isGreaterThan(0)) {
            setCustomFeeError(true);
            return false;
        }
        if (unchained_bitcoin_1.satoshisToBitcoins(customFee).isGreaterThan(0) && customFeeError) {
            setCustomFeeError(false);
        }
        return true;
    };
    var selectFee = function (fee) {
        createTransactionAndSetState(recipientAddress, sendAmount, new bignumber_js_1.default(fee));
        closeModal();
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(ModalHeaderContainer, null, "Adjust Transaction Fee"),
        !showEditCustomFee ? (react_1.default.createElement("div", { style: { padding: '1.5em' } },
            react_1.default.createElement(FeeItem, { onClick: function () { return selectFee(fastestFee); }, selected: fastestFee === fee },
                react_1.default.createElement(FeeMainText, null, "Fast: ~10 minutes"),
                react_1.default.createElement(FeeSubtext, null,
                    "$",
                    unchained_bitcoin_1.satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2),
                    ", ",
                    unchained_bitcoin_1.satoshisToBitcoins(fastestFee).toNumber(),
                    " BTC")),
            normalFee !== fastestFee && (react_1.default.createElement(FeeItem, { onClick: function () { return selectFee(normalFee); }, selected: normalFee === fee },
                react_1.default.createElement(FeeMainText, null, "Normal: ~30 minutes"),
                react_1.default.createElement(FeeSubtext, null,
                    "$",
                    unchained_bitcoin_1.satoshisToBitcoins(normalFee).multipliedBy(currentBitcoinPrice).toFixed(2),
                    ", ",
                    unchained_bitcoin_1.satoshisToBitcoins(normalFee).toNumber(),
                    " BTC"))),
            slowFee !== normalFee && ( //  remove slow option if same as normal (mempool isnt very full)
            react_1.default.createElement(FeeItem, { onClick: function () { return selectFee(slowFee); }, selected: slowFee === fee },
                react_1.default.createElement(FeeMainText, null, "Slow: ~1 hour"),
                react_1.default.createElement(FeeSubtext, null,
                    "$",
                    unchained_bitcoin_1.satoshisToBitcoins(slowFee).multipliedBy(currentBitcoinPrice).toFixed(2),
                    ", ",
                    unchained_bitcoin_1.satoshisToBitcoins(slowFee).toNumber(),
                    " BTC"))),
            react_1.default.createElement(FeeItem, { onClick: function () {
                    setShowEditCustomFee(true);
                }, selected: slowFee !== fee && normalFee !== fee && fastestFee !== fee },
                react_1.default.createElement(FeeMainText, null, "Custom Fee"),
                react_1.default.createElement(FeeSubtext, null, slowFee !== fee && normalFee !== fee && fastestFee !== fee &&
                    "$" + unchained_bitcoin_1.satoshisToBitcoins(customFee).multipliedBy(currentBitcoinPrice).toFixed(2) + ", " + unchained_bitcoin_1.satoshisToBitcoins(customFee).toNumber() + " BTC")))) : (react_1.default.createElement(Container, null,
            react_1.default.createElement(components_1.Input, { label: "Custom Fee", type: "text", onChange: function (value) {
                    setCustomFeeBtc(value);
                    setCustomFee(unchained_bitcoin_1.bitcoinsToSatoshis(value));
                    validateCustomFee();
                }, value: customFeeBtc, placeholder: "0.00001", error: customFeeError }),
            react_1.default.createElement(exports.InputStaticText, { disabled: true, text: "BTC" }, "BTC"),
            react_1.default.createElement(ButtonGroup, null,
                react_1.default.createElement(CancelButton, { onClick: function () {
                        setShowEditCustomFee(false);
                    } }, "Cancel"),
                react_1.default.createElement(SaveFeeButton, { background: colors_1.green600, color: colors_1.white, onClick: function () {
                        if (validateCustomFee()) {
                            createTransactionAndSetState(recipientAddress, sendAmount, new bignumber_js_1.default(customFee));
                            closeModal();
                        }
                    } }, "Save Fee"))))));
};
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\npadding: 1.5em;\n"], ["\npadding: 1.5em;\n"])));
var ButtonGroup = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var CancelButton = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1em 1.25rem;\n  border: 1px solid ", ";\n  border-radius: .375rem;\n  flex: 1;\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n  margin-right: 1em;\n\n  &:hover {\n    border: 1px solid ", ";\n    cursor: pointer;\n  }\n"], ["\n  padding: 1em 1.25rem;\n  border: 1px solid ", ";\n  border-radius: .375rem;\n  flex: 1;\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n  margin-right: 1em;\n\n  &:hover {\n    border: 1px solid ", ";\n    cursor: pointer;\n  }\n"])), colors_1.gray, colors_1.darkGray);
var SaveFeeButton = styled_components_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", ";\n  padding: 1em 1.25rem;\n  border-radius: .375rem;\n  flex: 1;\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n"], ["\n  ", ";\n  padding: 1em 1.25rem;\n  border-radius: .375rem;\n  flex: 1;\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n"])), components_1.Button);
var FeeMainText = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 1em;\n"], ["\n  font-size: 1em;\n"])));
var FeeSubtext = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.75em;\n"], ["\n  color: ", ";\n  font-size: 0.75em;\n"])), colors_1.darkGray);
var FeeItem = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  padding: 1.5em;\n  margin: 12px 0;\n  background: ", ";\n  border: 1px solid ", ";\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n  cursor: pointer;\n  transition-duration: .15s;\n\n  &:hover {\n    border: 1px solid ", ";\n    background: ", ";\n  }\n\n  &:active {\n    background: ", ";\n  }\n"], ["\n  display: flex;\n  flex-direction: column;\n  padding: 1.5em;\n  margin: 12px 0;\n  background: ", ";\n  border: 1px solid ", ";\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n  cursor: pointer;\n  transition-duration: .15s;\n\n  &:hover {\n    border: 1px solid ", ";\n    background: ", ";\n  }\n\n  &:active {\n    background: ", ";\n  }\n"])), function (p) { return p.selected ? colors_1.lightBlue : colors_1.lightGray; }, function (p) { return p.selected ? colors_1.blue : colors_1.offWhite; }, function (p) { return p.selected ? colors_1.blue : colors_1.offWhite; }, function (p) { return p.selected ? colors_1.lightBlue : colors_1.offWhite; }, function (p) { return p.selected ? colors_1.lightBlue : colors_1.gray; });
var ModalHeaderContainer = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"])));
exports.InputStaticText = styled_components_1.default.label(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  flex: 0 0;\n  justify-self: center;\n  align-self: center;\n  margin-left: -87px;\n  z-index: 1;\n  margin-right: 40px;\n  font-size: 1.5em;\n  font-weight: 100;\n  color: ", ";\n\n  &::after {\n    content: ", ";\n    position: absolute;\n    top: 4px;\n    left: 94px;\n    font-family: arial, helvetica, sans-serif;\n    font-size: .75em;\n    display: block;\n    color: rgba(0, 0, 0, 0.6);\n    font-weight: bold;\n  }\n"], ["\n  position: relative;\n  display: flex;\n  flex: 0 0;\n  justify-self: center;\n  align-self: center;\n  margin-left: -87px;\n  z-index: 1;\n  margin-right: 40px;\n  font-size: 1.5em;\n  font-weight: 100;\n  color: ", ";\n\n  &::after {\n    content: ", ";\n    position: absolute;\n    top: 4px;\n    left: 94px;\n    font-family: arial, helvetica, sans-serif;\n    font-size: .75em;\n    display: block;\n    color: rgba(0, 0, 0, 0.6);\n    font-weight: bold;\n  }\n"])), colors_1.gray, function (p) { return p.text; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=FeeSelector.js.map