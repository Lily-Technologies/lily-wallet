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
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var colors_1 = require("../utils/colors");
exports.Loading = function (_a) {
    var itemText = _a.itemText, _b = _a.style, style = _b === void 0 ? {} : _b, message = _a.message;
    return (react_1.default.createElement(LoadingWrapper, { style: style },
        react_1.default.createElement("img", { alt: "loading placeholder", src: require('../assets/flower-loading.svg'), style: { maxWidth: '6.25em' } }),
        !message && react_1.default.createElement(LoadingText, null,
            "Loading ",
            itemText),
        message && react_1.default.createElement(LoadingText, null, message),
        react_1.default.createElement(LoadingSubText, null, "Please wait...")));
};
var LoadingWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n  margin: 18px 0;\n  flex-direction: column;\n  color: ", ";\n  padding: 1.5em;\n"], ["\n  display: flex;\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n  margin: 18px 0;\n  flex-direction: column;\n  color: ", ";\n  padding: 1.5em;\n"])), colors_1.darkGray);
var LoadingText = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin: 4px 0;\n"], ["\n  font-size: 1.5em;\n  margin: 4px 0;\n"])));
var LoadingSubText = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    font-size: .75em;\n"], ["\n    font-size: .75em;\n"])));
exports.placeHolderShimmer = styled_components_1.keyframes(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  0%{\n      background-position: -468px 0\n  }\n  100%{\n      background-position: 468px 0\n"], ["\n  0%{\n      background-position: -468px 0\n  }\n  100%{\n      background-position: 468px 0\n"])));
exports.GrayAnimatedBackground = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  animation: ", " 1s linear infinite forwards;\n  background: #f6f7f8;\n  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);\n  background-size: 50em 6.5em;\n  position: relative;\n  flex: 1;\n"], ["\n  animation: ", " 1s linear infinite forwards;\n  background: #f6f7f8;\n  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);\n  background-size: 50em 6.5em;\n  position: relative;\n  flex: 1;\n"])), exports.placeHolderShimmer);
exports.GreenAnimatedBackground = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  animation: ", " 1s linear infinite forwards;\n  background: rgba(155,209,135, 0.95);\n  background: linear-gradient(to right, rgba(155,209,135, 0.5) 8%, ", " 18%, rgba(155,209,135, 0.5) 33%);\n  background-size: 800px 104px;\n  position: relative;\n  flex: 0 0 90%;\n  opacity: 0.95;\n"], ["\n  animation: ", " 1s linear infinite forwards;\n  background: rgba(155,209,135, 0.95);\n  background: linear-gradient(to right, rgba(155,209,135, 0.5) 8%, ", " 18%, rgba(155,209,135, 0.5) 33%);\n  background-size: 800px 104px;\n  position: relative;\n  flex: 0 0 90%;\n  opacity: 0.95;\n"])), exports.placeHolderShimmer, colors_1.lightGreen);
exports.GrayLoadingAnimation = styled_components_1.default(exports.GrayAnimatedBackground)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  height: 3em;\n"], ["\n  height: 3em;\n"])));
exports.GreenLoadingAnimation = styled_components_1.default(exports.GreenAnimatedBackground)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  height: 1em;\n"], ["\n  height: 1em;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=Loading.js.map