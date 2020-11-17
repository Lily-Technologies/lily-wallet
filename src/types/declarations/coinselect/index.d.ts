declare module 'coinselect' {
  import { UTXO } from '../../index';
  declare function coinSelect(utxos: UTXO[], outputs: any[], feeRate: number)
  export = coinSelect
}
