import { updateConfigFileVersionBeta, updateConfigFileVersionOne } from "../../utils/migration";

import { AddressType, OldLilyConfig } from "../../types";

jest.mock("uuid", () => ({
  v4: () => "abc123",
}));

const BetaConfig = {
  name: "",
  version: "0.0.2",
  isEmpty: false,
  backup_options: { gDrive: false },
  wallets: [
    {
      id: "8e338244-49fb-4323-bec1-e04a65a28a52",
      created_at: 1608649358032,
      name: "xxxxx",
      network: "mainnet",
      addressType: "p2sh",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub:
        "xpub6C52rmVgf1wqZRfDbWWXgJv6HAAE7kcpoUCY6DLZP6bWCNHMnEv1gucmxmesWqWEfoCPTnB7ikpyiHqTrRtbZccqLHgq8J527HWqSp2kLRp",
      parentFingerprint: "b4f39681",
      device: { type: "trezor", model: "trezor_1", fingerprint: "b4f39681" },
    },
    {
      id: "fb276bb2-3203-4e71-b57d-7f43aafcdf95",
      created_at: 1608650766950,
      name: "mmmm",
      network: "mainnet",
      addressType: "P2WPKH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub:
        "xpub6CEnoHGBmicPtWFXWafrYYVVMpAm6FFYdNa4uSNPGgx5Goqf7suyYNAC9ojdXzHc5MBwHDn3N2jdeH4T1YMR3BphWammxPxUQh78RJr7KSm",
      xprv:
        "xprv9yFSPmjHwM46g2B4QZ8rBQYkonLGgnXhG9eU73xmiMR6Q1WWaLbizZqiJa1kY7cjg2CorHBL1fdYmNWQKJmikam7Zf3FWdbWic3TEnToYwa",
      mnemonic:
        "network turtle bike giant clever genre federal vault exclude dream icon chaos fold flame demand dream tube fluid real naive short struggle dawn enrich",
      parentFingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
    },
  ],
  vaults: [
    {
      id: "b9adf6d4-3096-41aa-a54d-328709968fca",
      created_at: 1608662081641,
      name: "CC Vault",
      network: "mainnet",
      addressType: "P2WSH",
      quorum: { requiredSigners: 2, totalSigners: 3 },
      extendedPublicKeys: [
        {
          id: "345bc94b-f60f-4d8a-a0d1-45b2d2036b30",
          created_at: 1608662081641,
          parentFingerprint: "4F60D1C9",
          network: "mainnet",
          bip32Path: "m/0",
          xpub:
            "xpub6F2wuvSo8gSRjE9JsMgSva9cDZGa2Hh9SEJ9yczCLd1q2SRFV6N4vRUKFoecbatfhgZcG5rNwTxygNLoPrKpjRt94czCzQQPnoVY1RauiL6",
          device: { type: "coldcard", fingerprint: "4F60D1C9" },
        },
        {
          id: "e1efeff0-e161-4d06-a336-2a9dc08cf964",
          created_at: 1608662081641,
          parentFingerprint: "34ECF56B",
          network: "mainnet",
          bip32Path: "m/0",
          xpub:
            "xpub6FCzsnvwxusaXu8rxxn1XVKXSKFKjYrynid9ntEJ1Qc18Vi6eqGSkP6MJdEtDXCGqNNCGdytUJdLSucPxnyHdJYJKK6YMcTgULAxvrQYm5J",
          device: { type: "coldcard", fingerprint: "34ECF56B" },
        },
        {
          id: "109a5194-e789-43a4-b577-976a1434494d",
          created_at: 1608662081641,
          parentFingerprint: "9130C3D6",
          network: "mainnet",
          bip32Path: "m/0",
          xpub:
            "xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE",
          device: { type: "coldcard", fingerprint: "9130C3D6" },
        },
      ],
    },
  ],
  keys: [
    {
      id: "8e338244-49fb-4323-bec1-e04a65a28a52",
      created_at: 1608649358032,
      name: "xxxxx",
      network: "mainnet",
      addressType: "p2sh",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub:
        "xpub6C52rmVgf1wqZRfDbWWXgJv6HAAE7kcpoUCY6DLZP6bWCNHMnEv1gucmxmesWqWEfoCPTnB7ikpyiHqTrRtbZccqLHgq8J527HWqSp2kLRp",
      parentFingerprint: "b4f39681",
      device: { type: "trezor", model: "trezor_1", fingerprint: "b4f39681" },
    },
    {
      id: "fb276bb2-3203-4e71-b57d-7f43aafcdf95",
      created_at: 1608650766950,
      name: "mmmm",
      network: "mainnet",
      addressType: "P2WPKH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub:
        "xpub6CEnoHGBmicPtWFXWafrYYVVMpAm6FFYdNa4uSNPGgx5Goqf7suyYNAC9ojdXzHc5MBwHDn3N2jdeH4T1YMR3BphWammxPxUQh78RJr7KSm",
      xprv:
        "xprv9yFSPmjHwM46g2B4QZ8rBQYkonLGgnXhG9eU73xmiMR6Q1WWaLbizZqiJa1kY7cjg2CorHBL1fdYmNWQKJmikam7Zf3FWdbWic3TEnToYwa",
      mnemonic:
        "network turtle bike giant clever genre federal vault exclude dream icon chaos fold flame demand dream tube fluid real naive short struggle dawn enrich",
      parentFingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
    },
    {
      id: "345bc94b-f60f-4d8a-a0d1-45b2d2036b30",
      created_at: 1608662081641,
      parentFingerprint: "4F60D1C9",
      network: "mainnet",
      bip32Path: "m/0",
      xpub:
        "xpub6F2wuvSo8gSRjE9JsMgSva9cDZGa2Hh9SEJ9yczCLd1q2SRFV6N4vRUKFoecbatfhgZcG5rNwTxygNLoPrKpjRt94czCzQQPnoVY1RauiL6",
      device: { type: "coldcard", fingerprint: "4F60D1C9" },
    },
    {
      id: "e1efeff0-e161-4d06-a336-2a9dc08cf964",
      created_at: 1608662081641,
      parentFingerprint: "34ECF56B",
      network: "mainnet",
      bip32Path: "m/0",
      xpub:
        "xpub6FCzsnvwxusaXu8rxxn1XVKXSKFKjYrynid9ntEJ1Qc18Vi6eqGSkP6MJdEtDXCGqNNCGdytUJdLSucPxnyHdJYJKK6YMcTgULAxvrQYm5J",
      device: { type: "coldcard", fingerprint: "34ECF56B" },
    },
    {
      id: "109a5194-e789-43a4-b577-976a1434494d",
      created_at: 1608662081641,
      parentFingerprint: "9130C3D6",
      network: "mainnet",
      bip32Path: "m/0",
      xpub:
        "xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE",
      device: { type: "coldcard", fingerprint: "9130C3D6" },
    },
  ],
  exchanges: [],
} as OldLilyConfig;

