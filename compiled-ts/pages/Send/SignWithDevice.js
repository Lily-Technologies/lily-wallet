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
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var SignWithDevice = function (_a) {
    var finalPsbt = _a.finalPsbt, setFinalPsbt = _a.setFinalPsbt, signedDevices = _a.signedDevices, signThreshold = _a.signThreshold, fileUploadLabelRef = _a.fileUploadLabelRef, phoneAction = _a.phoneAction;
    var _b = react_1.useState([]), unsignedDevices = _b[0], setUnsignedDevices = _b[1];
    var _c = react_1.useState([]), errorDevices = _c[0], setErrorDevices = _c[1]; // stores fingerprint of error devices
    var _d = react_1.useState(false), optionsDropdownOpen = _d[0], setOptionsDropdownOpen = _d[1];
    // KBC-TODO: add a test
    var signWithDevice = function (device, index) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorDevicesCopy, e_1, errorDevicesCopy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/sign', {
                            deviceType: device.type,
                            devicePath: device.path,
                            psbt: finalPsbt.toBase64()
                        })];
                case 1:
                    response = _a.sent();
                    setFinalPsbt(bitcoinjs_lib_1.Psbt.fromBase64(response.psbt));
                    if (errorDevices.includes(device.fingerprint)) {
                        errorDevicesCopy = __spreadArrays(errorDevices);
                        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
                        setErrorDevices(errorDevicesCopy);
                    }
                    unsignedDevices.splice(index, 1);
                    setUnsignedDevices(__spreadArrays(unsignedDevices));
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
    var dropdownItems = [
        {
            label: 'Add signature from file',
            onClick: function () {
                var txFileUploadButton = fileUploadLabelRef.current;
                if (txFileUploadButton !== null) {
                    txFileUploadButton.click();
                }
            }
        }
    ];
    return (react_1.default.createElement(TransactionDetailsWrapper, null,
        react_1.default.createElement(SetupHeaderContainer, null,
            react_1.default.createElement(SetupHeaderWrapper, null,
                react_1.default.createElement(SetupHeaderLeft, null,
                    react_1.default.createElement(SetupHeader, null, "Confirm on Devices"),
                    react_1.default.createElement(SetupSubheader, null,
                        signedDevices.length,
                        " of ",
                        signThreshold,
                        " devices confirmed")),
                react_1.default.createElement(SetupHeaderRight, null,
                    react_1.default.createElement(components_1.Dropdown, { isOpen: optionsDropdownOpen, setIsOpen: setOptionsDropdownOpen, minimal: true, dropdownItems: dropdownItems })))),
        react_1.default.createElement(components_1.DeviceSelect, { configuredDevices: signedDevices, unconfiguredDevices: unsignedDevices, deviceAction: signWithDevice, deviceActionText: 'Click to Approve', deviceActionLoadingText: 'Approve on device', setUnconfiguredDevices: setUnsignedDevices, errorDevices: errorDevices, configuredThreshold: signThreshold, phoneAction: phoneAction })));
};
var TransactionDetailsWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  min-height: 400px;\n  justify-content: space-between;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-radius: 0.375rem;\n  background: ", ";\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n"], ["\n  display: flex;\n  flex-direction: column;\n  min-height: 400px;\n  justify-content: space-between;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  border-radius: 0.375rem;\n  background: ", ";\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n"])), colors_1.white);
var SetupHeaderContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  border-bottom: 1px solid rgb(229,231,235);\n  height: 90px;\n"], ["\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  border-bottom: 1px solid rgb(229,231,235);\n  height: 90px;\n"])));
var SetupHeaderWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n"])));
var SetupHeaderLeft = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n"], ["\n  display: flex;\n  flex-direction: column;\n"])));
var SetupHeaderRight = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
var SetupHeader = styled_components_1.default.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 1.5em;\n  display: inline-block;\n  margin-bottom: 4px;\n  font-weight: 100;\n"], ["\n  font-size: 1.5em;\n  display: inline-block;\n  margin-bottom: 4px;\n  font-weight: 100;\n"])));
var SetupSubheader = styled_components_1.default.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 14px;\n  color: ", ";\n"], ["\n  font-size: 14px;\n  color: ", ";\n"])), colors_1.darkGray);
exports.default = SignWithDevice;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=SignWithDevice.js.map