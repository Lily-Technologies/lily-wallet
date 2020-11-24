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
var styled_components_1 = __importStar(require("styled-components"));
var react_router_dom_1 = require("react-router-dom");
var axios_1 = __importDefault(require("axios"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var colors_1 = require("./utils/colors");
var media_1 = require("./utils/media");
var components_1 = require("./components");
// Pages
var Login_1 = __importDefault(require("./pages/Login"));
var Setup_1 = __importDefault(require("./pages/Setup"));
var Settings_1 = __importDefault(require("./pages/Settings"));
var Vault_1 = __importDefault(require("./pages/Vault"));
var Receive_1 = __importDefault(require("./pages/Receive"));
var Send_1 = __importDefault(require("./pages/Send"));
var Home_1 = __importDefault(require("./pages/Home"));
var Purchase_1 = __importDefault(require("./pages/Purchase"));
var AccountMapContext_1 = require("./AccountMapContext");
var emptyConfig = {
    name: "",
    version: "0.0.2",
    isEmpty: true,
    license: {
        trial: true,
        expires: 0
    },
    backup_options: {
        gDrive: false
    },
    wallets: [],
    vaults: [],
    keys: [],
    exchanges: []
};
var App = function () {
    var _a = react_1.useState(new bignumber_js_1.default(0)), currentBitcoinPrice = _a[0], setCurrentBitcoinPrice = _a[1];
    var _b = react_1.useState({}), historicalBitcoinPrice = _b[0], setHistoricalBitcoinPrice = _b[1];
    var _c = react_1.useState(emptyConfig), config = _c[0], setConfigFile = _c[1];
    var _d = react_1.useState(null), encryptedConfigFile = _d[0], setEncryptedConfigFile = _d[1];
    var _e = react_1.useState(bitcoinjs_lib_1.networks.bitcoin), currentBitcoinNetwork = _e[0], setCurrentBitcoinNetwork = _e[1];
    var _f = react_1.useState(false), refresh = _f[0], setRefresh = _f[1];
    var _g = react_1.useState(true), flyInAnimation = _g[0], setInitialFlyInAnimation = _g[1];
    var _h = react_1.useState(undefined), nodeConfig = _h[0], setNodeConfig = _h[1];
    var _j = react_1.useState(false), mobileNavOpen = _j[0], setMobileNavOpen = _j[1];
    var _k = react_1.useState(''), password = _k[0], setPassword = _k[1];
    var _l = react_1.useState(false), purchaseLicenseModalOpen = _l[0], setPurchaseLicenseModalOpen = _l[1];
    var _m = react_1.useContext(AccountMapContext_1.AccountMapContext), setAccountMap = _m.setAccountMap, updateAccountMap = _m.updateAccountMap, accountMap = _m.accountMap;
    console.log('accountMap: ', accountMap);
    var ConfigRequired = function () {
        var pathname = react_router_dom_1.useLocation().pathname;
        var history = react_router_dom_1.useHistory();
        if (config.isEmpty && (pathname !== '/login')) {
            history.push('/login');
        }
        return null;
    };
    var Overlay = function () {
        var pathname = react_router_dom_1.useLocation().pathname;
        if (!config.isEmpty && (pathname !== '/setup')) {
            return react_1.default.createElement(ColorOverlap, null);
        }
        return null;
    };
    var toggleRefresh = function () {
        setRefresh(!refresh);
    };
    var resetConfigFile = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, file, modifiedTime;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setConfigFile(emptyConfig);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/get-config')];
                case 1:
                    _a = _b.sent(), file = _a.file, modifiedTime = _a.modifiedTime;
                    setEncryptedConfigFile({ file: file.toString(), modifiedTime: modifiedTime });
                    setInitialFlyInAnimation(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var connectToBlockstream = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNodeConfig(undefined);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/changeNodeConfig', {
                            nodeConfig: {
                                provider: 'Blockstream'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    setNodeConfig(response);
                    return [2 /*return*/];
            }
        });
    }); };
    var connectToBitcoinCore = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setNodeConfig(undefined);
                    return [4 /*yield*/, window.ipcRenderer.invoke('/changeNodeConfig', {
                            nodeConfig: {
                                provider: 'Bitcoin Core'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    setNodeConfig(response);
                    return [2 /*return*/];
            }
        });
    }); };
    var getNodeConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, window.ipcRenderer.invoke('/getNodeConfig')];
                case 1:
                    response = _a.sent();
                    setNodeConfig(response);
                    return [2 /*return*/];
            }
        });
    }); };
    var prevSetFlyInAnimation = react_1.useRef();
    react_1.useEffect(function () {
        prevSetFlyInAnimation.current = flyInAnimation;
    });
    react_1.useEffect(function () {
        function getConfig() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, file, modifiedTime, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!config.isEmpty) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, window.ipcRenderer.invoke('/get-config')];
                        case 2:
                            _a = _b.sent(), file = _a.file, modifiedTime = _a.modifiedTime;
                            setEncryptedConfigFile({ file: file.toString(), modifiedTime: modifiedTime });
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        getConfig();
    }, [config.isEmpty]);
    react_1.useEffect(function () {
        function fetchBitcoinNetwork() {
            return __awaiter(this, void 0, void 0, function () {
                var bitcoinNetwork;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, window.ipcRenderer.invoke('/bitcoin-network')];
                        case 1:
                            bitcoinNetwork = _a.sent();
                            setCurrentBitcoinNetwork(bitcoinNetwork);
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchBitcoinNetwork();
    }, []);
    react_1.useEffect(function () {
        if (!config.isEmpty) {
            setTimeout(function () {
                setInitialFlyInAnimation(false);
            }, 100);
        }
    }, [config]);
    react_1.useEffect(function () {
        function fetchCurrentBitcoinPrice() {
            return __awaiter(this, void 0, void 0, function () {
                var currentBitcoinPrice;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.get('https://api.coindesk.com/v1/bpi/currentprice.json')];
                        case 1: return [4 /*yield*/, (_a.sent()).data.bpi.USD.rate];
                        case 2:
                            currentBitcoinPrice = _a.sent();
                            setCurrentBitcoinPrice(new bignumber_js_1.default(currentBitcoinPrice.replace(',', '')));
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchCurrentBitcoinPrice();
    }, []);
    react_1.useEffect(function () {
        function fetchHistoricalBTCPrice() {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, window.ipcRenderer.invoke('/historical-btc-price')];
                        case 1:
                            response = _a.sent();
                            setHistoricalBitcoinPrice(response);
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _a.sent();
                            console.log('Error retrieving historical bitcoin price');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        fetchHistoricalBTCPrice();
    }, []);
    react_1.useEffect(function () {
        function fetchNodeConfig() {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, window.ipcRenderer.invoke('/getNodeConfig')];
                        case 1:
                            response = _a.sent();
                            setNodeConfig(response);
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _a.sent();
                            console.log(e_3.message);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        fetchNodeConfig();
    }, []);
    // fetch/build account data from config file
    react_1.useEffect(function () {
        if (config.wallets.length || config.vaults.length) {
            var initialAccountMap = {};
            for (var i = 0; i < config.wallets.length; i++) {
                initialAccountMap[config.wallets[i].id] = {
                    name: config.wallets[i].name,
                    config: config.wallets[i],
                    transactions: [],
                    unusedAddresses: [],
                    addresses: [],
                    changeAddresses: [],
                    availableUtxos: [],
                    unusedChangeAddresses: [],
                    currentBalance: 0,
                    loading: true
                };
                window.ipcRenderer.send('/account-data', { config: config.wallets[i], nodeConfig: nodeConfig }); // TODO: allow setting nodeConfig to be dynamic later
            }
            for (var i = 0; i < config.vaults.length; i++) {
                initialAccountMap[config.vaults[i].id] = {
                    name: config.vaults[i].name,
                    config: config.vaults[i],
                    transactions: [],
                    unusedAddresses: [],
                    addresses: [],
                    changeAddresses: [],
                    availableUtxos: [],
                    unusedChangeAddresses: [],
                    currentBalance: 0,
                    loading: true
                };
                window.ipcRenderer.send('/account-data', { config: config.vaults[i], nodeConfig: nodeConfig }); // TODO: allow setting nodeConfig to be dynamic later
            }
            window.ipcRenderer.on('/account-data', function (_event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var accountInfo = args[0];
                updateAccountMap(__assign(__assign({}, accountInfo), { loading: false }));
            });
            setAccountMap(initialAccountMap);
        }
    }, [config, refresh, nodeConfig, setAccountMap, updateAccountMap]);
    return (react_1.default.createElement(react_router_dom_1.HashRouter, null,
        react_1.default.createElement(components_1.ScrollToTop, null),
        react_1.default.createElement(components_1.TitleBar, { setNodeConfig: setNodeConfig, nodeConfig: nodeConfig, setMobileNavOpen: setMobileNavOpen, config: config, connectToBlockstream: connectToBlockstream, connectToBitcoinCore: connectToBitcoinCore, getNodeConfig: getNodeConfig, resetConfigFile: resetConfigFile }),
        !config.isEmpty && nodeConfig && (config.license.expires - nodeConfig.blocks < 840) && react_1.default.createElement(components_1.AlertBar, { config: config, nodeConfig: nodeConfig }),
        react_1.default.createElement(PageWrapper, { id: "page-wrapper" },
            react_1.default.createElement(ConfigRequired, null),
            react_1.default.createElement(Overlay, null),
            !config.isEmpty && react_1.default.createElement(components_1.Sidebar, { config: config, flyInAnimation: flyInAnimation, currentBitcoinNetwork: currentBitcoinNetwork }),
            !config.isEmpty && react_1.default.createElement(components_1.MobileNavbar, { mobileNavOpen: mobileNavOpen, setMobileNavOpen: setMobileNavOpen, config: config, currentBitcoinNetwork: currentBitcoinNetwork }),
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_1.Route, { path: "/vault/:id", render: function () { return react_1.default.createElement(Vault_1.default, { config: config, setConfigFile: setConfigFile, password: password, toggleRefresh: toggleRefresh, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/receive", render: function () { return react_1.default.createElement(Receive_1.default, { config: config }); } }),
                nodeConfig && react_1.default.createElement(react_router_dom_1.Route, { path: "/send", render: function () { return react_1.default.createElement(Send_1.default, { config: config, currentBitcoinPrice: currentBitcoinPrice, nodeConfig: nodeConfig, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/setup", render: function () { return react_1.default.createElement(Setup_1.default, { config: config, setConfigFile: setConfigFile, password: password, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/login", render: function () { return react_1.default.createElement(Login_1.default, { config: config, setConfigFile: setConfigFile, setPassword: setPassword, encryptedConfigFile: encryptedConfigFile, setEncryptedConfigFile: setEncryptedConfigFile, currentBlockHeight: nodeConfig && nodeConfig.blocks, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/settings", render: function () { return react_1.default.createElement(Settings_1.default, { config: config, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/purchase", render: function () { return react_1.default.createElement(Purchase_1.default, { currentBitcoinPrice: currentBitcoinPrice, password: password, config: config, setConfig: setConfigFile, nodeConfig: nodeConfig, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/", render: function () { return react_1.default.createElement(Home_1.default, { flyInAnimation: flyInAnimation, prevFlyInAnimation: prevSetFlyInAnimation.current, historicalBitcoinPrice: historicalBitcoinPrice, currentBitcoinPrice: currentBitcoinPrice }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/", render: function () { return (react_1.default.createElement("div", null, "Not Found")); } })))));
};
var ColorOverlap = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-image: ", ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 35vh;\n  background-color: ", ";\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n"], ["\n  background-image: ", ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 35vh;\n  background-color: ", ";\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n"])), "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%2338a169' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E\")", colors_1.green700);
var PageWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  height: 100%;\n  display: flex;\n  font-family: 'Raleway', sans-serif;\n  flex: 1;\n  background: ", ";\n\n  ", ";\n"], ["\n  height: 100%;\n  display: flex;\n  font-family: 'Raleway', sans-serif;\n  flex: 1;\n  background: ", ";\n\n  ",
    ";\n"])), colors_1.offWhite, media_1.mobile(styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    flex-direction: column;\n  "], ["\n    flex-direction: column;\n  "])))));
exports.default = App;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=App.js.map