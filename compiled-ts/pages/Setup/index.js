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
var moment_1 = __importDefault(require("moment"));
var bip39_1 = require("bip39");
var files_1 = require("../../utils/files");
var colors_1 = require("../../utils/colors");
var Steps_1 = __importDefault(require("./Steps"));
var PageHeader_1 = __importDefault(require("./PageHeader"));
var SelectAccountScreen_1 = __importDefault(require("./SelectAccountScreen"));
var InputNameScreen_1 = __importDefault(require("./InputNameScreen"));
var NewVaultScreen_1 = __importDefault(require("./NewVaultScreen"));
var SuccessScreen_1 = __importDefault(require("./SuccessScreen"));
var NewWalletScreen_1 = __importDefault(require("./NewWalletScreen"));
var NewHardwareWalletScreen_1 = __importDefault(require("./NewHardwareWalletScreen"));
var Setup = function (_a) {
    var config = _a.config, setConfigFile = _a.setConfigFile, password = _a.password, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    document.title = "Setup - Lily Wallet";
    var _b = react_1.useState(0), setupOption = _b[0], setSetupOption = _b[1];
    var _c = react_1.useState(0), step = _c[0], setStep = _c[1];
    var _d = react_1.useState(''), accountName = _d[0], setAccountName = _d[1];
    var _e = react_1.useState([]), importedDevices = _e[0], setImportedDevices = _e[1];
    var _f = react_1.useState(''), walletMnemonic = _f[0], setWalletMnemonic = _f[1];
    var _g = react_1.useState(1), configRequiredSigners = _g[0], setConfigRequiredSigners = _g[1];
    var _h = react_1.useState(config), localConfig = _h[0], setLocalConfig = _h[1];
    var exportSetupFiles = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var configObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(setupOption === 1)) return [3 /*break*/, 2];
                    return [4 /*yield*/, files_1.createMultisigConfigFile(importedDevices, configRequiredSigners, accountName, config, currentBitcoinNetwork)];
                case 1:
                    configObject = _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    if (!(setupOption === 2)) return [3 /*break*/, 4];
                    return [4 /*yield*/, files_1.createSinglesigConfigFile(walletMnemonic, accountName, config, currentBitcoinNetwork)];
                case 3:
                    configObject = _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, files_1.createSinglesigHWWConfigFile(importedDevices[0], accountName, config, currentBitcoinNetwork)];
                case 5:
                    configObject = _a.sent();
                    _a.label = 6;
                case 6:
                    files_1.saveConfig(configObject, password);
                    setLocalConfig(configObject);
                    return [2 /*return*/];
            }
        });
    }); }, [accountName, config, configRequiredSigners, currentBitcoinNetwork, importedDevices, password, setupOption, walletMnemonic]);
    var downloadColdcardFile = function () { return __awaiter(void 0, void 0, void 0, function () {
        var devicesForCCFile, ccFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!files_1.containsColdcard(importedDevices)) return [3 /*break*/, 2];
                    devicesForCCFile = importedDevices.map(function (device) {
                        return {
                            id: 'abc123',
                            created_at: 1231006505,
                            parentFingerprint: 'abc123',
                            network: 'mainnet',
                            bip32Path: 'abc123',
                            xpub: 'abcs123',
                            device: device
                        };
                    });
                    ccFile = files_1.createColdCardBlob(configRequiredSigners, importedDevices.length, accountName, devicesForCCFile, currentBitcoinNetwork);
                    return [4 /*yield*/, files_1.downloadFile(ccFile, accountName + "-lily-coldcard-file-" + moment_1.default().format('MMDDYYYY') + ".txt")];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        setWalletMnemonic(bip39_1.generateMnemonic(256));
    }, []);
    react_1.useEffect(function () {
        if (step === 3) {
            exportSetupFiles();
        }
        return function () {
            if (step === 3) {
                setConfigFile(__assign({}, localConfig));
            }
        };
    }, [step]); // eslint-disable-line
    var Header = (react_1.default.createElement(PageHeader_1.default, { config: config, headerText: (step === 0) ? 'Select account type' : "" + (setupOption === 2 ? 'Create new wallet' : setupOption === 3 ? 'Manage hardware wallet' : 'Create new vault'), setStep: setStep, step: step }));
    var screen = null;
    switch (step) {
        case 0:
            screen = react_1.default.createElement(SelectAccountScreen_1.default, { header: Header, setSetupOption: setSetupOption, setStep: setStep });
            break;
        case 1:
            screen = react_1.default.createElement(InputNameScreen_1.default, { header: Header, setupOption: setupOption, setStep: setStep, accountName: accountName, setAccountName: setAccountName });
            break;
        case 2:
            if (setupOption === 2) {
                screen = react_1.default.createElement(NewWalletScreen_1.default, { header: Header, walletMnemonic: walletMnemonic, setStep: setStep });
            }
            else if (setupOption === 3) {
                screen = react_1.default.createElement(NewHardwareWalletScreen_1.default, { header: Header, setStep: setStep, importedDevices: importedDevices, setImportedDevices: setImportedDevices, currentBitcoinNetwork: currentBitcoinNetwork });
            }
            else {
                screen = react_1.default.createElement(NewVaultScreen_1.default, { header: Header, setStep: setStep, importedDevices: importedDevices, setImportedDevices: setImportedDevices, setConfigRequiredSigners: setConfigRequiredSigners, configRequiredSigners: configRequiredSigners, currentBitcoinNetwork: currentBitcoinNetwork });
            }
            break;
        case 3:
            screen = react_1.default.createElement(SuccessScreen_1.default, { config: localConfig, downloadColdcardFile: files_1.containsColdcard(importedDevices) && importedDevices.length > 1 ? downloadColdcardFile : undefined });
            break;
        default:
            screen = react_1.default.createElement("div", null, "Unexpected error");
    }
    return (react_1.default.createElement(Wrapper, { step: step },
        step > 0 && react_1.default.createElement(Steps_1.default, { step: step, setupOption: setupOption }),
        screen));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  text-align: left;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  align-items: center;\n  display: flex;\n  flex: 1;\n  justify-content: ", ";\n  flex-direction: column;\n  padding: 0 3em;\n  "], ["\n  text-align: left;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  align-items: center;\n  display: flex;\n  flex: 1;\n  justify-content: ", ";\n  flex-direction: column;\n  padding: 0 3em;\n  "])), colors_1.black, function (p) { return p.step === 0 ? 'center' : 'flex-start'; });
exports.default = Setup;
var templateObject_1;
//# sourceMappingURL=index.js.map