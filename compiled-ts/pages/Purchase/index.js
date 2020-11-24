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
var axios_1 = __importDefault(require("axios"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var components_1 = require("../../components");
var ConfirmTxPage_1 = __importDefault(require("../../pages/Send/ConfirmTxPage"));
var AccountMapContext_1 = require("../../AccountMapContext");
var send_1 = require("../../utils/send");
var files_1 = require("../../utils/files");
var colors_1 = require("../../utils/colors");
var PurchasePage = function (_a) {
    var currentBitcoinNetwork = _a.currentBitcoinNetwork, currentBitcoinPrice = _a.currentBitcoinPrice, config = _a.config, setConfig = _a.setConfig, password = _a.password, nodeConfig = _a.nodeConfig;
    var _b = react_1.useState(0), step = _b[0], setStep = _b[1];
    var _c = react_1.useState(undefined), finalPsbt = _c[0], setFinalPsbt = _c[1];
    var _d = react_1.useState({ fastestFee: 0, halfHourFee: 0, hourFee: 0 }), feeRates = _d[0], setFeeRates = _d[1];
    var _e = react_1.useState(''), childPath = _e[0], setChildPath = _e[1];
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var createLicenseTransaction = function (_recipientAddress, _sendAmount, _fee) { return __awaiter(void 0, void 0, void 0, function () {
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
                    setStep(1);
                    return [2 /*return*/, psbt];
                case 2:
                    e_1 = _b.sent();
                    throw new Error(e_1.message);
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var clickRenewLicense = function (level) { return __awaiter(void 0, void 0, void 0, function () {
        var data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('hits clickRenewLicense:  ', level);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(process.env.REACT_APP_LILY_ENDPOINT + "/payment-address")];
                case 2:
                    data = (_a.sent()).data;
                    createLicenseTransaction(data.address, data[level], new bignumber_js_1.default(0));
                    setChildPath(data.childPath);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.log('e: ', e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var confirmTxWithLilyThenSend = function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqBody, data, configCopy, _a, expires, txId, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    finalPsbt.finalizeAllInputs();
                    reqBody = { childPath: childPath, tx: finalPsbt.toBase64() };
                    return [4 /*yield*/, axios_1.default.post(process.env.REACT_APP_LILY_ENDPOINT + "/tx", reqBody)];
                case 1:
                    data = (_b.sent()).data;
                    configCopy = __assign({}, config);
                    _a = data.license.split(':'), expires = _a[0], txId = _a[1];
                    configCopy.license = __assign(__assign({}, data), { trial: false, expires: expires,
                        txId: txId });
                    return [4 /*yield*/, send_1.broadcastTransaction(currentAccount, finalPsbt, nodeConfig, currentBitcoinNetwork)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, files_1.saveConfig(configCopy, password)];
                case 3:
                    _b.sent();
                    setConfig(configCopy);
                    setStep(2);
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _b.sent();
                    console.log('e: ', e_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(components_1.PageWrapper, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(components_1.Header, null,
                react_1.default.createElement(components_1.HeaderLeft, null,
                    react_1.default.createElement(components_1.PageTitle, null, "Purchase a license")),
                react_1.default.createElement(Buttons, null,
                    react_1.default.createElement(RenewButton, { color: colors_1.gray900, background: colors_1.white }, "Questions? Call (970) 425-0282"))),
            step === 0 && (react_1.default.createElement(components_1.PricingPlanTable, { clickRenewLicense: clickRenewLicense })),
            step === 1 && (react_1.default.createElement(ConfirmTxPage_1.default, { finalPsbt: finalPsbt, sendTransaction: confirmTxWithLilyThenSend, setFinalPsbt: setFinalPsbt, feeRates: feeRates, setStep: setStep, currentBitcoinPrice: currentBitcoinPrice, currentBitcoinNetwork: currentBitcoinNetwork, createTransactionAndSetState: createLicenseTransaction })),
            step === 2 && (react_1.default.createElement(components_1.PurchaseLicenseSuccess, { config: config, nodeConfig: nodeConfig })))));
};
// const ModalContent = styled.div<{ step: number }>`
//   padding: 2em 0;
//   background: ${p => p.step === 1 ? gray100 : white};
//   border-radius: 0.385em;
//   box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
// `;
var Buttons = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 1em;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 1em;\n"])));
var RenewButton = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  marginRight: 1em;\n"], ["\n  ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid ", ";\n  marginRight: 1em;\n"])), components_1.Button, colors_1.gray400);
exports.default = PurchasePage;
var templateObject_1, templateObject_2;
//# sourceMappingURL=index.js.map