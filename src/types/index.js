// manually written because src/utils/transactions requires some enum types from Typescript

var TransactionType = {
  sent: 'sent',
  received: 'received',
  moved: 'moved'
}

var AddressType = {
  P2WSH: 'P2WSH',
  P2WPKH: 'P2WPKH',
  p2sh: 'p2sh',
  multisig: 'multisig'
}

module.exports = {
  TransactionType,
  AddressType
}