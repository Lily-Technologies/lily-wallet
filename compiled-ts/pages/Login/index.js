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
var react_router_dom_1 = require("react-router-dom");
var styled_components_1 = __importStar(require("styled-components"));
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var moment_1 = __importDefault(require("moment"));
var crypto_js_1 = require("crypto-js");
var evaicons_outline_1 = require("@styled-icons/evaicons-outline");
var components_1 = require("../../components");
var colors_1 = require("../../utils/colors");
var files_1 = require("../../utils/files");
var media_1 = require("../../utils/media");
var files_2 = require("../../utils/files");
var MIN_PASSWORD_LENGTH = 8;
var Login = function (_a) {
    var config = _a.config, setConfigFile = _a.setConfigFile, currentBitcoinNetwork = _a.currentBitcoinNetwork, encryptedConfigFile = _a.encryptedConfigFile, setEncryptedConfigFile = _a.setEncryptedConfigFile, setPassword = _a.setPassword, currentBlockHeight = _a.currentBlockHeight;
    document.title = "Login - Lily Wallet";
    var _b = react_1.useState(''), localPassword = _b[0], setLocalPassword = _b[1];
    var _c = react_1.useState(undefined), passwordError = _c[0], setPasswordError = _c[1];
    var _d = react_1.useState(''), confirmation = _d[0], setConfirmation = _d[1];
    var _e = react_1.useState(undefined), confirmationError = _e[0], setConfirmationError = _e[1];
    var _f = react_1.useState(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = react_1.useState(0), step = _g[0], setStep = _g[1];
    var history = react_router_dom_1.useHistory();
    var unlockFile = function () {
        setIsLoading(true);
        if (encryptedConfigFile) {
            try {
                var bytes = crypto_js_1.AES.decrypt(encryptedConfigFile.file, localPassword);
                var decryptedData_1 = JSON.parse(bytes.toString(crypto_js_1.enc.Utf8));
                setPasswordError(undefined);
                setTimeout(function () {
                    setConfigFile(decryptedData_1);
                    setPassword(localPassword);
                    files_2.saveConfig(decryptedData_1, localPassword); // we resave the file after opening to update the modifiedDate value
                    setIsLoading(false);
                    history.replace("/");
                }, 2000);
            }
            catch (e) {
                setPasswordError('Incorrect Password');
                setIsLoading(false);
            }
        }
        else {
            if (currentBlockHeight) {
                try {
                    var configCopy_1 = __assign({}, config);
                    configCopy_1.isEmpty = false;
                    configCopy_1.license.trial = true;
                    configCopy_1.license.expires = currentBlockHeight + 4320; // one month free trial (6 * 24 * 30)
                    setTimeout(function () {
                        setConfigFile(configCopy_1);
                        files_2.saveConfig(configCopy_1, localPassword); // we save a blank config file
                        setPassword(localPassword);
                        setIsLoading(false);
                        history.replace("/");
                    }, 2000);
                }
                catch (e) {
                    setPasswordError('Error. Try again.');
                    setIsLoading(false);
                }
            }
            else {
                setPasswordError('Server error. Please try restarting.');
                setIsLoading(false);
            }
        }
    };
    var onInputEnter = function (e) {
        if (encryptedConfigFile && e.key === 'Enter') {
            unlockFile();
        }
    };
    var validateInput = function () {
        if (localPassword && localPassword.length < MIN_PASSWORD_LENGTH) {
            setPasswordError("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long");
            return false;
        }
        else if (localPassword && confirmation && localPassword !== confirmation) {
            setConfirmationError('Password doesn\'t match confirmation');
            return false;
        }
        else {
            setPasswordError(undefined);
            setConfirmationError(undefined);
            return true;
        }
    };
    return (react_1.default.createElement(PageWrapper, null,
        react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(MainText, null,
                files_1.bitcoinNetworkEqual(currentBitcoinNetwork, bitcoinjs_lib_1.networks.testnet) ?
                    react_1.default.createElement(LilyLogoGray, { src: require('../../assets/flower.svg') }) :
                    react_1.default.createElement(LilyLogo, { src: require('../../assets/flower.svg') }),
                react_1.default.createElement(TextContainer, null,
                    react_1.default.createElement("div", null, encryptedConfigFile ? 'Unlock your account' : 'Welcome to Lily Wallet'),
                    react_1.default.createElement(Subtext, null, encryptedConfigFile ? (react_1.default.createElement(react_1.Fragment, null,
                        "or ",
                        react_1.default.createElement(SubTextLink, { onClick: function () { return setEncryptedConfigFile(null); } }, "create a new one"))) : ("The best way to secure your bitcoin")))),
            react_1.default.createElement(components_1.FileUploader, { accept: "*", id: "localConfigFile", onFileLoad: function (file) {
                    setEncryptedConfigFile(file);
                } }),
            react_1.default.createElement(SignupOptionMenu, null,
                encryptedConfigFile || step === 1 ? (react_1.default.createElement(SignupOptionItem, null,
                    !encryptedConfigFile && (react_1.default.createElement(ExplainerText, null, "Lily encrypts the information about your account on your local machine. This password will be used to decrypt this information when you use Lily in the future.")),
                    react_1.default.createElement(InputContainer, null,
                        react_1.default.createElement(components_1.Input, { autoFocus: true, label: "Password", value: localPassword, onKeyDown: function (e) { return onInputEnter(e); }, onChange: setLocalPassword, error: !!passwordError, type: "password" }),
                        passwordError !== undefined && react_1.default.createElement(PasswordError, null, passwordError)),
                    !encryptedConfigFile && (react_1.default.createElement(InputContainer, { style: { paddingBottom: '.5em' } },
                        react_1.default.createElement(components_1.Input, { label: "Confirm Password", value: confirmation, onKeyDown: function (e) { return onInputEnter(e); }, onChange: setConfirmation, error: !!confirmationError, type: "password" }),
                        confirmationError !== undefined && react_1.default.createElement(PasswordError, null, confirmationError))),
                    react_1.default.createElement(SignInButton, { background: colors_1.green500, color: colors_1.white, onClick: function () {
                            if (!encryptedConfigFile) {
                                if (validateInput()) {
                                    unlockFile();
                                }
                            }
                            else {
                                unlockFile();
                            }
                        } },
                        isLoading && !encryptedConfigFile ? 'Loading' : isLoading ? 'Unlocking' : encryptedConfigFile ? 'Unlock' : 'Continue',
                        isLoading ? react_1.default.createElement(LoadingImage, { alt: "loading placeholder", src: require('../../assets/flower-loading.svg') }) : react_1.default.createElement(components_1.StyledIcon, { as: evaicons_outline_1.ArrowIosForwardOutline, size: 24 })),
                    encryptedConfigFile && passwordError && react_1.default.createElement(PasswordError, null, passwordError),
                    encryptedConfigFile && react_1.default.createElement(SignupOptionSubtext, null,
                        "Last accessed on ",
                        encryptedConfigFile && moment_1.default(encryptedConfigFile.modifiedTime).format('MM/DD/YYYY')))) : (react_1.default.createElement(SignupOptionItem, null,
                    react_1.default.createElement(CreateNewAccountButton, { background: colors_1.green500, color: colors_1.white, onClick: function () { return setStep(1); } }, "Get Started"))),
                react_1.default.createElement(LoadFromFile, null,
                    "You can also restore a wallet ",
                    react_1.default.createElement(LabelOverlay, { htmlFor: "localConfigFile" },
                        react_1.default.createElement(SubTextLink, null, "from a backup file"))))),
        react_1.default.createElement(LilyImageContainer, null,
            react_1.default.createElement(LilyImage, { src: require('../../assets/lily-image.jpg') }))));
};
var ExplainerText = styled_components_1.default.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.75em;\n  padding: 0 0 1.5em 0;\n  text-align: left;\n"], ["\n  color: ", ";\n  font-size: 0.75em;\n  padding: 0 0 1.5em 0;\n  text-align: left;\n"])), colors_1.gray900);
var LoadingImage = styled_components_1.default.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  filter: brightness(0) invert(1);\n  max-width: 1.25em;\n  margin-left: .25em;\n  opacity: 0.9;\n"], ["\n  filter: brightness(0) invert(1);\n  max-width: 1.25em;\n  margin-left: .25em;\n  opacity: 0.9;\n"])));
var SignInButton = styled_components_1.default.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", ";\n  padding-top: .5em;\n  padding-bottom: .5em;\n  font-size: 1em;\n  width: 100%;\n  justify-content: center;\n"], ["\n  ", ";\n  padding-top: .5em;\n  padding-bottom: .5em;\n  font-size: 1em;\n  width: 100%;\n  justify-content: center;\n"])), components_1.Button);
var InputContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  align-items: flex-start;\n  margin-bottom: .75em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  align-items: flex-start;\n  margin-bottom: .75em;\n"])));
var PasswordError = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 0.75em;\n  margin-top: .5em;\n"], ["\n  color: ", ";\n  font-size: 0.75em;\n  margin-top: .5em;\n"])), colors_1.red);
var SignupOptionSubtext = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: .75em;\n  margin-top: 1em;\n  color: ", ";\n  padding: 0 2em;\n  line-height: 1.5em;\n  white-space: normal;\n"], ["\n  font-size: .75em;\n  margin-top: 1em;\n  color: ", ";\n  padding: 0 2em;\n  line-height: 1.5em;\n  white-space: normal;\n"])), colors_1.darkGray);
var SignupOptionItem = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  width: 100%;\n  max-width: 22em;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 2em;\n  border-radius: 4px;\n  align-items: center;\n  justify-content: center;\n  font-size: 1em;\n  // min-height: 12em;\n  background: ", ";\n"], ["\n  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);\n  width: 100%;\n  max-width: 22em;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 2em;\n  border-radius: 4px;\n  align-items: center;\n  justify-content: center;\n  font-size: 1em;\n  // min-height: 12em;\n  background: ", ";\n"])), colors_1.white);
var CreateNewAccountButton = styled_components_1.default.button(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  ", ";\n  width: auto;\n  text-align: right;\n  align-self: center;\n  font-size: 1em;\n"], ["\n  ", ";\n  width: auto;\n  text-align: right;\n  align-self: center;\n  font-size: 1em;\n"])), components_1.Button);
var LoadFromFile = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: ", ";\n  padding-top: 1em;\n  font-size: .75em;\n"], ["\n  color: ", ";\n  padding-top: 1em;\n  font-size: .75em;\n"])), colors_1.gray500);
var PageWrapper = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  display: flex;\n  min-height: 98vh;\n  width: 100%;\n\n  ", ";\n"], ["\n  display: flex;\n  min-height: 98vh;\n  width: 100%;\n\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n    justify-content: center;\n  "], ["\n    justify-content: center;\n  "])))));
var LilyImage = styled_components_1.default.img(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  // width: 100%;\n  height: 100%;\n  object-fit: cover;\n  vertical-align: middle;\n  width: 100%;\n"], ["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  // width: 100%;\n  height: 100%;\n  object-fit: cover;\n  vertical-align: middle;\n  width: 100%;\n"])));
var LilyImageContainer = styled_components_1.default.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  position: relative;\n  width: 0;\n  flex: 1 1 0%;\n  display: block;\n  ", ";\n"], ["\n  position: relative;\n  width: 0;\n  flex: 1 1 0%;\n  display: block;\n  ",
    ";\n"])), media_1.mobile(styled_components_1.css(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n    display: none;\n  "], ["\n    display: none;\n  "])))));
var Wrapper = styled_components_1.default.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  align-items: center;\n  display: flex;\n  flex: none;\n  flex-direction: column;\n  padding-top: 48px;\n  padding: 5em;\n  justify-content: center;\n  position: relative;\n"], ["\n  text-align: center;\n  font-family: 'Montserrat', sans-serif;\n  color: ", ";\n  align-items: center;\n  display: flex;\n  flex: none;\n  flex-direction: column;\n  padding-top: 48px;\n  padding: 5em;\n  justify-content: center;\n  position: relative;\n"])), colors_1.black);
var MainText = styled_components_1.default.div(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  display: flex;\n  font-size: 2em;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 8px;\n  flex-wrap: wrap;\n  flex-direction: column;\n  align-items: flex-start;\n  width: 100%;\n  font-weight: 600;\n"], ["\n  display: flex;\n  font-size: 2em;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 8px;\n  flex-wrap: wrap;\n  flex-direction: column;\n  align-items: flex-start;\n  width: 100%;\n  font-weight: 600;\n"])));
var TextContainer = styled_components_1.default.div(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  text-align: left;\n  justify-content: center;\n  margin-top: .5em;\n"], ["\n  display: flex;\n  flex-direction: column;\n  text-align: left;\n  justify-content: center;\n  margin-top: .5em;\n"])));
var Subtext = styled_components_1.default.div(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  font-size: .5em;\n  color: ", ";\n  // margin-bottom: .75em;\n  font-weight: 500;\n  margin-top: .5em;\n"], ["\n  font-size: .5em;\n  color: ", ";\n  // margin-bottom: .75em;\n  font-weight: 500;\n  margin-top: .5em;\n"])), colors_1.darkGray);
var SubTextLink = styled_components_1.default.span(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  color: ", ";\n\n  &:hover {\n    text-decoration: underline;\n    cursor: pointer;\n  }\n"], ["\n  color: ", ";\n\n  &:hover {\n    text-decoration: underline;\n    cursor: pointer;\n  }\n"])), colors_1.green600);
var LilyLogo = styled_components_1.default.img(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n  width: 100px;\n  height: 100px;\n  margin-right: 12px;\n"], ["\n  width: 100px;\n  height: 100px;\n  margin-right: 12px;\n"])));
var LilyLogoGray = styled_components_1.default.img(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n  width: 100px;\n  height: 100px;\n  margin-right: 12px;\n  filter: grayscale(100%);\n"], ["\n  width: 100px;\n  height: 100px;\n  margin-right: 12px;\n  filter: grayscale(100%);\n"])));
var LabelOverlay = styled_components_1.default.label(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var SignupOptionMenu = styled_components_1.default.div(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n  width: 100%;\n  padding-top: 1.75em;\n  flex-direction: column;\n  display: flex;\n"], ["\n  width: 100%;\n  padding-top: 1.75em;\n  flex-direction: column;\n  display: flex;\n"])));
exports.default = Login;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23;
//# sourceMappingURL=index.js.map