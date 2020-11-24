"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var unchained_bitcoin_1 = require("unchained-bitcoin");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var coinselect_1 = __importDefault(require("coinselect"));
var other_1 = require("./other");
var files_1 = require("./files");
var getTxHex = function (txid, currentBitcoinNetwork) { return __awaiter(void 0, void 0, void 0, function () {
    var txHex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get(unchained_bitcoin_1.blockExplorerAPIURL("/tx/" + txid + "/hex", files_1.getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))];
            case 1: return [4 /*yield*/, (_a.sent()).data];
            case 2:
                txHex = _a.sent();
                return [2 /*return*/, txHex];
        }
    });
}); };
exports.combinePsbts = function (finalPsbt, signedPsbt) {
    var combinedPsbt = finalPsbt.combine(signedPsbt);
    return combinedPsbt;
};
exports.validateAddress = function (recipientAddress, currentBitcoinNetwork) {
    try {
        bitcoinjs_lib_1.address.toOutputScript(recipientAddress, currentBitcoinNetwork);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.validateSendAmount = function (sendAmount, currentBalance) {
    if (unchained_bitcoin_1.satoshisToBitcoins(new bignumber_js_1.default(currentBalance)).isGreaterThan(sendAmount)) {
        return true;
    }
    else {
        return false;
    }
};
exports.validateTxForAccount = function (psbt, currentAccount) {
    var availableUtxos = currentAccount.availableUtxos;
    var utxosMap = exports.createUtxoMapFromUtxoArray(availableUtxos);
    for (var i = 0; i < psbt.txInputs.length; i++) {
        var currentInput = psbt.txInputs[i];
        var inputBuffer = other_1.cloneBuffer(currentInput.hash);
        var currentUtxo = utxosMap[inputBuffer.reverse().toString('hex') + ":" + currentInput.index];
        if (!currentUtxo) {
            throw new Error('This transaction isn\'t associated with this wallet');
        }
        ;
    }
    return true;
};
exports.createUtxoMapFromUtxoArray = function (utxosArray) {
    var utxoMap = {};
    utxosArray.forEach(function (utxo) {
        utxoMap[utxo.txid + ":" + utxo.vout] = utxo;
    });
    return utxoMap;
};
exports.createTransactionMapFromTransactionArray = function (transactionsArray) {
    var transactionMap = {};
    transactionsArray.forEach(function (tx) {
        transactionMap[tx.txid] = tx;
    });
    return transactionMap;
};
// freeRate is in sats/byte
exports.getFeeForMultisig = function (feesPerByteInSatoshis, addressType, numInputs, numOutputs, requiredSigners, totalSigners) {
    var feeRateString = feesPerByteInSatoshis.toString();
    return unchained_bitcoin_1.estimateMultisigTransactionFee({
        addressType: addressType,
        numInputs: numInputs,
        numOutputs: numOutputs,
        m: requiredSigners,
        n: totalSigners,
        feesPerByteInSatoshis: feeRateString
    });
};
exports.getFee = function (psbt, transactions) {
    var outputSum = psbt.txOutputs.reduce(function (acc, cur) { return acc + cur.value; }, 0);
    var txMap = exports.createTransactionMapFromTransactionArray(transactions);
    var inputSum = psbt.txInputs.reduce(function (acc, cur) {
        var inputBuffer = other_1.cloneBuffer(cur.hash);
        var currentUtxo = txMap[inputBuffer.reverse().toString('hex')];
        return Math.abs(currentUtxo.vout[cur.index].value) + acc;
    }, 0);
    return inputSum - outputSum;
};
exports.coinSelection = function (amountInSats, availableUtxos) {
    availableUtxos.sort(function (a, b) { return b.value - a.value; }); // sort available utxos from largest size to smallest size to minimize inputs
    var currentTotal = new bignumber_js_1.default(0);
    var spendingUtxos = [];
    var index = 0;
    while (currentTotal.isLessThan(amountInSats) && index < availableUtxos.length) {
        currentTotal = currentTotal.plus(availableUtxos[index].value);
        spendingUtxos.push(availableUtxos[index]);
        index++;
    }
    return { spendingUtxos: spendingUtxos, currentTotal: currentTotal };
};
exports.broadcastTransaction = function (currentAccount, psbt, nodeConfig, currentBitcoinNetwork) { return __awaiter(void 0, void 0, void 0, function () {
    var data, txBody, network, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(nodeConfig.provider !== 'Blockstream')) return [3 /*break*/, 2];
                return [4 /*yield*/, window.ipcRenderer.invoke('/broadcastTx', {
                        walletName: currentAccount.name,
                        txHex: psbt.extractTransaction().toHex()
                    })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
            case 2:
                txBody = psbt.extractTransaction().toHex();
                network = currentBitcoinNetwork.bech32 === 'bc' ? unchained_bitcoin_1.MAINNET : unchained_bitcoin_1.TESTNET;
                return [4 /*yield*/, axios_1.default.post(unchained_bitcoin_1.blockExplorerAPIURL('/tx', network), txBody)];
            case 3:
                data = (_a.sent()).data;
                return [2 /*return*/, data];
        }
    });
}); };
exports.getPsbtFromText = function (file) {
    try {
        return bitcoinjs_lib_1.Psbt.fromBase64(file);
    }
    catch (e) {
        try { // try getting hex encoded tx
            return bitcoinjs_lib_1.Psbt.fromHex(file);
        }
        catch (e) {
            throw new Error('Invalid Transaction');
        }
    }
};
var getSignedFingerprintsFromPsbt = function (psbt) {
    var signedFingerprints = [];
    for (var i = 0; i < psbt.data.inputs.length; i++) {
        var currentInput = psbt.data.inputs[i];
        // if there is, figure out what device it belongs to
        if (currentInput.partialSig) {
            for (var j = 0; j < currentInput.partialSig.length; j++) {
                for (var k = 0; k < currentInput.bip32Derivation.length; k++) {
                    var currentBipItem = currentInput.bip32Derivation[k];
                    var currentBipItemFingerprint = other_1.bufferToHex(currentBipItem.masterFingerprint);
                    if (Buffer.compare(currentInput.partialSig[j].pubkey, currentBipItem.pubkey) === 0 && !signedFingerprints.includes(currentBipItemFingerprint)) {
                        signedFingerprints.push(currentBipItemFingerprint);
                    }
                }
            }
        }
    }
    return signedFingerprints;
};
exports.getSignedDevicesFromPsbt = function (psbt, extendedPublicKeys) {
    var signedDevicesObjects = [];
    var signedFingerprints = getSignedFingerprintsFromPsbt(psbt);
    for (var i = 0; i < extendedPublicKeys.length; i++) {
        if (signedFingerprints.includes(extendedPublicKeys[i].device.fingerprint.toLowerCase())) {
            signedDevicesObjects.push(extendedPublicKeys[i].device);
        }
    }
    return signedDevicesObjects;
};
exports.createTransaction = function (currentAccount, amountInBitcoins, recipientAddress, desiredFee, currentBitcoinNetwork) { return __awaiter(void 0, void 0, void 0, function () {
    var availableUtxos, unusedChangeAddresses, config, fee, feeRates, coinSelectResult, outputTotal, _a, spendingUtxos, spendingUtxosTotal, psbt, i, utxo, prevTxHex, currentInput;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                availableUtxos = currentAccount.availableUtxos, unusedChangeAddresses = currentAccount.unusedChangeAddresses, config = currentAccount.config;
                return [4 /*yield*/, window.ipcRenderer.invoke('/estimateFee')];
            case 1:
                feeRates = _c.sent();
                console.log('feeRates: ', feeRates);
                if (!(desiredFee.toNumber() !== 0)) return [3 /*break*/, 2];
                fee = new bignumber_js_1.default(desiredFee);
                return [3 /*break*/, 5];
            case 2:
                if (!(config.quorum.totalSigners > 1)) return [3 /*break*/, 4];
                return [4 /*yield*/, exports.getFeeForMultisig(feeRates.halfHourFee, config.addressType, 1, 2, config.quorum.requiredSigners, config.quorum.totalSigners).integerValue(bignumber_js_1.default.ROUND_CEIL)];
            case 3:
                fee = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                coinSelectResult = coinselect_1.default(availableUtxos, [{ address: recipientAddress, value: unchained_bitcoin_1.bitcoinsToSatoshis(amountInBitcoins).toNumber() }], feeRates.halfHourFee);
                fee = new bignumber_js_1.default(coinSelectResult.fee);
                _c.label = 5;
            case 5:
                outputTotal = new bignumber_js_1.default(unchained_bitcoin_1.bitcoinsToSatoshis(amountInBitcoins)).plus(fee).toNumber();
                _a = exports.coinSelection(outputTotal, availableUtxos), spendingUtxos = _a.spendingUtxos, spendingUtxosTotal = _a.currentTotal;
                if (!(spendingUtxos.length > 1 && !desiredFee && config.quorum.totalSigners > 1)) return [3 /*break*/, 7];
                return [4 /*yield*/, exports.getFeeForMultisig(feeRates.halfHourFee, config.addressType, spendingUtxos.length, 2, config.quorum.requiredSigners, config.quorum.totalSigners).integerValue(bignumber_js_1.default.ROUND_CEIL)];
            case 6:
                fee = _c.sent();
                outputTotal = new bignumber_js_1.default(unchained_bitcoin_1.bitcoinsToSatoshis(amountInBitcoins)).plus(fee).toNumber();
                (_b = exports.coinSelection(outputTotal, availableUtxos), spendingUtxos = _b.spendingUtxos, spendingUtxosTotal = _b.currentTotal);
                _c.label = 7;
            case 7:
                psbt = new bitcoinjs_lib_1.Psbt({ network: currentBitcoinNetwork });
                psbt.setVersion(2); // These are defaults. This line is not needed.
                psbt.setLocktime(0); // These are defaults. This line is not needed.
                i = 0;
                _c.label = 8;
            case 8:
                if (!(i < spendingUtxos.length)) return [3 /*break*/, 11];
                utxo = spendingUtxos[i];
                return [4 /*yield*/, getTxHex(utxo.txid, currentBitcoinNetwork)];
            case 9:
                prevTxHex = _c.sent();
                currentInput = {
                    hash: utxo.txid,
                    index: utxo.vout,
                    sequence: 0xffffffff,
                    nonWitnessUtxo: Buffer.from(prevTxHex, 'hex'),
                    bip32Derivation: utxo.address.bip32derivation.map(function (derivation) { return ({
                        masterFingerprint: Buffer.from(Object.values(derivation.masterFingerprint)),
                        pubkey: Buffer.from(Object.values(derivation.pubkey)),
                        path: derivation.path
                    }); })
                };
                if (config.quorum.totalSigners > 1) { // multisig p2wsh requires witnessScript
                    currentInput.witnessScript = Buffer.from(Object.values(unchained_bitcoin_1.multisigWitnessScript(utxo.address).output));
                }
                else if (config.mnemonic === undefined) { // hardware wallet, add redeemScript
                    currentInput.redeemScript = Buffer.from(Object.values(utxo.address.redeem.output));
                }
                psbt.addInput(currentInput);
                _c.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 8];
            case 11:
                psbt.addOutput({
                    script: bitcoinjs_lib_1.address.toOutputScript(recipientAddress, currentBitcoinNetwork),
                    value: unchained_bitcoin_1.bitcoinsToSatoshis(amountInBitcoins).toNumber(),
                });
                if (spendingUtxosTotal.isGreaterThan(outputTotal)) {
                    psbt.addOutput({
                        script: bitcoinjs_lib_1.address.toOutputScript(unusedChangeAddresses[0].address, currentBitcoinNetwork),
                        value: spendingUtxosTotal.minus(outputTotal).toNumber()
                    });
                }
                return [2 /*return*/, { psbt: psbt, feeRates: feeRates }];
        }
    });
}); };
//# sourceMappingURL=send.js.map