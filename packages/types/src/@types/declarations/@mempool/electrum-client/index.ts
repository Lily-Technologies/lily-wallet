declare module '@mempool/electrum-client' {
  export interface JSONRPCParamResponse<T> {
    jsonrpc: '2.0';
    result: T;
    id: number;
    param: string;
  }

  interface ElectrumVin {
    txid: string;
    vout: number;
    scriptSig: {
      asm: string;
      hex: string;
    };
    txinwitness: string[];
    sequence: number;
  }
  interface ElectrumVout {
    value: number;
    n: number;
    scriptPubKey: {
      asm: string;
      hex: string;
      reqSigs: number;
      type: string;
      addresses: string[];
    };
  }

  interface blockchainHeaders_subscribeResponse {
    height: number;
    hex: string;
  }

  export interface blockchainScripthash_getHistoryBatchResponse {
    tx_hash: string;
    blockheight: number;
  }

  export interface blockchainTransaction_getBatchResponse {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    locktime: number;
    vin: ElectrumVin[];
    vout: ElectrumVout[];
    hex: string;
    blockhash: string;
    confirmations: number;
    time: number;
    blocktime: number;
  }

  export interface blockchainScripthash_listunspentBatch {
    tx_hash: string;
    tx_pos: number;
    height: number;
    value: number; // in sats
  }

  interface InitElectrumRequest {
    client: string;
    version: string;
  }

  export default class ElectrumClient {
    constructor(port: number, host: string, protocol: string, options?: any, callbacks?: any);

    initElectrum({ client, version }: InitElectrumRequest): string; // TODO: does not return string

    blockchainHeaders_subscribe(): blockchainHeaders_subscribeResponse;

    blockchainScripthash_getHistoryBatch(
      txIds: string[]
    ): JSONRPCParamResponse<blockchainScripthash_getHistoryBatchResponse[]>[];

    blockchainTransaction_get(
      txId: string,
      verbose: boolean
    ): blockchainTransaction_getBatchResponse;

    blockchainTransaction_getBatch(
      txIds: string[],
      verbose: boolean
    ): JSONRPCParamResponse<blockchainTransaction_getBatchResponse>[];

    blockchainScripthash_listunspentBatch(
      scripthash: string[]
    ): JSONRPCParamResponse<blockchainScripthash_listunspentBatch[]>[];

    blockchainTransaction_broadcast(rawTx: string): string;

    blockchainEstimatefee(blockTarget: number): number;
  }
}
