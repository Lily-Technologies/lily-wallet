"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var colors_1 = require("../../../utils/colors");
var SettingsTabs = function (_a) {
    var currentTab = _a.currentTab, setCurrentTab = _a.setCurrentTab;
    return (react_1.default.createElement(TabsContainer, null,
        react_1.default.createElement(TabItem, { active: currentTab === 'general', onClick: function () { return setCurrentTab('general'); } }, "General"),
        react_1.default.createElement(TabItem, { active: currentTab === 'addresses', onClick: function () { return setCurrentTab('addresses'); } }, "Addresses"),
        react_1.default.createElement(TabItem, { active: currentTab === 'utxos', onClick: function () { return setCurrentTab('utxos'); } }, "UTXOs"),
        react_1.default.createElement(TabItem, { active: currentTab === 'export', onClick: function () { return setCurrentTab('export'); } }, "Export")));
};
var TabsContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  border-bottom: 1px solid ", ";\n"], ["\n  display: flex;\n  border-bottom: 1px solid ", ";\n"])), colors_1.gray200);
var TabItem = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  border-bottom: 2px solid ", ";\n  margin-left: 2rem;\n  cursor: pointer;\n  color: ", ";\n  font-weight: 600;\n  text-decoration: none;\n\n  &:nth-child(1) {\n    margin-left: 0;\n  }\n\n  &:hover {\n    border-bottom: 2px solid ", ";\n    color: ", ";\n  }\n"], ["\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  border-bottom: 2px solid ", ";\n  margin-left: 2rem;\n  cursor: pointer;\n  color: ", ";\n  font-weight: 600;\n  text-decoration: none;\n\n  &:nth-child(1) {\n    margin-left: 0;\n  }\n\n  &:hover {\n    border-bottom: 2px solid ", ";\n    color: ", ";\n  }\n"])), function (p) { return p.active ? colors_1.green500 : 'none'; }, function (p) { return p.active ? colors_1.green500 : colors_1.gray500; }, function (p) { return p.active ? 'none' : colors_1.gray300; }, function (p) { return p.active ? 'inherit' : colors_1.gray700; });
exports.default = SettingsTabs;
var templateObject_1, templateObject_2;
//# sourceMappingURL=SettingsTabs.js.map