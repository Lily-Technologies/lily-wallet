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
var styled_components_1 = __importStar(require("styled-components"));
var media_1 = require("../utils/media");
var boxicons_solid_1 = require("@styled-icons/boxicons-solid");
var boxicons_regular_1 = require("@styled-icons/boxicons-regular");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var colors_1 = require("../utils/colors");
var _1 = require(".");
exports.TitleBar = function (_a) {
    var setNodeConfig = _a.setNodeConfig, nodeConfig = _a.nodeConfig, setMobileNavOpen = _a.setMobileNavOpen, config = _a.config, connectToBlockstream = _a.connectToBlockstream, connectToBitcoinCore = _a.connectToBitcoinCore, getNodeConfig = _a.getNodeConfig, resetConfigFile = _a.resetConfigFile;
    var _b = react_1.useState(false), nodeConfigModalOpen = _b[0], setNodeConfigModalOpen = _b[1];
    var _c = react_1.useState(false), moreOptionsDropdownOpen = _c[0], setMoreOptionsDropdownOpen = _c[1];
    var _d = react_1.useState(false), nodeOptionsDropdownOpen = _d[0], setNodeOptionsDropdownOpen = _d[1];
    var _e = react_1.useState(false), configModalOpen = _e[0], setConfigModalOpen = _e[1];
    var _f = react_1.useState(false), licenseModalOpen = _f[0], setLicenseModalOpen = _f[1];
    var refreshNodeData = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNodeConfig()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var nodeConfigDropdownItems = [];
    nodeConfigDropdownItems.push({
        label: (react_1.default.createElement(react_1.Fragment, null,
            "Status: ",
            react_1.default.createElement("br", null),
            nodeConfig && nodeConfig.initialblockdownload && nodeConfig.verificationprogress ? "Initializing (" + new bignumber_js_1.default(nodeConfig.verificationprogress).multipliedBy(100).toFixed(2) + "%)"
                : nodeConfig && nodeConfig.connected ? "Connected via " + nodeConfig.provider
                    : nodeConfig && !nodeConfig.connected ? "Disconnected from " + nodeConfig.provider
                        : 'Connecting...'))
    });
    nodeConfigDropdownItems.push({});
    if (nodeConfig && nodeConfig.blocks) {
        nodeConfigDropdownItems.push({ label: "Block Height: " + (nodeConfig ? nodeConfig.blocks.toLocaleString() : 'Connecting...') });
    }
    nodeConfigDropdownItems.push({ label: 'Refresh Node Info', onClick: function () { refreshNodeData(); } });
    nodeConfigDropdownItems.push({});
    if (nodeConfig && nodeConfig.provider !== 'Bitcoin Core') {
        nodeConfigDropdownItems.push({ label: 'Connect to Bitcoin Core', onClick: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connectToBitcoinCore()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); } });
    }
    if (nodeConfig && nodeConfig.provider !== 'Blockstream') {
        nodeConfigDropdownItems.push({ label: 'Connect to Blockstream', onClick: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connectToBlockstream()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); } });
    }
    nodeConfigDropdownItems.push({ label: 'Connect to Custom Node', onClick: function () { return setNodeConfigModalOpen(true); } });
    var moreOptionsDropdownItems = [
        { label: 'Support', onClick: function () { console.log('foobar'); } },
        { label: 'License', onClick: function () { setLicenseModalOpen(true); } },
        { label: 'View source code', onClick: function () { console.log('foobar2'); } }
    ];
    if (!config.isEmpty) {
        moreOptionsDropdownItems.push({ label: 'Connect to Lily Mobile', onClick: function () { setConfigModalOpen(true); } }, { label: 'Sign out', onClick: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, resetConfigFile()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); }); } });
    }
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(HeightHolder, null),
        react_1.default.createElement(DraggableTitleBar, null,
            react_1.default.createElement(_1.ConnectToNodeModal, { isOpen: nodeConfigModalOpen, onRequestClose: function () { return setNodeConfigModalOpen(false); }, setNodeConfig: setNodeConfig }),
            react_1.default.createElement(_1.ConnectToLilyMobileModal, { isOpen: configModalOpen, onRequestClose: function () { return setConfigModalOpen(false); }, config: config }),
            react_1.default.createElement(_1.LicenseModal, { config: config, isOpen: licenseModalOpen, nodeConfig: nodeConfig, onRequestClose: function () { return setLicenseModalOpen(false); } }),
            react_1.default.createElement(LeftSection, null, !config.isEmpty && (react_1.default.createElement(MobileMenuOpen, { onClick: function () { return setMobileNavOpen(true); } },
                react_1.default.createElement(_1.StyledIcon, { as: boxicons_regular_1.Menu, size: 36 }),
                " Menu"))),
            react_1.default.createElement(RightSection, null,
                react_1.default.createElement(NodeButtonContainer, null,
                    react_1.default.createElement(_1.Dropdown, { isOpen: nodeOptionsDropdownOpen, setIsOpen: setNodeOptionsDropdownOpen, minimal: false, style: { background: colors_1.green900, color: colors_1.white, padding: '0.35em 1em', border: 'none', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center' }, buttonLabel: react_1.default.createElement(react_1.Fragment, null,
                            nodeConfig ? (react_1.default.createElement(_1.StyledIcon, { as: boxicons_solid_1.Circle, style: {
                                    color: (nodeConfig.initialblockdownload) ? colors_1.orange400
                                        : (nodeConfig.connected) ? colors_1.green400
                                            : colors_1.red500,
                                } })) : (react_1.default.createElement(LoadingImage, { alt: "loading placeholder", src: require('../assets/flower-loading.svg') })),
                            nodeConfig && nodeConfig.connected ? null
                                : nodeConfig && !nodeConfig.connected ? null
                                    : 'Connecting...'), dropdownItems: nodeConfigDropdownItems })),
                react_1.default.createElement(DotDotDotContainer, null,
                    react_1.default.createElement(_1.Dropdown, { style: { color: colors_1.white }, isOpen: moreOptionsDropdownOpen, setIsOpen: setMoreOptionsDropdownOpen, minimal: true, dropdownItems: moreOptionsDropdownItems }))))));
};
var LoadingImage = styled_components_1.default.img(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  filter: brightness(0) invert(1);\n  max-width: 1.25em;\n  margin-right: .25em;\n  opacity: 0.9;\n"], ["\n  filter: brightness(0) invert(1);\n  max-width: 1.25em;\n  margin-right: .25em;\n  opacity: 0.9;\n"])));
var LeftSection = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  margin-left: 1em;\n"], ["\n  display: flex;\n  margin-left: 1em;\n"])));
var RightSection = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex: 1;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  flex: 1;\n  justify-content: flex-end;\n"])));
var MobileMenuOpen = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: none;\n  color: ", ";\n  cursor: pointer;\n  margin-left: 3.5em;\n  align-items: center;\n  ", "\n\n"], ["\n  display: none;\n  color: ", ";\n  cursor: pointer;\n  margin-left: 3.5em;\n  align-items: center;\n  ",
    "\n\n"])), colors_1.white, media_1.mobile(styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    display: flex;\n  "], ["\n    display: flex;\n  "])))));
var DotDotDotContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 0 1em 0 0;\n  display: flex;\n  align-items: center;\n  -webkit-app-region: no-drag;\n"], ["\n  margin: 0 1em 0 0;\n  display: flex;\n  align-items: center;\n  -webkit-app-region: no-drag;\n"])));
var DraggableTitleBar = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: fixed;\n  background: ", ";\n  -webkit-user-select: none;\n  -webkit-app-region: drag;\n  height: 2.5rem;\n  width: 100%;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-family: Montserrat, sans-serif;\n"], ["\n  position: fixed;\n  background: ", ";\n  -webkit-user-select: none;\n  -webkit-app-region: drag;\n  height: 2.5rem;\n  width: 100%;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-family: Montserrat, sans-serif;\n"])), colors_1.green800);
var HeightHolder = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  height: 2.5rem;\n  z-index: 0;\n  background: transparent;\n"], ["\n  height: 2.5rem;\n  z-index: 0;\n  background: transparent;\n"])));
var NodeButtonContainer = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin: 0 0.25em;\n  -webkit-app-region: no-drag;\n"], ["\n  margin: 0 0.25em;\n  -webkit-app-region: no-drag;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=TitleBar.js.map