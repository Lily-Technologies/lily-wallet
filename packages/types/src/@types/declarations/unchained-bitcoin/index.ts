declare module 'unchained-bitcoin' {
  import { Network, Payment } from 'bitcoinjs-lib';
  import BigNumber from 'bignumber.js';

  function satoshisToBitcoins(n: number | string | BigNumber): BigNumber;
  function bitcoinsToSatoshis(n: number | string | BigNumber): BigNumber;
  function multisigWitnessScript(multisig: Payment): WitnessScript;
  function blockExplorerAPIURL(path: string, network: string): string;
  function blockExplorerTransactionURL(txid: string, network: 'mainnet' | 'testnet'): string;
  function deriveChildPublicKey(xpub: string, path: string, network: 'mainnet' | 'testnet'): string;
  function generateMultisigFromPublicKeys(
    network: 'mainnet' | 'testnet',
    addressType: string,
    requiredSigners: number,
    ...publicKeys: string[]
  ): Payment;

  const MAINNET = 'mainnet';
  const TESTNET = 'testnet';

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
    signatures?: any;
    witness?: any;
  }
}
