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
var _1 = require(".");
var OutsideClick_1 = __importDefault(require("./OutsideClick"));
var colors_1 = require("../utils/colors");
exports.Dropdown = function (_a) {
    var isOpen = _a.isOpen, setIsOpen = _a.setIsOpen, buttonLabel = _a.buttonLabel, dropdownItems = _a.dropdownItems, minimal = _a.minimal, style = _a.style;
    return (react_1.default.createElement(DropdownWrapper, null,
        react_1.default.createElement(ButtonContainer, null, minimal ? (react_1.default.createElement(MinimalDropdownButtonContainer, { style: style, onClick: function () { return setIsOpen(!isOpen); }, "aria-label": "Options", id: "options-menu" },
            react_1.default.createElement(DotDotDotImage, { fill: "currentColor", viewBox: "0 0 20 20" },
                react_1.default.createElement("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" })))) : (react_1.default.createElement(DropdownButtonContainer, null,
            react_1.default.createElement(DropdownButton, { style: style, onClick: function () { return setIsOpen(!isOpen); }, type: "button", id: "options-menu", "aria-haspopup": "true" }, buttonLabel)))),
        react_1.default.createElement(_1.Transition, { show: isOpen, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", appear: undefined },
            react_1.default.createElement(OutsideClick_1.default, { onOutsideClick: function () { return setIsOpen(false); } },
                react_1.default.createElement(DropdownItemsWrapper, null,
                    react_1.default.createElement(DropdownItemsContainer, null,
                        react_1.default.createElement(DropdownItems, { role: "menu", "aria-orientation": "vertical", "aria-labelledby": "options-menu" }, dropdownItems.map(function (item, index) {
                            if ("label" in item) {
                                return (react_1.default.createElement(DropdownItem, { key: index, clickable: !!item.onClick, onClick: function () {
                                        if (item.onClick) {
                                            item.onClick();
                                            setIsOpen(false);
                                        }
                                    }, role: "menuitem" }, item.label));
                            }
                            else {
                                return (react_1.default.createElement(Divider, { key: index }));
                            }
                        }))))))));
};
var ButtonContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n"])));
var DropdownWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  display: inline-block;\n  text-align: left;\n  z-index: 10;\n"], ["\n  position: relative;\n  display: inline-block;\n  text-align: left;\n  z-index: 10;\n"])));
var DropdownButtonContainer = styled_components_1.default.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);\n  border-radius: .375rem;\n  cursor: pointer;\n"], ["\n  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);\n  border-radius: .375rem;\n  cursor: pointer;\n"])));
var MinimalDropdownButtonContainer = styled_components_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  color: rgb(159,166,178);\n  padding: 0.25em;\n  cursor: pointer;\n  border: none;\n  border-radius: 9999px;\n\n  &:hover {\n    color: rgb(75,85,99);\n    background: rgba(255,255,255, 0.25)\n  }\n\n  &:focus {\n    color: rgb(75,85,99);\n    outline: 0;\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  color: rgb(159,166,178);\n  padding: 0.25em;\n  cursor: pointer;\n  border: none;\n  border-radius: 9999px;\n\n  &:hover {\n    color: rgb(75,85,99);\n    background: rgba(255,255,255, 0.25)\n  }\n\n  &:focus {\n    color: rgb(75,85,99);\n    outline: 0;\n  }\n"])));
var DropdownButton = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  transition-duration: 150ms;\n  transition-timing-function: cubic-bezier(.4,0,.2,1);\n  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;\n  width: 100%;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: .5rem;\n  padding-bottom: .5rem;\n  line-height: 1.25rem;\n  font-size: .875rem;\n  font-weight: 500;\n  justify-content: center;\n  display: inline-flex;\n  // border-width: 1px;\n  border-radius: .375rem;\n  // border-color: rgb(210,214,220);\n  background: ", ";\n  cursor: pointer;\n\n  &:active {\n    color: rgb(37,47,63);\n  }\n\n\n  &:hover {\n    color: rgb(107,114,128);\n  }\n\n  &:focus {\n    box-shadow: 0 0 0 3px rgba(164,202,254,.45);\n    outline: 0;\n    border-color: rgb(164,202,254)\n  }\n"], ["\n  transition-duration: 150ms;\n  transition-timing-function: cubic-bezier(.4,0,.2,1);\n  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;\n  width: 100%;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: .5rem;\n  padding-bottom: .5rem;\n  line-height: 1.25rem;\n  font-size: .875rem;\n  font-weight: 500;\n  justify-content: center;\n  display: inline-flex;\n  // border-width: 1px;\n  border-radius: .375rem;\n  // border-color: rgb(210,214,220);\n  background: ", ";\n  cursor: pointer;\n\n  &:active {\n    color: rgb(37,47,63);\n  }\n\n\n  &:hover {\n    color: rgb(107,114,128);\n  }\n\n  &:focus {\n    box-shadow: 0 0 0 3px rgba(164,202,254,.45);\n    outline: 0;\n    border-color: rgb(164,202,254)\n  }\n"])), colors_1.white);
var DotDotDotImage = styled_components_1.default.svg(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  height: 1.25rem;\n  width: 1.25rem;\n  display: block;\n  vertical-align: middle;\n"], ["\n  height: 1.25rem;\n  width: 1.25rem;\n  display: block;\n  vertical-align: middle;\n"])));
var DropdownItemsWrapper = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  transform-origin: top right;\n  width: 14rem;\n  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);\n  right: 0;\n  position: absolute;\n  margin-top: .5rem;\n  border-radius: .375rem;\n  z-index: 2;\n"], ["\n  transform-origin: top right;\n  width: 14rem;\n  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);\n  right: 0;\n  position: absolute;\n  margin-top: .5rem;\n  border-radius: .375rem;\n  z-index: 2;\n"])));
var DropdownItemsContainer = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  border-radius: .375rem;\n  box-shadow: 0 0 0 1px rgba(0,0,0,.05);\n  background: ", ";\n"], ["\n  border-radius: .375rem;\n  box-shadow: 0 0 0 1px rgba(0,0,0,.05);\n  background: ", ";\n"])), colors_1.white);
var DropdownItems = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding-top: .25rem;\n  padding-bottom: .25rem;\n"], ["\n  padding-top: .25rem;\n  padding-bottom: .25rem;\n"])));
var Divider = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  background: #d2d6dc;\n  height: 1px;\n"], ["\n  background: #d2d6dc;\n  height: 1px;\n"])));
var DropdownItem = styled_components_1.default.a(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: .5rem;\n  padding-bottom: .5rem;\n  line-height: 1.25rem;\n  font-size: .875rem;\n  display: block;\n  background-color: transparent;\n  text-decoration: none;\n  cursor: ", ";\n\n  &:hover {\n    background: rgb(244,245,247);\n    color: rgb(22,30,46);\n  }\n\n  &:focus {\n    outline: 0;\n    background-color: rgb(244,245,247);\n    color: rgb(22,30,46);\n  }\n"], ["\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: .5rem;\n  padding-bottom: .5rem;\n  line-height: 1.25rem;\n  font-size: .875rem;\n  display: block;\n  background-color: transparent;\n  text-decoration: none;\n  cursor: ", ";\n\n  &:hover {\n    background: rgb(244,245,247);\n    color: rgb(22,30,46);\n  }\n\n  &:focus {\n    outline: 0;\n    background-color: rgb(244,245,247);\n    color: rgb(22,30,46);\n  }\n"])), function (p) { return p.clickable ? 'pointer' : 'default'; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=Dropdown.js.map