const V1Config = {
  name: "",
  version: "1.0.0",
  isEmpty: false,
  license: { license: "trial:4420", signature: "" },
  wallets: [
    {
      id: "8e338244-49fb-4323-bec1-e04a65a28a52",
      created_at: 1608649358032,
      name: "xxxxx",
      network: "mainnet" as "mainnet",
      addressType: AddressType.p2sh,
      quorum: { requiredSigners: 1, totalSigners: 1 },
      extendedPublicKeys: [
        {
          id: "abc123",
          created_at: 1608649358032,
          parentFingerprint: "b4f39681",
          xpub:
            "xpub6C52rmVgf1wqZRfDbWWXgJv6HAAE7kcpoUCY6DLZP6bWCNHMnEv1gucmxmesWqWEfoCPTnB7ikpyiHqTrRtbZccqLHgq8J527HWqSp2kLRp",
          network: "mainnet" as "mainnet",
          bip32Path: "m/0",
          device: {
            type: "trezor",
            model: "trezor_1",
            fingerprint: "b4f39681",
          },
        },
      ],
      mnemonic: undefined,
      parentFingerprint: "b4f39681",
    },
    {
      id: "fb276bb2-3203-4e71-b57d-7f43aafcdf95",
      created_at: 1608650766950,
      name: "mmmm",
      network: "mainnet" as "mainnet",
      addressType: "P2WPKH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      extendedPublicKeys: [
        {
          id: "abc123",
          created_at: 1608650766950,
          parentFingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
          xpub:
            "xpub6CEnoHGBmicPtWFXWafrYYVVMpAm6FFYdNa4uSNPGgx5Goqf7suyYNAC9ojdXzHc5MBwHDn3N2jdeH4T1YMR3BphWammxPxUQh78RJr7KSm",
            network: "mainnet" as "mainnet",
          bip32Path: "m/0",
          device: {
            model: "lily",
            type: "lily",
            fingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
          },
        },
      ],
      mnemonic:
        "network turtle bike giant clever genre federal vault exclude dream icon chaos fold flame demand dream tube fluid real naive short struggle dawn enrich",
      parentFingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
    },
  ],
  vaults: [
    {
      id: "b9adf6d4-3096-41aa-a54d-328709968fca",
      created_at: 1608662081641,
      name: "CC Vault",
      network: "mainnet" as "mainnet",
      addressType: "P2WSH",
      quorum: { requiredSigners: 2, totalSigners: 3 },
      extendedPublicKeys: [
        {
          id: "345bc94b-f60f-4d8a-a0d1-45b2d2036b30",
          created_at: 1608662081641,
          parentFingerprint: "4F60D1C9",
          network: "mainnet" as "mainnet",
          bip32Path: "m/0",
          xpub:
            "xpub6F2wuvSo8gSRjE9JsMgSva9cDZGa2Hh9SEJ9yczCLd1q2SRFV6N4vRUKFoecbatfhgZcG5rNwTxygNLoPrKpjRt94czCzQQPnoVY1RauiL6",
          device: { type: "coldcard", fingerprint: "4F60D1C9" },
        },
        {
          id: "e1efeff0-e161-4d06-a336-2a9dc08cf964",
          created_at: 1608662081641,
          parentFingerprint: "34ECF56B",
          network: "mainnet" as "mainnet",
          bip32Path: "m/0",
          xpub:
            "xpub6FCzsnvwxusaXu8rxxn1XVKXSKFKjYrynid9ntEJ1Qc18Vi6eqGSkP6MJdEtDXCGqNNCGdytUJdLSucPxnyHdJYJKK6YMcTgULAxvrQYm5J",
          device: { type: "coldcard", fingerprint: "34ECF56B" },
        },
        {
          id: "109a5194-e789-43a4-b577-976a1434494d",
          created_at: 1608662081641,
          parentFingerprint: "9130C3D6",
          network: "mainnet" as "mainnet",
          bip32Path: "m/0",
          xpub:
            "xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE",
          device: { type: "coldcard", fingerprint: "9130C3D6" },
        },
      ],
    },
  ],
}

