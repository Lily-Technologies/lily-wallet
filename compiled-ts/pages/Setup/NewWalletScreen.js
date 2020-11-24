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
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var styles_1 = require("./styles");
var CreateWallet = function (_a) {
    var header = _a.header, walletMnemonic = _a.walletMnemonic, setStep = _a.setStep;
    return (react_1.default.createElement(styles_1.InnerWrapper, { style: { marginBottom: '2em' } },
        header,
        react_1.default.createElement(styles_1.FormContainer, null,
            react_1.default.createElement(styles_1.BoxedWrapper, null,
                react_1.default.createElement(styles_1.XPubHeaderWrapper, null,
                    react_1.default.createElement(styles_1.SetupHeaderWrapper, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(styles_1.SetupHeader, null, "Write down these recovery words"),
                            react_1.default.createElement(styles_1.SetupExplainerText, null, "These 24 words are the keys to your wallet. Write them down and keep them in a safe place. Do not share them with anyone else. These can be used to recover your wallet if you lose your configuration file.")))),
                react_1.default.createElement(WordContainer, null,
                    react_1.default.createElement(components_1.MnemonicWordsDisplayer, { mnemonicWords: walletMnemonic })),
                react_1.default.createElement(SaveWalletButton, { background: colors_1.green600, color: colors_1.white, onClick: function () {
                        setStep(3);
                    } },
                    "I have written these words down ",
                    react_1.default.createElement("br", null),
                    " and stored them in a safe place")))));
};
var SaveWalletButton = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", ";\n  flex: 1;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n"], ["\n  ", ";\n  flex: 1;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n"])), components_1.Button);
var WordContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1.25em;\n  background: ", ";\n  justify-content: center;\n  border-bottom: 1px solid ", ";\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  padding: 1.25em;\n  background: ", ";\n  justify-content: center;\n  border-bottom: 1px solid ", ";\n"])), colors_1.gray100, colors_1.darkOffWhite);
exports.default = CreateWallet;
var templateObject_1, templateObject_2;
//# sourceMappingURL=NewWalletScreen.js.map