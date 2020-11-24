"use strict";
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
var react_router_dom_1 = require("react-router-dom");
var components_1 = require("../../components");
var VaultView_1 = __importDefault(require("./VaultView"));
var Settings_1 = __importDefault(require("./Settings"));
var VaultHeader_1 = __importDefault(require("./VaultHeader"));
var Vault = function (_a) {
    var config = _a.config, setConfigFile = _a.setConfigFile, password = _a.password, toggleRefresh = _a.toggleRefresh, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    document.title = "Vault - Lily Wallet";
    var path = react_router_dom_1.useRouteMatch().path;
    return (react_1.default.createElement(components_1.PageWrapper, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(VaultHeader_1.default, { toggleRefresh: toggleRefresh }),
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_1.Route, { path: path + "/settings", render: function (props) { return react_1.default.createElement(Settings_1.default, { config: config, setConfigFile: setConfigFile, match: props.match, password: password, currentBitcoinNetwork: currentBitcoinNetwork }); } }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "", render: function () { return react_1.default.createElement(VaultView_1.default, null); } })))));
};
exports.default = Vault;
//# sourceMappingURL=index.js.map