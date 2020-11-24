"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var axios_1 = __importDefault(require("axios"));
var _1 = require(".");
var colors_1 = require("../utils/colors");
exports.LicenseModal = function (_a) {
    var isOpen = _a.isOpen, onRequestClose = _a.onRequestClose, config = _a.config, nodeConfig = _a.nodeConfig;
    // KBC-TODO: Have this do something
    var clickRenewLicense = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get(process.env.REACT_APP_LILY_ENDPOINT + "/payment-address")];
                case 1:
                    data = (_a.sent()).data;
                    console.log('data: ', data);
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(_1.Modal, { isOpen: isOpen, onRequestClose: onRequestClose },
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ModalHeader, null,
                react_1.default.createElement(HeaderText, null, "License Information")),
            react_1.default.createElement(_1.LicenseInformation, { config: config, nodeConfig: nodeConfig }),
            react_1.default.createElement(Buttons, null,
                react_1.default.createElement(RenewButton, { style: { border: "1px solid " + colors_1.gray400, marginRight: '1em' }, color: colors_1.gray900, background: colors_1.white }, "Contact Support"),
                react_1.default.createElement(RenewButton, { onClick: function () { return clickRenewLicense(); }, color: colors_1.white, background: colors_1.green600 }, "Renew License")))));
};
var ModalHeader = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  margin-top: -.5rem;\n  justify-content: space-between;\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid ", ";\n"], ["\n  padding-top: 1.25rem;\n  padding-bottom: 1.25rem;\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n  margin-top: -.5rem;\n  justify-content: space-between;\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid ", ";\n"])), colors_1.gray300);
var HeaderText = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: .5rem;\n  font-size: 1.125rem;\n  line-height: 1.5rem;\n  font-weight: 500;\n"], ["\n  margin-top: .5rem;\n  font-size: 1.125rem;\n  line-height: 1.5rem;\n  font-weight: 500;\n"])));
var Buttons = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: flex-end;\n  padding: 1em 2em 2em;\n"], ["\n  display: flex;\n  justify-content: flex-end;\n  padding: 1em 2em 2em;\n"])));
var RenewButton = styled_components_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n"], ["\n  ", ";\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n"])), _1.Button);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=LicenseModal.js.map