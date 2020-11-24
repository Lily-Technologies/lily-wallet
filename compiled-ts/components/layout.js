"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// KBC-TODO: either apply throughout entire project or remove
// There are some components that implement this in their own files
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var media_1 = require("../utils/media");
var colors_1 = require("../utils/colors");
exports.PageWrapper = function (_a) {
    var children = _a.children;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Content, null, children)));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  text-align: left;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  display: flex;\n  flex: 1;\n  display: flex;\n  min-height: 400px;\n  flex-direction: column;\n  align-items: center;\n  padding: 0em 3em;\n  overflow: hidden;\n  z-index: 1;\n\n  ", ";\n"], ["\n  text-align: left;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  display: flex;\n  flex: 1;\n  display: flex;\n  min-height: 400px;\n  flex-direction: column;\n  align-items: center;\n  padding: 0em 3em;\n  overflow: hidden;\n  z-index: 1;\n\n  ",
    ";\n"])), colors_1.black, media_1.mobile(styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    padding: 0em 1em;\n  "], ["\n    padding: 0em 1em;\n  "])))));
var Content = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  padding: 2.25em 2em;\n  overflow: scroll;\n  flex: 1;\n  max-width: 75rem;\n  width: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  padding: 2.25em 2em;\n  overflow: scroll;\n  flex: 1;\n  max-width: 75rem;\n  width: 100%;\n"])));
exports.GridArea = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: grid;\n  background: transparent;\n  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));\n  grid-gap: 1.5em;\n  padding: 1.5em;\n  justify-items: center;\n"], ["\n  display: grid;\n  background: transparent;\n  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));\n  grid-gap: 1.5em;\n  padding: 1.5em;\n  justify-items: center;\n"])));
exports.PageTitle = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 2em;\n  color: ", ";\n  font-weight: 600;\n"], ["\n  font-size: 2em;\n  color: ", ";\n  font-weight: 600;\n"])), colors_1.white);
exports.Header = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1em;\n  flex-wrap: wrap;\n  color: ", ";\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1em;\n  flex-wrap: wrap;\n  color: ", ";\n"])), colors_1.white);
exports.HeaderLeft = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n"], ["\n  display: flex;\n  flex-direction: column;\n"])));
exports.HeaderRight = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=layout.js.map