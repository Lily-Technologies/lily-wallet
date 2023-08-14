# Changelog

## [1.5.0](https://github.com/Lily-Technologies/lily-wallet/compare/electron-v1.4.0...electron-v1.5.0) (2023-08-14)


### Features

* **Bitgo:** support bitgo vaults ([baece25](https://github.com/Lily-Technologies/lily-wallet/commit/baece25843eb7a294ea3405c517b667121459248))
* **DeepLink:** add protocol to package.json ([55e966d](https://github.com/Lily-Technologies/lily-wallet/commit/55e966da731e9f36abfc9654ae5a385851054475))
* **DeepLink:** setup via deep link ([3071042](https://github.com/Lily-Technologies/lily-wallet/commit/3071042f1314e019862a168d7f188901a3e0df67))
* **Labels:** add/delete labels from addresses ([64ca20e](https://github.com/Lily-Technologies/lily-wallet/commit/64ca20e6b5f030745bd0e8b087edd16036905f4c))
* **Lightning:** specify outgoing channel id ([#111](https://github.com/Lily-Technologies/lily-wallet/issues/111)) ([30a9d7c](https://github.com/Lily-Technologies/lily-wallet/commit/30a9d7c05ea01fb238329528a29c9cc755ef4a1b))
* **OnchainProviders:** save config on change, add ssl ([6c4b226](https://github.com/Lily-Technologies/lily-wallet/commit/6c4b22607090a4b004270f8e29bcd4ba4b6949ae))
* **OnchainProviders:** store connection details ([1db5a2b](https://github.com/Lily-Technologies/lily-wallet/commit/1db5a2ba908abea68aabfeb7172aef493c220fb8))
* reference address/change address context in utxo, allow TagsSection to add/delete multiple correctly ([#105](https://github.com/Lily-Technologies/lily-wallet/issues/105)) ([480b66c](https://github.com/Lily-Technologies/lily-wallet/commit/480b66c8c8e1c4a1a9f07bbcd49aa3dcdd0091df))
* Transaction Descriptions ([#99](https://github.com/Lily-Technologies/lily-wallet/issues/99)) ([cae4690](https://github.com/Lily-Technologies/lily-wallet/commit/cae46902d1bcb8179fc3bdc89a94a059d3d7dbfd))


### Bug Fixes

* **Bitgo:** allow Ledger signing on Bitgo vaults ([5fa6818](https://github.com/Lily-Technologies/lily-wallet/commit/5fa681815478e05f5226298d5e695315e1d6f6fe))
* **BlockstreamProvider:** rename Esplora ([ef6b70f](https://github.com/Lily-Technologies/lily-wallet/commit/ef6b70f00efb7dc7e27b4ea4f8929df17f67ec46))
* **Electron/Express builds:** make sure HWI properly imported ([8f258aa](https://github.com/Lily-Technologies/lily-wallet/commit/8f258aa49579a8159a2169e6f3626d11e45dc55e))
* **Electron:** default electrum endpoint ([45a059b](https://github.com/Lily-Technologies/lily-wallet/commit/45a059b9e794aec4bb9fdaf13c5ac945a645fe64))
* **Electron:** initial window size ([547f7ea](https://github.com/Lily-Technologies/lily-wallet/commit/547f7ead65a25615ebe7febc016b5663181c0423))
* **main:** remove console.log ([c25fa90](https://github.com/Lily-Technologies/lily-wallet/commit/c25fa90ecf88faad7d2c00fb31b6b017ace24cf5))
* **main:** remove unnecessary output ([33140f0](https://github.com/Lily-Technologies/lily-wallet/commit/33140f0fe19a98a8525577ddb316fa156660770e))
* only use ReactDevTools in dev ([ad86c70](https://github.com/Lily-Technologies/lily-wallet/commit/ad86c701f18728bf3e01c134d9a2d36a42558d20))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @lily/shared-server bumped from 1.4.0 to 1.5.0

## [1.4.0](https://github.com/Lily-Technologies/lily-wallet/compare/electron-v1.3.0...electron-v1.4.0) (2023-07-19)


### Features

* **Bitgo:** support bitgo vaults ([baece25](https://github.com/Lily-Technologies/lily-wallet/commit/baece25843eb7a294ea3405c517b667121459248))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @lily/shared-server bumped from 1.3.0 to 1.4.0
    * @lily/types bumped from 1.3.0 to 1.4.0

## 1.3.0 (2022-12-07)


### Features

* **Lightning:** specify outgoing channel id ([#111](https://github.com/Lily-Technologies/lily-wallet/issues/111)) ([30a9d7c](https://github.com/Lily-Technologies/lily-wallet/commit/30a9d7c05ea01fb238329528a29c9cc755ef4a1b))


### Bug Fixes

* **Electron:** default electrum endpoint ([45a059b](https://github.com/Lily-Technologies/lily-wallet/commit/45a059b9e794aec4bb9fdaf13c5ac945a645fe64))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @lily/shared-server bumped from * to 1.3.0
    * @lily/types bumped from * to 1.3.0
