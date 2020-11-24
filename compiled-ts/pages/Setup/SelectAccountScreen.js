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
var remix_line_1 = require("@styled-icons/remix-line");
var ionicons_outline_1 = require("@styled-icons/ionicons-outline");
var heroicons_outline_1 = require("@styled-icons/heroicons-outline");
var components_1 = require("../../components");
var styles_1 = require("./styles");
var colors_1 = require("../../utils/colors");
var SelectAccountScreen = function (_a) {
    var header = _a.header, setSetupOption = _a.setSetupOption, setStep = _a.setStep;
    return (react_1.default.createElement(styles_1.InnerWrapper, null,
        header,
        react_1.default.createElement(SignupOptionMenu, null,
            react_1.default.createElement(SignupOptionItem, { background: colors_1.white, color: colors_1.gray800, style: { borderTop: "8px solid " + colors_1.green800 }, onClick: function () {
                    setSetupOption(2);
                    setStep(1);
                } },
                react_1.default.createElement(components_1.StyledIcon, { as: ionicons_outline_1.Wallet, size: 48, style: { marginTop: '0.15em' } }),
                react_1.default.createElement(SignupOptionTextContainer, null,
                    react_1.default.createElement(SignupOptionMainText, null, "Wallet"),
                    react_1.default.createElement(SignupOptionSubtext, null, "Create a new Bitcoin wallet with its own mnemonic"))),
            react_1.default.createElement(SignupOptionItem, { background: colors_1.white, color: colors_1.gray800, onClick: function () {
                    setSetupOption(3);
                    setStep(1);
                } },
                react_1.default.createElement(components_1.StyledIcon, { as: heroicons_outline_1.Calculator, size: 48, style: { marginTop: '0.15em' } }),
                react_1.default.createElement(SignupOptionTextContainer, null,
                    react_1.default.createElement(SignupOptionMainText, null, "Hardware Wallet"),
                    react_1.default.createElement(SignupOptionSubtext, null, "Import your existing hardware wallet to manage funds in Lily similar to Ledger Live or Trezor Wallet"))),
            react_1.default.createElement(SignupOptionItem, { background: colors_1.white, color: colors_1.gray800, onClick: function () {
                    setSetupOption(1);
                    setStep(1);
                } },
                react_1.default.createElement(components_1.StyledIcon, { as: remix_line_1.Bank, size: 48, style: { marginTop: '0.15em' } }),
                react_1.default.createElement(SignupOptionTextContainer, null,
                    react_1.default.createElement(SignupOptionMainText, null, "Multisignature Vault"),
                    react_1.default.createElement(SignupOptionSubtext, null, "Combine multiple hardware wallets to create a vault for securing larger amounts of Bitcoin"))))));
};
var SignupOptionMenu = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  max-width: 46.875em;\n  width: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  max-width: 46.875em;\n  width: 100%;\n"])));
var SignupOptionTextContainer = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  text-align: left;\n  margin-left: 1em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  text-align: left;\n  margin-left: 1em;\n"])));
var SignupOptionMainText = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 1em;\n  line-height: 1.5em;\n"], ["\n  font-size: 1em;\n  line-height: 1.5em;\n"])));
var SignupOptionSubtext = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: .5em;\n  color: ", ";\n  line-height: 1em;\n"], ["\n  font-size: .5em;\n  color: ", ";\n  line-height: 1em;\n"])), colors_1.darkGray);
var SignupOptionItem = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", ";\n  background: ", ";\n  border: 1px solid ", ";\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  border-radius: 4px;\n  padding: 1.5em;\n  margin: 0.25em 0;\n  font-size: 1.5em;\n  text-align: center;\n  white-space: normal;\n"], ["\n  ", ";\n  background: ", ";\n  border: 1px solid ", ";\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  border-radius: 4px;\n  padding: 1.5em;\n  margin: 0.25em 0;\n  font-size: 1.5em;\n  text-align: center;\n  white-space: normal;\n"])), components_1.Button, colors_1.white, colors_1.gray);
exports.default = SelectAccountScreen;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=SelectAccountScreen.js.map