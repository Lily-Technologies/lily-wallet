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
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __importStar(require("styled-components"));
var colors_1 = require("../utils/colors");
var rotate360 = styled_components_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n"], ["\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n"])));
exports.Spinner = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  animation: ", " 1s linear infinite;\n  transform: translateZ(0);\n  \n  border-top: 2px solid grey;\n  border-right: 2px solid grey;\n  border-bottom: 2px solid grey;\n  border-left: 4px solid ", ";\n  background: transparent;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n"], ["\n  animation: ", " 1s linear infinite;\n  transform: translateZ(0);\n  \n  border-top: 2px solid grey;\n  border-right: 2px solid grey;\n  border-bottom: 2px solid grey;\n  border-left: 4px solid ", ";\n  background: transparent;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n"])), rotate360, colors_1.white);
var templateObject_1, templateObject_2;
//# sourceMappingURL=Spinner.js.map