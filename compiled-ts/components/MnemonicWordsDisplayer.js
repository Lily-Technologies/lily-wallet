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
exports.MnemonicWordsDisplayer = function (_a) {
    var mnemonicWords = _a.mnemonicWords;
    var mnemonicWordsArray = mnemonicWords.split(" ");
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(WordSection, null, mnemonicWordsArray.slice(0, 6).map(function (word, index) { return (react_1.default.createElement(Word, { key: index },
            react_1.default.createElement(WordIndex, null,
                "(",
                index + 1,
                ")"),
            word)); })),
        react_1.default.createElement(WordSection, null, mnemonicWordsArray.slice(6, 12).map(function (word, index) { return (react_1.default.createElement(Word, { key: index + 6 },
            react_1.default.createElement(WordIndex, null,
                "(",
                index + 7,
                ") "),
            word)); })),
        react_1.default.createElement(WordSection, null, mnemonicWordsArray.slice(12, 18).map(function (word, index) { return (react_1.default.createElement(Word, { key: index + 12 },
            react_1.default.createElement(WordIndex, null,
                "(",
                index + 13,
                ")"),
            word)); })),
        react_1.default.createElement(WordSection, null, mnemonicWordsArray.slice(18, 24).map(function (word, index) { return (react_1.default.createElement(Word, { key: index + 18 },
            react_1.default.createElement(WordIndex, null,
                "(",
                index + 19,
                ")"),
            word)); }))));
};
var WordSection = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n"], ["\n  display: flex;\n  flex-direction: column;\n"])));
var Word = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 1.25em;\n  margin: .25em;\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 4px;\n  position: relative;\n  text-align: center;\n"], ["\n  padding: 1.25em;\n  margin: .25em;\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 4px;\n  position: relative;\n  text-align: center;\n"])), colors_1.white, colors_1.green800);
var WordIndex = styled_components_1.default.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  font-size: .5em;\n  color: ", ";\n"], ["\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  font-size: .5em;\n  color: ", ";\n"])), colors_1.darkGray);
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=MnemonicWordsDisplayer.js.map