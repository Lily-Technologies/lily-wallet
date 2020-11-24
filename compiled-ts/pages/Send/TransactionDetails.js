"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var evaicons_outline_1 = require("@styled-icons/evaicons-outline");
var material_1 = require("@styled-icons/material");
var unchained_bitcoin_1 = require("unchained-bitcoin");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var other_1 = require("../../utils/other");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var files_1 = require("../../utils/files");
var send_1 = require("../../utils/send");
var FeeSelector_1 = require("./FeeSelector");
var ABSURD_FEE = 1000000; // 0.01 BTC
var TransactionDetails = function (_a) {
    var finalPsbt = _a.finalPsbt, sendTransaction = _a.sendTransaction, feeRates = _a.feeRates, currentAccount = _a.currentAccount, signedDevices = _a.signedDevices, setStep = _a.setStep, currentBitcoinPrice = _a.currentBitcoinPrice, createTransactionAndSetState = _a.createTransactionAndSetState, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var _b = react_1.useState(false), optionsDropdownOpen = _b[0], setOptionsDropdownOpen = _b[1];
    var _c = react_1.useState(false), modalIsOpen = _c[0], setModalIsOpen = _c[1];
    var _d = react_1.useState(null), modalContent = _d[0], setModalContent = _d[1];
    var signThreshold = currentAccount.config.quorum.requiredSigners;
    var availableUtxos = currentAccount.availableUtxos;
    console.log('finalPsbt: ', finalPsbt);
    var _fee = send_1.getFee(finalPsbt, currentAccount.transactions);
    var openInModal = function (component) {
        setModalIsOpen(true);
        setModalContent(component);
    };
    var closeModal = function () {
        setModalIsOpen(false);
        setModalContent(null);
    };
    var downloadPsbt = function () { return __awaiter(void 0, void 0, void 0, function () {
        var psbtForDownload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    psbtForDownload = finalPsbt.toBase64();
                    return [4 /*yield*/, files_1.downloadFile(psbtForDownload, files_1.formatFilename('tx', currentBitcoinNetwork, 'psbt'))];
                case 1:
                    _a.sent();
                    openInModal(react_1.default.createElement(PsbtDownloadDetails, null));
                    return [2 /*return*/];
            }
        });
    }); };
    var TransactionOptionsDropdown = function () {
        var dropdownItems = [
            { label: 'Save transaction to file', onClick: function () { downloadPsbt(); } },
        ];
        if (setStep !== undefined && (!signedDevices.length || currentAccount.config.mnemonic)) {
            dropdownItems.unshift({
                label: 'Adjust Fee', onClick: function () {
                    openInModal(react_1.default.createElement(FeeSelector_1.FeeSelector, { currentAccount: currentAccount, finalPsbt: finalPsbt, feeRates: feeRates, availableUtxos: availableUtxos, recipientAddress: finalPsbt.txOutputs[0].address, sendAmount: unchained_bitcoin_1.satoshisToBitcoins(finalPsbt.txOutputs[0].value).toString(), closeModal: closeModal, createTransactionAndSetState: createTransactionAndSetState, currentBitcoinPrice: currentBitcoinPrice }));
                }
            });
        }
        // if we are creating the transaction ourselves, give options for adjustment
        if (setStep !== undefined) {
            dropdownItems.unshift({ label: 'View more details', onClick: function () { openInModal(react_1.default.createElement(TransactionUtxoDetails, null)); } });
        }
        if (setStep !== undefined && !signedDevices.length || currentAccount.config.mnemonic) {
            dropdownItems.unshift({ label: 'Edit Transaction', onClick: function () { return setStep && setStep(0); } });
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(components_1.Dropdown, { isOpen: optionsDropdownOpen, setIsOpen: setOptionsDropdownOpen, minimal: true, dropdownItems: dropdownItems })));
    };
    var PsbtDownloadDetails = function () { return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(ModalHeaderContainer, null, "Download Complete"),
        react_1.default.createElement(ModalBody, null,
            react_1.default.createElement(IconWrapper, { style: { color: colors_1.green } },
                react_1.default.createElement(components_1.StyledIcon, { as: material_1.CheckCircle, size: 100 })),
            react_1.default.createElement(ModalSubtext, null, "Your PSBT file has been saved successfully.")))); };
    var TransactionUtxoDetails = function () {
        var utxosMap;
        if (availableUtxos) {
            utxosMap = send_1.createUtxoMapFromUtxoArray(availableUtxos);
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ModalHeaderContainer, null,
                react_1.default.createElement("span", null, "Transaction Details")),
            react_1.default.createElement(MoreDetailsContainer, null,
                react_1.default.createElement(MoreDetailsSection, null,
                    react_1.default.createElement(MoreDetailsHeader, null, "Inputs"),
                    finalPsbt.txInputs.map(function (input) {
                        var inputBuffer = other_1.cloneBuffer(input.hash);
                        var utxo = utxosMap[inputBuffer.reverse().toString('hex') + ":" + input.index];
                        return (react_1.default.createElement(OutputItem, null,
                            react_1.default.createElement(OutputAddress, null, utxo.address.address),
                            react_1.default.createElement(OutputAmount, null,
                                unchained_bitcoin_1.satoshisToBitcoins(utxo.value).toNumber(),
                                " BTC")));
                    })),
                react_1.default.createElement(MoreDetailsSection, null,
                    react_1.default.createElement(MoreDetailsHeader, { style: { marginTop: '1em' } }, "Outputs"),
                    finalPsbt.txOutputs.map(function (output) { return (react_1.default.createElement(OutputItem, null,
                        react_1.default.createElement(OutputAddress, null, bitcoinjs_lib_1.address.fromOutputScript(output.script, currentBitcoinNetwork)),
                        " ",
                        react_1.default.createElement(OutputAmount, null,
                            unchained_bitcoin_1.satoshisToBitcoins(output.value).toNumber(),
                            " BTC"))); }),
                    react_1.default.createElement(MoreDetailsHeader, { style: { display: 'flex', justifyContent: 'space-between', marginTop: '2em' } },
                        "Fees: ",
                        react_1.default.createElement("span", null,
                            unchained_bitcoin_1.satoshisToBitcoins(_fee).toNumber(),
                            " BTC ($",
                            unchained_bitcoin_1.satoshisToBitcoins(_fee).multipliedBy(currentBitcoinPrice).toFixed(2),
                            ")"))))));
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(AccountSendContentRight, null,
            react_1.default.createElement(components_1.Modal, { isOpen: modalIsOpen, onRequestClose: function () { return closeModal(); } }, modalContent),
            react_1.default.createElement(SendDetailsContainer, null,
                react_1.default.createElement(ModalHeaderContainer, null,
                    react_1.default.createElement("span", null, "Transaction Summary"),
                    react_1.default.createElement(TransactionOptionsDropdown, null)),
                react_1.default.createElement(MainTxData, null,
                    react_1.default.createElement(SendingHeader, { style: { padding: 0 } }, "Sending " + unchained_bitcoin_1.satoshisToBitcoins(finalPsbt.txOutputs[0].value) + " BTC"),
                    react_1.default.createElement(ToField, null, "to"),
                    react_1.default.createElement(RecipientAddressRow, { style: { paddingTop: 0, textAlign: 'right' } }, finalPsbt.txOutputs[0].address)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(TransactionFeeField, null,
                        "Transaction Fee: ",
                        react_1.default.createElement("span", null,
                            unchained_bitcoin_1.satoshisToBitcoins(_fee).toNumber(),
                            " BTC ($",
                            unchained_bitcoin_1.satoshisToBitcoins(_fee).multipliedBy(currentBitcoinPrice).toFixed(2),
                            ")")),
                    _fee >= ABSURD_FEE && react_1.default.createElement(WarningBox, null, "Warning: transaction fee is very high")),
                react_1.default.createElement(SendButton, { sendable: signedDevices.length === signThreshold, background: colors_1.green, color: colors_1.white, onClick: function () { return sendTransaction(); } },
                    signedDevices.length < signThreshold ? "Confirm on Devices (" + signedDevices.length + "/" + signThreshold + ")" : 'Broadcast Transaction',
                    signedDevices.length < signThreshold ? null : (react_1.default.createElement(SendButtonCheckmark, null,
                        react_1.default.createElement(components_1.StyledIcon, { as: evaicons_outline_1.ArrowIosForwardOutline, size: 16 }))))))));
};
var IconWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\n"], ["\n\n"])));
var ModalBody = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  padding: 2.5rem;\n  align-items: center;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  padding: 2.5rem;\n  align-items: center;\n  justify-content: center;\n"])));
var ModalSubtext = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  margin-top: 1rem;\n"], ["\n  color: ", ";\n  margin-top: 1rem;\n"])), colors_1.darkGray);
var ModalHeaderContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n  height: 90px;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n  height: 90px;\n"])));
var SendingHeader = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 1.75em;\n"], ["\n  font-size: 1.75em;\n"])));
var MainTxData = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin: 4em 0 3em;\n  padding-left: 3.5rem;\n  padding-right: 3.5rem;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin: 4em 0 3em;\n  padding-left: 3.5rem;\n  padding-right: 3.5rem;\n"])));
var RecipientAddressRow = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  word-break: break-all;\n  font-size: 1.2em;\n  align-self: center;\n"], ["\n  word-break: break-all;\n  font-size: 1.2em;\n  align-self: center;\n"])));
var AccountSendContentRight = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n"], ["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n"])));
var OutputItem = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  padding: 1.5em;\n  margin: 12px 0;\n  background: ", ";\n  border: 1px solid ", ";\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  padding: 1.5em;\n  margin: 12px 0;\n  background: ", ";\n  border: 1px solid ", ";\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n"])), colors_1.lightGray, colors_1.darkOffWhite);
var OutputAddress = styled_components_1.default.span(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  color: ", ";\n  flex: 2;\n  word-break: break-word;\n"], ["\n  color: ", ";\n  flex: 2;\n  word-break: break-word;\n"])), colors_1.green800);
var OutputAmount = styled_components_1.default.span(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  flex: 1;\n  text-align: right;\n"], ["\n  flex: 1;\n  text-align: right;\n"])));
var MoreDetailsSection = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject([""], [""])));
var MoreDetailsContainer = styled_components_1.default.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  padding: 1.5rem;\n"], ["\n  padding: 1.5rem;\n"])));
var MoreDetailsHeader = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 1.5em;\n"], ["\n  color: ", ";\n  font-size: 1.5em;\n"])), colors_1.darkGray);
var SendDetailsContainer = styled_components_1.default.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  background: ", ";\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  justify-content: space-between;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-radius: 0.375rem;\n"], ["\n  background: ", ";\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  justify-content: space-between;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-radius: 0.375rem;\n"])), colors_1.white);
var ToField = styled_components_1.default.div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  font-size: 1em;\n  padding: 1em 0;\n  display: flex;\n  justify-content: space-between;\n"], ["\n  font-size: 1em;\n  padding: 1em 0;\n  display: flex;\n  justify-content: space-between;\n"])));
var TransactionFeeField = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  font-size: 1em;\n  padding: 1em 0;\n  display: flex;\n  justify-content: space-between;\n  color: ", ";\n  flex-direction: column;\n  align-items: center;\n"], ["\n  font-size: 1em;\n  padding: 1em 0;\n  display: flex;\n  justify-content: space-between;\n  color: ", ";\n  flex-direction: column;\n  align-items: center;\n"])), colors_1.gray);
var SendButton = styled_components_1.default.div(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  ", ";\n  transition: ease-out 0.4s;\n  position: relative;\n  font-size: 1.5em;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  padding-left: 2.5rem;\n  padding-right: 2.5rem;\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  box-shadow: ", ";\n"], ["\n  ", ";\n  transition: ease-out 0.4s;\n  position: relative;\n  font-size: 1.5em;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  padding-left: 2.5rem;\n  padding-right: 2.5rem;\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  box-shadow: ", ";\n"])), components_1.Button, function (p) { return p.sendable ? "inset 1000px 0 0 0 " + colors_1.darkGreen : 'none'; });
var SendButtonCheckmark = styled_components_1.default.div(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  animation: 1s ease infinite ", ";\n"], ["\n  animation: 1s ease infinite ", ";\n"])), components_1.SidewaysShake);
var WarningBox = styled_components_1.default.div(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n  padding: 1.5em;\n  background: ", ";\n  color: ", ";\n  border: 1px solid ", ";\n  margin: 1.5em 0;\n"], ["\n  padding: 1.5em;\n  background: ", ";\n  color: ", ";\n  border: 1px solid ", ";\n  margin: 1.5em 0;\n"])), colors_1.lightOrange, colors_1.orange, colors_1.orange);
exports.default = TransactionDetails;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
//# sourceMappingURL=TransactionDetails.js.map