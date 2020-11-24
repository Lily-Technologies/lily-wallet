"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
exports.mobile = function (inner) { return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  @media (max-width: ", "em) {\n    ", ";\n  }\n"], ["\n  @media (max-width: ", "em) {\n    ", ";\n  }\n"])), 1000 / 16, inner); };
exports.phone = function (inner) { return styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  @media (max-width: ", "em) {\n    ", ";\n  }\n"], ["\n  @media (max-width: ", "em) {\n    ", ";\n  }\n"])), 650 / 16, inner); };
var templateObject_1, templateObject_2;
//# sourceMappingURL=media.js.map