import { v4 as uuidv4 } from "uuid";
import { networks } from "bitcoinjs-lib";

import {
  getP2shDeriationPathForNetwork,
  getP2wpkhDeriationPathForNetwork,
  getMultisigDeriationPathForNetwork,
} from "./files";

import {
  LilyConfig,
  LilyZeroDotOneConfig,
  LilyConfigOneDotFiveConfig,
  LilyConfigOneDotZeroConfig,
  LilyConfigOneDotSevenConfig,
  AddressType,
} from "../types";

export const getBjsNetworkFromUnchained = (unchainedNetwork: string) => {
  if (unchainedNetwork === "testnet") {
    return networks.testnet;
  } else {
    return networks.bitcoin;
  }
};

export const updateConfigFileVersionBeta = (
  config:
    | LilyConfigOneDotSevenConfig
    | LilyConfigOneDotFiveConfig
    | LilyConfigOneDotZeroConfig
    | LilyConfig
    | LilyZeroDotOneConfig,
  currentBlockHeight: number
) => {
  if (config.version === "0.0.1" || config.version === "0.0.2") {
    const updatedConfig = {
      name: "",
      version: "1.0.0",
      isEmpty: false,
      license: {
        license: `trial:${currentBlockHeight + 4320}`, // one month free trial (6 * 24 * 30)
        signature: "",
      },
      wallets: config.wallets.map((item) => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        network: item.network,
        addressType: item.addressType,
        quorum: item.quorum,
        extendedPublicKeys: [
          {
            id: uuidv4(),
            created_at: item.created_at,
            parentFingerprint: item.parentFingerprint,
            xpub: item.xpub,
            network: item.network,
            bip32Path: "m/0",
            device: item.device || {
              type: "lily",
              model: "lily",
              fingerprint: item.parentFingerprint,
            },
          },
        ],
        mnemonic: item.mnemonic,
        parentFingerprint: item.parentFingerprint,
      })),
      vaults: config.vaults.map((item) => ({
        ...item,
      })),
    } as LilyConfigOneDotZeroConfig;
    return updatedConfig;
  }
  return config as unknown as
    | LilyConfigOneDotSevenConfig
    | LilyConfigOneDotFiveConfig
    | LilyConfigOneDotZeroConfig
    | LilyConfig;
};

export const updateConfigFileVersionOne = (
  config:
    | LilyConfigOneDotSevenConfig
    | LilyConfigOneDotFiveConfig
    | LilyConfigOneDotZeroConfig
    | LilyConfig
) => {
  if (config.version === "1.0.0") {
    const updatedConfig = {
      ...config,
      version: "1.0.5",
      wallets: config.wallets.map((item) => ({
        ...item,
        extendedPublicKeys: [
          {
            ...item.extendedPublicKeys[0],
            bip32Path:
              item.addressType === AddressType.p2sh
                ? getP2shDeriationPathForNetwork(
                    getBjsNetworkFromUnchained(item.network)
                  )
                : getP2wpkhDeriationPathForNetwork(
                    getBjsNetworkFromUnchained(item.network)
                  ),
          },
        ],
      })),
      vaults: config.vaults.map((item) => ({
        ...item,
        extendedPublicKeys: item.extendedPublicKeys.map(
          (extendedPublicKey) => ({
            ...extendedPublicKey,
            bip32Path: getMultisigDeriationPathForNetwork(
              getBjsNetworkFromUnchained(item.network)
            ),
          })
        ),
      })),
    } as LilyConfigOneDotFiveConfig;
    return updatedConfig;
  }
  return config as unknown as LilyConfigOneDotFiveConfig | LilyConfig;
};

export const updateConfigFileVersionOneDotFive = (
  config: LilyConfigOneDotFiveConfig | LilyConfig
) => {
  if (config.version === "1.0.5") {
    const updatedConfig = {
      ...config,
      version: "1.0.7",
      vaults: config.vaults.map((item) => ({
        ...item,
        license: config.license,
      })),
    } as LilyConfigOneDotSevenConfig;
    return updatedConfig;
  }
  return config as unknown as LilyConfig | LilyConfigOneDotSevenConfig;
};

export const updateConfigFileVersionOneDotSeven = (
  config: LilyConfigOneDotSevenConfig | LilyConfig
) => {
  if (config.version === "1.0.7") {
    const updatedConfig = {
      ...config,
      vaults: config.vaults.map((item) => ({ ...item, type: "onchain" })),
      wallets: config.wallets.map((item) => ({ ...item, type: "onchain" })),
      version: "1.0.8",
      lightning: [],
    } as LilyConfig;
    return updatedConfig;
  }
  return config as unknown as LilyConfig;
};
