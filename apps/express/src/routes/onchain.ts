import { Router } from 'express';

import { OnChainConfig } from '@lily/types';

import { ElectrumProvider, createAddressTable, dbConnect } from '@lily/shared-server';

import { sendError } from '../utils';

const APP_DATA_DIRECTORY = process.env.APP_DATA_DIR;

const router = Router();
const isTestnet = !!('TESTNET' in process.env);
const OnchainDataProvider = new ElectrumProvider(
  process.env.ELECTRUM_IP,
  Number(process.env.ELECTRUM_PORT),
  'tcp',
  isTestnet
);

OnchainDataProvider.initialize();

router.post('/account-data', async (req, res) => {
  // load data from cache
  // event.reply("/account-data", accountData);
  const config: OnChainConfig = req.body;

  try {
    const db = await dbConnect(APP_DATA_DIRECTORY);
    createAddressTable(db);
    const accountData = await OnchainDataProvider.getAccountData(config, db);
    res.send(accountData);
  } catch (e) {
    console.log(`(${config.id}) /account-data error: `, e);
  }
});

router.post('/does-address-have-transaction', async (req, res) => {
  const { address } = req.body;
  try {
    const accountData = await OnchainDataProvider.getTransactionsFromAddress(address);
    res.send(accountData.length > 0);
  } catch (e) {
    console.log(`/does-address-have-transaction error: `, e);
    sendError(res, 'Error getting address transactions');
  }
});

router.get('/estimate-fee', async (req, res) => {
  try {
    const feeRates = await OnchainDataProvider.estimateFee();
    res.send(feeRates);
  } catch (e) {
    console.log(`error /estimate-fee ${e}`);
    sendError(res, 'Error estimating fee');
  }
});

router.post('/broadcastTx', async (req, res) => {
  const { txHex } = req.body;
  try {
    const txId = await OnchainDataProvider.broadcastTransaction(txHex);
    res.send(txId);
  } catch (e) {
    console.log(`error /broadcastTx ${e}`);
    sendError(res, 'Error broadcasting transaction');
  }
});

router.post('/isConfirmedTransaction', async (req, res) => {
  const { txId } = req.body;
  if (txId.length === 64) {
    try {
      const isConfirmed = await OnchainDataProvider.isConfirmedTransaction(txId);
      return res.send(isConfirmed);
    } catch (e) {
      console.log(`error /isConfirmedTransaction ${e}`);
      sendError(res, 'Error confirming transaction');
    }
  }
  console.log(`error /isConfirmedTransaction: Invalid txIdxx: `, txId);
  return Promise.reject({ success: false });
});

router.get('/get-node-config', async (req, res) => {
  try {
    const nodeConfig = await OnchainDataProvider.getConfig();
    res.send(nodeConfig);
  } catch (e) {
    sendError(res, 'Error getting node config');
  }
});

export default router;
