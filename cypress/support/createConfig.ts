import { LilyConfig, AccountMap} from '../../src/types';
import { EMPTY_CONFIG } from '../../src/ConfigContext'
import { AES } from "crypto-js";

import {
    HWWAccount,
    HWWAddresses,
    HWWChangeAddresses,
    HWWTransactions,
    HWWUnusedAddresses,
    HWWUnusedChangeAddresses,
    HWWUTXOs,

    MnemonicAccount,
    MnemonicAddresses,
    MnemonicChangeAddresses,
    MnemonicTransactions,
    MnemonicUnusedAddresses,
    MnemonicUnusedChangeAddresses,
    MnemonicUTXOs,

    MultisigAccount,
    MultisigAddresses,
    MultisigChangeAddresses,
    MultisigTransactions,
    MultisigUnusedAddresses,
    MultisigUnusedChangeAddresses,
    MultisigUTXOs 
} from '../../src/__tests__/fixtures'

export const createAccountMap = () => {
    return {
        [HWWAccount.config.id]: {
            ...HWWAccount,
            transactions: HWWTransactions,
            addresses: HWWAddresses,
            unusedAddresses: HWWUnusedAddresses,
            changeAddresses: HWWChangeAddresses,
            unusedChangeAddresses: HWWUnusedChangeAddresses,
            availableUtxos: HWWUTXOs
        },
        [MnemonicAccount.config.id]: {
            ...MnemonicAccount,
            transactions: MnemonicTransactions,
            addresses: MnemonicAddresses,
            unusedAddresses: MnemonicUnusedAddresses,
            changeAddresses: MnemonicChangeAddresses,
            unusedChangeAddresses: MnemonicUnusedChangeAddresses,
            availableUtxos: MnemonicUTXOs
        },
        [MultisigAccount.config.id]: {
            ...MultisigAccount,
        }
    } as AccountMap
}

export const createConfig = (password) => {
    const configFile = {
        ...EMPTY_CONFIG,
        isEmpty: false,
        wallets: [
            MnemonicAccount.config,
            HWWAccount.config
        ],
        vaults: [
            MultisigAccount.config
        ]
    } as LilyConfig

    return AES.encrypt(
        JSON.stringify(configFile),
        password
      ).toString();
}