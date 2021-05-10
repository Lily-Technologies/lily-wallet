/* eslint-disable */
"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOrCreateWalletViaRPC = exports.getDataFromXPub = exports.getDataFromMultisig = exports.getAddressFromAccount = exports.serializeTransactions = exports.getSegwitDescriptor = exports.getWrappedDescriptor = exports.getMultisigDescriptor = exports.getDerivationPath = exports.bitcoinNetworkEqual = void 0;
var axios_1 = __importDefault(require("axios"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var unchained_bitcoin_1 = require("unchained-bitcoin");
var types_1 = require("../types");
var bitcoinNetworkEqual = function (a, b) {
  return a.bech32 === b.bech32;
};
exports.bitcoinNetworkEqual = bitcoinNetworkEqual;
function isVout(item) {
  return item.value !== undefined;
}
var getDerivationPath = function (
  addressType,
  bip32Path,
  currentBitcoinNetwork
) {
  var childPubKeysBip32Path = bip32Path;
  if (addressType === "multisig") {
    return (
      getMultisigDeriationPathForNetwork(currentBitcoinNetwork) +
      "/" +
      childPubKeysBip32Path.replace("m/", "")
    );
  } else if (addressType === "p2sh") {
    return (
      getP2shDeriationPathForNetwork(currentBitcoinNetwork) +
      "/" +
      childPubKeysBip32Path.replace("m/", "")
    );
  } else {
    // p2wpkh
    return (
      getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork) +
      "/" +
      childPubKeysBip32Path.replace("m/", "")
    );
  }
};
exports.getDerivationPath = getDerivationPath;
var getMultisigDeriationPathForNetwork = function (network) {
  if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.bitcoin)) {
    return "m/48'/0'/0'/2'";
  } else if (
    exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.testnet)
  ) {
    return "m/48'/1'/0'/2'";
  } else {
    // return mainnet by default...this should never run though
    return "m/48'/0'/0'/2'";
  }
};
var getP2shDeriationPathForNetwork = function (network) {
  if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.bitcoin)) {
    return "m/49'/0'/0'";
  } else if (
    exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.testnet)
  ) {
    return "m/49'/1'/0'";
  } else {
    // return mainnet by default...this should never run though
    return "m/49'/0'/0'";
  }
};
var getP2wpkhDeriationPathForNetwork = function (network) {
  if (exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.bitcoin)) {
    return "m/84'/0'/0'";
  } else if (
    exports.bitcoinNetworkEqual(network, bitcoinjs_lib_1.networks.testnet)
  ) {
    return "m/84'/1'/0'";
  } else {
    // return mainnet by default...this should never run though
    return "m/84'/0'/0'";
  }
};
var getUnchainedNetworkFromBjslibNetwork = function (bitcoinJslibNetwork) {
  if (
    exports.bitcoinNetworkEqual(
      bitcoinJslibNetwork,
      bitcoinjs_lib_1.networks.bitcoin
    )
  ) {
    return "mainnet";
  } else {
    return "testnet";
  }
};
var getMultisigDescriptor = function (client, config, isChange) {
  return __awaiter(void 0, void 0, void 0, function () {
    var descriptor, descriptorWithChecksum;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          descriptor =
            "wsh(sortedmulti(" +
            config.quorum.requiredSigners +
            "," +
            config.extendedPublicKeys.map(function (xpub) {
              return (
                "[" +
                xpub.device.fingerprint +
                "/48h/0h/0h/2h]" +
                xpub.xpub +
                "/" +
                (isChange ? "1" : "0") +
                "/*"
              );
            }) +
            "))";
          return [4 /*yield*/, client.getDescriptorInfo(descriptor)];
        case 1:
          descriptorWithChecksum = _a.sent();
          return [2 /*return*/, descriptorWithChecksum.descriptor];
      }
    });
  });
};
exports.getMultisigDescriptor = getMultisigDescriptor;
var getWrappedDescriptor = function (client, config, isChange) {
  return __awaiter(void 0, void 0, void 0, function () {
    var descriptor, descriptorWithChecksum;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          descriptor =
            "sh(wpkh([" +
            config.extendedPublicKeys[0].device.fingerprint +
            "/49h/0h/0h]" +
            config.extendedPublicKeys[0].xpub +
            "/" +
            (isChange ? "1" : "0") +
            "/*))";
          return [4 /*yield*/, client.getDescriptorInfo(descriptor)];
        case 1:
          descriptorWithChecksum = _a.sent();
          return [2 /*return*/, descriptorWithChecksum.descriptor];
      }
    });
  });
};
exports.getWrappedDescriptor = getWrappedDescriptor;
var getSegwitDescriptor = function (client, config, isChange) {
  return __awaiter(void 0, void 0, void 0, function () {
    var descriptor, descriptorWithChecksum;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          descriptor =
            "wpkh([" +
            config.extendedPublicKeys[0].device.fingerprint +
            "/84h/0h/0h]" +
            config.extendedPublicKeys[0].xpub +
            "/" +
            (isChange ? "1" : "0") +
            "/*)";
          return [4 /*yield*/, client.getDescriptorInfo(descriptor)];
        case 1:
          descriptorWithChecksum = _a.sent();
          return [2 /*return*/, descriptorWithChecksum.descriptor];
      }
    });
  });
};
exports.getSegwitDescriptor = getSegwitDescriptor;
var createAddressMapFromAddressArray = function (addressArray, isChange) {
  var addressMap = {};
  addressArray.forEach(function (addr) {
    addressMap[addr.address] = __assign(__assign({}, addr), {
      isChange: !!isChange,
    });
  });
  return addressMap;
};
var getTxHex = function (txid, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var txHex;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            axios_1.default.get(
              unchained_bitcoin_1.blockExplorerAPIURL(
                "/tx/" + txid + "/hex",
                getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
              )
            ),
          ];
        case 1:
          return [4 /*yield*/, _a.sent().data];
        case 2:
          txHex = _a.sent();
          return [2 /*return*/, txHex];
      }
    });
  });
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
  if (typeof isMine === "boolean")
    filtered = filtered.filter(function (item) {
      return item.isMine === isMine;
    });
  if (typeof isChange === "boolean")
    filtered = filtered.filter(function (item) {
      return item.isChange === isChange;
    });
  var total = filtered.reduce(function (accum, item) {
    if (isVout(item)) {
      return accum + item.value;
    } else {
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
    tx.vin[index] = __assign(__assign({}, vin), {
      isChange: isChange,
      isMine: isMine,
    });
  });
  tx.vout.forEach(function (vout, index) {
    var isChange = !!changeMap[vout.scriptpubkey_address];
    var isMine = isChange || !!externalMap[vout.scriptpubkey_address];
    tx.vout[index] = __assign(__assign({}, vout), {
      isChange: isChange,
      isMine: isMine,
    });
  });
  return tx;
};
var serializeTransactions = function (
  transactionsFromBlockstream,
  addresses,
  changeAddresses
) {
  transactionsFromBlockstream.sort(function (a, b) {
    return a.status.block_time - b.status.block_time;
  });
  var addressesMap = createAddressMapFromAddressArray(addresses, false);
  var changeAddressesMap = createAddressMapFromAddressArray(
    changeAddresses,
    true
  );
  var txMap = {};
  var txs = transactionsFromBlockstream
    .map(function (tx) {
      return decorateTx(tx, addressesMap, changeAddressesMap);
    })
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
    if (amountIn === amountOut + (amountIn > 0 ? tx.fee : 0)) {
      tx.type = types_1.TransactionType.moved;
      tx.address = "";
      balance -= tx.fee;
      tx.totalValue = balance;
      tx.address = tx.vout.filter(function (vout) {
        return vout.isChange;
      })[0].scriptpubkey_address;
      tx.value = tx.vout.reduce(function (accum, item) {
        return accum + item.value;
      }, 0);
    } else {
      var feeContribution = amountIn > 0 ? tx.fee : 0;
      var netAmount = amountIn - amountOut - feeContribution;
      if (netAmount > 0) {
        tx.type = types_1.TransactionType.sent;
      } else {
        tx.type = types_1.TransactionType.received;
      }
      if (tx.type === types_1.TransactionType.sent) {
        balance -= amountIn - amountOutChange + feeContribution;
        tx.totalValue = balance;
        tx.address = tx.vout.filter(function (vout) {
          return !vout.isMine;
        })[0].scriptpubkey_address;
        tx.value = tx.vout
          .filter(function (vout) {
            return !vout.isMine;
          })
          .reduce(function (accum, item) {
            return accum + item.value;
          }, 0);
      } else {
        balance += amountOut;
        tx.totalValue = balance;
        tx.address = tx.vout.filter(function (vout) {
          return vout.isMine;
        })[0].scriptpubkey_address;
        tx.value = tx.vout
          .filter(function (vout) {
            return vout.isMine;
          })
          .reduce(function (accum, item) {
            return accum + item.value;
          }, 0);
      }
    }
  });
  return txs.sort(function (a, b) {
    return b.status.block_time - a.status.block_time;
  });
};
exports.serializeTransactions = serializeTransactions;
var serializeTransactionsFromNode = function (nodeClient, transactions) {
  return __awaiter(void 0, void 0, void 0, function () {
    var currentAccountTotal,
      decoratedTxArray,
      i,
      currentTransaction,
      decoratedTx,
      e_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          transactions.sort(function (a, b) {
            return a.blocktime - b.blocktime;
          });
          currentAccountTotal = new bignumber_js_1.default(0);
          decoratedTxArray = [];
          i = 0;
          _b.label = 1;
        case 1:
          if (!(i < transactions.length)) return [3 /*break*/, 7];
          _b.label = 2;
        case 2:
          _b.trys.push([2, 5, , 6]);
          return [
            4 /*yield*/,
            nodeClient.getTransaction(
              transactions[i].txid, //txid
              true, // include_watchonly
              true // verbose
            ),
          ];
        case 3:
          currentTransaction = _b.sent();
          currentAccountTotal = currentAccountTotal.plus(
            unchained_bitcoin_1.bitcoinsToSatoshis(
              currentTransaction.details[0].amount
            )
          );
          _a = {
            txid: currentTransaction.txid,
            version: currentTransaction.decoded.version,
            locktime: currentTransaction.decoded.locktime,
            value: unchained_bitcoin_1
              .bitcoinsToSatoshis(currentTransaction.details[0].amount)
              .abs()
              .toNumber(),
            address: currentTransaction.details[0].address,
            type:
              currentTransaction.details[0].category === "receive"
                ? "received"
                : "sent",
            totalValue: currentAccountTotal.toNumber(),
          };
          return [
            4 /*yield*/,
            Promise.all(
              currentTransaction.decoded.vin.map(function (item) {
                return __awaiter(void 0, void 0, void 0, function () {
                  var prevoutTx;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          nodeClient.getRawTransaction(
                            item.txid, // txid
                            true // verbose
                          ),
                        ];
                      case 1:
                        prevoutTx = _a.sent();
                        return [
                          2 /*return*/,
                          {
                            txid: item.txid,
                            vout: item.vout,
                            prevout: {
                              scriptpubkey:
                                prevoutTx.vout[item.vout].scriptPubKey.hex,
                              scriptpubkey_asm:
                                prevoutTx.vout[item.vout].scriptPubKey.asm,
                              scriptpubkey_type:
                                prevoutTx.vout[item.vout].scriptPubKey.type,
                              scriptpubkey_address:
                                prevoutTx.vout[item.vout].scriptPubKey
                                  .addresses[0],
                              value: unchained_bitcoin_1
                                .bitcoinsToSatoshis(
                                  prevoutTx.vout[item.vout].value
                                )
                                .abs()
                                .toNumber(),
                            },
                            scriptsig: item.scriptSig.hex,
                            scriptsig_asm: item.scriptSig.asm,
                            witness: item.txinwitness,
                            sequence: item.sequence,
                          },
                        ];
                    }
                  });
                });
              })
            ),
          ];
        case 4:
          decoratedTx =
            ((_a.vin = _b.sent()),
            (_a.vout = currentTransaction.decoded.vout.map(function (item) {
              return {
                scriptpubkey: item.scriptPubKey.hex,
                scriptpubkey_address: item.scriptPubKey.addresses[0],
                scriptpubkey_asm: item.scriptPubKey.asm,
                scriptpubkey_type: item.scriptPubKey.type,
                value: unchained_bitcoin_1
                  .bitcoinsToSatoshis(item.value)
                  .abs()
                  .toNumber(),
              };
            })),
            (_a.size = currentTransaction.decoded.size),
            (_a.weight = currentTransaction.decoded.weight),
            (_a.fee = unchained_bitcoin_1
              .bitcoinsToSatoshis(currentTransaction.fee)
              .abs()
              .toNumber()),
            (_a.status = {
              confirmed: currentTransaction.blockheight ? true : false,
              block_time: currentTransaction.blocktime,
              block_hash: currentTransaction.blockhash,
              block_height: currentTransaction.blockheight,
            }),
            _a);
          // transactionWithValues.value = bitcoinsToSatoshis(
          //   currentTransaction.details[0].amount
          // )
          //   .abs()
          //   .toNumber();
          // transactionWithValues.address = currentTransaction.details[0].address;
          // transactionWithValues.type =
          //   currentTransaction.details[0].category === "receive"
          //     ? "received"
          //     : "sent";
          // transactionWithValues.totalValue = currentAccountTotal.toNumber();
          // transactionWithValues.status = {
          //   block_time: currentTransaction.blocktime,
          //   block_height: currentTransaction.blockheight,
          //   confirmed: true, // TODO: change later
          // };
          decoratedTxArray.push(decoratedTx);
          return [3 /*break*/, 6];
        case 5:
          e_1 = _b.sent();
          console.log("e: ", e_1);
          return [3 /*break*/, 6];
        case 6:
          i++;
          return [3 /*break*/, 1];
        case 7:
          decoratedTxArray.sort(function (a, b) {
            return b.status.block_time - a.status.block_time;
          });
          return [2 /*return*/, decoratedTxArray];
      }
    });
  });
};
var getChildPubKeyFromXpub = function (xpub, bip32Path, currentBitcoinNetwork) {
  var childPubKeysBip32Path = bip32Path;
  var bip32derivationPath = xpub.bip32Path + "/" + bip32Path.replace("m/", "");
  return {
    childPubKey: unchained_bitcoin_1.deriveChildPublicKey(
      xpub.xpub,
      childPubKeysBip32Path,
      getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
    ),
    bip32derivation: {
      masterFingerprint: Buffer.from(xpub.parentFingerprint, "hex"),
      pubkey: Buffer.from(
        unchained_bitcoin_1.deriveChildPublicKey(
          xpub.xpub,
          childPubKeysBip32Path,
          getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
        ),
        "hex"
      ),
      path: bip32derivationPath,
    },
  };
};
var getMultisigAddressFromPubKeys = function (
  pubkeys,
  config,
  currentBitcoinNetwork
) {
  var rawPubkeys = pubkeys.map(function (publicKey) {
    return publicKey.childPubKey;
  });
  rawPubkeys.sort();
  var address = unchained_bitcoin_1.generateMultisigFromPublicKeys.apply(
    void 0,
    __spreadArray(
      [
        getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
        config.addressType,
        config.quorum.requiredSigners,
      ],
      rawPubkeys
    )
  );
  address.bip32derivation = pubkeys.map(function (publicKey) {
    return publicKey.bip32derivation;
  });
  return address;
};
var getUtxosFromNode = function (
  receiveAddresses,
  changeAddresses,
  nodeClient
) {
  return __awaiter(void 0, void 0, void 0, function () {
    var availableUtxos, receiveAddressMap, changeAddressMap, addressMap, i, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, nodeClient.listUnspent()];
        case 1:
          availableUtxos = _b.sent();
          receiveAddressMap = createAddressMapFromAddressArray(
            receiveAddresses,
            false
          );
          changeAddressMap = createAddressMapFromAddressArray(
            changeAddresses,
            true
          );
          addressMap = __assign(
            __assign({}, receiveAddressMap),
            changeAddressMap
          );
          i = 0;
          _b.label = 2;
        case 2:
          if (!(i < availableUtxos.length)) return [3 /*break*/, 5];
          availableUtxos[i].value = unchained_bitcoin_1
            .bitcoinsToSatoshis(availableUtxos[i].amount)
            .toNumber();
          _a = availableUtxos[i];
          return [
            4 /*yield*/,
            nodeClient.getRawTransaction(availableUtxos[i].txid, true).hex,
          ];
        case 3:
          _a.prevTxHex = _b.sent();
          availableUtxos[i].address = addressMap[availableUtxos[i].address];
          _b.label = 4;
        case 4:
          i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, availableUtxos];
      }
    });
  });
};
var getUtxosForAddresses = function (addresses, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var availableUtxos, i, utxosFromBlockstream, j, utxo, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          availableUtxos = [];
          i = 0;
          _b.label = 1;
        case 1:
          if (!(i < addresses.length)) return [3 /*break*/, 8];
          return [
            4 /*yield*/,
            axios_1.default.get(
              unchained_bitcoin_1.blockExplorerAPIURL(
                "/address/" + addresses[i].address + "/utxo",
                getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
              )
            ),
          ];
        case 2:
          return [4 /*yield*/, _b.sent().data];
        case 3:
          utxosFromBlockstream = _b.sent();
          j = 0;
          _b.label = 4;
        case 4:
          if (!(j < utxosFromBlockstream.length)) return [3 /*break*/, 7];
          utxo = utxosFromBlockstream[j];
          utxo.address = addresses[i];
          _a = utxo;
          return [4 /*yield*/, getTxHex(utxo.txid, currentBitcoinNetwork)];
        case 5:
          _a.prevTxHex = _b.sent();
          availableUtxos.push(utxo);
          _b.label = 6;
        case 6:
          j++;
          return [3 /*break*/, 4];
        case 7:
          i++;
          return [3 /*break*/, 1];
        case 8:
          return [2 /*return*/, availableUtxos];
      }
    });
  });
};
var getAddressFromPubKey = function (
  childPubKey,
  addressType,
  currentBitcoinNetwork
) {
  if (addressType === "p2sh") {
    var _a = bitcoinjs_lib_1.payments.p2sh({
        redeem: bitcoinjs_lib_1.payments.p2wpkh({
          pubkey: Buffer.from(childPubKey.childPubKey, "hex"),
          network: currentBitcoinNetwork,
        }),
        network: currentBitcoinNetwork,
      }),
      network = _a.network,
      _address = _a.address,
      hash = _a.hash,
      output = _a.output,
      redeem = _a.redeem,
      input = _a.input,
      witness = _a.witness;
    return {
      network: currentBitcoinNetwork,
      address: _address,
      hash: hash,
      output: output,
      redeem: redeem,
      input: input,
      witness: witness,
      bip32derivation: [childPubKey.bip32derivation],
    };
  } else {
    // p2wpkh
    var _b = bitcoinjs_lib_1.payments.p2wpkh({
        pubkey: Buffer.from(childPubKey.childPubKey, "hex"),
        network: currentBitcoinNetwork,
      }),
      network = _b.network,
      _address = _b.address,
      hash = _b.hash,
      output = _b.output,
      redeem = _b.redeem,
      input = _b.input,
      witness = _b.witness;
    return {
      network: currentBitcoinNetwork,
      address: _address,
      hash: hash,
      output: output,
      redeem: redeem,
      input: input,
      witness: witness,
      bip32derivation: [childPubKey.bip32derivation],
    };
  }
};
var getTransactionsFromAddress = function (
  address,
  nodeClient,
  currentBitcoinNetwork
) {
  return __awaiter(void 0, void 0, void 0, function () {
    var addressTxs, txIds, numTxIds, i, tx;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!nodeClient) return [3 /*break*/, 6];
          addressTxs = [];
          return [
            4 /*yield*/,
            nodeClient.listReceivedByAddress(
              0, // minconf
              true, // include_empty
              true, // include_watchonly
              address // address_filter
            ),
          ];
        case 1:
          txIds = _c.sent();
          numTxIds =
            ((_b =
              (_a = txIds[0]) === null || _a === void 0 ? void 0 : _a.txids) ===
              null || _b === void 0
              ? void 0
              : _b.length) || 0;
          i = 0;
          _c.label = 2;
        case 2:
          if (!(i < numTxIds)) return [3 /*break*/, 5];
          return [
            4 /*yield*/,
            nodeClient.getRawTransaction(txIds[0].txids[i], true),
          ];
        case 3:
          tx = _c.sent();
          addressTxs.push(tx);
          _c.label = 4;
        case 4:
          i++;
          return [3 /*break*/, 2];
        case 5:
          return [2 /*return*/, addressTxs];
        case 6:
          return [
            4 /*yield*/,
            axios_1.default.get(
              unchained_bitcoin_1.blockExplorerAPIURL(
                "/address/" + address + "/txs",
                getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
              )
            ),
          ];
        case 7:
          return [4 /*yield*/, _c.sent().data];
        case 8:
          return [2 /*return*/, _c.sent()];
      }
    });
  });
};
var getAddressFromAccount = function (account, path, currentBitcoinNetwork) {
  if (account.quorum.totalSigners > 1) {
    // multisig
    if (account.extendedPublicKeys) {
      // should always be true
      var childPubKeys = account.extendedPublicKeys.map(function (
        extendedPublicKey
      ) {
        return getChildPubKeyFromXpub(
          extendedPublicKey,
          path,
          currentBitcoinNetwork
        );
      });
      return getMultisigAddressFromPubKeys(
        childPubKeys,
        account,
        currentBitcoinNetwork
      );
    }
  } else {
    // single sig
    if (account.addressType === types_1.AddressType.p2sh) {
      // hww
      var receivePubKey = getChildPubKeyFromXpub(
        account.extendedPublicKeys[0],
        path,
        currentBitcoinNetwork
      );
      return getAddressFromPubKey(
        receivePubKey,
        types_1.AddressType.p2sh,
        currentBitcoinNetwork
      );
    } else {
      // software wallet
      var receivePubKey = getChildPubKeyFromXpub(
        account.extendedPublicKeys[0],
        path,
        currentBitcoinNetwork
      );
      return getAddressFromPubKey(
        receivePubKey,
        types_1.AddressType.P2WPKH,
        currentBitcoinNetwork
      );
    }
  }
};
exports.getAddressFromAccount = getAddressFromAccount;
var scanForAddressesAndTransactions = function (
  account,
  nodeClient,
  currentBitcoinNetwork,
  limitGap
) {
  return __awaiter(void 0, void 0, void 0, function () {
    var receiveAddresses,
      changeAddresses,
      transactions,
      unusedReceiveAddresses,
      unusedChangeAddresses,
      gap,
      i,
      receiveAddress,
      receiveTxs,
      changeAddress,
      changeTxs;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log(
            "(" +
              account.id +
              "): Deriving addresses and checking for transactions..."
          );
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
          receiveAddress = exports.getAddressFromAccount(
            account,
            "m/0/" + i,
            currentBitcoinNetwork
          );
          receiveAddresses.push(receiveAddress);
          return [
            4 /*yield*/,
            getTransactionsFromAddress(
              receiveAddress.address,
              nodeClient,
              currentBitcoinNetwork
            ),
          ];
        case 2:
          receiveTxs = _a.sent();
          if (!receiveTxs.length) {
            unusedReceiveAddresses.push(receiveAddress);
          } else {
            transactions = __spreadArray(
              __spreadArray([], transactions),
              receiveTxs
            );
          }
          changeAddress = exports.getAddressFromAccount(
            account,
            "m/1/" + i,
            currentBitcoinNetwork
          );
          changeAddresses.push(changeAddress);
          return [
            4 /*yield*/,
            getTransactionsFromAddress(
              changeAddress.address,
              nodeClient,
              currentBitcoinNetwork
            ),
          ];
        case 3:
          changeTxs = _a.sent();
          if (!changeTxs.length) {
            unusedChangeAddresses.push(changeAddress);
          } else {
            transactions = __spreadArray(
              __spreadArray([], transactions),
              changeTxs
            );
          }
          if (!!!receiveTxs.length && !!!changeTxs.length) {
            gap = gap + 1;
          } else {
            gap = 0;
          }
          i = i + 1;
          return [3 /*break*/, 1];
        case 4:
          console.log(
            "(" +
              account.id +
              "): Finished deriving addresses and checking for transactions."
          );
          return [
            2 /*return*/,
            {
              receiveAddresses: receiveAddresses,
              changeAddresses: changeAddresses,
              unusedReceiveAddresses: unusedReceiveAddresses,
              unusedChangeAddresses: unusedChangeAddresses,
              transactions: transactions,
            },
          ];
      }
    });
  });
};
var getDataFromMultisig = function (
  account,
  nodeClient,
  currentBitcoinNetwork
) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      receiveAddresses,
      changeAddresses,
      unusedReceiveAddresses,
      unusedChangeAddresses,
      transactions,
      organizedTransactions,
      availableUtxos;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            scanForAddressesAndTransactions(
              account,
              nodeClient,
              currentBitcoinNetwork,
              10
            ),
          ];
        case 1:
          (_a = _b.sent()),
            (receiveAddresses = _a.receiveAddresses),
            (changeAddresses = _a.changeAddresses),
            (unusedReceiveAddresses = _a.unusedReceiveAddresses),
            (unusedChangeAddresses = _a.unusedChangeAddresses),
            (transactions = _a.transactions);
          if (!nodeClient) return [3 /*break*/, 4];
          console.log(
            "(" + account.id + "): Serializing transactions from node..."
          );
          return [
            4 /*yield*/,
            serializeTransactionsFromNode(nodeClient, transactions),
          ];
        case 2:
          organizedTransactions = _b.sent();
          console.log("(" + account.id + "): re-serializing (test...)...");
          organizedTransactions = exports.serializeTransactions(
            organizedTransactions,
            receiveAddresses,
            changeAddresses
          );
          console.log("(" + account.id + "): Getting UTXO data from node...");
          return [
            4 /*yield*/,
            getUtxosFromNode(receiveAddresses, changeAddresses, nodeClient),
          ];
        case 3:
          availableUtxos = _b.sent();
          return [3 /*break*/, 6];
        case 4:
          console.log("(" + account.id + "): Serializing transactions...");
          organizedTransactions = exports.serializeTransactions(
            transactions,
            receiveAddresses,
            changeAddresses
          );
          console.log("(" + account.id + "): Getting UTXO data...");
          return [
            4 /*yield*/,
            getUtxosForAddresses(
              receiveAddresses.concat(changeAddresses),
              currentBitcoinNetwork
            ),
          ];
        case 5:
          availableUtxos = _b.sent();
          _b.label = 6;
        case 6:
          return [
            2 /*return*/,
            [
              receiveAddresses,
              changeAddresses,
              organizedTransactions,
              unusedReceiveAddresses,
              unusedChangeAddresses,
              availableUtxos,
            ],
          ];
      }
    });
  });
};
exports.getDataFromMultisig = getDataFromMultisig;
var getDataFromXPub = function (account, nodeClient, currentBitcoinNetwork) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      receiveAddresses,
      changeAddresses,
      unusedReceiveAddresses,
      unusedChangeAddresses,
      transactions,
      organizedTransactions,
      availableUtxos;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            scanForAddressesAndTransactions(
              account,
              nodeClient,
              currentBitcoinNetwork,
              10
            ),
          ];
        case 1:
          (_a = _b.sent()),
            (receiveAddresses = _a.receiveAddresses),
            (changeAddresses = _a.changeAddresses),
            (unusedReceiveAddresses = _a.unusedReceiveAddresses),
            (unusedChangeAddresses = _a.unusedChangeAddresses),
            (transactions = _a.transactions);
          if (!nodeClient) return [3 /*break*/, 4];
          console.log(
            "(" + account.id + "): Serializing transactions from node..."
          );
          return [
            4 /*yield*/,
            serializeTransactionsFromNode(nodeClient, transactions),
          ];
        case 2:
          organizedTransactions = _b.sent();
          console.log("(" + account.id + "): Getting UTXO data from node...");
          return [
            4 /*yield*/,
            getUtxosFromNode(receiveAddresses, changeAddresses, nodeClient),
          ];
        case 3:
          availableUtxos = _b.sent();
          return [3 /*break*/, 6];
        case 4:
          console.log("(" + account.id + "): Getting UTXO data...");
          return [
            4 /*yield*/,
            getUtxosForAddresses(
              receiveAddresses.concat(changeAddresses),
              currentBitcoinNetwork
            ),
          ];
        case 5:
          availableUtxos = _b.sent();
          console.log("(" + account.id + "): Serializing transactions...");
          organizedTransactions = exports.serializeTransactions(
            transactions,
            receiveAddresses,
            changeAddresses
          );
          _b.label = 6;
        case 6:
          return [
            2 /*return*/,
            [
              receiveAddresses,
              changeAddresses,
              organizedTransactions,
              unusedReceiveAddresses,
              unusedChangeAddresses,
              availableUtxos,
            ],
          ];
      }
    });
  });
};
exports.getDataFromXPub = getDataFromXPub;
var loadOrCreateWalletViaRPC = function (config, nodeClient) {
  return __awaiter(void 0, void 0, void 0, function () {
    var walletList, walletResp, e_2, _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
      switch (_r.label) {
        case 0:
          return [4 /*yield*/, nodeClient.listWallets()];
        case 1:
          walletList = _r.sent();
          console.log("walletList: ", walletList);
          if (!!walletList.includes("lily" + config.id))
            return [3 /*break*/, 19];
          console.log("Wallet lily" + config.id + " isn't loaded.");
          _r.label = 2;
        case 2:
          _r.trys.push([2, 4, , 19]);
          console.log("Attempting to load lily" + config.id + "...");
          return [
            4 /*yield*/,
            nodeClient.loadWallet(
              "lily" + config.id // filename
            ),
          ];
        case 3:
          walletResp = _r.sent();
          return [3 /*break*/, 19];
        case 4:
          e_2 = _r.sent();
          console.log("Couldn't load lily" + config.id + "...");
          console.log("Creating lily" + config.id + "...");
          // if failed to load wallet, then probably doesnt exist so let's create one and import
          return [
            4 /*yield*/,
            nodeClient.createWallet(
              "lily" + config.id, // wallet_name
              true, // disable_private_keys
              true, //blank
              "", // passphrase
              true // avoid_reuse
            ),
          ];
        case 5:
          // if failed to load wallet, then probably doesnt exist so let's create one and import
          _r.sent();
          if (!(config.quorum.totalSigners === 1)) return [3 /*break*/, 14];
          if (!(config.addressType === "p2sh")) return [3 /*break*/, 9];
          console.log("Importing " + config.addressType + " addresses...");
          _b = (_a = nodeClient).importMulti;
          _k = {};
          return [
            4 /*yield*/,
            exports.getWrappedDescriptor(nodeClient, config, false),
          ];
        case 6:
          _c = [
            ((_k.desc = _r.sent()),
            (_k.range = [0, 1000]),
            (_k.timestamp = 1503446400),
            (_k.internal = false),
            (_k.watchonly = true),
            (_k.keypool = true),
            _k),
          ];
          _l = {};
          return [
            4 /*yield*/,
            exports.getWrappedDescriptor(nodeClient, config, true),
          ];
        case 7:
          return [
            4 /*yield*/,
            _b.apply(_a, [
              _c.concat([
                ((_l.desc = _r.sent()),
                (_l.range = [0, 1000]),
                (_l.timestamp = 1503446400),
                (_l.internal = false),
                (_l.watchonly = true),
                (_l.keypool = true),
                _l),
              ]),
              {
                rescan: true,
              },
            ]),
          ];
        case 8:
          _r.sent();
          return [3 /*break*/, 13];
        case 9:
          console.log("Importing " + config.addressType + " addresses...");
          _e = (_d = nodeClient).importMulti;
          _m = {};
          return [
            4 /*yield*/,
            exports.getSegwitDescriptor(nodeClient, config, false),
          ];
        case 10:
          _f = [
            ((_m.desc = _r.sent()),
            (_m.range = [0, 1000]),
            (_m.timestamp = 1503446400),
            (_m.internal = false),
            (_m.watchonly = true),
            (_m.keypool = true),
            _m),
          ];
          _o = {};
          return [
            4 /*yield*/,
            exports.getSegwitDescriptor(nodeClient, config, true),
          ];
        case 11:
          return [
            4 /*yield*/,
            _e.apply(_d, [
              _f.concat([
                ((_o.desc = _r.sent()),
                (_o.range = [0, 1000]),
                (_o.timestamp = 1503446400),
                (_o.internal = false),
                (_o.watchonly = true),
                (_o.keypool = true),
                _o),
              ]),
              {
                rescan: true,
              },
            ]),
          ];
        case 12:
          _r.sent();
          _r.label = 13;
        case 13:
          return [3 /*break*/, 18];
        case 14:
          console.log("Importing " + config.addressType + " addresses...");
          _h = (_g = nodeClient).importMulti;
          _p = {};
          return [
            4 /*yield*/,
            exports.getMultisigDescriptor(nodeClient, config, false),
          ];
        case 15:
          _j = [
            ((_p.desc = _r.sent()),
            (_p.range = [0, 1000]),
            (_p.timestamp = 1503446400),
            (_p.internal = false),
            (_p.watchonly = true),
            (_p.keypool = true),
            _p),
          ];
          _q = {};
          return [
            4 /*yield*/,
            exports.getMultisigDescriptor(nodeClient, config, true),
          ];
        case 16:
          // multisig
          //  import receive addresses
          return [
            4 /*yield*/,
            _h.apply(_g, [
              _j.concat([
                ((_q.desc = _r.sent()),
                (_q.range = [0, 1000]),
                (_q.timestamp = 1503446400),
                (_q.internal = false),
                (_q.watchonly = true),
                (_q.keypool = true),
                _q),
              ]),
              {
                rescan: true,
              },
            ]),
          ];
        case 17:
          // multisig
          //  import receive addresses
          _r.sent();
          _r.label = 18;
        case 18:
          return [3 /*break*/, 19];
        case 19:
          return [2 /*return*/];
      }
    });
  });
};
exports.loadOrCreateWalletViaRPC = loadOrCreateWalletViaRPC;
//# sourceMappingURL=accountMap.js.map
