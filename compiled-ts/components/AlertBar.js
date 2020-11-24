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
var react_router_dom_1 = require("react-router-dom");
var moment_1 = __importDefault(require("moment"));
var ionicons_outline_1 = require("@styled-icons/ionicons-outline");
var _1 = require(".");
var colors_1 = require("../utils/colors");
exports.AlertBar = function (_a) {
    var config = _a.config, nodeConfig = _a.nodeConfig;
    var history = react_router_dom_1.useHistory();
    var blockDiff;
    if (nodeConfig) {
        blockDiff = config.license.expires - nodeConfig.blocks;
    }
    else {
        blockDiff = config.license.expires;
    }
    var blockDiffTimeEst = blockDiff * 10;
    var expireAsDate = moment_1.default().add(blockDiffTimeEst, "minutes");
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(HeightHolder, null),
        react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(Container, null,
                react_1.default.createElement(TextContainer, null,
                    react_1.default.createElement(IconWrapper, null,
                        react_1.default.createElement(Icon, null)),
                    react_1.default.createElement(Text, null,
                        "Your license will expire in ",
                        blockDiff,
                        " blocks (approx. ",
                        expireAsDate.fromNow(),
                        ")")),
                react_1.default.createElement(BuyButton, { background: colors_1.white, color: colors_1.yellow500, onClick: function () { return history.push('purchase'); } }, "Buy a License")))));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  z-index: 2;\n  position: fixed;\n  top: 2.5em;\n  width: 100%;\n"], ["\n  background: ", ";\n  z-index: 2;\n  position: fixed;\n  top: 2.5em;\n  width: 100%;\n"])), colors_1.yellow500);
var HeightHolder = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: 2.5rem;\n  z-index: 0;\n  background: transparent;\n"], ["\n  height: 2.5rem;\n  z-index: 0;\n  background: transparent;\n"])));
var Container = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  max-width: 80rem;\n  width: 100%;\n  padding-right: 2rem;\n  padding-left: 2rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  margin: 0 auto;\n"], ["\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  max-width: 80rem;\n  width: 100%;\n  padding-right: 2rem;\n  padding-left: 2rem;\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  margin: 0 auto;\n"])));
var TextContainer = styled_components_1.default.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex: 1;\n  display: flex;\n  align-items: center;\n"], ["\n  flex: 1;\n  display: flex;\n  align-items: center;\n"])));
var IconWrapper = styled_components_1.default.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background: ", ";\n  padding: 0.5rem;\n  border-radius: 0.5rem;\n  display: flex;\n"], ["\n  background: ", ";\n  padding: 0.5rem;\n  border-radius: 0.5rem;\n  display: flex;\n"])), colors_1.yellow600);
var Icon = styled_components_1.default(ionicons_outline_1.Alert)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  width: 1.5rem;\n"], ["\n  color: ", ";\n  width: 1.5rem;\n"])), colors_1.white);
var Text = styled_components_1.default.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: ", ";\n  margin-left: 0.75em;\n  font-weight: 500;\n"], ["\n  color: ", ";\n  margin-left: 0.75em;\n  font-weight: 500;\n"])), colors_1.white);
var BuyButton = styled_components_1.default.button(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", "\n  font-size: 0.75em;\n  padding: 0.5em 1em;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 600;\n"], ["\n  ", "\n  font-size: 0.75em;\n  padding: 0.5em 1em;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 600;\n"])), _1.Button);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=AlertBar.js.map