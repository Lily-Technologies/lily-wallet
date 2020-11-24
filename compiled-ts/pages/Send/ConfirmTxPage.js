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
var SignWithDevice_1 = __importDefault(require("./SignWithDevice"));
var TransactionDetails_1 = __importDefault(require("./TransactionDetails"));
var PsbtQrCode_1 = __importDefault(require("./PsbtQrCode"));
var AccountMapContext_1 = require("../../AccountMapContext");
var components_1 = require("../../components");
var send_1 = require("../../utils/send");
var ConfirmTxPage = function (_a) {
    var finalPsbt = _a.finalPsbt, setFinalPsbt = _a.setFinalPsbt, sendTransaction = _a.sendTransaction, feeRates = _a.feeRates, setStep = _a.setStep, currentBitcoinPrice = _a.currentBitcoinPrice, currentBitcoinNetwork = _a.currentBitcoinNetwork, createTransactionAndSetState = _a.createTransactionAndSetState;
    var currentAccount = react_1.useContext(AccountMapContext_1.AccountMapContext).currentAccount;
    var _b = react_1.useState([]), signedDevices = _b[0], setSignedDevices = _b[1];
    var fileUploadLabelRef = react_1.useRef(null);
    var _c = react_1.useState(false), modalIsOpen = _c[0], setModalIsOpen = _c[1];
    var _d = react_1.useState(null), modalContent = _d[0], setModalContent = _d[1];
    var _e = react_1.useState(''), importSignatureFromFileError = _e[0], setImportSignatureFromFileError = _e[1];
    // if the finalPsbt has signatures on it already, update signed device view
    react_1.useEffect(function () {
        if (currentAccount.config.quorum.requiredSigners > 1) { // KBC-TODO: this needs to handle the single hww case
            var signedDevicesObjects = send_1.getSignedDevicesFromPsbt(finalPsbt, currentAccount.config.extendedPublicKeys);
            setSignedDevices(signedDevicesObjects);
        }
        // signTransactionIfSingleSigner(finalPsbt);
    }, [finalPsbt]);
    var openInModal = function (component) {
        setModalIsOpen(true);
        setModalContent(component);
    };
    var closeModal = function () {
        setModalIsOpen(false);
        setModalContent(null);
    };
    // KBC-TODO: add test
    // const signTransactionIfSingleSigner = async (psbt: Psbt) => {
    //   // if only single sign, then sign tx right away
    //   if (currentAccount.config.mnemonic) {
    //     const seed = await mnemonicToSeed(currentAccount.config.mnemonic);
    //     const root = bip32.fromSeed(seed, currentBitcoinNetwork);
    //     psbt.signAllInputsHD(root);
    //     psbt.validateSignaturesOfAllInputs();
    //     psbt.finalizeAllInputs();
    //     setSignedDevices([{ // we need to set a signed device for flow to continue, so set it as lily
    //       model: 'lily',
    //       type: 'lily',
    //       fingerprint: 'whatever'
    //     }]) // this could probably have better information in it but
    //     setSignedPsbts([psbt.toBase64()]);
    //   }
    // }
    var importSignatureFromFile = function (file) {
        try {
            var psbt = send_1.getPsbtFromText(file);
            var combinedPsbt = send_1.combinePsbts(finalPsbt, psbt);
            send_1.validateTxForAccount(combinedPsbt, currentAccount);
            var signedDevicesObjects = send_1.getSignedDevicesFromPsbt(finalPsbt, currentAccount.config.extendedPublicKeys);
            setSignedDevices(signedDevicesObjects);
            setFinalPsbt(combinedPsbt);
        }
        catch (e) {
            console.log('e: ', e);
            setImportSignatureFromFileError(e.message);
        }
    };
    var phoneAction = currentAccount.config.extendedPublicKeys && currentAccount.config.extendedPublicKeys.filter(function (item) { return item.device && item.device.type === 'phone'; }).length ? function () { return openInModal(react_1.default.createElement(PsbtQrCode_1.default, { psbt: finalPsbt.toBase64() })); } : undefined;
    return (react_1.default.createElement(components_1.GridArea, null,
        react_1.default.createElement(components_1.FileUploader, { accept: "*", id: "txFile", onFileLoad: function (_a) {
                var file = _a.file;
                importSignatureFromFile(file);
            } }),
        react_1.default.createElement("label", { style: { display: 'none' }, ref: fileUploadLabelRef, htmlFor: "txFile" }),
        react_1.default.createElement(components_1.Modal, { isOpen: modalIsOpen, onRequestClose: function () { return closeModal(); } }, modalContent),
        react_1.default.createElement(TransactionDetails_1.default, { finalPsbt: finalPsbt, sendTransaction: sendTransaction, feeRates: feeRates, setStep: setStep, signedDevices: signedDevices, currentBitcoinNetwork: currentBitcoinNetwork, currentBitcoinPrice: currentBitcoinPrice, currentAccount: currentAccount, createTransactionAndSetState: createTransactionAndSetState }),
        !currentAccount.config.mnemonic && finalPsbt && (react_1.default.createElement(SignWithDevice_1.default, { finalPsbt: finalPsbt, setFinalPsbt: setFinalPsbt, signedDevices: signedDevices, signThreshold: currentAccount.config.quorum.requiredSigners, fileUploadLabelRef: fileUploadLabelRef, phoneAction: phoneAction }))));
};
var AccountSendContentRight = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  width: 100%;\n"], ["\n  min-height: 400px;\n  padding: 0;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  width: 100%;\n"])));
exports.default = ConfirmTxPage;
var templateObject_1;
//# sourceMappingURL=ConfirmTxPage.js.map