declare module 'unchained-bitcoin' {
  import { Network, Payment } from 'bitcoinjs-lib';
  declare function satoshisToBitcoins(n: number | string | BigNumber): BigNumber
  declare function bitcoinsToSatoshis(n: number | string | BigNumber): BigNumber
  declare function multisigWitnessScript(multisig: Payment): WitnessScript
  declare function estimateMultisigTransactionFee(config: MultisigConfig): BigNumber
  declare function blockExplorerAPIURL(path: string, network: string): string
  declare function blockExplorerTransactionURL(txid: string, network: 'mainnet' | 'testnet'): string

  declare const MAINNET = "mainnet"
  declare const TESTNET = "testnet"

  interface MultisigConfig {
    addressType: any;
    numInputs: number;
    numOutputs: number;
    m: number;
    n: number;
    feesPerByteInSatoshis: string;
  }

  interface WitnessScript {
    input?: any;
    m: number;
    n: number;
    network: Network;
    output: Buffer;
    pubkeys: Buffer[];
    signatures?: any
    witness?: any
  }
}
