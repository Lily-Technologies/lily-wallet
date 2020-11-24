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
var material_1 = require("@styled-icons/material");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var Steps = function (_a) {
    var step = _a.step, setupOption = _a.setupOption;
    return (react_1.default.createElement(StepsGroup, null,
        react_1.default.createElement(StepItem, { arrow: true, completed: step > 1, active: step === 1 },
            react_1.default.createElement(StepCircle, { completed: step > 1, active: step === 1 }, step > 1 ? react_1.default.createElement(components_1.StyledIcon, { as: material_1.Check, size: 25 }) : '01'),
            react_1.default.createElement(StepItemTextContainer, null,
                react_1.default.createElement(StepItemSubText, null,
                    "Give your ",
                    setupOption === 2 ? 'wallet' : 'vault',
                    " a name"))),
        react_1.default.createElement(StepItem, { arrow: true, completed: step > 2, active: step === 2 },
            react_1.default.createElement(StepCircle, { completed: step > 2, active: step === 2 }, step > 2 ? react_1.default.createElement(components_1.StyledIcon, { as: material_1.Check, size: 25 }) : '02'),
            react_1.default.createElement(StepItemTextContainer, null,
                setupOption === 1 && react_1.default.createElement(StepItemSubText, null, "Connect or import hardware wallets"),
                setupOption === 2 && react_1.default.createElement(StepItemSubText, null, "Write down recovery words"),
                setupOption === 3 && react_1.default.createElement(StepItemSubText, null, "Connect or import hardware wallet"))),
        react_1.default.createElement(StepItem, { arrow: false, completed: step > 3, active: step === 3 },
            react_1.default.createElement(StepCircle, { completed: step > 3, active: step === 3 }, step > 3 ? react_1.default.createElement(components_1.StyledIcon, { as: material_1.Check, size: 25 }) : '03'),
            react_1.default.createElement(StepItemTextContainer, null,
                react_1.default.createElement(StepItemSubText, null, "Stack Sats")))));
};
var StepItemTextContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  margin-left: 1em;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  margin-left: 1em;\n  justify-content: center;\n"])));
var StepCircle = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-radius: 9999px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  width: 2.5rem;\n  height: 2.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"], ["\n  border-radius: 9999px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  width: 2.5rem;\n  height: 2.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])), function (p) { return (p.active || p.completed) ? colors_1.green500 : colors_1.gray400; }, function (p) { return p.completed ? colors_1.green400 : 'transparent'; }, function (p) { return p.completed ? colors_1.white : p.active ? colors_1.green500 : colors_1.gray500; });
var StepsGroup = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: inline-flex;\n  border-radius: 0.375em;\n  border: 1px solid ", ";\n  align-items: stretch;\n  margin-bottom: 3.5em;\n"], ["\n  display: inline-flex;\n  border-radius: 0.375em;\n  border: 1px solid ", ";\n  align-items: stretch;\n  margin-bottom: 3.5em;\n"])), colors_1.gray300);
var StepItem = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  position: relative;\n  // flex-direction: column;\n  background: ", ";\n  color: ", ";\n  padding: 1em 2em 1em 1em;\n  border-right: 1px solid rgba(34,36,38,.15);\n\n  &:after { \n    display: ", ";\n    position: absolute;\n    z-index: 2;\n    content: '';\n    top: 50%;\n    right: 0;\n    border: medium none;\n    background-color: ", ";\n    width: 1.14285714em;\n    height: 1.14285714em;\n    border-style: solid;\n    border-color: ", ";\n    border-width: 0 1px 1px 0;\n    -webkit-transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;\n    transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;\n    transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease;\n    transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease,-webkit-box-shadow .1s ease;\n    -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);\n    transform: translateY(-50%) translateX(50%) rotate(-45deg);\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  position: relative;\n  // flex-direction: column;\n  background: ", ";\n  color: ", ";\n  padding: 1em 2em 1em 1em;\n  border-right: 1px solid rgba(34,36,38,.15);\n\n  &:after { \n    display: ", ";\n    position: absolute;\n    z-index: 2;\n    content: '';\n    top: 50%;\n    right: 0;\n    border: medium none;\n    background-color: ", ";\n    width: 1.14285714em;\n    height: 1.14285714em;\n    border-style: solid;\n    border-color: ", ";\n    border-width: 0 1px 1px 0;\n    -webkit-transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;\n    transition: background-color .1s ease,opacity .1s ease,color .1s ease,-webkit-box-shadow .1s ease;\n    transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease;\n    transition: background-color .1s ease,opacity .1s ease,color .1s ease,box-shadow .1s ease,-webkit-box-shadow .1s ease;\n    -webkit-transform: translateY(-50%) translateX(50%) rotate(-45deg);\n    transform: translateY(-50%) translateX(50%) rotate(-45deg);\n  }\n"])), function (p) { return (p.active || p.completed) ? colors_1.white : colors_1.gray100; }, function (p) { return p.active ? colors_1.green500 : p.completed ? colors_1.gray700 : colors_1.gray400; }, function (p) { return p.arrow ? 'auto' : 'none'; }, function (p) { return (p.active || p.completed) ? colors_1.white : colors_1.gray100; }, colors_1.gray300);
var StepItemSubText = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
exports.default = Steps;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Steps.js.map