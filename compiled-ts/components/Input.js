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
var styled_components_1 = __importDefault(require("styled-components"));
var colors_1 = require("../utils/colors");
exports.Input = function (_a) {
    var value = _a.value, onChange = _a.onChange, error = _a.error, label = _a.label, id = _a.id, placeholder = _a.placeholder, type = _a.type, autoFocus = _a.autoFocus, onKeyDown = _a.onKeyDown, inputStaticText = _a.inputStaticText;
    return (react_1.default.createElement(react_1.Fragment, null,
        label && react_1.default.createElement(Label, { htmlFor: id }, label),
        react_1.default.createElement(InputWrapper, null,
            react_1.default.createElement(StyledInput, { type: type || 'text', id: id, value: value, onChange: function (e) { return onChange(e.target.value); }, onKeyDown: onKeyDown, error: error, autoFocus: autoFocus, placeholder: placeholder }),
            inputStaticText && react_1.default.createElement(exports.InputStaticText, { disabled: true, text: inputStaticText }))));
};
var Label = styled_components_1.default.label(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: .875rem;\n  line-height: 1.25em;\n  font-weight: 500;\n  color: ", ";\n"], ["\n  font-size: .875rem;\n  line-height: 1.25em;\n  font-weight: 500;\n  color: ", ";\n"])), colors_1.gray600);
var InputWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border: 0 solid #d2d6dc;\n  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);\n  margin-top: 0.25rem;\n  position: relative;\n  width: 100%;\n\n  *, &:after, &:before {\n    box-sizing: border-box;\n    border: 0 solid #d2d6dc;\n  }\n"], ["\n  border: 0 solid #d2d6dc;\n  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);\n  margin-top: 0.25rem;\n  position: relative;\n  width: 100%;\n\n  *, &:after, &:before {\n    box-sizing: border-box;\n    border: 0 solid #d2d6dc;\n  }\n"])));
var StyledInput = styled_components_1.default.input(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  line-height: 1.25em;\n  width: 100%;\n  font-size: 0.875em;\n  display: block;\n  background-color: ", ";\n  border-color: ", ";\n  border-width: 1px;\n  border-radius: 0.375rem;\n  padding: 0.5rem 0.75rem;\n\n  *, &:after, &:before {\n    box-sizing: border-box;\n    border: 0 solid #d2d6dc;\n  }\n\n  &:focus {\n    outline: none;\n    box-shadow: 0 0 0 3px rgba(164,202,254,.45);\n    border-color: #a4cafe;\n  }\n"], ["\n  line-height: 1.25em;\n  width: 100%;\n  font-size: 0.875em;\n  display: block;\n  background-color: ", ";\n  border-color: ", ";\n  border-width: 1px;\n  border-radius: 0.375rem;\n  padding: 0.5rem 0.75rem;\n\n  *, &:after, &:before {\n    box-sizing: border-box;\n    border: 0 solid #d2d6dc;\n  }\n\n  &:focus {\n    outline: none;\n    box-shadow: 0 0 0 3px rgba(164,202,254,.45);\n    border-color: #a4cafe;\n  }\n"])), colors_1.white, function (p) { return p.error ? colors_1.red400 : colors_1.gray300; });
exports.InputStaticText = styled_components_1.default.label(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  top: 0;\n  right: 0;\n  position: absolute;\n\n  &::after {\n    content: \"", "\";\n    position: absolute;\n    top: 0.65em;\n    right: 0.75em;\n    font-family: arial,helvetica,sans-serif;\n    font-size: 1em;\n    display: block;\n    color: ", ";\n    font-weight: bold;\n  }\n"], ["\n  top: 0;\n  right: 0;\n  position: absolute;\n\n  &::after {\n    content: \"", "\";\n    position: absolute;\n    top: 0.65em;\n    right: 0.75em;\n    font-family: arial,helvetica,sans-serif;\n    font-size: 1em;\n    display: block;\n    color: ", ";\n    font-weight: bold;\n  }\n"])), function (p) { return p.text; }, colors_1.gray500);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=Input.js.map