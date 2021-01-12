import { ipcMain, ipcRenderer } from '../mock/electron-mock'

import { Psbt, networks } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';

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
  createTransaction
} from '../../utils/send';

import { AddressType } from '../../types'

import MultisigAccount from '../fixtures/Multisig-Account.json';
import MultisigUtxos from '../fixtures/Multisig-Utxos.json';
import MultisigTransactions from '../fixtures/Multisig-Transactions.json';
import MultisigUnusedChangeAddresses from '../fixtures/Multisig-UnusedChangeAddresses.json';

import HWWAccount from '../fixtures/HWW-Account.json';

import MnemonicAccount from '../fixtures/Mnemonic-Account.json';
import MnemonicUtxos from '../fixtures/Mnemonic-UTXOs.json';
import MnemonicUnusedChangeAddresses from '../fixtures/Mnemonic-UnusedChangeAddresses.json';

const FEE_RATES = {
  fastestFee: 275,
  halfHourFee: 254,
  hourFee: 187
}

describe('Send Utils', () => {
  beforeAll(() => {
    global.ipcMain = ipcMain;
    global.ipcRenderer = ipcRenderer;

    ipcMain.handle('/estimateFee', (event, obj) => {
      event.sender.send('/estimateFee', FEE_RATES)
    });
  })

  test('validateAddress', () => {
    const VALID_ADDRESS = '3L7XqyW1sxTtiJZnc5QagQZfPszNM6ZAoJ'
    const INVALID_ADDRESS = '3L7XqyWxTtiJZnc5QagQZfPszNM6ZAoJ' // missing characters

    const validResponse = validateAddress(VALID_ADDRESS, networks.bitcoin);
    const invalidResponse = validateAddress(INVALID_ADDRESS, networks.bitcoin)

    expect(validResponse).toStrictEqual(true)
    expect(invalidResponse).toStrictEqual(false)
  });

  test('validateSendAmount', () => {
    const valid = validateSendAmount('100', 10);
    expect(valid).toBe(false);
    const valid2 = validateSendAmount('100', 15000000000);
    expect(valid2).toBe(true);
    const valid3 = validateSendAmount('100', 100);
    expect(valid3).toBe(false);
  });

  test('validateTxForAccount success', () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"
    const psbt = Psbt.fromBase64(UNSIGNED_TX);
    const valid = validateTxForAccount(psbt, { ...MultisigAccount, availableUtxos: MultisigUtxos });
    expect(valid).toBe(true);
    // try with account that doesn't own the psbt, should throw an error
    expect(() => validateTxForAccount(psbt, { ...MnemonicAccount, availableUtxos: MnemonicUtxos })).toThrow();
  })


  test('combinePsbts', () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"
    const PSBT_1 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDy3KIjTyYiaWQZizgoc1V8Btodix8ns6BO/9LR9pzqBxHMEQCIFMAS4+zMEyu/FFdpTkFn/0R4lkSUUTQFnLAc4lgk572AiBfkFpkGaRu6nbi8IxKfkKfx7+eq63HgmWTl3W9AUobUwEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA";
    const PSBT_2 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=";
    const COMBINED_PSBTS_BASE64 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA="

    const finalPsbt = Psbt.fromBase64(UNSIGNED_TX);
    expect(finalPsbt.data.inputs[0].partialSig).toBe(undefined);

    const psbt1 = Psbt.fromBase64(PSBT_1);
    const combinedPsbts1 = combinePsbts(finalPsbt, psbt1);

    expect(combinedPsbts1.txInputs.length).toEqual(1);
    expect(combinedPsbts1.txOutputs.length).toEqual(2);
    expect(combinedPsbts1.data.inputs[0].partialSig!.length).toEqual(1);
    expect(combinedPsbts1.txOutputs[0].address).toEqual('bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk');
    expect(combinedPsbts1.txOutputs[0].value).toEqual(1000000);
    expect(combinedPsbts1.txOutputs[1].address).toEqual('bc1qejjt2pfmzxsswp7y9m56efqv5tje27xegfksvd3n09xreflgxwvq7y06my');
    expect(combinedPsbts1.txOutputs[1].value).toEqual(25911552);

    const psbt2 = Psbt.fromBase64(PSBT_2);
    const combinedPsbts2 = combinePsbts(combinedPsbts1, psbt2);

    expect(combinedPsbts2.txInputs.length).toEqual(1);
    expect(combinedPsbts2.txOutputs.length).toEqual(2);
    expect(combinedPsbts2.data.inputs[0].partialSig!.length).toEqual(2);
    expect(combinedPsbts2.txOutputs[0].address).toEqual('bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk');
    expect(combinedPsbts2.txOutputs[0].value).toEqual(1000000);
    expect(combinedPsbts2.txOutputs[1].address).toEqual('bc1qejjt2pfmzxsswp7y9m56efqv5tje27xegfksvd3n09xreflgxwvq7y06my');
    expect(combinedPsbts2.txOutputs[1].value).toEqual(25911552);
    expect(COMBINED_PSBTS_BASE64).toEqual(combinedPsbts2.toBase64());
  });

  test('createUtxoMapFromUtxoArray', () => {
    const UtxoMap = createUtxoMapFromUtxoArray(MultisigUtxos as any);
    expect(Object.keys(UtxoMap).length).toEqual(MultisigUtxos.length);
  });

  test('createTransactionMapFromTransactionArray', () => {
    const TransactionMap = createTransactionMapFromTransactionArray(MultisigTransactions as any);
    expect(Object.keys(TransactionMap).length).toEqual(MultisigTransactions.length);
  });

  test('getFeeForMultisig', () => {
    const FEE_RATE = 10;
    const ADDRESS_TYPE = AddressType.P2WSH;
    const NUM_INPUTS = 2;
    const NUM_OUTPUTS = 2;
    const REQ_SIGNERS = 2;
    const TOTAL_SIGNERS = 3;
    const multisigFee = getFeeForMultisig(FEE_RATE, ADDRESS_TYPE, NUM_INPUTS, NUM_OUTPUTS, REQ_SIGNERS, TOTAL_SIGNERS);
    expect(multisigFee.toNumber()).toEqual(3050);
  })

  test('getFee', () => {
    const PSBT_1 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDy3KIjTyYiaWQZizgoc1V8Btodix8ns6BO/9LR9pzqBxHMEQCIFMAS4+zMEyu/FFdpTkFn/0R4lkSUUTQFnLAc4lgk572AiBfkFpkGaRu6nbi8IxKfkKfx7+eq63HgmWTl3W9AUobUwEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA";
    const psbt = Psbt.fromBase64(PSBT_1);
    const fee = getFee(psbt, MultisigTransactions as any);
    expect(fee).toEqual(51308);
  });

  test('coinSelection', () => {
    const utxoMap = createUtxoMapFromUtxoArray(MultisigUtxos as any);
    const { spendingUtxos, currentTotal } = coinSelection(1000000, MultisigUtxos as any); // 0.01 BTC
    expect(spendingUtxos.length).toEqual(1);
    expect(spendingUtxos[0]).toEqual(utxoMap['28177cf0e0c508d2eefd2fd292d1699915ab7cffc6393989bf9b1fc1d94a930d:1']);
    expect(currentTotal.toNumber()).toEqual(26962860);

    // KBC-TODO: add a more complex transaction with multiple inputs
  })

  test('getPsbtFromText', () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"
    const psbt = getPsbtFromText(UNSIGNED_TX);
    expect(psbt.txInputs.length).toBe(1);
    expect(psbt.txOutputs.length).toBe(2);
    expect(psbt.txOutputs[0].address).toEqual('bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk');
    expect(psbt.txOutputs[0].value).toEqual(1000000);
    expect(psbt.txOutputs[1].address).toEqual('bc1qejjt2pfmzxsswp7y9m56efqv5tje27xegfksvd3n09xreflgxwvq7y06my');
    expect(psbt.txOutputs[1].value).toEqual(25911552);
  });

  test('getSignedFingerprintsFromPsbt', () => {
    const COMBINED_PSBTS_BASE64 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA="
    const psbt = Psbt.fromBase64(COMBINED_PSBTS_BASE64);
    const fingerprints = getSignedFingerprintsFromPsbt(psbt);
    expect(fingerprints.length).toBe(2);
    expect(fingerprints.includes('4f60d1c9')).toBe(true);
    expect(fingerprints.includes('34ecf56b')).toBe(true);
    expect(fingerprints.includes('abc123')).toBe(false);
  });

  test('getSignedDevicesFromPsbt', () => {
    const COMBINED_PSBTS_BASE64 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA="
    const psbt = Psbt.fromBase64(COMBINED_PSBTS_BASE64);
    const devices = getSignedDevicesFromPsbt(psbt, MultisigAccount.config.extendedPublicKeys);
    expect(devices.length).toBe(2);
    expect(devices.some(device => device.fingerprint === '4F60D1C9')).toBe(true);
    expect(devices.some(device => device.fingerprint === '34ECF56B')).toBe(true);
  })

  test('Multisig - createTransaction', async () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"

    const AMOUNT_TO_SEND = '0.01';
    const CURRENT_ACCOUNT = { ...MultisigAccount, availableUtxos: MultisigUtxos, unusedChangeAddresses: MultisigUnusedChangeAddresses, transactions: MultisigTransactions };
    const RECIPIENT_ADDRESS = 'bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk';
    const DESIRED_FEE = new BigNumber(0);
    const { psbt, feeRates } = await createTransaction(CURRENT_ACCOUNT as any, AMOUNT_TO_SEND, RECIPIENT_ADDRESS, DESIRED_FEE, networks.bitcoin);
    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
    expect(getFee(psbt, CURRENT_ACCOUNT.transactions as any)).toBe(51308);
  });

  test('HWW - createTransaction', async () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tBPK4oBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQRpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"

    const AMOUNT_TO_SEND = '0.01';
    const CURRENT_ACCOUNT = { ...HWWAccount, availableUtxos: MultisigUtxos, unusedChangeAddresses: MultisigUnusedChangeAddresses };
    const RECIPIENT_ADDRESS = 'bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk';
    const DESIRED_FEE = new BigNumber(0);
    const { psbt, feeRates } = await createTransaction(CURRENT_ACCOUNT as any, AMOUNT_TO_SEND, RECIPIENT_ADDRESS, DESIRED_FEE, networks.bitcoin);
    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
  });

  test('Mnemonic - createTransaction', async () => {
    const UNSIGNED_TX = "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"

    const AMOUNT_TO_SEND = '0.01';
    const CURRENT_ACCOUNT = { ...MnemonicAccount, availableUtxos: MnemonicUtxos, unusedChangeAddresses: MnemonicUnusedChangeAddresses };
    const RECIPIENT_ADDRESS = 'bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk';
    const DESIRED_FEE = new BigNumber(0);
    const { psbt, feeRates } = await createTransaction(CURRENT_ACCOUNT as any, AMOUNT_TO_SEND, RECIPIENT_ADDRESS, DESIRED_FEE, networks.bitcoin);
    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
  });
})