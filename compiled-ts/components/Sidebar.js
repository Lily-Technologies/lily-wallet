"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var react_spring_1 = require("react-spring");
var NavLinks_1 = require("./NavLinks");
var colors_1 = require("../utils/colors");
var media_1 = require("../utils/media");
exports.Sidebar = function (_a) {
    var config = _a.config, flyInAnimation = _a.flyInAnimation, currentBitcoinNetwork = _a.currentBitcoinNetwork;
    var sidebarAnimationProps = react_spring_1.useSpring({ transform: flyInAnimation ? 'translateX(-120%)' : 'translateX(0%)' });
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(SidebarPlaceholder, null),
        react_1.default.createElement(SidebarWrapperAnimated, { style: __assign({}, sidebarAnimationProps) },
            react_1.default.createElement(SidebarContainer, null,
                react_1.default.createElement(NavLinks_1.NavLinks, { config: config, currentBitcoinNetwork: currentBitcoinNetwork })))));
};
var SidebarPlaceholder = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 12em;\n"], ["\n  width: 12em;\n"])));
var SidebarWrapper = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  width: 12em;\n  // min-height: 100vh;\n  border: solid 1px ", ";\n  border-left: none;\n  height: 100vh;\n  position: fixed;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n\n  ", ";\n"], ["\n  display: flex;\n  flex-direction: column;\n  width: 12em;\n  // min-height: 100vh;\n  border: solid 1px ", ";\n  border-left: none;\n  height: 100vh;\n  position: fixed;\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n\n  ",
    ";\n"])), colors_1.darkOffWhite, media_1.mobile(styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    flex-direction: row;\n    display: none;\n    height: auto;\n  "], ["\n    flex-direction: row;\n    display: none;\n    height: auto;\n  "])))));
var SidebarWrapperAnimated = react_spring_1.animated(SidebarWrapper);
var SidebarContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: fixed;\n  height: 100%;\n  width: 12em;\n  background: ", ";\n  overflow: scroll;\n  padding-bottom: 4em;\n"], ["\n  position: fixed;\n  height: 100%;\n  width: 12em;\n  background: ", ";\n  overflow: scroll;\n  padding-bottom: 4em;\n"])), colors_1.white);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=Sidebar.js.map