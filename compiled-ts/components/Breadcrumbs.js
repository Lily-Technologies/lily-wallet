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
var react_router_dom_1 = require("react-router-dom");
var boxicons_regular_1 = require("@styled-icons/boxicons-regular");
var heroicons_solid_1 = require("@styled-icons/heroicons-solid");
var colors_1 = require("../utils/colors");
exports.Breadcrumbs = function (_a) {
    var items = _a.items, homeLink = _a.homeLink, className = _a.className;
    return (react_1.default.createElement(Wrapper, { className: className },
        react_1.default.createElement(ItemsWrapper, null,
            react_1.default.createElement(HomeLinkContainer, { to: homeLink },
                react_1.default.createElement(HomeIcon, null)),
            items.map(function (item) { return (react_1.default.createElement(Item, null,
                react_1.default.createElement(ItemIcon, null),
                react_1.default.createElement(ItemLink, { to: item.link }, item.text))); }))));
};
var Wrapper = styled_components_1.default.nav(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var ItemsWrapper = styled_components_1.default.ol(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  padding: 0;\n"], ["\n  display: flex;\n  align-items: center;\n  padding: 0;\n"])));
var Item = styled_components_1.default.li(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  margin-left: 1rem;\n"], ["\n  display: flex;\n  align-items: center;\n  margin-left: 1rem;\n"])));
var ItemIcon = styled_components_1.default(boxicons_regular_1.ChevronRight)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 1.25rem;\n  height: 1.25rem;\n  color: ", ";\n"], ["\n  width: 1.25rem;\n  height: 1.25rem;\n  color: ", ";\n"])), colors_1.gray400);
var HomeLinkContainer = styled_components_1.default(react_router_dom_1.Link)(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
var HomeIcon = styled_components_1.default(heroicons_solid_1.Home)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 1.25rem;\n  height: 1.25rem;\n  color: ", ";\n  cursor: pointer;\n\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  width: 1.25rem;\n  height: 1.25rem;\n  color: ", ";\n  cursor: pointer;\n\n  &:hover {\n    color: ", ";\n  }\n"])), colors_1.gray400, colors_1.gray700);
var ItemLink = styled_components_1.default(react_router_dom_1.Link)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  color: ", ";\n  cursor: pointer;\n  margin-left: 1rem;\n  text-decoration: none;\n\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  color: ", ";\n  cursor: pointer;\n  margin-left: 1rem;\n  text-decoration: none;\n\n  &:hover {\n    color: ", ";\n  }\n"])), colors_1.gray500, colors_1.gray700);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Breadcrumbs.js.map