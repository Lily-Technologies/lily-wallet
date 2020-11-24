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
var boxicons_regular_1 = require("@styled-icons/boxicons-regular");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var RequiredDevicesModal = function (_a) {
    var selectNumberRequiredModalOpen = _a.selectNumberRequiredModalOpen, setSelectNumberRequiredModalOpen = _a.setSelectNumberRequiredModalOpen, numberOfImportedDevices = _a.numberOfImportedDevices, setConfigRequiredSigners = _a.setConfigRequiredSigners, configRequiredSigners = _a.configRequiredSigners, setStep = _a.setStep;
    var _b = react_1.useState(configRequiredSigners), requiredSigners = _b[0], setRequiredSigners = _b[1];
    return (react_1.default.createElement(components_1.Modal, { isOpen: selectNumberRequiredModalOpen, onRequestClose: function () { return setSelectNumberRequiredModalOpen(false); } },
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ModalHeaderContainer, null, "How many devices are required to approve transactions?"),
            react_1.default.createElement(SelectionContainer, null,
                react_1.default.createElement(SelectionWrapper, null,
                    react_1.default.createElement(IncrementButton, { onClick: function () { return setRequiredSigners(requiredSigners - 1); }, disabled: requiredSigners - 1 === 0 },
                        react_1.default.createElement(components_1.StyledIcon, { as: boxicons_regular_1.Minus, size: 25 })),
                    react_1.default.createElement(CurrentSelection, null, requiredSigners),
                    react_1.default.createElement(IncrementButton, { onClick: function () { return setRequiredSigners(requiredSigners + 1); }, disabled: requiredSigners + 1 > numberOfImportedDevices },
                        react_1.default.createElement(components_1.StyledIcon, { as: boxicons_regular_1.Plus, size: 25 }))),
                react_1.default.createElement(ContinueButton, { background: colors_1.green600, color: colors_1.white, onClick: function () {
                        setConfigRequiredSigners(requiredSigners);
                        setSelectNumberRequiredModalOpen(false);
                        setStep(3);
                    } }, "Confirm")))));
};
var ModalHeaderContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"])));
var SelectionContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n"], ["\n  display: flex;\n  flex-direction: column;\n"])));
var ContinueButton = styled_components_1.default.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", ";\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n"], ["\n  ", ";\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n"])), components_1.Button);
var SelectionWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: nowrap;\n  padding: 4em;\n  align-items: center;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-wrap: nowrap;\n  padding: 4em;\n  align-items: center;\n  justify-content: center;\n"])));
var CurrentSelection = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 1em;\n  font-size: 2.5em;\n"], ["\n  padding: 1em;\n  font-size: 2.5em;\n"])));
var IncrementButton = styled_components_1.default.button(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  border-radius: 9999px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  width: 2.5rem;\n  height: 2.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  pointer-events: ", ";\n\n  &:hover {\n    background: ", ";\n  }\n\n  &:active {\n    background: ", ";\n  }\n"], ["\n  border-radius: 9999px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  width: 2.5rem;\n  height: 2.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  pointer-events: ", ";\n\n  &:hover {\n    background: ", ";\n  }\n\n  &:active {\n    background: ", ";\n  }\n"])), function (p) { return p.disabled ? colors_1.gray400 : colors_1.green500; }, function (p) { return p.disabled ? 'transparent' : colors_1.green400; }, function (p) { return p.disabled ? colors_1.gray500 : colors_1.white; }, function (p) { return p.disabled ? 'none' : 'auto'; }, function (p) { return !p.disabled && colors_1.green400; }, function (p) { return !p.disabled && colors_1.green600; });
exports.default = RequiredDevicesModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=RequiredDevicesModal.js.map