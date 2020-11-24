"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var evaicons_outline_1 = require("@styled-icons/evaicons-outline");
var _1 = require(".");
var colors_1 = require("../utils/colors");
var media_1 = require("../utils/media");
exports.MobileNavbar = function (_a) {
    var config = _a.config, mobileNavOpen = _a.mobileNavOpen, setMobileNavOpen = _a.setMobileNavOpen, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(_1.Transition, { show: mobileNavOpen, enter: "transition ease-linear duration-300", enterFrom: "transform opacity-0", enterTo: "transform opacity-100", leave: "transition ease-linear duration-300", leaveFrom: "transform opacity-100", leaveTo: "transform opacity-0", appear: undefined },
            react_1.default.createElement(BackgroundContainer, { onClick: function () { return setMobileNavOpen(false); } },
                react_1.default.createElement(BackgroundOverlay, null))),
        react_1.default.createElement(_1.Transition, { show: mobileNavOpen, enter: "transition ease-in-out duration-300 transform", enterFrom: "-translate-x-full", enterTo: "translate-x-0", leave: "transition ease-in-out duration-300 transform", leaveFrom: "translate-x-0", leaveTo: "-translate-x-full", appear: undefined },
            react_1.default.createElement(SomeContainer, null,
                react_1.default.createElement(SidebarContainer, null,
                    react_1.default.createElement(NavLinksContainer, null,
                        react_1.default.createElement(_1.NavLinks, { config: config, currentBitcoinNetwork: currentBitcoinNetwork })),
                    react_1.default.createElement(CloseButtonContainer, null,
                        react_1.default.createElement(CloseButton, { background: "transparent", color: colors_1.white, onClick: function () { return setMobileNavOpen(false); } },
                            react_1.default.createElement(_1.StyledIcon, { as: evaicons_outline_1.CloseOutline, size: 36 }))))))));
};
var Wrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: none;\n  ", "\n"], ["\n  display: none;\n  ",
    "\n"])), media_1.mobile(styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n  "], ["\n    display: flex;\n  "])))));
var NavLinksContainer = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  overflow: scroll;\n  height: 100vh;\n"], ["\n  overflow: scroll;\n  height: 100vh;\n"])));
var SidebarContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  height: 100%;\n  width: 12em;\n  background: ", ";\n  z-index: 100;\n  padding-top: 1em;\n"], ["\n  position: relative;\n  height: 100%;\n  width: 12em;\n  background: ", ";\n  z-index: 100;\n  padding-top: 1em;\n"])), colors_1.white);
var CloseButton = styled_components_1.default.button(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n  width: 3rem;\n  height: 3rem;\n  padding: 0;\n"], ["\n  ", "\n  width: 3rem;\n  height: 3rem;\n  padding: 0;\n"])), _1.Button);
var CloseButtonContainer = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: none;\n  overflow: hidden;\n  // height: 100vh;\n  z-index: 50;\n  ", ";\n"], ["\n  display: none;\n  overflow: hidden;\n  // height: 100vh;\n  z-index: 50;\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    display: flex;\n    margin-right: -3.5em;\n    position: absolute;\n    top: 0;\n    right: 0;\n    padding: .25rem;\n  "], ["\n    display: flex;\n    margin-right: -3.5em;\n    position: absolute;\n    top: 0;\n    right: 0;\n    padding: .25rem;\n  "])))));
var BackgroundContainer = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: flex;\n  z-index: 40;\n"], ["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: flex;\n  z-index: 40;\n"])));
var SomeContainer = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: flex;\n  z-index: 40;\n"], ["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: flex;\n  z-index: 40;\n"])));
var BackgroundOverlay = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  opacity: 0.75;\n  background: ", ";\n"], ["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  opacity: 0.75;\n  background: ", ";\n"])), colors_1.gray800);
exports.default = exports.MobileNavbar;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=MobileNavbar.js.map