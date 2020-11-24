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
var unchained_bitcoin_1 = require("unchained-bitcoin");
var material_1 = require("@styled-icons/material");
var components_1 = require("../../components");
var SendTxForm_1 = __importDefault(require("./SendTxForm"));
var components_2 = require("../../components");
var ConfirmTxPage_1 = __importDefault(require("./ConfirmTxPage"));
var AccountMapContext_1 = require("../../AccountMapContext");
var colors_1 = require("../../utils/colors");
var send_1 = require("../../utils/send");
var files_1 = require("../../utils/files");
var Send = function (_a) {
    var config = _a.config, currentBitcoinNetwork = _a.currentBitcoinNetwork, nodeConfig = _a.nodeConfig, currentBitcoinPrice = _a.currentBitcoinPrice;
    document.title = "Send - Lily Wallet";
    var _b = react_1.useState(0), step = _b[0], setStep = _b[1];
    var _c = react_1.useState(undefined), finalPsbt = _c[0], setFinalPsbt = _c[1];
    var _d = react_1.useState({ fastestFee: 0, halfHourFee: 0, hourFee: 0 }), feeRates = _d[0], setFeeRates = _d[1];
    var _e = react_1.useState(false), modalIsOpen = _e[0], setModalIsOpen = _e[1];
    var _f = react_1.useState(null), modalContent = _f[0], setModalContent = _f[1];
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var currentBalance = currentAccount.currentBalance;
    var openInModal = function (component) {
        setModalIsOpen(true);
        setModalContent(component);
    };
    var closeModal = function () {
        setModalIsOpen(false);
        setModalContent(null);
    };
    var createTransactionAndSetState = function (_recipientAddress, _sendAmount, _fee) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, psbt, feeRates_1, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, send_1.createTransaction(currentAccount, _sendAmount, _recipientAddress, _fee, currentBitcoinNetwork)];
                case 1:
                    _a = _b.sent(), psbt = _a.psbt, feeRates_1 = _a.feeRates;
                    setFinalPsbt(psbt);
                    setFeeRates(feeRates_1);
                    return [2 /*return*/, psbt];
                case 2:
                    e_1 = _b.sent();
                    console.log('error: ', e_1);
                    throw new Error(e_1.message);
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var BroadcastModalContent = function (_a) {
        var broadcastedTxId = _a.broadcastedTxId, message = _a.message;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ModalHeaderContainer, null,
                "Transaction ",
                broadcastedTxId ? "Success" : "Failure"),
            react_1.default.createElement(ModalBody, null,
                react_1.default.createElement(IconWrapper, { style: { color: broadcastedTxId ? colors_1.green500 : colors_1.red500 } },
                    react_1.default.createElement(components_2.StyledIcon, { as: broadcastedTxId ? material_1.CheckCircle : material_1.RemoveCircle, size: 100 })),
                react_1.default.createElement(ModalSubtext, null, message),
                broadcastedTxId && react_1.default.createElement(ViewTransactionButton, { color: colors_1.white, background: colors_1.green500, href: unchained_bitcoin_1.blockExplorerTransactionURL(broadcastedTxId, files_1.getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)), target: "_blank" }, "View Transaction"),
                !broadcastedTxId && react_1.default.createElement(ViewTransactionButton, { color: colors_1.white, background: colors_1.red500, onClick: function () { return closeModal(); } }, "Try Again"))));
    };
    var sendTransaction = function () { return __awaiter(void 0, void 0, void 0, function () {
        var signedDevices, broadcastId, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!finalPsbt) return [3 /*break*/, 4];
                    signedDevices = send_1.getSignedDevicesFromPsbt(finalPsbt, currentAccount.config.extendedPublicKeys);
                    if (!(signedDevices.length === currentAccount.config.quorum.requiredSigners)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    finalPsbt.finalizeAllInputs();
                    return [4 /*yield*/, send_1.broadcastTransaction(currentAccount, finalPsbt, nodeConfig, currentBitcoinNetwork)];
                case 2:
                    broadcastId = _a.sent();
                    openInModal(react_1.default.createElement(BroadcastModalContent, { broadcastedTxId: broadcastId, message: 'Your transaction has been broadcast.' }));
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    if (e_2.response) { // error from blockstream
                        openInModal(react_1.default.createElement(BroadcastModalContent, { message: e_2.response.data }));
                    }
                    else { // error somewhere else
                        openInModal(react_1.default.createElement(BroadcastModalContent, { message: e_2.message }));
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(components_1.PageWrapper, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(components_2.Modal, { isOpen: modalIsOpen, onRequestClose: function () { return closeModal(); } }, modalContent),
            react_1.default.createElement(components_1.Header, null,
                react_1.default.createElement(components_1.HeaderLeft, null,
                    react_1.default.createElement(components_1.PageTitle, null, "Send from")),
                react_1.default.createElement(components_1.HeaderRight, null)),
            react_1.default.createElement(components_2.SelectAccountMenu, { config: config }),
            currentAccount.loading && react_1.default.createElement(components_1.Loading, { itemText: 'Send Information' }),
            !currentAccount.loading && step === 0 && (react_1.default.createElement(components_1.GridArea, null,
                react_1.default.createElement(SendTxForm_1.default, { finalPsbt: finalPsbt, setFinalPsbt: setFinalPsbt, createTransactionAndSetState: createTransactionAndSetState, setStep: setStep, currentBitcoinNetwork: currentBitcoinNetwork }),
                react_1.default.createElement(SendContentRight, null,
                    react_1.default.createElement(CurrentBalanceWrapper, null,
                        react_1.default.createElement(CurrentBalanceText, null, "Current Balance:"),
                        react_1.default.createElement(CurrentBalanceValue, null,
                            unchained_bitcoin_1.satoshisToBitcoins(currentBalance).toNumber(),
                            " BTC"))))),
            !currentAccount.loading && finalPsbt && step === 1 && (react_1.default.createElement(ConfirmTxPage_1.default, { finalPsbt: finalPsbt, setFinalPsbt: setFinalPsbt, sendTransaction: sendTransaction, feeRates: feeRates, setStep: setStep, currentBitcoinPrice: currentBitcoinPrice, currentBitcoinNetwork: currentBitcoinNetwork, createTransactionAndSetState: createTransactionAndSetState })))));
};
var SendContentRight = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n"], ["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n"])));
var CurrentBalanceWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 1.5em;\n  display: 'flex';\n  margin-bottom: 1em;\n  flex-direction: column;\n  border-radius: 0.385em;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  background: ", ";\n  text-align: right;\n"], ["\n  padding: 1.5em;\n  display: 'flex';\n  margin-bottom: 1em;\n  flex-direction: column;\n  border-radius: 0.385em;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  background: ", ";\n  text-align: right;\n"])), colors_1.gray400, colors_1.white);
var CurrentBalanceText = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 1.5em;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  color: ", ";\n"])), colors_1.gray600);
var CurrentBalanceValue = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 2em;\n"], ["\n  font-size: 2em;\n"])));
exports.InputStaticText = styled_components_1.default.label(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  flex: 0 0;\n  justify-self: center;\n  align-self: center;\n  margin-left: -87px;\n  z-index: 1;\n  margin-right: 40px;\n  font-size: 1.5em;\n  font-weight: 100;\n  color: ", ";\n\n  &::after {\n    content: ", ";\n    position: absolute;\n    top: 4px;\n    left: 94px;\n    font-family: arial, helvetica, sans-serif;\n    font-size: .75em;\n    display: block;\n    color: rgba(0, 0, 0, 0.6);\n    font-weight: bold;\n  }\n"], ["\n  position: relative;\n  display: flex;\n  flex: 0 0;\n  justify-self: center;\n  align-self: center;\n  margin-left: -87px;\n  z-index: 1;\n  margin-right: 40px;\n  font-size: 1.5em;\n  font-weight: 100;\n  color: ", ";\n\n  &::after {\n    content: ", ";\n    position: absolute;\n    top: 4px;\n    left: 94px;\n    font-family: arial, helvetica, sans-serif;\n    font-size: .75em;\n    display: block;\n    color: rgba(0, 0, 0, 0.6);\n    font-weight: bold;\n  }\n"])), colors_1.gray500, function (p) { return p.text; });
var ModalHeaderContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n  height: 90px;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n  height: 90px;\n"])));
var ModalBody = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  padding: 2.5rem;\n  align-items: center;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  padding: 2.5rem;\n  align-items: center;\n  justify-content: center;\n"])));
var IconWrapper = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n\n"], ["\n\n"])));
var ModalSubtext = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: ", ";\n  margin-top: 1rem;\n"], ["\n  color: ", ";\n  margin-top: 1rem;\n"])), colors_1.gray800);
var ViewTransactionButton = styled_components_1.default.a(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  ", "\n  margin-top: 1em;\n"], ["\n  ", "\n  margin-top: 1em;\n"])), components_2.Button);
exports.default = Send;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=index.js.map