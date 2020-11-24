"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bs58check = require('bs58check');
function cloneBuffer(buffer) {
    var clone = Buffer.alloc(buffer.length);
    buffer.copy(clone);
    return clone;
}
exports.cloneBuffer = cloneBuffer;
function bufferToHex(buffer) {
    return __spreadArrays(new Uint8Array(buffer)).map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
}
exports.bufferToHex = bufferToHex;
function formatMoney(amount, decimalCount, decimal, thousands) {
    if (decimalCount === void 0) { decimalCount = 2; }
    if (decimal === void 0) { decimal = "."; }
    if (thousands === void 0) { thousands = ","; }
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        var negativeSign = amount < 0 ? "-" : "";
        var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        var j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    }
    catch (e) {
        console.log(e);
    }
}
exports.formatMoney = formatMoney;
;
function zpubToXpub(zpub) {
    var zpubRemovedPrefix = zpub.slice(4);
    var xpubBuffer = Buffer.concat([Buffer.from('0488b21e', 'hex'), zpubRemovedPrefix]);
    var xpub = bs58check.encode(xpubBuffer);
    return xpub;
}
exports.zpubToXpub = zpubToXpub;
;
//# sourceMappingURL=other.js.map