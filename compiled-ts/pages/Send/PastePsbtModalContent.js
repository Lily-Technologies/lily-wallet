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
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var PastePsbtModalContent = function (_a) {
    var closeModal = _a.closeModal, importTxFromFile = _a.importTxFromFile, importTxFromFileError = _a.importTxFromFileError, setImportTxFromFileError = _a.setImportTxFromFileError;
    var _b = react_1.useState(''), pastedPsbtValue = _b[0], setPastedPsbtValue = _b[1];
    var onClickCloseModal = function () {
        setPastedPsbtValue('');
        setImportTxFromFileError('');
        closeModal();
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(ModalHeaderContainer, null, "Paste PSBT or Transaction Hex Below"),
        react_1.default.createElement("div", { style: { padding: '1.5em' } },
            react_1.default.createElement(PastePsbtTextArea, { rows: 20, onChange: function (e) {
                    setPastedPsbtValue(e.target.value);
                } }),
            importTxFromFileError && react_1.default.createElement(ErrorText, { style: { paddingBottom: '1em' } }, importTxFromFileError),
            react_1.default.createElement(ImportButtons, null,
                react_1.default.createElement(FromFileButton, { style: { marginRight: '1em' }, onClick: function () { return onClickCloseModal(); } }, "Cancel"),
                react_1.default.createElement(ImportTxButton, { background: colors_1.green600, color: colors_1.white, onClick: function () { importTxFromFile(pastedPsbtValue); } }, "Import Transaction")))));
};
var ModalHeaderContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"], ["\n  border-bottom: 1px solid rgb(229,231,235);\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.5em;\n"])));
var PastePsbtTextArea = styled_components_1.default.textarea(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  resize: none;\n  border-color: #d2d6dc;\n  border-width: 1px;\n  border-radius: .375rem;\n  padding: .5rem .75rem;\n  box-sizing: border-box;\n  margin: 2em 0;\n\n  &:focus {\n    outline: none;\n    box-shadow: 0 0 0 3px rgba(164,202,254,.45);\n    border-color: #a4cafe;\n  }\n"], ["\n  width: 100%;\n  resize: none;\n  border-color: #d2d6dc;\n  border-width: 1px;\n  border-radius: .375rem;\n  padding: .5rem .75rem;\n  box-sizing: border-box;\n  margin: 2em 0;\n\n  &:focus {\n    outline: none;\n    box-shadow: 0 0 0 3px rgba(164,202,254,.45);\n    border-color: #a4cafe;\n  }\n"])));
var ErrorText = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  text-align: center;\n  padding-left: 0;\n  padding-right: 0;\n"], ["\n  color: ", ";\n  text-align: center;\n  padding-left: 0;\n  padding-right: 0;\n"])), colors_1.red);
var ImportButtons = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var FromFileButton = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 1em 1.25rem;\n  border: 1px solid ", ";\n  border-radius: .375rem;\n  flex: 1;\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n\n  &:hover {\n    border: 1px solid ", ";\n    cursor: pointer;\n  }\n"], ["\n  padding: 1em 1.25rem;\n  border: 1px solid ", ";\n  border-radius: .375rem;\n  flex: 1;\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n\n  &:hover {\n    border: 1px solid ", ";\n    cursor: pointer;\n  }\n"])), colors_1.gray, colors_1.darkGray);
var ImportTxButton = styled_components_1.default.button(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", ";\n  flex: 1;\n"], ["\n  ", ";\n  flex: 1;\n"])), components_1.Button);
exports.default = PastePsbtModalContent;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=PastePsbtModalContent.js.map