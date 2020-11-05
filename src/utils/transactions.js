var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
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
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { payments, networks } from 'bitcoinjs-lib';
import { deriveChildPublicKey, blockExplorerAPIURL, generateMultisigFromPublicKeys, bitcoinsToSatoshis } from "unchained-bitcoin";
import { AddressType, TransactionType } from '../types';
var bitcoinNetworkEqual = function (a, b) {
  return a.bech32 === b.bech32;
};
function isVout(item) {
  return item.value !== undefined;
}
var getDerivationPath = function (addressType, bip32Path, currentBitcoinNetwork) {
  var childPubKeysBip32Path = bip32Path;
  if (addressType === 'multisig') {
    return getMultisigDeriationPathForNetwork(currentBitcoinNetwork) + "/" + childPubKeysBip32Path.replace('m/', '');
  }
  else if (addressType === 'p2sh') {
    return getP2shDeriationPathForNetwork(currentBitcoinNetwork) + "/" + childPubKeysBip32Path.replace('m/', '');
  }
  else { // p2wpkh
    return getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork) + "/" + childPubKeysBip32Path.replace('m/', '');
  }
};
var getMultisigDeriationPathForNetwork = function (network) {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/48'/0'/0'/2'";
  }
  else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/48'/1'/0'/2'";
  }
  else { // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'";
  }
};
var getP2shDeriationPathForNetwork = function (network) {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/49'/0'/0'";
  }
  else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/49'/1'/0'";
  }
  else { // return mainnet by default...this should never run though
    return "m/49'/0'/0'";
  }
};
var getP2wpkhDeriationPathForNetwork = function (network) {
  if (bitcoinNetworkEqual(network, networks.bitcoin)) {
    return "m/84'/0'/0'";
  }
  else if (bitcoinNetworkEqual(network, networks.testnet)) {
    return "m/84'/1'/0'";
  }
  else { // return mainnet by default...this should never run though
    return "m/84'/0'/0'";
  }
};
var getUnchainedNetworkFromBjslibNetwork = function (bitcoinJslibNetwork) {
  if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
    return 'mainnet';
  }
  else {
    return 'testnet';
  }
};
var getMultisigDescriptor = function (client, reqSigners, xpubs, isChange) {
  return __awaiter(void 0, void 0, void 0, function () {
    var descriptor, descriptorWithChecksum;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          descriptor = "wsh(sortedmulti(" + reqSigners + "," + xpubs.map(function (xpub) { return xpub.xpub + "/" + (isChange ? '1' : '0') + "/*"; }) + "))";
          return [4 /*yield*/, client.getDescriptorInfo(descriptor)];
        case 1:
          descriptorWithChecksum = _a.sent();
          return [2 /*return*/, descriptorWithChecksum.descriptor];
      }
    });
  });
};
var createAddressMapFromAddressArray = function (addressArray, isChange) {
  var addressMap = {};
  addressArray.forEach(function (addr) {
    addressMap[addr.address] = __assign(__assign({}, addr), { isChange: !!isChange });
  });
  return addressMap;
};
/**
* Function used to aggregate values of inputs/outputs with optional
* filtering options.
*
* @param {Array} items - Array of either inputs or outputs.
* @param {Boolean} isMine - Whether to restrict sum to our own inputs/outputs.
* @param {Boolean} isChange - Whether to restrict sum to change inputs/outputs.
*/
var sum = function (items, isMine, isChange) {
  var filtered = items;
  if (typeof isMine === 'boolean')
    filtered = filtered.filter(function (item) { return item.isMine === isMine; });
  if (typeof isChange === 'boolean')
    filtered = filtered.filter(function (item) { return item.isChange === isChange; });
  var total = filtered.reduce(function (accum, item) {
    if (isVout(item)) {
      return accum + item.value;
    }
    else {
      return accum + item.prevout.value;
    }
  }, 0);
  return total;
};
/**
* Function used to add 'isMine' & 'isChange' decoration markers
* to inputs & outputs.
*
* @param {Object} tx - A raw transaction.
* @param {Map} externalMap - Map of external addresses.
* @param {Map} changeMap - Map of change addresses.
*/
var decorateTx = function (tx, externalMap, changeMap) {
  tx.vin.forEach(function (vin, index) {
    var isChange = !!changeMap[vin.prevout.scriptpubkey_address];
    var isMine = isChange || !!externalMap[vin.prevout.scriptpubkey_address];
    tx.vin[index] = __assign(__assign({}, vin), { isChange: isChange, isMine: isMine });
  });
  tx.vout.forEach(function (vout, index) {
    var isChange = !!changeMap[vout.scriptpubkey_address];
    var isMine = isChange || !!externalMap[vout.scriptpubkey_address];
    tx.vout[index] = __assign(__assign({}, vout), { isChange: isChange, isMine: isMine });
  });
  return tx;
};
var serializeTransactions = function (transactionsFromBlockstream, addresses, changeAddresses) {
  transactionsFromBlockstream.sort(function (a, b) { return a.status.block_time - b.status.block_time; });
  var addressesMap = createAddressMapFromAddressArray(addresses, false);
  var changeAddressesMap = createAddressMapFromAddressArray(changeAddresses, true);
  var txMap = {};
  var txs = transactionsFromBlockstream
    .map(function (tx) { return decorateTx(tx, addressesMap, changeAddressesMap); })
    .filter(function (tx) {
      if (!txMap[tx.txid]) {
        txMap[tx.txid] = tx;
        return true;
      }
      return false;
    });
  var balance = 0;
  txs.forEach(function (tx) {
    var amountIn, amountOut, amountOutChange;
    amountIn = sum(tx.vin, true);
    amountOut = sum(tx.vout, true);
    amountOutChange = sum(tx.vout, true, true);
    if (amountIn === (amountOut + (amountIn > 0 ? tx.fee : 0))) {
      tx.type = TransactionType.moved;
      tx.address = '';
      balance -= tx.fee;
      tx.totalValue = balance;
      tx.address = tx.vout.filter(function (vout) { return vout.isChange; })[0].scriptpubkey_address;
      tx.value = tx.vout.reduce(function (accum, item) { return accum + item.value; }, 0);
    }
    else {
      var feeContribution = amountIn > 0 ? tx.fee : 0;
      var netAmount = amountIn - amountOut - feeContribution;
      tx.type = netAmount > 0 ? TransactionType.sent : TransactionType.received;
      if (tx.type === 'sent') {
        balance -= ((amountIn - amountOutChange) + feeContribution);
        tx.totalValue = balance;
        tx.address = tx.vout.filter(function (vout) { return !vout.isMine; })[0].scriptpubkey_address;
        tx.value = tx.vout.filter(function (vout) { return !vout.isMine; })
          .reduce(function (accum, item) { return accum + item.value; }, 0);
      }
      else {
        balance += amountOut;
        tx.totalValue = balance;
        tx.address = tx.vout.filter(function (vout) { return vout.isMine; })[0].scriptpubkey_address;
        tx.value = tx.vout.filter(function (vout) { return vout.isMine; })
          .reduce(function (accum, item) { return accum + item.value; }, 0);
      }
    }
  });
  return txs.sort(function (a, b) { return b.status.block_time - a.status.block_time; });
};
var serializeTransactionsFromNode = function (nodeClient, transactions, addresses, changeAddresses) {
  return __awaiter(void 0, void 0, void 0, function () {
    var currentAccountTotal, transactionsMap, i, currentTransaction, transactionWithValues, transactionsIterator, transactionsArray, i;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          transactions.sort(function (a, b) { return a.blockheight - b.blockheight; }); // bitcoin-core returns value as blockheight
          currentAccountTotal = new BigNumber(0);
          transactionsMap = new Map();
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < transactions.length)) return [3 /*break*/, 4];
          return [4 /*yield*/, nodeClient.getTransaction({ txid: transactions[i].txid, verbose: true })];
        case 2:
          currentTransaction = _a.sent();
          currentAccountTotal = currentAccountTotal.plus(bitcoinsToSatoshis(currentTransaction.details[0].amount));
          transactionWithValues = currentTransaction;
          transactionWithValues.value = bitcoinsToSatoshis(currentTransaction.details[0].amount).abs().toNumber();
          transactionWithValues.address = currentTransaction.details[0].address;
          transactionWithValues.type = currentTransaction.details[0].category === 'receive' ? 'received' : 'sent';
          transactionWithValues.totalValue = currentAccountTotal.toNumber();
          transactionWithValues.vout = currentTransaction.decoded.vout.map(function (vout) {
            vout.value = bitcoinsToSatoshis(vout.value).abs().toNumber();
            return vout;
          });
          transactionWithValues.vin = currentTransaction.decoded.vin.map(function (vin) {
            vin.value = bitcoinsToSatoshis(vin.value).abs().toNumber();
            return vin;
          });
          transactionWithValues.status = {
            block_time: currentTransaction.blocktime,
            block_height: currentTransaction.blockheight,
            confirmed: true // TODO: change later
          };
          transactionsMap.set(currentTransaction.txid, transactionWithValues);
          _a.label = 3;
        case 3:
          i++;
          return [3 /*break*/, 1];
        case 4:
          transactionsIterator = transactionsMap.values();
          transactionsArray = [];
          for (i = 0; i < transactionsMap.size; i++) {
            transactionsArray.push(transactionsIterator.next().value);
          }
          transactionsArray.sort(function (a, b) { return b.status.block_time - a.status.block_time; });
          return [2 /*return*/, transactionsArray];
      }
    });
  });
};
var getChildPubKeyFromXpub = function (xpub, bip32Path, addressType, currentBitcoinNetwork) {
  var childPubKeysBip32Path = bip32Path;
  var bip32derivationPath = getDerivationPath(addressType, bip32Path, currentBitcoinNetwork);
  return {
    childPubKey: deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)),
    bip32derivation: {
      masterFingerprint: Buffer.from(xpub.parentFingerprint, 'hex'),
      pubkey: Buffer.from(deriveChildPublicKey(xpub.xpub, childPubKeysBip32Path, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)), 'hex'),
      path: bip32derivationPath
    }
  };
};
var getMultisigAddressFromPubKeys = function (pubkeys, config, currentBitcoinNetwork) {
  var rawPubkeys = pubkeys.map(function (publicKey) { return publicKey.childPubKey; });
  rawPubkeys.sort();
  var address = generateMultisigFromPublicKeys.apply(void 0, __spreadArrays([getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork), config.addressType, config.quorum.requiredSigners], rawPubkeys));
  address.bip32derivation = pubkeys.map(function (publicKey) { return publicKey.bip32derivation; });
  return address;
};
var getUtxosForAddresses = function (addresses, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var availableUtxos, i, utxosFromBlockstream, j, utxo;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          availableUtxos = [];
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < addresses.length)) return [3 /*break*/, 5];
          return [4 /*yield*/, axios.get(blockExplorerAPIURL("/address/" + addresses[i].address + "/utxo", getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))];
        case 2: return [4 /*yield*/, (_a.sent()).data];
        case 3:
          utxosFromBlockstream = _a.sent();
          for (j = 0; j < utxosFromBlockstream.length; j++) {
            utxo = utxosFromBlockstream[j];
            utxo.address = addresses[i];
            availableUtxos.push(utxo);
          }
          _a.label = 4;
        case 4:
          i++;
          return [3 /*break*/, 1];
        case 5: return [2 /*return*/, availableUtxos];
      }
    });
  });
};
var getAddressFromPubKey = function (childPubKey, addressType, currentBitcoinNetwork) {
  if (addressType === 'p2sh') {
    var _a = payments.p2sh({
      redeem: payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: currentBitcoinNetwork }),
      network: currentBitcoinNetwork
    }), network = _a.network, _address = _a.address, hash = _a.hash, output = _a.output, redeem = _a.redeem, input = _a.input, witness = _a.witness;
    return {
      network: network,
      address: _address,
      hash: hash,
      output: output,
      redeem: redeem,
      input: input,
      witness: witness,
      bip32derivation: [childPubKey.bip32derivation]
    };
  }
  else { // p2wpkh
    var _b = payments.p2wpkh({ pubkey: Buffer.from(childPubKey.childPubKey, 'hex'), network: currentBitcoinNetwork }), network = _b.network, _address = _b.address, hash = _b.hash, output = _b.output, redeem = _b.redeem, input = _b.input, witness = _b.witness;
    return {
      network: network,
      address: _address,
      hash: hash,
      output: output,
      redeem: redeem,
      input: input,
      witness: witness,
      bip32derivation: [childPubKey.bip32derivation]
    };
  }
};
var getTransactionsFromAddress = function (address, nodeClient, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var addressTxs, transactions, i;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!nodeClient) return [3 /*break*/, 2];
          addressTxs = [];
          return [4 /*yield*/, getTransactionsFromNode(nodeClient)];
        case 1:
          transactions = _a.sent();
          for (i = 0; i < transactions.length; i++) {
            if (transactions[i].address === address) {
              addressTxs.push(transactions[i]);
            }
          }
          return [2 /*return*/, addressTxs];
        case 2: return [4 /*yield*/, axios.get(blockExplorerAPIURL("/address/" + address + "/txs", getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))];
        case 3: return [4 /*yield*/, (_a.sent()).data];
        case 4: return [2 /*return*/, _a.sent()];
      }
    });
  });
};
var getAddressFromAccount = function (account, path, currentBitcoinNetwork) {
  if (account.quorum.totalSigners > 1) { // multisig
    if (account.extendedPublicKeys) { // should always be true
      var childPubKeys = account.extendedPublicKeys.map(function (extendedPublicKey) {
        return getChildPubKeyFromXpub(extendedPublicKey, path, AddressType.multisig, currentBitcoinNetwork);
      });
      return getMultisigAddressFromPubKeys(childPubKeys, account, currentBitcoinNetwork);
    }
  }
  else { // single sig
    if (account.device) {
      var receivePubKey = getChildPubKeyFromXpub(account, path, AddressType.p2sh, currentBitcoinNetwork);
      return getAddressFromPubKey(receivePubKey, AddressType.p2sh, currentBitcoinNetwork);
    }
    else {
      var receivePubKey = getChildPubKeyFromXpub(account, path, AddressType.P2WPKH, currentBitcoinNetwork);
      return getAddressFromPubKey(receivePubKey, AddressType.P2WPKH, currentBitcoinNetwork);
    }
  }
};
var scanForAddressesAndTransactions = function (account, nodeClient, currentBitcoinNetwork, limitGap) {
  return __awaiter(void 0, void 0, void 0, function () {
    var receiveAddresses, changeAddresses, transactions, unusedReceiveAddresses, unusedChangeAddresses, gap, i, receiveAddress, receiveTxs, changeAddress, changeTxs;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          receiveAddresses = [];
          changeAddresses = [];
          transactions = [];
          unusedReceiveAddresses = [];
          unusedChangeAddresses = [];
          gap = 0;
          i = 0;
          _a.label = 1;
        case 1:
          if (!(gap < limitGap)) return [3 /*break*/, 4];
          receiveAddress = getAddressFromAccount(account, "m/0/" + i, currentBitcoinNetwork);
          receiveAddresses.push(receiveAddress);
          return [4 /*yield*/, getTransactionsFromAddress(receiveAddress.address, nodeClient, currentBitcoinNetwork)];
        case 2:
          receiveTxs = _a.sent();
          if (!receiveTxs.length) {
            unusedReceiveAddresses.push(receiveAddress);
          }
          else {
            transactions = __spreadArrays(transactions, receiveTxs);
          }
          changeAddress = getAddressFromAccount(account, "m/1/" + i, currentBitcoinNetwork);
          changeAddresses.push(changeAddress);
          return [4 /*yield*/, getTransactionsFromAddress(changeAddress.address, nodeClient, currentBitcoinNetwork)];
        case 3:
          changeTxs = _a.sent();
          if (!changeTxs.length) {
            unusedChangeAddresses.push(changeAddress);
          }
          else {
            transactions = __spreadArrays(transactions, changeTxs);
          }
          if (!!!receiveTxs.length && !!!changeTxs.length) {
            gap = gap + 1;
          }
          else {
            gap = 0;
          }
          i = i + 1;
          return [3 /*break*/, 1];
        case 4:
          if (!nodeClient) return [3 /*break*/, 6];
          return [4 /*yield*/, getTransactionsFromNode(nodeClient)];
        case 5:
          transactions = _a.sent();
          _a.label = 6;
        case 6: return [2 /*return*/, { receiveAddresses: receiveAddresses, changeAddresses: changeAddresses, unusedReceiveAddresses: unusedReceiveAddresses, unusedChangeAddresses: unusedChangeAddresses, transactions: transactions }];
      }
    });
  });
};
var getTransactionsFromNode = function (nodeClient) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, nodeClient.listTransactions({ count: 100 })];
        case 1: return [2 /*return*/, _a.sent()];
      }
    });
  });
};
var getDataFromMultisig = function (account, nodeClient, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions, organizedTransactions, availableUtxos, receiveAddressMap, changeAddressMap, addressMap, i;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0: return [4 /*yield*/, scanForAddressesAndTransactions(account, nodeClient, currentBitcoinNetwork, 10)];
        case 1:
          _a = _b.sent(), receiveAddresses = _a.receiveAddresses, changeAddresses = _a.changeAddresses, unusedReceiveAddresses = _a.unusedReceiveAddresses, unusedChangeAddresses = _a.unusedChangeAddresses, transactions = _a.transactions;
          if (!nodeClient) return [3 /*break*/, 4];
          return [4 /*yield*/, serializeTransactionsFromNode(nodeClient, transactions, receiveAddresses, changeAddresses)];
        case 2:
          organizedTransactions = _b.sent();
          return [4 /*yield*/, nodeClient.listUnspent()];
        case 3:
          availableUtxos = _b.sent();
          receiveAddressMap = createAddressMapFromAddressArray(receiveAddresses, false);
          changeAddressMap = createAddressMapFromAddressArray(changeAddresses, true);
          addressMap = __assign(__assign({}, receiveAddressMap), changeAddressMap);
          for (i = 0; i < availableUtxos.length; i++) {
            availableUtxos[i].value = bitcoinsToSatoshis(availableUtxos[i].amount).toNumber();
            availableUtxos[i].address = addressMap[availableUtxos[i].address.address];
          }
          return [3 /*break*/, 6];
        case 4:
          organizedTransactions = serializeTransactions(transactions, receiveAddresses, changeAddresses);
          return [4 /*yield*/, getUtxosForAddresses(receiveAddresses.concat(changeAddresses), currentBitcoinNetwork)];
        case 5:
          availableUtxos = _b.sent();
          _b.label = 6;
        case 6: return [2 /*return*/, [receiveAddresses, changeAddresses, organizedTransactions, unusedReceiveAddresses, unusedChangeAddresses, availableUtxos]];
      }
    });
  });
};
var getDataFromXPub = function (account, nodeClient, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, receiveAddresses, changeAddresses, unusedReceiveAddresses, unusedChangeAddresses, transactions, availableUtxos, organizedTransactions;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0: return [4 /*yield*/, scanForAddressesAndTransactions(account, nodeClient, currentBitcoinNetwork, 10)];
        case 1:
          _a = _b.sent(), receiveAddresses = _a.receiveAddresses, changeAddresses = _a.changeAddresses, unusedReceiveAddresses = _a.unusedReceiveAddresses, unusedChangeAddresses = _a.unusedChangeAddresses, transactions = _a.transactions;
          return [4 /*yield*/, getUtxosForAddresses(receiveAddresses.concat(changeAddresses), currentBitcoinNetwork)];
        case 2:
          availableUtxos = _b.sent();
          organizedTransactions = serializeTransactions(transactions, receiveAddresses, changeAddresses);
          return [2 /*return*/, [receiveAddresses, changeAddresses, organizedTransactions, unusedReceiveAddresses, unusedChangeAddresses, availableUtxos]];
      }
    });
  });
};
module.exports = {
  getAddressFromAccount: getAddressFromAccount,
  getMultisigDeriationPathForNetwork: getMultisigDeriationPathForNetwork,
  bitcoinNetworkEqual: bitcoinNetworkEqual,
  getP2shDeriationPathForNetwork: getP2shDeriationPathForNetwork,
  getP2wpkhDeriationPathForNetwork: getP2wpkhDeriationPathForNetwork,
  getDataFromMultisig: getDataFromMultisig,
  getDataFromXPub: getDataFromXPub,
  getUnchainedNetworkFromBjslibNetwork: getUnchainedNetworkFromBjslibNetwork,
  getMultisigDescriptor: getMultisigDescriptor,
  scanForAddressesAndTransactions: scanForAddressesAndTransactions
};
//# sourceMappingURL=transactions.js.map