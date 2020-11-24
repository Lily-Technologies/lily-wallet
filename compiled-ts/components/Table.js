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
var colors_1 = require("../utils/colors");
exports.Table = styled_components_1.default.table(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border: none;\n  border-collapse: collapse;\n"], ["\n  border: none;\n  border-collapse: collapse;\n"])));
exports.TableHeader = styled_components_1.default.thead(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\n"], ["\n\n"])));
exports.TableHead = styled_components_1.default.th(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 600;\n  color: ", ";\n  background: ", ";\n  border: none;\n"], ["\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 600;\n  color: ", ";\n  background: ", ";\n  border: none;\n"])), colors_1.gray600, colors_1.gray50);
exports.TableBody = styled_components_1.default.tbody(templateObject_4 || (templateObject_4 = __makeTemplateObject([""], [""])));
exports.TableRow = styled_components_1.default.tr(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  border: 1px solid ", ";\n"], ["\n  border: 1px solid ", ";\n"])), colors_1.gray100);
exports.TableColumn = styled_components_1.default.td(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: ", ";\n\n  border: none;\n  // padding-top: 1.25rem;\n  // padding-bottom: 1.25rem;\n  // padding-left: 1.5rem;\n  // padding-right: 1.5rem;\n  border-bottom: 1px solid ", ";\n  border-width: thin;\n"], ["\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: ", ";\n\n  border: none;\n  // padding-top: 1.25rem;\n  // padding-bottom: 1.25rem;\n  // padding-left: 1.5rem;\n  // padding-right: 1.5rem;\n  border-bottom: 1px solid ", ";\n  border-width: thin;\n"])), colors_1.gray600, colors_1.gray300);
exports.TableColumnBold = styled_components_1.default(exports.TableColumn)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 600;\n"], ["\n  color: ", ";\n  font-weight: 600;\n"])), colors_1.gray700);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=Table.js.map