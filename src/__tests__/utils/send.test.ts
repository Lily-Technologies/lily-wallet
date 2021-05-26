import { ipcMain, ipcRenderer } from "../mock/electron-mock";

import { Psbt, networks } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";

import {
  combinePsbts,
  validateAddress,
  validateSendAmount,
  validateTxForAccount,
  createUtxoMapFromUtxoArray,
  createTransactionMapFromTransactionArray,
  getFeeForMultisig,
  getFee,
  coinSelection,
  getPsbtFromText,
  getSignedFingerprintsFromPsbt,
  getSignedDevicesFromPsbt,
  createTransaction,
} from "../../utils/send";

import { AddressType } from "../../types";

import { Multisig, Mnemonic, HWW } from "../fixtures";

const FEE_RATES = {
  fastestFee: 275,
  halfHourFee: 254,
  hourFee: 187,
};

describe("Send Utils", () => {
  beforeEach(() => {
    global.ipcMain = ipcMain;
    global.ipcRenderer = ipcRenderer;

    ipcMain.handle("/estimate-fee", (event, obj) => {
      event.sender.send("/estimate-fee", FEE_RATES);
    });
  });

  test("validateAddress", () => {
    const VALID_ADDRESS = "3L7XqyW1sxTtiJZnc5QagQZfPszNM6ZAoJ";
    const INVALID_ADDRESS = "3L7XqyWxTtiJZnc5QagQZfPszNM6ZAoJ"; // missing characters

    const validResponse = validateAddress(VALID_ADDRESS, networks.bitcoin);
    const invalidResponse = validateAddress(INVALID_ADDRESS, networks.bitcoin);

    expect(validResponse).toStrictEqual(true);
    expect(invalidResponse).toStrictEqual(false);
  });

  test("validateSendAmount", () => {
    const valid = validateSendAmount("100", 10);
    expect(valid).toBe(false);
    const valid2 = validateSendAmount("100", 15000000000);
    expect(valid2).toBe(true);
    const valid3 = validateSendAmount("100", 100);
    expect(valid3).toBe(false);
  });

  test("validateTxForAccount success", () => {
    const psbt = Psbt.fromBase64(Multisig.other.unsigned_transasction);
    const valid = validateTxForAccount(psbt, {
      ...Multisig.config,
      availableUtxos: Multisig.availableUtxos,
    });
    expect(valid).toBe(true);
    // try with account that doesn't own the psbt, should throw an error
    expect(() =>
      validateTxForAccount(psbt, {
        ...Mnemonic.config,
        availableUtxos: Mnemonic.availableUtxos,
      })
    ).toThrow();
  });

  test("combinePsbts", () => {
    const PSBT_1 =
      "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDy3KIjTyYiaWQZizgoc1V8Btodix8ns6BO/9LR9pzqBxHMEQCIFMAS4+zMEyu/FFdpTkFn/0R4lkSUUTQFnLAc4lgk572AiBfkFpkGaRu6nbi8IxKfkKfx7+eq63HgmWTl3W9AUobUwEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA";
    const PSBT_2 =
      "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=";
    const COMBINED_PSBTS_BASE64 =
      "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=";

    const finalPsbt = Psbt.fromBase64(Multisig.other.unsigned_transasction);
    expect(finalPsbt.data.inputs[0].partialSig).toBe(undefined);

    const psbt1 = Psbt.fromBase64(Multisig.other.one_signature_transaction);
    const combinedPsbts1 = combinePsbts(finalPsbt, psbt1);

    expect(combinedPsbts1.txInputs.length).toEqual(1);
    expect(combinedPsbts1.txOutputs.length).toEqual(2);
    expect(combinedPsbts1.data.inputs[0].partialSig!.length).toEqual(1);
    expect(combinedPsbts1.txOutputs[0].address).toEqual(
      "bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk"
    );
    expect(combinedPsbts1.txOutputs[0].value).toEqual(1000000);
    expect(combinedPsbts1.txOutputs[1].address).toEqual(
      Multisig.unusedChangeAddresses[0].address
    );
    expect(combinedPsbts1.txOutputs[1].value).toEqual(25911552);

    const psbt2 = Psbt.fromBase64(PSBT_2);
    const combinedPsbts2 = combinePsbts(combinedPsbts1, psbt2);

    expect(combinedPsbts2.txInputs.length).toEqual(1);
    expect(combinedPsbts2.txOutputs.length).toEqual(2);
    expect(combinedPsbts2.data.inputs[0].partialSig!.length).toEqual(2);
    expect(combinedPsbts2.txOutputs[0].address).toEqual(
      "bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk"
    );
    expect(combinedPsbts2.txOutputs[0].value).toEqual(1000000);
    expect(combinedPsbts2.txOutputs[1].address).toEqual(
      Multisig.unusedChangeAddresses[0].address
    );
    expect(combinedPsbts2.txOutputs[1].value).toEqual(25911552);
    expect(COMBINED_PSBTS_BASE64).toEqual(combinedPsbts2.toBase64());
  });

  test("createUtxoMapFromUtxoArray", () => {
    const UtxoMap = createUtxoMapFromUtxoArray(Multisig.availableUtxos as any);
    expect(Object.keys(UtxoMap).length).toEqual(Multisig.availableUtxos.length);
  });

  test("createTransactionMapFromTransactionArray", () => {
    const TransactionMap = createTransactionMapFromTransactionArray(
      Multisig.transactions as any
    );
    expect(Object.keys(TransactionMap).length).toEqual(
      Multisig.transactions.length
    );
  });

  test("getFeeForMultisig", () => {
    const FEE_RATE = 10;
    const ADDRESS_TYPE = AddressType.P2WSH;
    const NUM_INPUTS = 2;
    const NUM_OUTPUTS = 2;
    const REQ_SIGNERS = 2;
    const TOTAL_SIGNERS = 3;
    const multisigFee = getFeeForMultisig(
      FEE_RATE,
      ADDRESS_TYPE,
      NUM_INPUTS,
      NUM_OUTPUTS,
      REQ_SIGNERS,
      TOTAL_SIGNERS
    );
    expect(multisigFee.toNumber()).toEqual(3050);
  });

  test("getFee", () => {
    const PSBT_1 =
      "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDy3KIjTyYiaWQZizgoc1V8Btodix8ns6BO/9LR9pzqBxHMEQCIFMAS4+zMEyu/FFdpTkFn/0R4lkSUUTQFnLAc4lgk572AiBfkFpkGaRu6nbi8IxKfkKfx7+eq63HgmWTl3W9AUobUwEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA";
    const psbt = Psbt.fromBase64(PSBT_1);
    const fee = getFee(psbt, Multisig.transactions as any);
    expect(fee).toEqual(51308);
  });

  test("coinSelection", () => {
    const utxoMap = createUtxoMapFromUtxoArray(Multisig.availableUtxos as any);
    const { spendingUtxos, currentTotal } = coinSelection(
      1000000,
      Multisig.availableUtxos as any
    ); // 0.01 BTC
    expect(spendingUtxos.length).toEqual(1);
    expect(spendingUtxos[0]).toEqual(
      utxoMap[
        "28177cf0e0c508d2eefd2fd292d1699915ab7cffc6393989bf9b1fc1d94a930d:1"
      ]
    );
    expect(currentTotal.toNumber()).toEqual(26962860);

    // KBC-TODO: add a more complex transaction with multiple inputs
  });

  test("getPsbtFromText", () => {
    const psbt = getPsbtFromText(Multisig.other.unsigned_transasction);
    expect(psbt.txInputs.length).toBe(1);
    expect(psbt.txOutputs.length).toBe(2);
    expect(psbt.txOutputs[0].address).toEqual(
      "bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk"
    );
    expect(psbt.txOutputs[0].value).toEqual(1000000);
    expect(psbt.txOutputs[1].address).toEqual(
      Multisig.unusedChangeAddresses[0].address
    );
    expect(psbt.txOutputs[1].value).toEqual(25911552);
  });

  test("getSignedFingerprintsFromPsbt", () => {
    const COMBINED_PSBTS_BASE64 =
      "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=";
    const psbt = Psbt.fromBase64(COMBINED_PSBTS_BASE64);
    const fingerprints = getSignedFingerprintsFromPsbt(psbt);
    expect(fingerprints.length).toBe(2);
    expect(fingerprints.includes("4f60d1c9")).toBe(true);
    expect(fingerprints.includes("34ecf56b")).toBe(true);
    expect(fingerprints.includes("abc123")).toBe(false);
  });

  test("getSignedDevicesFromPsbt", () => {
    const COMBINED_PSBTS_BASE64 =
      "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=";
    const psbt = Psbt.fromBase64(COMBINED_PSBTS_BASE64);
    const devices = getSignedDevicesFromPsbt(
      psbt,
      Multisig.config.extendedPublicKeys
    );
    expect(devices.length).toBe(2);
    expect(devices.some((device) => device.fingerprint === "4F60D1C9")).toBe(
      true
    );
    expect(devices.some((device) => device.fingerprint === "34ECF56B")).toBe(
      true
    );
  });

  test("Multisig - createTransaction", async () => {
    const AMOUNT_TO_SEND = "0.01";
    const CURRENT_ACCOUNT = {
      config: Multisig.config,
      availableUtxos: Multisig.availableUtxos,
      unusedChangeAddresses: Multisig.unusedChangeAddresses,
      transactions: Multisig.transactions,
    };
    const RECIPIENT_ADDRESS = "bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk";
    const DESIRED_FEE = new BigNumber(0);
    const { psbt, feeRates } = await createTransaction(
      CURRENT_ACCOUNT as any,
      AMOUNT_TO_SEND,
      RECIPIENT_ADDRESS,
      DESIRED_FEE,
      networks.bitcoin
    );
    expect(psbt.toBase64()).toEqual(Multisig.other.unsigned_transasction);
    expect(feeRates).toEqual(FEE_RATES);
    expect(getFee(psbt, CURRENT_ACCOUNT.transactions as any)).toBe(51308);
  });

  test("HWW - createTransaction", async () => {
    const UNSIGNED_TX =
      "cHNidP8BAHICAAAAARfbs4oAMI1qAzJR8LdFGlKOdT3huuyeFjj+EqzXyZ5gAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tD3HncCAAAAABepFOt56CSSNXFoMRviPyW9d+ba9CBFhwAAAAAAAQD3AgAAAAABAY09IruoLx7PBgzKO+IyHv0SLF8HhDeW6TSavQ6kPBEFAQAAABcWABR2Xrg/Ef69j+4u23Hw9ONg/58pr/////8C2DkYAAAAAAAWABSInfR/q8OfElbgBeDckhHqoxB3EHNBhwIAAAAAF6kU+5LtduVIR+W1z9xylG89iSOjHfiHAkgwRQIhAO23hRhSoLnvxRPKdVGQkWRmMZtEKz1/FzmiwXbNpuyEAiB1YVx+JDd3t+MYbQCTDpcx97e3H1KWxF+QUbGKJhmkIgEhA91FwAJdDkY0HR1NRbp/nwGK/MDcEbOMeYCw/5gWYFPCAAAAAAEEFgAUkGUQ00VBeBajVprVcuhgn883O9giBgL4GHk9y8OsXoMCCWDu7ymzN5hOl0vzk7YEJj0RAAa1Thi085aBMQAAgAAAAIAAAACAAQAAAAMAAAAAAAA=";

    const AMOUNT_TO_SEND = "0.01";
    const CURRENT_ACCOUNT = {
      ...HWW.account,
      availableUtxos: HWW.availableUtxos,
      unusedChangeAddresses: HWW.unusedChangeAddresses,
    };
    const RECIPIENT_ADDRESS = "bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk";
    const DESIRED_FEE = new BigNumber(0);
    const { psbt, feeRates } = await createTransaction(
      CURRENT_ACCOUNT as any,
      AMOUNT_TO_SEND,
      RECIPIENT_ADDRESS,
      DESIRED_FEE,
      networks.bitcoin
    );

    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
  });

  test("Mnemonic - createTransaction", async () => {
    const UNSIGNED_TX =
      "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";

    const AMOUNT_TO_SEND = "0.001";
    const CURRENT_ACCOUNT = {
      ...Mnemonic.config,
      availableUtxos: Mnemonic.availableUtxos,
      unusedChangeAddresses: Mnemonic.unusedChangeAddresses,
    };
    const RECIPIENT_ADDRESS = "bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk";
    const DESIRED_FEE = new BigNumber(0);
    const { psbt, feeRates } = await createTransaction(
      CURRENT_ACCOUNT as any,
      AMOUNT_TO_SEND,
      RECIPIENT_ADDRESS,
      DESIRED_FEE,
      networks.bitcoin
    );

    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
  });
});
