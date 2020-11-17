import { ipcMain, ipcRenderer } from '../mock/electron-mock'

import { Psbt, networks } from 'bitcoinjs-lib';

import {
  combinePsbts,
  validateAddress,
  createUtxoMapFromUtxoArray,
  createTransactionMapFromTransactionArray,
  getFeeForMultisig,
  getFee,
  coinSelection,
  createTransaction
} from '../../pages/Send/utils';

import { AddressType, LilyAccount, UTXO } from '../../types'

import UtxoArray from '../fixtures/Multisig-UtxoArray.json';
import TransactionArray from '../fixtures/Multisig-TransactionArray.json';
import MultisigAccount from '../fixtures/Multisig-Account.json';
import UnusedChangeAddressArray from '../fixtures/Multisig-UnusedChangeAddressArray.json';
import HWWAccount from '../fixtures/HWW-Account.json';
import MnemonicAccount from '../fixtures/Mnemonic-Account.json';

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
  })

  test('combinePsbts', () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"
    const PSBT_1 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDy3KIjTyYiaWQZizgoc1V8Btodix8ns6BO/9LR9pzqBxHMEQCIFMAS4+zMEyu/FFdpTkFn/0R4lkSUUTQFnLAc4lgk572AiBfkFpkGaRu6nbi8IxKfkKfx7+eq63HgmWTl3W9AUobUwEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA";
    const PSBT_2 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA=";
    const COMBINED_PSBTS_BASE64 = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgIDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDVHMEQCICjl1FVRr/orXGnq6lRnl+v+NkjKCpFzlURsUOdEMjarAiBU9s17EYmslFQZxTjAM6d7TzrrgIcXd9dmfatERfcQhwEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgUwBLj7MwTK78UV2lOQWf/RHiWRJRRNAWcsBziWCTnvYCIF+QWmQZpG7qduLwjEp+Qp/Hv56rrceCZZOXdb0BShtTAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA="

    const finalPsbt = Psbt.fromBase64(UNSIGNED_TX);
    expect(finalPsbt.data.inputs[0].partialSig).toBe(undefined);

    const combinedPsbts = combinePsbts(finalPsbt, [PSBT_1, PSBT_2]);

    expect(combinedPsbts.txInputs.length).toEqual(1);
    expect(combinedPsbts.txOutputs.length).toEqual(2);
    expect(combinedPsbts.data.inputs[0].partialSig!.length).toEqual(2);
    expect(combinedPsbts.txOutputs[0].address).toEqual('bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk');
    expect(combinedPsbts.txOutputs[0].value).toEqual(1000000);
    expect(combinedPsbts.txOutputs[1].address).toEqual('bc1qejjt2pfmzxsswp7y9m56efqv5tje27xegfksvd3n09xreflgxwvq7y06my');
    expect(combinedPsbts.txOutputs[1].value).toEqual(25911552);
    expect(COMBINED_PSBTS_BASE64).toEqual(combinedPsbts.toBase64());
  });

  test('createUtxoMapFromUtxoArray', () => {
    const UtxoMap = createUtxoMapFromUtxoArray(UtxoArray as any);
    expect(Object.keys(UtxoMap).length).toEqual(UtxoArray.length);
  });

  test('createTransactionMapFromTransactionArray', () => {
    const TransactionMap = createTransactionMapFromTransactionArray(TransactionArray as any);
    expect(Object.keys(TransactionMap).length).toEqual(TransactionArray.length);
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
    const fee = getFee(psbt, TransactionArray as any);
    expect(fee).toEqual(51308);
  });

  test('coinSelection', () => {
    const utxoMap = createUtxoMapFromUtxoArray(UtxoArray as any);
    const { spendingUtxos, currentTotal } = coinSelection(1000000, UtxoArray as any); // 0.01 BTC
    expect(spendingUtxos.length).toEqual(1);
    expect(spendingUtxos[0]).toEqual(utxoMap['28177cf0e0c508d2eefd2fd292d1699915ab7cffc6393989bf9b1fc1d94a930d:1']);
    expect(currentTotal.toNumber()).toEqual(26962860);

    // KBC-TODO: add a more complex transaction with multiple inputs
  })

  test('Multisig - createTransaction', async () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tAAYYsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"

    const AMOUNT_TO_SEND = '0.01';
    const CURRENT_ACCOUNT = MultisigAccount;
    const RECIPIENT_ADDRESS = 'bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk';
    const DESIRED_FEE = undefined;
    const AVAILABLE_UTXOS = UtxoArray;
    const UNUSED_CHANGE_ADDRESSES = UnusedChangeAddressArray;
    const { psbt, fee, feeRates } = await createTransaction(CURRENT_ACCOUNT as LilyAccount, AMOUNT_TO_SEND, RECIPIENT_ADDRESS, DESIRED_FEE, AVAILABLE_UTXOS as any, UNUSED_CHANGE_ADDRESSES as any, networks.bitcoin);
    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
    expect(fee.toNumber()).toBe(51308);
  });

  test('HWW - createTransaction', async () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tBPK4oBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAAQRpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"

    const AMOUNT_TO_SEND = '0.01';
    const CURRENT_ACCOUNT = HWWAccount;
    const RECIPIENT_ADDRESS = 'bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk';
    const DESIRED_FEE = undefined;
    const AVAILABLE_UTXOS = UtxoArray;
    const UNUSED_CHANGE_ADDRESSES = UnusedChangeAddressArray;
    const { psbt, fee, feeRates } = await createTransaction(CURRENT_ACCOUNT as LilyAccount, AMOUNT_TO_SEND, RECIPIENT_ADDRESS, DESIRED_FEE, AVAILABLE_UTXOS as any, UNUSED_CHANGE_ADDRESSES as any, networks.bitcoin);
    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
    expect(fee).toBe(130589);
  });

  test('Mnemonic - createTransaction', async () => {
    const UNSIGNED_TX = "cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AkBCDwAAAAAAFgAUSVEw/wVLMaWYOEkglmBTSbQN3tBPK4oBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA"

    const AMOUNT_TO_SEND = '0.01';
    const CURRENT_ACCOUNT = MnemonicAccount;
    const RECIPIENT_ADDRESS = 'bc1qf9gnplc9fvc6txpcfysfvcznfx6qmhksce0jjk';
    const DESIRED_FEE = undefined;
    const AVAILABLE_UTXOS = UtxoArray;
    const UNUSED_CHANGE_ADDRESSES = UnusedChangeAddressArray;
    const { psbt, fee, feeRates } = await createTransaction(CURRENT_ACCOUNT as any, AMOUNT_TO_SEND, RECIPIENT_ADDRESS, DESIRED_FEE, AVAILABLE_UTXOS as any, UNUSED_CHANGE_ADDRESSES as any, networks.bitcoin);
    expect(psbt.toBase64()).toEqual(UNSIGNED_TX);
    expect(feeRates).toEqual(FEE_RATES);
    expect(fee).toBe(130589);
  });
})