# Changelog

## [1.5.0](https://github.com/Lily-Technologies/lily-wallet/compare/shared-server-v1.4.0...shared-server-v1.5.0) (2023-08-14)


### Features

* **Bitgo:** support bitgo vaults ([baece25](https://github.com/Lily-Technologies/lily-wallet/commit/baece25843eb7a294ea3405c517b667121459248))
* **Electrum:** allow custom connection from frontend ([82b9bba](https://github.com/Lily-Technologies/lily-wallet/commit/82b9bba99b290e17ac3a717602ed220d9032d883))
* **HWI:** add express support ([b7d30ce](https://github.com/Lily-Technologies/lily-wallet/commit/b7d30cedcbc395a0af18f3a39d9e6c4d0b5a9f8e))
* **Lightning:** specify outgoing channel id ([#111](https://github.com/Lily-Technologies/lily-wallet/issues/111)) ([30a9d7c](https://github.com/Lily-Technologies/lily-wallet/commit/30a9d7c05ea01fb238329528a29c9cc755ef4a1b))
* **OnchainProviders:** store connection details ([1db5a2b](https://github.com/Lily-Technologies/lily-wallet/commit/1db5a2ba908abea68aabfeb7172aef493c220fb8))
* reference address/change address context in utxo, allow TagsSection to add/delete multiple correctly ([#105](https://github.com/Lily-Technologies/lily-wallet/issues/105)) ([480b66c](https://github.com/Lily-Technologies/lily-wallet/commit/480b66c8c8e1c4a1a9f07bbcd49aa3dcdd0091df))
* **Setup, Lightning:** add review screen with data ([d054d31](https://github.com/Lily-Technologies/lily-wallet/commit/d054d31f9516b5203e8e35b86c370cb6b41366e9))
* **sqlite:** add to shared-server ([f4a05db](https://github.com/Lily-Technologies/lily-wallet/commit/f4a05db251850548d470e4aa96f1de323483b032))
* Transaction Descriptions ([#99](https://github.com/Lily-Technologies/lily-wallet/issues/99)) ([cae4690](https://github.com/Lily-Technologies/lily-wallet/commit/cae46902d1bcb8179fc3bdc89a94a059d3d7dbfd))
* **Umbrel:** integration ([a5c127d](https://github.com/Lily-Technologies/lily-wallet/commit/a5c127d4f9312fcba14448b41b875c448cc6006c))
* **Web:** add interface ([#78](https://github.com/Lily-Technologies/lily-wallet/issues/78)) ([0e6add8](https://github.com/Lily-Technologies/lily-wallet/commit/0e6add820aac0ef01c6bfb51dd9eec05d91dfcdf))


### Bug Fixes

* add sqlite3 to package.json ([dc942ba](https://github.com/Lily-Technologies/lily-wallet/commit/dc942bad95d45e65d32e56353e242f057a5bd231))
* **Bitgo:** allow Ledger signing on Bitgo vaults ([5fa6818](https://github.com/Lily-Technologies/lily-wallet/commit/5fa681815478e05f5226298d5e695315e1d6f6fe))
* **BlockstreamProvider:** rename Esplora ([ef6b70f](https://github.com/Lily-Technologies/lily-wallet/commit/ef6b70f00efb7dc7e27b4ea4f8929df17f67ec46))
* **Electron/Express builds:** make sure HWI properly imported ([8f258aa](https://github.com/Lily-Technologies/lily-wallet/commit/8f258aa49579a8159a2169e6f3626d11e45dc55e))
* isMine/isChange labeling ([33f0a3c](https://github.com/Lily-Technologies/lily-wallet/commit/33f0a3cd0cd879afbc67f9dc3cdd610ce6d05e43))
* **LND:** event sorting w/o creationDate ([d74e0f6](https://github.com/Lily-Technologies/lily-wallet/commit/d74e0f625aef0d53199828ea1a77f584f460ac21))
* **monorepo:** docker setup ([1bfe65f](https://github.com/Lily-Technologies/lily-wallet/commit/1bfe65f33e5a9687723bb679823dde5b6866883d))
* **OnchainProviders, Custom Node:** remove ([a527b15](https://github.com/Lily-Technologies/lily-wallet/commit/a527b15076d9c18d2def3196cda71d0ece60e999))
* **OnchainProviders, Electrum:** output object fallback ([876dc72](https://github.com/Lily-Technologies/lily-wallet/commit/876dc720bd07aed55511ed38cbbb30e4e1c813a8))

## [1.4.0](https://github.com/Lily-Technologies/lily-wallet/compare/shared-server-v1.3.0...shared-server-v1.4.0) (2023-07-19)


### Features

* **Bitgo:** support bitgo vaults ([baece25](https://github.com/Lily-Technologies/lily-wallet/commit/baece25843eb7a294ea3405c517b667121459248))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @lily/types bumped from 1.3.0 to 1.4.0

## 1.3.0 (2022-12-07)


### Features

* **Lightning:** specify outgoing channel id ([#111](https://github.com/Lily-Technologies/lily-wallet/issues/111)) ([30a9d7c](https://github.com/Lily-Technologies/lily-wallet/commit/30a9d7c05ea01fb238329528a29c9cc755ef4a1b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @lily/types bumped from * to 1.3.0
