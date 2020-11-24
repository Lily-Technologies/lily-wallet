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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var react_modal_1 = __importDefault(require("react-modal"));
var ionicons_outline_1 = require("@styled-icons/ionicons-outline");
var _1 = require(".");
var colors_1 = require("../utils/colors");
exports.Modal = function (_a) {
    var isOpen = _a.isOpen, onAfterOpen = _a.onAfterOpen, onRequestClose = _a.onRequestClose, _b = _a.style, style = _b === void 0 ? { content: {}, overlay: {} } : _b, children = _a.children;
    var _c = react_1.useState(false), localOpen = _c[0], setLocalOpen = _c[1];
    var afterOpen = function () {
        setLocalOpen(true);
        onAfterOpen && onAfterOpen();
    };
    var requestClose = function () {
        setLocalOpen(false);
        onRequestClose && (setTimeout(function () { onRequestClose(); }, 100) // wait for transition to complete
        );
    };
    var styles = {
        content: __assign({ background: colors_1.white, opacity: 1, boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)', borderRadius: '.5rem', border: 'none', maxWidth: '50em', padding: '0', position: 'relative', width: '100%', transform: localOpen ? 'scale(1)' : 'scale(0.9)', transition: 'transform 0.25s' }, style.content),
        overlay: __assign({ background: localOpen ? 'rgba(31, 31, 31, 0.75)' : 'rgba(31, 31, 31, 0)', transition: 'background 0.25s', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }, style.overlay)
    };
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, onAfterOpen: afterOpen, onRequestClose: requestClose, style: styles, contentLabel: "Example Modal" },
        children,
        react_1.default.createElement(CloseButtonContainer, null,
            react_1.default.createElement(_1.StyledIcon, { onClick: function () { return requestClose(); }, as: ionicons_outline_1.Close, size: 36, style: { cursor: 'pointer' } }))));
};
var CloseButtonContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding-right: 1em;\n  padding-top: 1em;\n  color: ", ";\n\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding-right: 1em;\n  padding-top: 1em;\n  color: ", ";\n\n  &:hover {\n    color: ", ";\n  }\n"])), colors_1.gray400, colors_1.gray600);
var templateObject_1;
//# sourceMappingURL=Modal.js.map