const V2Config = {
  name: "",
  version: "1.0.5",
  isEmpty: false,
  license: { license: "trial:4420", signature: "" },
  wallets: [
    {
      id: "8e338244-49fb-4323-bec1-e04a65a28a52",
      created_at: 1608649358032,
      name: "xxxxx",
      network: "mainnet",
      addressType: "p2sh",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      extendedPublicKeys: [
        {
          id: "abc123",
          created_at: 1608649358032,
          parentFingerprint: "b4f39681",
          xpub:
            "xpub6C52rmVgf1wqZRfDbWWXgJv6HAAE7kcpoUCY6DLZP6bWCNHMnEv1gucmxmesWqWEfoCPTnB7ikpyiHqTrRtbZccqLHgq8J527HWqSp2kLRp",
          network: "mainnet",
          bip32Path: "m/49'/0'/0'",
          device: {
            type: "trezor",
            model: "trezor_1",
            fingerprint: "b4f39681",
          },
        },
      ],
      mnemonic: undefined,
      parentFingerprint: "b4f39681",
    },
    {
      id: "fb276bb2-3203-4e71-b57d-7f43aafcdf95",
      created_at: 1608650766950,
      name: "mmmm",
      network: "mainnet",
      addressType: "P2WPKH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      extendedPublicKeys: [
        {
          id: "abc123",
          created_at: 1608650766950,
          parentFingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
          xpub:
            "xpub6CEnoHGBmicPtWFXWafrYYVVMpAm6FFYdNa4uSNPGgx5Goqf7suyYNAC9ojdXzHc5MBwHDn3N2jdeH4T1YMR3BphWammxPxUQh78RJr7KSm",
          network: "mainnet",
          bip32Path: "m/84'/0'/0'",
          device: {
            model: "lily",
            type: "lily",
            fingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
          },
        },
      ],
      mnemonic:
        "network turtle bike giant clever genre federal vault exclude dream icon chaos fold flame demand dream tube fluid real naive short struggle dawn enrich",
      parentFingerprint: { type: "Buffer", data: [190, 189, 114, 17] },
    },
  ],
  vaults: [
    {
      id: "b9adf6d4-3096-41aa-a54d-328709968fca",
      created_at: 1608662081641,
      name: "CC Vault",
      network: "mainnet",
      addressType: "P2WSH",
      quorum: { requiredSigners: 2, totalSigners: 3 },
      extendedPublicKeys: [
        {
          id: "345bc94b-f60f-4d8a-a0d1-45b2d2036b30",
          created_at: 1608662081641,
          parentFingerprint: "4F60D1C9",
          network: "mainnet",
          bip32Path: "m/48'/0'/0'/2'",
          xpub:
            "xpub6F2wuvSo8gSRjE9JsMgSva9cDZGa2Hh9SEJ9yczCLd1q2SRFV6N4vRUKFoecbatfhgZcG5rNwTxygNLoPrKpjRt94czCzQQPnoVY1RauiL6",
          device: { type: "coldcard", fingerprint: "4F60D1C9" },
        },
        {
          id: "e1efeff0-e161-4d06-a336-2a9dc08cf964",
          created_at: 1608662081641,
          parentFingerprint: "34ECF56B",
          network: "mainnet",
          bip32Path: "m/48'/0'/0'/2'",
          xpub:
            "xpub6FCzsnvwxusaXu8rxxn1XVKXSKFKjYrynid9ntEJ1Qc18Vi6eqGSkP6MJdEtDXCGqNNCGdytUJdLSucPxnyHdJYJKK6YMcTgULAxvrQYm5J",
          device: { type: "coldcard", fingerprint: "34ECF56B" },
        },
        {
          id: "109a5194-e789-43a4-b577-976a1434494d",
          created_at: 1608662081641,
          parentFingerprint: "9130C3D6",
          network: "mainnet",
          bip32Path: "m/48'/0'/0'/2'",
          xpub:
            "xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE",
          device: { type: "coldcard", fingerprint: "9130C3D6" },
        },
      ],
    },
  ],
}

describe('Migration', () => {
  test("updateConfigFileVersion", () => {
    expect(updateConfigFileVersionBeta(BetaConfig, 100)).toEqual(V1Config);
  });
  
  test('updateV1ToBeta' , () => {
      expect(updateConfigFileVersionOne(V1Config)).toEqual(V2Config);
  })
})
