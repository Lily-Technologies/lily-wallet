"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// KBC-TODO: Figure out why this wasnt working before
// KBC-TODO: reimplement this component in App.tsx
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (react_1.default.createElement(ErrorBoundaryContainer, null,
                react_1.default.createElement(LilyImage, { src: require('../assets/flower.svg') }),
                react_1.default.createElement("h1", null, "Oops, something went wrong."),
                react_1.default.createElement("h3", null,
                    "Please ",
                    react_1.default.createElement("a", { href: "mailto:kaybesee@gmail.com", target: "_blank", rel: "noopener noreferrer" }, "contact us"),
                    " to report the error.")));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.default.Component));
exports.ErrorBoundary = ErrorBoundary;
var ErrorBoundaryContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n"])));
var LilyImage = styled_components_1.default.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 9em;\n  height: 9em;\n"], ["\n  width: 9em;\n  height: 9em;\n"])));
var templateObject_1, templateObject_2;
//# sourceMappingURL=ErrorBoundary.js.map