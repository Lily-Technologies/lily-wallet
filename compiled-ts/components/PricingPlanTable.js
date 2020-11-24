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
var octicons_1 = require("@styled-icons/octicons");
var _1 = require(".");
var colors_1 = require("../utils/colors");
var types_1 = require("../types");
exports.PricingPlanTable = function (_a) {
    var clickRenewLicense = _a.clickRenewLicense;
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(Table, null,
            react_1.default.createElement(TableHeader, null,
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null),
                    react_1.default.createElement(TableColumn, null, "Basic"),
                    react_1.default.createElement(TableColumn, null, "Essential"),
                    react_1.default.createElement(TableColumn, null, "Premium"))),
            react_1.default.createElement(TableBody, null,
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(BoldTableColumn, null, "Pricing"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(PriceText, null, "$100"),
                        react_1.default.createElement(PriceSubtext, null, "/year")),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(PriceText, null, "$200"),
                        react_1.default.createElement(PriceSubtext, null, "/year")),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(PriceText, null, "$500"),
                        react_1.default.createElement(PriceSubtext, null, "/year"))),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(PurchaseColumn, null),
                    react_1.default.createElement(PurchaseColumn, null,
                        react_1.default.createElement(PurchaseButton, { onClick: function () { return clickRenewLicense(types_1.LicenseLevels.basic); }, background: colors_1.green700, color: colors_1.white }, "Buy Basic")),
                    react_1.default.createElement(PurchaseColumn, null,
                        react_1.default.createElement(PurchaseButton, { onClick: function () { return clickRenewLicense(types_1.LicenseLevels.essential); }, background: colors_1.green700, color: colors_1.white }, "Buy Essential")),
                    react_1.default.createElement(PurchaseColumn, null,
                        react_1.default.createElement(PurchaseButton, { onClick: function () { return clickRenewLicense(types_1.LicenseLevels.premium); }, background: colors_1.green700, color: colors_1.white }, "Buy Premium"))),
                react_1.default.createElement(FeatureRow, null,
                    react_1.default.createElement(BoldTableColumn, null, "Features"),
                    react_1.default.createElement(TableColumn, null),
                    react_1.default.createElement(TableColumn, null),
                    react_1.default.createElement(TableColumn, null)),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null, "Single Signature Hardware Wallets"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null))),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null, "2-of-3 Multisig Vaults"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null))),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null, "3-of-5 Multisig Vaults"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(DashIcon, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null))),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null, "Mobile App"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(DashIcon, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null))),
                react_1.default.createElement(FeatureRow, null,
                    react_1.default.createElement(BoldTableColumn, null, "Support"),
                    react_1.default.createElement(TableColumn, null),
                    react_1.default.createElement(TableColumn, null),
                    react_1.default.createElement(TableColumn, null)),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null, "Email Support"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null))),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(TableColumn, null, "Phone / Zoom Support"),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(DashIcon, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(DashIcon, null)),
                    react_1.default.createElement(TableColumn, null,
                        react_1.default.createElement(CheckMark, null))),
                react_1.default.createElement(TableRow, null,
                    react_1.default.createElement(PurchaseColumn, null),
                    react_1.default.createElement(PurchaseColumn, null,
                        react_1.default.createElement(PurchaseButton, { onClick: function () { return clickRenewLicense(types_1.LicenseLevels.basic); }, background: colors_1.green700, color: colors_1.white }, "Buy Basic")),
                    react_1.default.createElement(PurchaseColumn, null,
                        react_1.default.createElement(PurchaseButton, { onClick: function () { return clickRenewLicense(types_1.LicenseLevels.essential); }, background: colors_1.green700, color: colors_1.white }, "Buy Essential")),
                    react_1.default.createElement(PurchaseColumn, null,
                        react_1.default.createElement(PurchaseButton, { onClick: function () { return clickRenewLicense(types_1.LicenseLevels.premium); }, background: colors_1.green700, color: colors_1.white }, "Buy Premium")))))));
};
var PurchaseButton = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), _1.Button);
var Table = styled_components_1.default.table(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  table-layout: fixed;\n  width: 100%;\n  height: 1px;\n  border: none;\n  background: ", ";\n  border-collapse: collapse;\n"], ["\n  table-layout: fixed;\n  width: 100%;\n  height: 1px;\n  border: none;\n  background: ", ";\n  border-collapse: collapse;\n"])), colors_1.white);
var TableHeader = styled_components_1.default.thead(templateObject_3 || (templateObject_3 = __makeTemplateObject([""], [""])));
var TableBody = styled_components_1.default.tbody(templateObject_4 || (templateObject_4 = __makeTemplateObject([""], [""])));
var TableRow = styled_components_1.default.tr(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  border: 1px solid ", ";\n"], ["\n  border: 1px solid ", ";\n"])), colors_1.gray100);
var FeatureRow = styled_components_1.default(TableRow)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  background: ", ";\n  line-height: 0.25em;\n"], ["\n  background: ", ";\n  line-height: 0.25em;\n"])), colors_1.gray100);
var TableColumn = styled_components_1.default.td(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  border: none;\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  border-bottom: 1px solid ", ";\n  border-width: thin;\n"], ["\n  border: none;\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  border-bottom: 1px solid ", ";\n  border-width: thin;\n"])), colors_1.gray400);
var PurchaseColumn = styled_components_1.default(TableColumn)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  border: none;\n"], ["\n  border: none;\n"])));
var BoldTableColumn = styled_components_1.default(TableColumn)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  font-weight: 900;\n"], ["\n  font-weight: 900;\n"])));
var CheckMark = styled_components_1.default(boxicons_regular_1.Check)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  width: 1.5em;\n  color: ", "\n"], ["\n  width: 1.5em;\n  color: ", "\n"])), colors_1.green400);
var DashIcon = styled_components_1.default(octicons_1.Dash)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  width: 1.5em;\n  color: ", ";\n"], ["\n  width: 1.5em;\n  color: ", ";\n"])), colors_1.gray400);
var PriceText = styled_components_1.default.span(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 800;\n  font-size: 2.25rem;\n  line-height: 2.5rem;\n}\n"], ["\n  color: ", ";\n  font-weight: 800;\n  font-size: 2.25rem;\n  line-height: 2.5rem;\n}\n"])), colors_1.gray900);
var PriceSubtext = styled_components_1.default.span(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  color: ", ";\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: 500;\n"], ["\n  color: ", ";\n  line-height: 1.5rem;\n  font-size: 1rem;\n  font-weight: 500;\n"])), colors_1.gray600);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
//# sourceMappingURL=PricingPlanTable.js.map