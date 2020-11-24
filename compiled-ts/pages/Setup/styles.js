"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = __importDefault(require("styled-components"));
var colors_1 = require("../../utils/colors");
exports.HeaderWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", "\n"], ["\n  color: ", "\n"])), colors_1.black);
exports.InnerWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  max-width: 46.875em;\n  width: 100%;\n"], ["\n  max-width: 46.875em;\n  width: 100%;\n"])));
exports.PageTitleSubtext = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 1em;\n  color: ", ";\n"], ["\n  font-size: 1em;\n  color: ", ";\n"])), colors_1.darkGray);
exports.CancelButton = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n  padding: 1em;\n  cursor: pointer;\n"], ["\n  color: ", ";\n  padding: 1em;\n  cursor: pointer;\n"])), colors_1.gray);
exports.XPubHeaderWrapper = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  background: ", ";\n  margin: 0;\n  display: flex;\n  justify-content: space-between;\n  padding: 1.25em;\n  border-bottom: 1px solid #E4E7EB;\n  align-items: flex-start;\n"], ["\n  color: ", ";\n  background: ", ";\n  margin: 0;\n  display: flex;\n  justify-content: space-between;\n  padding: 1.25em;\n  border-bottom: 1px solid #E4E7EB;\n  align-items: flex-start;\n"])), colors_1.darkGray, colors_1.white);
exports.SetupHeaderWrapper = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  flex: 1;\n  align-items: flex-start;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  flex: 1;\n  align-items: flex-start;\n"])));
exports.SetupHeader = styled_components_1.default.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 1.25em;\n  margin: 4px 0;\n  color: ", ";\n"], ["\n  font-size: 1.25em;\n  margin: 4px 0;\n  color: ", ";\n"])), colors_1.black);
exports.SetupExplainerText = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n  font-size: .8em;\n  margin: 8px 0;\n  padding: 0 3em 0 0;\n"], ["\n  color: ", ";\n  font-size: .8em;\n  margin: 8px 0;\n  padding: 0 3em 0 0;\n"])), colors_1.darkGray);
exports.FormContainer = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  min-height: 33em;\n"], ["\n  min-height: 33em;\n"])));
exports.BoxedWrapper = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  background: ", ";\n  border-radius: .375rem;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  border-top: 11px solid ", ";\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n"], ["\n  background: ", ";\n  border-radius: .375rem;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  border-top: 11px solid ", ";\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n"])), colors_1.white, colors_1.green600);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=styles.js.map