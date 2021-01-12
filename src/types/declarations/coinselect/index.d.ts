declare module 'coinselect' {
  import { UTXO } from '../../index';
  function coinSelect(utxos: UTXO[], outputs: any[], feeRate: number): CoinSelectResposne

  interface CoinSelectResposne {
    inputs: any[]
    outputs: any[]
    fee: number
  }

  export = coinSelect
}
