"use strict";
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
var moment_1 = __importDefault(require("moment"));
var uuid_1 = require("uuid");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var bitcoinjs_lib_2 = require("bitcoinjs-lib");
var bip39_1 = require("bip39");
var crypto_js_1 = require("crypto-js");
var other_1 = require("../utils/other");
var types_1 = require("../types");
exports.bitcoinNetworkEqual = function (a, b) {
    return a.bech32 === b.bech32;
};
exports.getDerivationPath = function (addressType, bip32Path, currentBitcoinNetwork) {
    var childPubKeysBip32Path = bip32Path;
    if (addressType === 'multisig') {
        return exports.getMultisigDeriationPathForNetwork(currentBitcoinNetwork) + "/" + childPubKeysBip32Path.replace('m/', '');
    }
    else if (addressType === 'p2sh') {
        return exports.getP2shDeriationPathForNetwork(currentBitcoinNetwork) + "/" + childPubKeysBip32Path.replace('m/', '');
    }
    else { // p2wpkh
        return exports.getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork) + "/" + childPubKeysBip32Path.replace('m/', '');
    }
};
exports.getMultisigDeriationPathForNetwork = function (network) {
    if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.bitcoin)) {
        return "m/48'/0'/0'/2'";
    }
    else if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.testnet)) {
        return "m/48'/1'/0'/2'";
    }
    else { // return mainnet by default...this should never run though
        return "m/48'/0'/0'/2'";
    }
};
exports.getP2shDeriationPathForNetwork = function (network) {
    if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.bitcoin)) {
        return "m/49'/0'/0'";
    }
    else if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.testnet)) {
        return "m/49'/1'/0'";
    }
    else { // return mainnet by default...this should never run though
        return "m/49'/0'/0'";
    }
};
exports.getP2wpkhDeriationPathForNetwork = function (network) {
    if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.bitcoin)) {
        return "m/84'/0'/0'";
    }
    else if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.testnet)) {
        return "m/84'/1'/0'";
    }
    else { // return mainnet by default...this should never run though
        return "m/84'/0'/0'";
    }
};
exports.getUnchainedNetworkFromBjslibNetwork = function (bitcoinJslibNetwork) {
    if (exports.bitcoinNetworkEqual(bitcoinJslibNetwork, bitcoinjs_lib_1.networks.bitcoin)) {
        return 'mainnet';
    }
    else {
        return 'testnet';
    }
};
exports.containsColdcard = function (devices) {
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].type === 'coldcard') {
            return true;
        }
    }
    return false;
};
exports.formatFilename = function (fileName, currentBitcoinNetwork, fileType) {
    if (exports.bitcoinNetworkEqual(currentBitcoinNetwork, bitcoinjs_lib_1.networks.bitcoin)) {
        return fileName + "-bitcoin-" + moment_1.default().format('MMDDYY-hhmmss') + "." + fileType;
    }
    else {
        return fileName + "-testnet-" + moment_1.default().format('MMDDYY-hhmmss') + "." + fileType;
    }
};
exports.downloadFile = function (file, filename) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, window.ipcRenderer.invoke('/download-item', { data: file, filename: filename })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log('e: ', e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.saveConfig = function (configFile, password) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptedConfigObject, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                encryptedConfigObject = crypto_js_1.AES.encrypt(JSON.stringify(configFile), password).toString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, window.ipcRenderer.invoke('/save-config', { encryptedConfigFile: encryptedConfigObject })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.log('e: ', e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createSinglesigConfigFile = function (walletMnemonic, accountName, config, currentBitcoinNetwork) { return __awaiter(void 0, void 0, void 0, function () {
    var configCopy, seed, root, path, child, xpubString, xprvString, newKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                configCopy = __assign({}, config);
                configCopy.isEmpty = false;
                return [4 /*yield*/, bip39_1.mnemonicToSeed(walletMnemonic)];
            case 1:
                seed = _a.sent();
                root = bitcoinjs_lib_2.bip32.fromSeed(seed, currentBitcoinNetwork);
                path = exports.getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork);
                child = root.derivePath(path).neutered();
                xpubString = child.toBase58();
                xprvString = root.derivePath(path).toBase58();
                newKey = {
                    id: uuid_1.v4(),
                    created_at: Date.now(),
                    name: accountName,
                    network: exports.getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
                    addressType: "P2WPKH",
                    quorum: { requiredSigners: 1, totalSigners: 1 },
                    xpub: xpubString,
                    xprv: xprvString,
                    mnemonic: walletMnemonic,
                    parentFingerprint: other_1.bufferToHex(root.fingerprint),
                };
                configCopy.wallets.push(newKey);
                return [2 /*return*/, configCopy];
        }
    });
}); };
exports.createSinglesigHWWConfigFile = function (device, accountName, config, currentBitcoinNetwork) { return __awaiter(void 0, void 0, void 0, function () {
    var configCopy, newKey;
    return __generator(this, function (_a) {
        configCopy = __assign({}, config);
        configCopy.isEmpty = false;
        newKey = {
            id: uuid_1.v4(),
            created_at: Date.now(),
            name: accountName,
            network: exports.getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
            addressType: "P2WPKH",
            quorum: { requiredSigners: 1, totalSigners: 1 },
            xpub: device.xpub,
            parentFingerprint: device.fingerprint,
            device: {
                type: device.type,
                model: device.model,
                fingerprint: device.fingerprint
            }
        };
        configCopy.wallets.push(newKey);
        return [2 /*return*/, configCopy];
    });
}); };
exports.createMultisigConfigFile = function (importedDevices, requiredSigners, accountName, config, currentBitcoinNetwork) {
    var configCopy = __assign({}, config);
    configCopy.isEmpty = false;
    var newKeys = importedDevices.map(function (device) {
        return {
            id: uuid_1.v4(),
            created_at: Date.now(),
            parentFingerprint: device.fingerprint,
            network: exports.getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
            bip32Path: "m/0",
            xpub: device.xpub,
            device: {
                type: device.type,
                model: device.model,
                fingerprint: device.fingerprint
            }
        };
    });
    configCopy.vaults.push({
        id: uuid_1.v4(),
        created_at: Date.now(),
        name: accountName,
        network: exports.getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        addressType: types_1.AddressType.P2WSH,
        quorum: {
            requiredSigners: requiredSigners,
            totalSigners: importedDevices.length
        },
        extendedPublicKeys: newKeys
    });
    return configCopy;
};
exports.createColdCardBlob = function (requiredSigners, totalSigners, accountName, importedDevices, currentBitcoinNetwork) {
    var derivationPath = exports.getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
    return "# Coldcard Multisig setup file (created by Lily Wallet on " + moment_1.default(Date.now()).format('MM/DD/YYYY') + ")\n#\nName: " + accountName + "\nPolicy: " + requiredSigners + " of " + totalSigners + "\nDerivation: " + derivationPath + "\nFormat: P2WSH\n" + importedDevices.map(function (device) { return ("\n" + device.parentFingerprint + ": " + device.xpub); }) + "\n";
};
//# sourceMappingURL=files.js.map