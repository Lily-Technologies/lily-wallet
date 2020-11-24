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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
var bs58check_1 = require("bs58check");
var react_webcam_barcode_scanner_1 = __importDefault(require("react-webcam-barcode-scanner"));
var components_1 = require("../../components");
var styles_1 = require("./styles");
var other_1 = require("../../utils/other");
var RequiredDevicesModal_1 = __importDefault(require("./RequiredDevicesModal"));
var colors_1 = require("../../utils/colors");
var files_1 = require("../../utils/files");
var NewVaultScreen = function (_a) {
    var header = _a.header, setStep = _a.setStep, importedDevices = _a.importedDevices, setImportedDevices = _a.setImportedDevices, setConfigRequiredSigners = _a.setConfigRequiredSigners, configRequiredSigners = _a.configRequiredSigners, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var _b = react_1.useState(false), selectNumberRequiredModalOpen = _b[0], setSelectNumberRequiredModalOpen = _b[1];
    var _c = react_1.useState([]), availableDevices = _c[0], setAvailableDevices = _c[1];
    var _d = react_1.useState([]), errorDevices = _d[0], setErrorDevices = _d[1];
    var _e = react_1.useState(false), otherImportDropdownOpen = _e[0], setOtherImportDropdownOpen = _e[1];
    var _f = react_1.useState(false), qrScanModalOpen = _f[0], setQrScanModalOpen = _f[1];
    var importDeviceFromFileRef = react_1.useRef(null);
    var importMultisigDevice = function (device, index) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorDevicesCopy, e_1, errorDevicesCopy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/xpub', {
                            deviceType: device.type,
                            devicePath: device.path,
                            path: files_1.getMultisigDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
                        })];
                case 1:
                    response = _a.sent();
                    setImportedDevices(__spreadArrays(importedDevices, [__assign(__assign({}, device), response)]));
                    availableDevices.splice(index, 1);
                    if (errorDevices.includes(device.fingerprint)) {
                        errorDevicesCopy = __spreadArrays(errorDevices);
                        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
                        setErrorDevices(errorDevicesCopy);
                    }
                    setAvailableDevices(__spreadArrays(availableDevices));
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    errorDevicesCopy = __spreadArrays(errorDevices);
                    errorDevicesCopy.push(device.fingerprint);
                    setErrorDevices(__spreadArrays(errorDevicesCopy));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // data comes in as (n/m):somedata1wq42rsdsa
    var importDeviceFromQR = function (_a) {
        var data = _a.data;
        try {
            var _b = data.split(':'), parentFingerprint = _b[0], xpub = _b[1];
            var newDevice = {
                type: 'phone',
                fingerprint: parentFingerprint,
                xpub: xpub,
                model: 'unknown',
                path: 'unknown'
            };
            var updatedImportedDevices = __spreadArrays(importedDevices, [newDevice]);
            setImportedDevices(updatedImportedDevices);
            setAvailableDevices(__spreadArrays(availableDevices.filter(function (item) { return item.type !== 'phone'; })));
            setQrScanModalOpen(false);
        }
        catch (e) {
        }
    };
    // TODO: look at the difference between singleSig and multisigExport files
    var importDeviceFromFile = function (parsedFile) {
        var zpub = bs58check_1.decode(parsedFile.p2wsh);
        var xpub = other_1.zpubToXpub(zpub);
        var newDevice = {
            type: 'coldcard',
            fingerprint: parsedFile.xfp,
            xpub: xpub,
            path: 'unknown',
            model: 'unknown'
        };
        var updatedImportedDevices = __spreadArrays(importedDevices, [newDevice]);
        setImportedDevices(updatedImportedDevices);
    };
    var importMultisigWalletFromFile = function (parsedFile) {
        var numPubKeys = Object.keys(parsedFile).filter(function (key) { return key.startsWith('x'); }).length; // all exports start with x
        var devicesFromFile = [];
        for (var i = 1; i < numPubKeys + 1; i++) {
            var zpub = bs58check_1.decode(parsedFile["x" + i + "/"].xpub);
            var xpub = other_1.zpubToXpub(zpub);
            var newDevice = {
                type: parsedFile["x" + i + "/"].hw_type,
                fingerprint: parsedFile["x" + i + "/"].label.substring(parsedFile["x" + i + "/"].label.indexOf('Coldcard ') + 'Coldcard '.length),
                xpub: xpub,
                model: 'unknown',
                path: 'none'
            };
            devicesFromFile.push(newDevice);
        }
        var updatedImportedDevices = __spreadArrays(importedDevices, devicesFromFile);
        setImportedDevices(updatedImportedDevices);
    };
    return (react_1.default.createElement(styles_1.InnerWrapper, null,
        header,
        react_1.default.createElement(styles_1.FormContainer, null,
            react_1.default.createElement(styles_1.BoxedWrapper, null,
                react_1.default.createElement(components_1.FileUploader, { accept: "*", id: "localConfigFile", onFileLoad: function (_a) {
                        var file = _a.file;
                        var parsedFile = JSON.parse(file);
                        // TODO: should probably have better checking for files to make sure users aren't uploading "weird" files
                        if (parsedFile.seed_version) { // is a multisig file
                            importMultisigWalletFromFile(parsedFile);
                        }
                        else { // is a wallet export file
                            importDeviceFromFile(parsedFile);
                        }
                    } }),
                react_1.default.createElement(ImportFromFileLabel, { htmlFor: "localConfigFile", ref: importDeviceFromFileRef }),
                react_1.default.createElement(components_1.Modal, { isOpen: qrScanModalOpen, onRequestClose: function () { return setQrScanModalOpen(false); } },
                    react_1.default.createElement(react_webcam_barcode_scanner_1.default, { width: 500, height: 500, onUpdate: function (err, result) {
                            if (result)
                                importDeviceFromQR({ data: result.getText() });
                            else
                                return;
                        } })),
                react_1.default.createElement(styles_1.XPubHeaderWrapper, null,
                    react_1.default.createElement(styles_1.SetupHeaderWrapper, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(styles_1.SetupHeader, null, "Connect Devices to Computer"),
                            react_1.default.createElement(styles_1.SetupExplainerText, null, "Devices unlocked and connected to your computer will appear here. Click on them to include them in your vault. You may disconnect a device from your computer after it has been imported.")),
                        react_1.default.createElement(components_1.Dropdown, { isOpen: otherImportDropdownOpen, setIsOpen: setOtherImportDropdownOpen, minimal: true, buttonLabel: 'Other Import Options', dropdownItems: [
                                {
                                    label: "Import from File",
                                    onClick: function () {
                                        var importDeviceFromFile = importDeviceFromFileRef.current;
                                        if (importDeviceFromFile) {
                                            importDeviceFromFile.click();
                                        }
                                    }
                                },
                                {
                                    label: "Import from QR Code",
                                    onClick: function () { return setQrScanModalOpen(true); }
                                }
                            ] }))),
                react_1.default.createElement(components_1.DeviceSelect, { deviceAction: importMultisigDevice, phoneAction: function () { return setQrScanModalOpen(true); }, deviceActionText: 'Click to Configure', deviceActionLoadingText: 'Extracting XPub', configuredDevices: importedDevices, unconfiguredDevices: availableDevices, errorDevices: errorDevices, setUnconfiguredDevices: setAvailableDevices, configuredThreshold: 15 })),
            importedDevices.length > 1 && react_1.default.createElement(ContinueButton, { background: colors_1.green600, color: colors_1.white, onClick: function () {
                    setSelectNumberRequiredModalOpen(true);
                } }, "Finish Adding Devices")),
        react_1.default.createElement(RequiredDevicesModal_1.default, { selectNumberRequiredModalOpen: selectNumberRequiredModalOpen, setSelectNumberRequiredModalOpen: setSelectNumberRequiredModalOpen, numberOfImportedDevices: importedDevices.length, setConfigRequiredSigners: setConfigRequiredSigners, configRequiredSigners: configRequiredSigners, setStep: setStep })));
};
var ContinueButton = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", ";\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  width: 100%;\n"], ["\n  ", ";\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  width: 100%;\n"])), components_1.Button);
var ImportFromFileLabel = styled_components_1.default.label(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: none;\n"], ["\n  display: none;\n"])));
exports.default = NewVaultScreen;
var templateObject_1, templateObject_2;
//# sourceMappingURL=NewVaultScreen.js.map