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
var entypo_1 = require("@styled-icons/entypo");
var _1 = require(".");
var colors_1 = require("../utils/colors");
exports.PromptPinModal = function (_a) {
    var device = _a.device, promptPinModalIsOpen = _a.promptPinModalIsOpen, setPromptPinModalDevice = _a.setPromptPinModalDevice, enumerate = _a.enumerate;
    var _b = react_1.useState(''), currentPin = _b[0], setCurrentPin = _b[1];
    var _c = react_1.useState(''), loadingMessage = _c[0], setLoadingMessage = _c[1];
    var _d = react_1.useState(''), promptPinError = _d[0], setPromptPinError = _d[1];
    var closeModal = react_1.useCallback(function () {
        setPromptPinModalDevice(null);
        setPromptPinError('');
    }, [setPromptPinModalDevice]);
    react_1.useEffect(function () {
        function promptPin() {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoadingMessage('Loading Keypad');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, window.ipcRenderer.invoke('/promptpin', {
                                    deviceType: device.type,
                                    devicePath: device.path
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            setPromptPinError('Something went wrong. Please unplug and re-plug in your device until no keypad appears on the screen.');
                            setTimeout(function () { closeModal(); }, 10000);
                            return [3 /*break*/, 4];
                        case 4:
                            setLoadingMessage('');
                            return [2 /*return*/];
                    }
                });
            });
        }
        if (device) {
            promptPin();
        }
    }, [device, closeModal]);
    var addToPin = function (number) {
        if (promptPinError) {
            setPromptPinError('');
        }
        setCurrentPin(currentPin.concat(number.toString()));
    };
    var sendPin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingMessage('Unlocking Device');
                    return [4 /*yield*/, window.ipcRenderer.invoke('/sendpin', {
                            deviceType: device.type,
                            devicePath: device.path,
                            pin: currentPin
                        })];
                case 1:
                    response = _a.sent();
                    setCurrentPin('');
                    if (!response.success) return [3 /*break*/, 3];
                    return [4 /*yield*/, enumerate()];
                case 2:
                    _a.sent();
                    closeModal();
                    return [3 /*break*/, 5];
                case 3:
                    setPromptPinError('Incorrect Pin');
                    return [4 /*yield*/, window.ipcRenderer.invoke('/promptpin', {
                            deviceType: device.type,
                            devicePath: device.path
                        })];
                case 4:
                    _a.sent();
                    setLoadingMessage('');
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var pinItems = []; // KBC-TODO: give this a correct type
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(7); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(8); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(9); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(4); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(5); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(6); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(1); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(2); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    pinItems.push(react_1.default.createElement(PinItem, { onClick: function () { return addToPin(3); } },
        react_1.default.createElement(_1.StyledIcon, { as: entypo_1.DotSingle, size: 25 })));
    var PinInput = function () { return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(PinItemsWrapper, null, pinItems),
        promptPinError && react_1.default.createElement(ErrorText, null, promptPinError),
        react_1.default.createElement(UnlockButton, { background: colors_1.green600, color: colors_1.white, onClick: function () { return sendPin(); } }, "Unlock Device"))); };
    return (react_1.default.createElement(_1.Modal, { isOpen: promptPinModalIsOpen, onRequestClose: function () { return closeModal(); } },
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ModalHeaderContainer, null, "Enter PIN"),
            !!loadingMessage && react_1.default.createElement(_1.Loading, { itemText: "Pinpad", message: loadingMessage }),
            !!!loadingMessage && react_1.default.createElement(PinInput, null))));
};
var ModalHeaderContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"])));
var PinItemsWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: grid;\n  grid-gap: 1px;\n  grid-template-columns: repeat(3, 1fr);\n  padding: 3em;\n"], ["\n  display: grid;\n  grid-gap: 1px;\n  grid-template-columns: repeat(3, 1fr);\n  padding: 3em;\n"])));
var PinItem = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1.25em;\n  margin: .25em;\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 4px;\n  position: relative;\n  text-align: center;\n  cursor: pointer;\n\n  &:hover {\n    border: 1px solid ", ";\n  }\n\n  &:active {\n    border: 1px solid ", ";\n    background: ", ";\n  }\n"], ["\n  padding: 1.25em;\n  margin: .25em;\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 4px;\n  position: relative;\n  text-align: center;\n  cursor: pointer;\n\n  &:hover {\n    border: 1px solid ", ";\n  }\n\n  &:active {\n    border: 1px solid ", ";\n    background: ", ";\n  }\n"])), colors_1.white, colors_1.green500, colors_1.green400, colors_1.green600, colors_1.gray100);
var ErrorText = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  text-align: center;\n  padding-bottom: 1em;\n  margin-top: -2em;\n"], ["\n  color: ", ";\n  text-align: center;\n  padding-bottom: 1em;\n  margin-top: -2em;\n"])), colors_1.red500);
var UnlockButton = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", ";\n  width: 100%;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n"], ["\n  ", ";\n  width: 100%;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n"])), _1.Button);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=PromptPinModal.js.map