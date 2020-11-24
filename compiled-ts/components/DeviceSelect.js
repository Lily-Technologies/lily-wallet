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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var material_1 = require("@styled-icons/material");
var bootstrap_1 = require("@styled-icons/bootstrap");
var components_1 = require("../components");
var colors_1 = require("../utils/colors");
exports.DeviceSelect = function (_a) {
    var configuredDevices = _a.configuredDevices, unconfiguredDevices = _a.unconfiguredDevices, errorDevices = _a.errorDevices, setUnconfiguredDevices = _a.setUnconfiguredDevices, configuredThreshold = _a.configuredThreshold, deviceAction = _a.deviceAction, deviceActionText = _a.deviceActionText, deviceActionLoadingText = _a.deviceActionLoadingText, phoneAction = _a.phoneAction;
    var _b = react_1.useState(false), devicesLoading = _b[0], setDevicesLoading = _b[1];
    var _c = react_1.useState(null), deviceActionLoading = _c[0], setDeviceActionLoading = _c[1];
    var _d = react_1.useState(null), promptPinModalDevice = _d[0], setPromptPinModalDevice = _d[1];
    react_1.useEffect(function () {
        enumerate();
    }, []); // eslint-disable-line
    var enumerate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, filteredDevices, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setDevicesLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/enumerate')];
                case 2:
                    response = _a.sent();
                    setDevicesLoading(false);
                    if (phoneAction) {
                        response.push({
                            type: 'phone',
                            fingerprint: 'unknown',
                            xpub: 'unknown',
                            model: 'unknown',
                            path: 'unknown'
                        });
                    }
                    filteredDevices = response.filter(function (device) {
                        var deviceAlreadyConfigured = false;
                        for (var i = 0; i < configuredDevices.length; i++) {
                            if (configuredDevices[i].fingerprint === device.fingerprint) {
                                deviceAlreadyConfigured = true;
                            }
                            else if (device.type === 'phone' && configuredDevices[i].type === 'phone') { // there can only be one phone in a config
                                deviceAlreadyConfigured = true;
                            }
                        }
                        if (!deviceAlreadyConfigured) {
                            return device;
                        }
                    });
                    setUnconfiguredDevices(filteredDevices);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log('e: ', e_1);
                    setDevicesLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var performDeviceAction = function (device, index) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setDeviceActionLoading(index);
                    return [4 /*yield*/, deviceAction(device, index)];
                case 1:
                    _a.sent();
                    setDeviceActionLoading(null);
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(components_1.PromptPinModal, { promptPinModalIsOpen: !!promptPinModalDevice, setPromptPinModalDevice: setPromptPinModalDevice, device: promptPinModalDevice, enumerate: enumerate }),
        react_1.default.createElement(DevicesWrapper, null,
            configuredDevices.map(function (device, index) { return (react_1.default.createElement(DeviceWrapper, { key: index, imported: true, displayLoadingCursor: deviceActionLoading !== null },
                react_1.default.createElement(IconWrapper, { style: { color: colors_1.green } },
                    react_1.default.createElement(components_1.StyledIcon, { as: material_1.CheckCircle, size: 24 })),
                react_1.default.createElement(DeviceImage, { src: device.type === 'coldcard' ? require('../assets/coldcard.png')
                        : device.type === 'ledger' ? require('../assets/ledger.png')
                            : device.type === 'trezor' ? require('../assets/trezor.png')
                                : require('../assets/iphone.png') }),
                react_1.default.createElement(DeviceInfoWrapper, null,
                    react_1.default.createElement(DeviceName, null, device.type),
                    react_1.default.createElement(DeviceFingerprint, { imported: true }, device.fingerprint)))); }),
            unconfiguredDevices.map(function (device, index) {
                var deviceError = errorDevices.includes(device.fingerprint);
                var deviceWarning = !device.fingerprint && device.type !== 'phone'; // if ledger isn't in the BTC app or trezor is locked, it wont give fingerprint, so show warning
                return (react_1.default.createElement(DeviceWrapper, { key: index, loading: deviceActionLoading !== null && deviceActionLoading === index, onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(deviceActionLoading === null)) return [3 /*break*/, 5];
                                    if (!deviceWarning) return [3 /*break*/, 4];
                                    if (!(device.type === 'trezor')) return [3 /*break*/, 1];
                                    setPromptPinModalDevice(device);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, enumerate()];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 5];
                                case 4:
                                    if (device.type === 'phone' && phoneAction !== undefined) {
                                        phoneAction();
                                    }
                                    else {
                                        performDeviceAction(device, index);
                                    }
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, warning: deviceWarning, error: deviceError, displayLoadingCursor: deviceActionLoading !== null },
                    (deviceError || deviceWarning) && (react_1.default.createElement(IconWrapper, { style: { color: colors_1.red } },
                        react_1.default.createElement(components_1.StyledIcon, { as: bootstrap_1.ExclamationDiamond, size: 24 }))),
                    react_1.default.createElement(DeviceImage, { src: device.type === 'coldcard' ? require('../assets/coldcard.png')
                            : device.type === 'ledger' ? require('../assets/ledger.png')
                                : device.type === 'trezor' ? require('../assets/trezor.png')
                                    : require('../assets/iphone.png') }),
                    react_1.default.createElement(DeviceInfoWrapper, null,
                        react_1.default.createElement(DeviceName, null, device.type),
                        react_1.default.createElement(DeviceFingerprint, { imported: false }, device.fingerprint),
                        react_1.default.createElement(ImportedWrapper, null, deviceActionLoading === index ? (react_1.default.createElement(ConfiguringText, { error: deviceError, style: { textAlign: 'center' } },
                            deviceActionLoadingText,
                            react_1.default.createElement(ConfiguringAnimation, null, "."),
                            react_1.default.createElement(ConfiguringAnimation, null, "."),
                            react_1.default.createElement(ConfiguringAnimation, null, "."))) : deviceError || deviceWarning ? (react_1.default.createElement(ConfiguringText, { error: true, warning: deviceWarning }, deviceError ? 'Click to Retry' : device.type === 'ledger' ? 'Open Bitcoin App on Device' : 'Click to enter PIN')) : (react_1.default.createElement(ConfiguringText, null, deviceActionText))))));
            }),
            unconfiguredDevices.length === 0 && configuredDevices.length === 0 && !devicesLoading && (react_1.default.createElement(NoDevicesContainer, null,
                react_1.default.createElement(NoDevicesWrapper, null,
                    react_1.default.createElement(NoDevicesHeader, null, "No devices detected"),
                    react_1.default.createElement(components_1.StyledIcon, { as: bootstrap_1.ExclamationDiamond, size: 96 }),
                    react_1.default.createElement(NoDevicesSubheader, null, "Please make sure your device is connected and unlocked.")))),
            unconfiguredDevices.length === 0 && configuredDevices.length === 0 && devicesLoading && (react_1.default.createElement(LoadingDevicesWrapper, null,
                react_1.default.createElement(LoadingImage, { src: require('../assets/flower-loading.svg'), style: { maxWidth: '6.25em' }, alt: "loading" }),
                react_1.default.createElement(LoadingText, null, "Loading Devices"),
                react_1.default.createElement(LoadingSubText, null, "Please wait...")))),
        configuredDevices.length < configuredThreshold && react_1.default.createElement(ScanDevicesButton, { background: colors_1.white, color: colors_1.green800, onClick: enumerate }, devicesLoading ? 'Updating Device List...' : 'Scan for devices')));
};
var LoadingImage = styled_components_1.default.img(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.gray900);
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  background: ", ";\n  justify-content: center;\n  height: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  background: ", ";\n  justify-content: center;\n  height: 100%;\n"])), colors_1.white);
var NoDevicesContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])));
var NoDevicesWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: ", ";\n  text-align: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: ", ";\n  text-align: center;\n"])), colors_1.gray900);
var LoadingDevicesWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 1.5em;\n  justify-content: center;\n  color: ", ";\n  text-align: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 1.5em;\n  justify-content: center;\n  color: ", ";\n  text-align: center;\n"])), colors_1.darkGray);
var NoDevicesHeader = styled_components_1.default.h3(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-weight: 100;\n"], ["\n  font-weight: 100;\n"])));
var NoDevicesSubheader = styled_components_1.default.h4(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-weight: 100;\n"], ["\n  font-weight: 100;\n"])));
var ConfiguringText = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n  font-size: ", ";\n  text-align: center;\n"], ["\n  color: ", ";\n  font-size: ", ";\n  text-align: center;\n"])), function (p) { return p.error ? colors_1.gray600 : colors_1.darkGray; }, function (p) { return p.warning ? '0.75em' : '1em'; });
var DevicesWrapper = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n  margin-bottom: 1.25em;\n  margin-top: 1.25em;\n  overflow: scroll;\n"], ["\n  display: flex;\n  justify-content: center;\n  margin-bottom: 1.25em;\n  margin-top: 1.25em;\n  overflow: scroll;\n"])));
var DeviceInfoWrapper = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n"], ["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n"])));
var IconWrapper = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  position: absolute;\n  align-self: flex-end;\n  top: 0.65em;\n"], ["\n  position: absolute;\n  align-self: flex-end;\n  top: 0.65em;\n"])));
var DeviceWrapper = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: center;\n  padding: .75em;\n  margin: 1.5em;\n  margin-bottom: 0px;\n  flex: 0 1 15.625em;\n  border-radius: 4px;\n  position: relative;\n  animation-name: ", ";\n  animation-duration: 1.4s;\n  animation-iteration-count: infinite;\n  animation-fill-mode: both;\n\n  background: ", ";\n  border: ", ";\n\n  &:hover {\n    cursor: ", ";\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  align-items: center;\n  padding: .75em;\n  margin: 1.5em;\n  margin-bottom: 0px;\n  flex: 0 1 15.625em;\n  border-radius: 4px;\n  position: relative;\n  animation-name: ", ";\n  animation-duration: 1.4s;\n  animation-iteration-count: infinite;\n  animation-fill-mode: both;\n\n  background: ", ";\n  border: ", ";\n\n  &:hover {\n    cursor: ", ";\n"])), function (p) { return p.loading ? blinking : 'none'; }, function (p) { return p.imported ? colors_1.lightGreen : p.error ? colors_1.lightRed : p.warning ? colors_1.lightYellow : 'none'; }, function (p) { return p.imported ? "1px solid " + colors_1.green : p.error ? "1px solid " + colors_1.red : p.warning ? "1px solid " + colors_1.yellow : '1px solid transparent'; }, function (p) { return p.displayLoadingCursor ? 'wait' : 'pointer'; });
var DeviceImage = styled_components_1.default.img(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  display: block;\n  width: auto;\n  height: auto;\n  max-height: 250px;\n  max-width: 6.25em;\n"], ["\n  display: block;\n  width: auto;\n  height: auto;\n  max-height: 250px;\n  max-width: 6.25em;\n"])));
var DeviceName = styled_components_1.default.h4(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  text-transform: capitalize;\n  margin-bottom: 2px;\n  font-weight: 500;\n"], ["\n  text-transform: capitalize;\n  margin-bottom: 2px;\n  font-weight: 500;\n"])));
var DeviceFingerprint = styled_components_1.default.h5(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  color: ", ";\n  margin: 0;\n  font-weight: 100;\n"], ["\n  color: ", ";\n  margin: 0;\n  font-weight: 100;\n"])), function (p) { return p.imported ? colors_1.darkGray : colors_1.gray; });
var LoadingText = styled_components_1.default.div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 4px 0;\n"], ["\n  font-size: 1.5em;\n  margin: 4px 0;\n"])));
var LoadingSubText = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n    font-size: .75em;\n"], ["\n    font-size: .75em;\n"])));
var ImportedWrapper = styled_components_1.default.div(templateObject_18 || (templateObject_18 = __makeTemplateObject([""], [""])));
var ScanDevicesButton = styled_components_1.default.button(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  ", ";\n  padding: 1em;\n  font-size: 1em;\n  width: fit-content;\n  align-self: center;\n  border: 1px solid ", ";\n  margin-bottom: 1em;\n"], ["\n  ", ";\n  padding: 1em;\n  font-size: 1em;\n  width: fit-content;\n  align-self: center;\n  border: 1px solid ", ";\n  margin-bottom: 1em;\n"])), components_1.Button, colors_1.green800);
var blinking = styled_components_1.keyframes(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n  0% { opacity: .2; }\n  50% { opacity: 1; }\n  100% { opacity: .2; }\n"], ["\n  0% { opacity: .2; }\n  50% { opacity: 1; }\n  100% { opacity: .2; }\n"])));
var ConfiguringAnimation = styled_components_1.default.span(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n  animation-name: ", ";\n  animation-duration: 1.4s;\n  animation-iteration-count: infinite;\n  animation-fill-mode: both;\n\n  // &:nth-child(2) {\n  //   animation-delay: .2s;\n  // }\n\n  // &:nth-child(3) {\n  //   animation-delay: .4s;\n  // }\n"], ["\n  animation-name: ", ";\n  animation-duration: 1.4s;\n  animation-iteration-count: infinite;\n  animation-fill-mode: both;\n\n  // &:nth-child(2) {\n  //   animation-delay: .2s;\n  // }\n\n  // &:nth-child(3) {\n  //   animation-delay: .4s;\n  // }\n"])), blinking);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21;
//# sourceMappingURL=DeviceSelect.js.map