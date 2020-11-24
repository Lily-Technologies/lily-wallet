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
var react_router_dom_1 = require("react-router-dom");
var styled_components_1 = __importDefault(require("styled-components"));
var components_1 = require("../components");
var colors_1 = require("../utils/colors");
var ColdcardImportInstructions = function () {
    document.title = "ColdcardImportInstructions - Lily Wallet";
    var history = react_router_dom_1.useHistory();
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(FormContainer, null,
            react_1.default.createElement(SelectDeviceContainer, null,
                react_1.default.createElement(DevicesWrapper, null,
                    react_1.default.createElement("h1", null, "Import File to Coldcard"),
                    react_1.default.createElement(Instructions, { style: { marginTop: '1em' } }, "1) Drag and drop coldcard_import_file.txt into an SD Card"),
                    react_1.default.createElement(Instructions, null, "2) Put SD Card into Coldcard Wallet"),
                    react_1.default.createElement(Instructions, null, "3) Import Wallet: Settings > Multisig Wallets > Import from SD"),
                    react_1.default.createElement(ScanDevicesButton, { onClick: function () { return history.push('/vault'); } }, "I have completed these instructions"))))));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  text-align: left;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  align-items: center;\n  display: flex;\n  flex: 1;\n  justify-content: center;\n  flex-direction: column;\n  padding-top: 150px;\n"], ["\n  width: 100%;\n  text-align: left;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  align-items: center;\n  display: flex;\n  flex: 1;\n  justify-content: center;\n  flex-direction: column;\n  padding-top: 150px;\n"])), colors_1.black);
var Instructions = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  align-self: flex-start;\n  padding: 0.35em;\n"], ["\n  color: ", ";\n  align-self: flex-start;\n  padding: 0.35em;\n"])), colors_1.darkGray);
var FormContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  width: 100%;\n  justify-content: center;\n"], ["\n  display: flex;\n  width: 100%;\n  justify-content: center;\n"])));
var SelectDeviceContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  max-width: 750px;\n  background: #fff;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  border-radius: 4px;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  margin: 18px;\n"], ["\n  max-width: 750px;\n  background: #fff;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  border-radius: 4px;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  margin: 18px;\n"])));
var ScanDevicesButton = styled_components_1.default(react_router_dom_1.Link)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", ";\n  padding: 1em;\n  font-size: 1em;\n  margin-top: 2.5em;\n  font-weight: 700;\n"], ["\n  ", ";\n  padding: 1em;\n  font-size: 1em;\n  margin-top: 2.5em;\n  font-weight: 700;\n"])), components_1.Button);
var DevicesWrapper = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-height: 400px;\n  flex-wrap: wrap;\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-height: 400px;\n  flex-wrap: wrap;\n"])));
exports.default = ColdcardImportInstructions;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ColdcardImportInstructions.js.map