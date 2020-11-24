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
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var unchained_bitcoin_1 = require("unchained-bitcoin");
var components_1 = require("../../components");
var AccountMapContext_1 = require("../../AccountMapContext");
var PastePsbtModalContent_1 = __importDefault(require("./PastePsbtModalContent"));
var files_1 = require("../../utils/files");
var colors_1 = require("../../utils/colors");
var send_1 = require("../../utils/send");
var SendTxForm = function (_a) {
    var setFinalPsbt = _a.setFinalPsbt, finalPsbt = _a.finalPsbt, setStep = _a.setStep, createTransactionAndSetState = _a.createTransactionAndSetState, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var _b = react_1.useState(finalPsbt && finalPsbt.txOutputs[0].address || ''), recipientAddress = _b[0], setRecipientAddress = _b[1];
    var _c = react_1.useState(finalPsbt && unchained_bitcoin_1.satoshisToBitcoins(finalPsbt.txOutputs[0].value).toString() || ''), sendAmount = _c[0], setSendAmount = _c[1];
    var _d = react_1.useState(false), optionsDropdownOpen = _d[0], setOptionsDropdownOpen = _d[1];
    var _e = react_1.useState(false), sendAmountError = _e[0], setSendAmountError = _e[1];
    var _f = react_1.useState(false), recipientAddressError = _f[0], setRecipientAddressError = _f[1];
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var _g = react_1.useState(false), modalIsOpen = _g[0], setModalIsOpen = _g[1];
    var _h = react_1.useState(null), modalContent = _h[0], setModalContent = _h[1];
    var fileUploadLabelRef = react_1.useRef(null);
    var _j = react_1.useState(''), importTxFromFileError = _j[0], setImportTxFromFileError = _j[1];
    var openInModal = function (component) {
        setModalIsOpen(true);
        setModalContent(component);
    };
    var closeModal = function () {
        setModalIsOpen(false);
        setModalContent(null);
    };
    var importTxFromFile = function (file) {
        try {
            var tx = send_1.getPsbtFromText(file);
            setFinalPsbt(tx);
            setImportTxFromFileError('');
            setStep(1);
        }
        catch (e) {
            console.log('catch: ', e);
            console.log('xxxcatch: ', e.message);
            setImportTxFromFileError(e.message);
        }
    };
    var validateForm = function (_recipientAddress, _sendAmount, _currentBalance) {
        var valid = true;
        if (!send_1.validateAddress(_recipientAddress, currentBitcoinNetwork)) {
            valid = false;
            setRecipientAddressError(true);
        }
        if (!send_1.validateSendAmount(_sendAmount, _currentBalance)) {
            valid = false;
            setSendAmountError(true);
        }
        return valid;
    };
    var submitForm = function (_recipientAddress, _sendAmount, _currentBalance) { return __awaiter(void 0, void 0, void 0, function () {
        var valid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    valid = validateForm(_recipientAddress, _sendAmount, _currentBalance);
                    if (!valid) return [3 /*break*/, 2];
                    return [4 /*yield*/, createTransactionAndSetState(_recipientAddress, _sendAmount, new bignumber_js_1.default(0))];
                case 1:
                    _a.sent();
                    setStep(1);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var dropdownItems = [
        {
            label: 'Import from file',
            onClick: function () {
                var txFileUploadButton = fileUploadLabelRef.current;
                if (txFileUploadButton !== null) {
                    txFileUploadButton.click();
                }
            }
        },
        {
            label: 'Import from clipboard',
            onClick: function () {
                setImportTxFromFileError('');
                openInModal(react_1.default.createElement(PastePsbtModalContent_1.default, { setImportTxFromFileError: setImportTxFromFileError, importTxFromFileError: importTxFromFileError, closeModal: closeModal, importTxFromFile: importTxFromFile }));
            }
        }
    ];
    return (react_1.default.createElement(SentTxFormContainer, null,
        react_1.default.createElement(components_1.FileUploader, { accept: "*", id: "txFile", onFileLoad: function (_a) {
                var file = _a.file;
                importTxFromFile(file);
            } }),
        react_1.default.createElement("label", { style: { display: 'none' }, ref: fileUploadLabelRef, htmlFor: "txFile" }),
        react_1.default.createElement(components_1.Modal, { isOpen: modalIsOpen, onRequestClose: function () { return closeModal(); } }, modalContent),
        react_1.default.createElement(components_1.Dropdown, { isOpen: optionsDropdownOpen, setIsOpen: setOptionsDropdownOpen, minimal: true, style: { alignSelf: 'flex-end' }, dropdownItems: dropdownItems }),
        react_1.default.createElement(InputContainer, null,
            react_1.default.createElement(components_1.Input, { label: "Send bitcoin to", type: "text", onChange: setRecipientAddress, value: recipientAddress, placeholder: files_1.bitcoinNetworkEqual(currentBitcoinNetwork, bitcoinjs_lib_1.networks.testnet) ?
                    "tb1q4h5xd5wsalmes2496y8dtphc609rt0un3gl69r" :
                    "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", error: recipientAddressError })),
        react_1.default.createElement(InputContainer, null,
            react_1.default.createElement(components_1.Input, { label: "Amount of bitcoin to send", type: "text", value: sendAmount, onChange: setSendAmount, placeholder: "0.0025", error: sendAmountError, inputStaticText: "BTC" })),
        sendAmountError && react_1.default.createElement(SendAmountError, null, "Not enough funds"),
        react_1.default.createElement(SendButtonContainer, null,
            react_1.default.createElement(CopyAddressButton, { background: colors_1.green600, color: colors_1.white, onClick: function () { return submitForm(recipientAddress, sendAmount, currentAccount.currentBalance); } }, "Preview Transaction"),
            importTxFromFileError && !modalIsOpen && react_1.default.createElement(ErrorText, { style: { paddingTop: '1em' } }, importTxFromFileError))));
};
var SentTxFormContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-height: 400px;\n  padding: 1.5em;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  background: ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  border-radius: 0.385em;\n  justify-content: center;\n  width: 100%;\n"], ["\n  min-height: 400px;\n  padding: 1.5em;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  background: ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  border-radius: 0.385em;\n  justify-content: center;\n  width: 100%;\n"])), colors_1.white, colors_1.gray400);
var SendAmountError = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 0.5em;\n  color: ", ";\n  text-align: right;\n"], ["\n  font-size: 0.5em;\n  color: ", ";\n  text-align: right;\n"])), colors_1.red);
var SendButtonContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 0;\n  display: flex;\n  justify-content: space-between;\n  flex-direction: column;\n"], ["\n  margin-bottom: 0;\n  display: flex;\n  justify-content: space-between;\n  flex-direction: column;\n"])));
var InputContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 1em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 1em;\n"])));
var CopyAddressButton = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", ";\n  flex: 1;\n"], ["\n  ", ";\n  flex: 1;\n"])), components_1.Button);
var ErrorText = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  text-align: center;\n  padding-left: 0;\n  padding-right: 0;\n"], ["\n  color: ", ";\n  text-align: center;\n  padding-left: 0;\n  padding-right: 0;\n"])), colors_1.red);
exports.default = SendTxForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=SendTxForm.js.map