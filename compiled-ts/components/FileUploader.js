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
exports.FileUploader = function (_a) {
    var accept = _a.accept, id = _a.id, onFileLoad = _a.onFileLoad;
    return (react_1.default.createElement(FileInput, { type: "file", accept: accept, id: id, onChange: function (e) {
            if (e.target.files) {
                var filereader = new FileReader();
                var modifiedDate_1 = e.target.files[0].lastModified;
                filereader.onload = function (event) {
                    if (event.target && event.target.result) {
                        onFileLoad({ file: event.target.result.toString(), modifiedTime: modifiedDate_1 });
                    }
                };
                filereader.readAsText(e.target.files[0]);
            }
        } }));
};
var FileInput = styled_components_1.default.input(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\twidth: 0.1px;\n\theight: 0.1px;\n\topacity: 0;\n\toverflow: hidden;\n\tposition: absolute;\n\tz-index: -1;\n"], ["\n\twidth: 0.1px;\n\theight: 0.1px;\n\topacity: 0;\n\toverflow: hidden;\n\tposition: absolute;\n\tz-index: -1;\n"])));
var templateObject_1;
//# sourceMappingURL=FileUploader.js.map