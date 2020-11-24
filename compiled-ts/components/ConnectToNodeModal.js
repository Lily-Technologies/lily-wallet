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
var _1 = require(".");
var colors_1 = require("../utils/colors");
exports.ConnectToNodeModal = function (_a) {
    var isOpen = _a.isOpen, onRequestClose = _a.onRequestClose, setNodeConfig = _a.setNodeConfig;
    var _b = react_1.useState('http://localhost:8332'), host = _b[0], setHost = _b[1];
    var _c = react_1.useState(''), username = _c[0], setUsername = _c[1];
    var _d = react_1.useState(''), password = _d[0], setPassword = _d[1];
    var _e = react_1.useState(''), nodeConnectError = _e[0], setNodeConnectError = _e[1];
    var _f = react_1.useState(false), isLoading = _f[0], setIsLoading = _f[1];
    var configureNode = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setIsLoading(true);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/changeNodeConfig', {
                            nodeConfig: {
                                host: host,
                                username: username,
                                password: password,
                                version: '0.20.1'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    setNodeConfig(response);
                    onRequestClose();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    setNodeConnectError('Error Connecting to Node.');
                    return [3 /*break*/, 3];
                case 3:
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var onInputEnter = function (e) {
        if (e.key === 'Enter') {
            configureNode();
        }
    };
    return (react_1.default.createElement(_1.Modal, { isOpen: isOpen, onRequestClose: onRequestClose },
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ModalHeader, null,
                react_1.default.createElement(HeaderText, null, "Input Node Information")),
            react_1.default.createElement(InputsWrapper, null,
                react_1.default.createElement(InputContainer, { style: { marginTop: '1em' } },
                    react_1.default.createElement(_1.Input, { label: "Host", type: "text", value: host, onChange: setHost, onKeyDown: function (e) { return onInputEnter(e); } })),
                react_1.default.createElement(InputContainer, null,
                    react_1.default.createElement(_1.Input, { label: "Username", type: "text", value: username, onChange: setUsername, onKeyDown: function (e) { return onInputEnter(e); } })),
                react_1.default.createElement(InputContainer, null,
                    react_1.default.createElement(_1.Input, { label: "Password", type: "password", value: password, onChange: setPassword, onKeyDown: function (e) { return onInputEnter(e); } })),
                react_1.default.createElement(SaveButton, { background: colors_1.green600, color: colors_1.white, onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                        var e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, configureNode()];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _a.sent();
                                    console.log('e: ', e_2);
                                    setNodeConnectError('Error Connecting to Node.');
                                    setIsLoading(false);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); } }, isLoading ? react_1.default.createElement(_1.Spinner, null) : 'Connect to Node'),
                nodeConnectError && react_1.default.createElement(ErrorText, null, nodeConnectError)))));
};
var InputContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  margin-bottom: 1em;\n"], ["\n  width: 100%;\n  margin-bottom: 1em;\n"])));
var ModalHeader = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  margin-top: -.5rem;\n  justify-content: space-between;\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid ", ";\n"], ["\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  margin-top: -.5rem;\n  justify-content: space-between;\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid ", ";\n"])), colors_1.gray300);
var HeaderText = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-top: .5rem;\n  font-size: 1.125rem;\n  line-height: 1.5rem;\n  font-weight: 500;\n"], ["\n  margin-top: .5rem;\n  font-size: 1.125rem;\n  line-height: 1.5rem;\n  font-weight: 500;\n"])));
var SaveButton = styled_components_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", ";\n  margin-top: 1.5rem;\n"], ["\n  ", ";\n  margin-top: 1.5rem;\n"])), _1.Button);
var InputsWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 1em 2em 2em;\n"], ["\n  padding: 1em 2em 2em;\n"])));
var ErrorText = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), colors_1.red500);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ConnectToNodeModal.js.map