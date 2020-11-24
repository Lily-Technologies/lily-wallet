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
var styled_components_1 = __importStar(require("styled-components"));
var rem_1 = __importDefault(require("../utils/rem"));
var spinning = styled_components_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  from {transform:rotate(0deg);}\n  to {transform:rotate(360deg);\n"], ["\n  from {transform:rotate(0deg);}\n  to {transform:rotate(360deg);\n"])));
exports.StyledIcon = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    width: ", ";\n    height: ", ";\n  }\n"], ["\n  && {\n    width: ", ";\n    height: ", ";\n  }\n"])), function (p) { return rem_1.default(p.size || 20); }, function (p) { return rem_1.default(p.size || 20); });
exports.StyledIconSpinning = styled_components_1.default(exports.StyledIcon)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  animation-name: ", ";\n  animation-duration: 1.4s;\n  animation-iteration-count: infinite;\n  animation-fill-mode: both;\n"], ["\n  animation-name: ", ";\n  animation-duration: 1.4s;\n  animation-iteration-count: infinite;\n  animation-fill-mode: both;\n"])), spinning);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=StyledIcon.js.map