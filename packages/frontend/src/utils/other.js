import bs58check from "bs58check";
import BigNumber from "bignumber.js";

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function capitalizeAllAndReplaceUnderscore(word) {
  return word.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function isOnlyLettersAndNumbers(word) {
  const letterNumber = /^[0-9a-zA-Z]+$/;
  return word.match(letterNumber);
}

export function cloneBuffer(buffer) {
  const clone = Buffer.alloc(buffer.length);
  buffer.copy(clone);
  return clone;
}

export function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function formatMoney(
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

export function zpubToXpub(zpub) {
  const zpubRemovedPrefix = zpub.slice(4);
  const xpubBuffer = Buffer.concat([
    Buffer.from("0488b21e", "hex"),
    zpubRemovedPrefix,
  ]);
  const xpub = bs58check.encode(xpubBuffer);
  return xpub;
}

export function getNodeStatus(nodeConfig) {
  if (nodeConfig) {
    if (nodeConfig.initialblockdownload && nodeConfig.verificationprogress) {
      return `Initializing (${new BigNumber(nodeConfig.verificationprogress)
        .multipliedBy(100)
        .toFixed(2)}%)`;
    } else if (nodeConfig.connected) {
      return `Connected`;
    } else if (!nodeConfig.connected) {
      return `Disconnected`;
    } else {
      return "Connecting...";
    }
  }
  return "Connecting...";
}
