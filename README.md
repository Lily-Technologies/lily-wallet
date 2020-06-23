# Lily Wallet

![Screenshot of creating import files](https://github.com/KayBeSee/cc-kitchen-frontend/blob/master/public/screenshot.png "Screenshot of Lily Wallet")

### Features
- Multisignature Vaults: Easily setup 2-of-3 multisig vaults using Coldcard hardware wallets
- Segwit: All transactions use bech32 segwit addresses
- Multiple Accounts: Easily create new HD wallets on the fly with a few clicks
- Stateless: There is no database. The app is populated from a password encrypted configuration file
- Interoperable: Export your vault to use in other software like Unchained Capital's Caravan or BlueWallet

### Contributions
This project relies on a number of awesome open source libraries including:
- [HWI](https://github.com/bitcoin-core/HWI)
- [bitcoinjs-lib](https://github.com/junderw/bitcoinjs-lib)
- [unchained-bitcoin](https://github.com/unchained-capital/unchained-bitcoin)
- [Coldcard](https://github.com/Coldcard/firmware)
- [Bitcoin Quotes API](https://www.bitcoin-quotes.com/)