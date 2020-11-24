"use strict";
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
var prop_types_1 = __importDefault(require("prop-types"));
/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, onOutsideClick) {
    react_1.useEffect(function () {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onOutsideClick]);
}
/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(_a) {
    var onOutsideClick = _a.onOutsideClick, children = _a.children;
    var wrapperRef = react_1.useRef(null);
    useOutsideAlerter(wrapperRef, onOutsideClick);
    return react_1.default.createElement("div", { ref: wrapperRef }, children);
}
OutsideAlerter.propTypes = {
    children: prop_types_1.default.element.isRequired
};
exports.default = OutsideAlerter;
//# sourceMappingURL=OutsideClick.js.map