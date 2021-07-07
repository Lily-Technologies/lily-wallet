import { EMPTY_CONFIG } from "../../src/ConfigContext";
import { AES } from "crypto-js";

import { Multisig, Mnemonic, HWW } from "../../src/__tests__/fixtures";

export const createLilyAccount = (Account) => {
  return {
    id: Account.config.id,
    name: Account.config.name,
    config: Account.config,
    transactions: Account.transactions,
    addresses: Account.addresses,
    unusedAddresses: Account.unusedAddresses,
    changeAddresses: Account.changeAddresses,
    unusedChangeAddresses: Account.unusedChangeAddresses,
    availableUtxos: Account.availableUtxos,
  };
};

export const createConfig = (password) => {
  const configFile = {
    ...EMPTY_CONFIG,
    isEmpty: false,
    wallets: [Mnemonic.config, HWW.account.config],
    vaults: [Multisig.config],
  };

  return AES.encrypt(JSON.stringify(configFile), password).toString();
};
