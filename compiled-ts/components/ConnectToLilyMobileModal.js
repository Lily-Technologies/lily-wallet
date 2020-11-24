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
var AnimatedQrCode_1 = require("./AnimatedQrCode"); // can't import from index https://github.com/styled-components/styled-components/issues/1449
var _1 = require(".");
var colors_1 = require("../utils/colors");
var getChunks = function (value, parts) {
    var chunkLength = Math.ceil(value.length / parts);
    var result = [];
    for (var i = 1; i <= parts; i++) {
        result.push(i + "/" + parts + "(:)" + value.slice((chunkLength * (i - 1)), (chunkLength * i)));
    }
    return result;
};
exports.ConnectToLilyMobileModal = function (_a) {
    var isOpen = _a.isOpen, onRequestClose = _a.onRequestClose, config = _a.config;
    var _b = react_1.useState(0), lilyMobileStep = _b[0], setLilyMobileStep = _b[1];
    var configStringified = JSON.stringify(config);
    var numChunks = Math.ceil(configStringified.length / 1000);
    var splitValueArray = getChunks(configStringified, numChunks);
    return (react_1.default.createElement(_1.Modal, { isOpen: isOpen, onRequestClose: function () {
            setLilyMobileStep(0);
            onRequestClose();
        } },
        react_1.default.createElement(LilyMobileContainer, null,
            lilyMobileStep === 0 && (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(LilyMobileHeader, null, "Connect to Lily Mobile"),
                react_1.default.createElement(LilyMobileContent, null, "You can use your phone as a transaction approver and monitor your account balances on your phone using Lily Mobile."),
                react_1.default.createElement(LilyMobileContent, { style: { marginTop: '1em' } }, "Download it from the app store by clicking here. Once you have it loaded on your phone, click continue below to view your config QR code."),
                react_1.default.createElement(LilyMobileContinueButton, { background: colors_1.green600, color: colors_1.white, onClick: function () { return setLilyMobileStep(1); } }, "Continue"))),
            lilyMobileStep === 1 && (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(LilyMobileHeader, { style: { textAlign: 'center' } }, "Scan the QR Code"),
                react_1.default.createElement(LilyMobileQrContainer, null,
                    react_1.default.createElement(LilyMobileQrCode, { valueArray: splitValueArray })))))));
};
var LilyMobileContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  color: ", ";\n  padding: 1.5em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  color: ", ";\n  padding: 1.5em;\n"])), colors_1.black);
var LilyMobileHeader = styled_components_1.default.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 1.5em;\n  margin-bottom: 1em;\n"], ["\n  font-size: 1.5em;\n  margin-bottom: 1em;\n"])));
var LilyMobileContent = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 0.75em;\n"], ["\n  font-size: 0.75em;\n"])));
var LilyMobileContinueButton = styled_components_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n  margin-top: 2em;\n"], ["\n  ", "\n  margin-top: 2em;\n"])), _1.Button);
var LilyMobileQrCode = styled_components_1.default(AnimatedQrCode_1.AnimatedQrCode)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var LilyMobileQrContainer = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  max-width: 500px;\n  align-self: center;\n"], ["\n  max-width: 500px;\n  align-self: center;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ConnectToLilyMobileModal.js.map