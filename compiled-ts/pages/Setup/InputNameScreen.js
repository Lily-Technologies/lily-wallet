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
var styles_1 = require("./styles");
var colors_1 = require("../../utils/colors");
var InputNameScreen = function (_a) {
    var header = _a.header, setupOption = _a.setupOption, setStep = _a.setStep, accountName = _a.accountName, setAccountName = _a.setAccountName;
    var nextScreenAction = function () {
        if (accountName.length > 3) {
            setStep(2);
        }
    };
    var onInputEnter = function (e) {
        if (e.key === 'Enter') {
            nextScreenAction();
        }
    };
    var getAccountType = function (setupOption, capitalize) {
        var option;
        if (setupOption === 1) {
            option = 'vault';
        }
        else if (setupOption === 2) {
            option = 'wallet';
        }
        else {
            option = 'hardware wallet';
        }
        if (capitalize === 'all') {
            var splitOption = option.toLowerCase().split(' ');
            for (var i = 0; i < splitOption.length; i++) {
                splitOption[i] = splitOption[i].charAt(0).toUpperCase() + splitOption[i].substring(1);
            }
            // Directly return the joined string
            return splitOption.join(' ');
        }
        else if (capitalize === 'first') {
            return option.charAt(0).toUpperCase() + option.slice(1);
        }
        else {
            return option;
        }
    };
    return (react_1.default.createElement(styles_1.InnerWrapper, null,
        header,
        react_1.default.createElement(styles_1.FormContainer, null,
            react_1.default.createElement(styles_1.BoxedWrapper, null,
                react_1.default.createElement(styles_1.XPubHeaderWrapper, null,
                    react_1.default.createElement(styles_1.SetupHeaderWrapper, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(styles_1.SetupHeader, null, "Enter a name"),
                            react_1.default.createElement(styles_1.SetupExplainerText, null,
                                "Give your ",
                                getAccountType(setupOption),
                                " a name (i.e. \"My First ",
                                getAccountType(setupOption, 'all'),
                                "\") to identify it while using Lily.")))),
                react_1.default.createElement(PasswordWrapper, null,
                    react_1.default.createElement(components_1.Input, { autoFocus: true, error: false, label: "Account Name", type: "text", placeholder: getAccountType(setupOption, 'all') + " Name", value: accountName, onChange: setAccountName, onKeyDown: function (e) { return onInputEnter(e); } })),
                react_1.default.createElement(ExportFilesButton, { background: colors_1.green600, color: colors_1.white, 
                    // active={accountName.length > 3}
                    onClick: function () { return nextScreenAction(); } }, "Continue")))));
};
var PasswordWrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 0.5em;\n  display: flex;\n  flex-direction: column;\n  background: ", ";\n"], ["\n  padding: 0.5em;\n  display: flex;\n  flex-direction: column;\n  background: ", ";\n"])), colors_1.white);
var ExportFilesButton = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", ";\n  padding: 1em;\n  font-size: 1em;\n  font-weight: 700;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  width: 100%;\n"], ["\n  ", ";\n  padding: 1em;\n  font-size: 1em;\n  font-weight: 700;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  width: 100%;\n"])), components_1.Button);
exports.default = InputNameScreen;
var templateObject_1, templateObject_2;
//# sourceMappingURL=InputNameScreen.js.map