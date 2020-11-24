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
var react_qr_svg_1 = require("react-qr-svg");
var colors_1 = require("../../utils/colors");
var PsbtQrCode = function (_a) {
    var psbt = _a.psbt;
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(ModalHeaderContainer, null, "Scan this with your device"),
        react_1.default.createElement(ModalContent, null,
            react_1.default.createElement(OutputItem, { style: { wordBreak: 'break-word' } },
                react_1.default.createElement(react_qr_svg_1.QRCode, { bgColor: colors_1.white, fgColor: colors_1.black, level: "Q", style: { width: 256 }, value: psbt })))));
};
var ModalHeaderContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"])));
var OutputItem = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  padding: 1.5em;\n  margin: 12px 0;\n  background: ", ";\n  border: 1px solid ", ";\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  padding: 1.5em;\n  margin: 12px 0;\n  background: ", ";\n  border: 1px solid ", ";\n  justify-content: center;\n  align-items: center;\n  border-radius: 4px;\n"])), colors_1.lightGray, colors_1.darkOffWhite);
var ModalContent = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1.5em;\n"], ["\n  padding: 1.5em;\n"])));
exports.default = PsbtQrCode;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=PsbtQrCode.js.map