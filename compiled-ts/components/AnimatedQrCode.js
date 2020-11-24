"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_qr_svg_1 = require("react-qr-svg");
var colors_1 = require("../utils/colors");
exports.AnimatedQrCode = function (_a) {
    var valueArray = _a.valueArray;
    var _b = react_1.useState(0), step = _b[0], setStep = _b[1];
    setTimeout(function () {
        if (step < valueArray.length - 1) {
            setStep(step + 1);
        }
        else {
            setStep(0);
        }
    }, 500);
    return (react_1.default.createElement(react_qr_svg_1.QRCode, { bgColor: colors_1.white, fgColor: colors_1.black, level: "Q", style: { width: 256 }, value: valueArray[step] }));
};
//# sourceMappingURL=AnimatedQrCode.js.map