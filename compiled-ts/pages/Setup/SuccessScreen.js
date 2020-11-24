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
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@styled-icons/material");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var styles_1 = require("./styles");
var files_1 = require("../../utils/files");
var SuccessScreen = function (_a) {
    var config = _a.config, downloadColdcardFile = _a.downloadColdcardFile;
    var history = react_router_dom_1.useHistory();
    return (react_1.default.createElement(styles_1.InnerWrapper, null,
        react_1.default.createElement(styles_1.FormContainer, null,
            react_1.default.createElement(BoxedWrapperModified, null,
                react_1.default.createElement(IconWrapper, { style: { color: colors_1.green } },
                    react_1.default.createElement(components_1.StyledIcon, { as: material_1.CheckCircle, size: 100 })),
                react_1.default.createElement(SuccessText, null, "Setup Success!"),
                react_1.default.createElement(SuccessSubtext, null,
                    "Your account configuration has been saved in your Lily app data directory. ",
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("br", null),
                    "You may backup this file to another location for safe keeping now ",
                    react_1.default.createElement("br", null),
                    " or later via Settings > Download Backup Configuration."),
                react_1.default.createElement(Buttons, null,
                    !!downloadColdcardFile && (react_1.default.createElement(SaveBackupButton, { background: colors_1.white, color: colors_1.gray600, onClick: function () { downloadColdcardFile(); } }, "Download Coldcard File")),
                    react_1.default.createElement(SaveBackupButton, { background: colors_1.white, color: colors_1.gray600, onClick: function () {
                            files_1.downloadFile(JSON.stringify(config), 'lily-config-encrypted.json');
                        } }, "Backup Config File"),
                    react_1.default.createElement(DownloadButton, { background: colors_1.green600, color: colors_1.white, onClick: function () {
                            history.push("/");
                        } }, "View Accounts"))))));
};
var Buttons = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  margin-top: 2em;\n  width: 100%;\n  justify-content: center;\n"], ["\n  display: flex;\n  margin-top: 2em;\n  width: 100%;\n  justify-content: center;\n"])));
var SaveBackupButton = styled_components_1.default.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", ";\n  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);\n  border: 1px solid #d2d6dc;\n  margin-right: 1em;\n\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  ", ";\n  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);\n  border: 1px solid #d2d6dc;\n  margin-right: 1em;\n\n  &:hover {\n    color: ", ";\n  }\n"])), components_1.Button, colors_1.gray500);
var BoxedWrapperModified = styled_components_1.default(styles_1.BoxedWrapper)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  align-items: center;\n  padding: 2em;\n"], ["\n  align-items: center;\n  padding: 2em;\n"])));
var IconWrapper = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject([""], [""])));
var SuccessText = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-top: 0.5em;\n  font-size: 1.5em;\n  color: ", "\n"], ["\n  margin-top: 0.5em;\n  font-size: 1.5em;\n  color: ", "\n"])), colors_1.gray700);
var SuccessSubtext = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  margin-top: 2rem;\n  text-align: center;\n"], ["\n  color: ", ";\n  margin-top: 2rem;\n  text-align: center;\n"])), colors_1.darkGray);
var DownloadButton = styled_components_1.default.button(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  ", ";\n"], ["\n  ", ";\n"])), components_1.Button);
exports.default = SuccessScreen;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=SuccessScreen.js.map