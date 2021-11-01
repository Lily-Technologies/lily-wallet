declare module 'coinselect' {
  import { UTXO } from 'src/types';

  function coinSelect(utxos: UTXO[], outputs: Output[], feeRate: number): CoinSelectResponse;

  interface Output {
    address?: string;
    value: number;
  }

  interface CoinSelectResponse {
    inputs: UTXO[];
    outputs: Output[];
    fee: number;
  }

  export = coinSelect;
}
