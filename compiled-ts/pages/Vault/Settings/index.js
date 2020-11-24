"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var GeneralView_1 = __importDefault(require("./GeneralView"));
var AddressesView_1 = __importDefault(require("./AddressesView"));
var UtxosView_1 = __importDefault(require("./UtxosView"));
var ExportView_1 = __importDefault(require("./ExportView"));
var SettingsTabs_1 = __importDefault(require("./SettingsTabs"));
var components_1 = require("../../../components");
var colors_1 = require("../../../utils/colors");
var media_1 = require("../../../utils/media");
var VaultSettings = function (_a) {
    var config = _a.config, setConfigFile = _a.setConfigFile, password = _a.password, currentBitcoinNetwork = _a.currentBitcoinNetwork, match = _a.match;
    var _b = react_1.useState('general'), currentTab = _b[0], setCurrentTab = _b[1];
    var url = react_router_dom_1.useRouteMatch().url;
    var breadcrumbs = [
        { text: 'Settings', link: url }
    ];
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(HeaderContainer, null,
            react_1.default.createElement(components_1.Breadcrumbs, { homeLink: match.url.substring(0, match.url.lastIndexOf('/')), items: breadcrumbs }),
            react_1.default.createElement(SettingsHeader, null, "Settings"),
            react_1.default.createElement(SettingsTabs_1.default, { currentTab: currentTab, setCurrentTab: setCurrentTab })),
        currentTab === 'general' && react_1.default.createElement(GeneralView_1.default, { config: config, password: password, setConfigFile: setConfigFile }),
        currentTab === 'addresses' && react_1.default.createElement(AddressesView_1.default, null),
        currentTab === 'utxos' && react_1.default.createElement(UtxosView_1.default, null),
        currentTab === 'export' && react_1.default.createElement(ExportView_1.default, { currentBitcoinNetwork: currentBitcoinNetwork })));
};
var HeaderContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 0.5em 1.5em;\n"], ["\n  padding: 0.5em 1.5em;\n"])));
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background: ", ";\n  border-radius: 0.385em;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  overflow: hidden;\n  padding: 0 0rem;\n"], ["\n  background: ", ";\n  border-radius: 0.385em;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  overflow: hidden;\n  padding: 0 0rem;\n"])), colors_1.white);
var SettingsSectionLeft = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  grid-column: span 2;\n\n  ", ";\n"], ["\n  grid-column: span 2;\n\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    grid-column: span 1;\n  "], ["\n    grid-column: span 1;\n  "])))));
var SettingsSectionRight = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
var SettingsSubheader = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  font-size: 0.875em;\n  color: ", ";\n  margin: 8px 0;\n"], ["\n  display: flex;\n  font-size: 0.875em;\n  color: ", ";\n  margin: 8px 0;\n"])), colors_1.gray500);
var SettingsItemHeader = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: flex;\n  font-size: 1.125em;\n"], ["\n  display: flex;\n  font-size: 1.125em;\n"])));
var SettingsHeadingItem = styled_components_1.default.h3(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 64px 0 0;\n  font-weight: 400;\n  color: ", ";\n"], ["\n  font-size: 1.5em;\n  margin: 64px 0 0;\n  font-weight: 400;\n  color: ", ";\n"])), colors_1.gray900);
var ViewAddressesButton = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"], ["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"])), colors_1.green800);
var BoxLink = styled_components_1.default(react_router_dom_1.Link)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"], ["\n  border: 1px solid ", ";\n  padding: 1.5em;\n  border-radius: 4px;\n  text-align: center;\n  cursor: pointer;\n"])), colors_1.green800);
var SettingsHeader = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  font-size: 2.25em;\n  background: ", ";\n  padding: 0.25em 0;\n  font-weight: 600;\n"], ["\n  font-size: 2.25em;\n  background: ", ";\n  padding: 0.25em 0;\n  font-weight: 600;\n"])), colors_1.white);
var XpubWellWrapper = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  border: 1px solid ", ";\n  background: ", ";\n  padding: 1.5em;\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1em;\n  border-radius: 4px;\n  word-break: break-all;\n"], ["\n  border: 1px solid ", ";\n  background: ", ";\n  padding: 1.5em;\n  color: ", ";\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 1em;\n  border-radius: 4px;\n  word-break: break-all;\n"])), colors_1.gray500, colors_1.gray300, colors_1.green800);
exports.default = VaultSettings;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
//# sourceMappingURL=index.js.map