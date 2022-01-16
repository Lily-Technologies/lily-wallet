import { Router } from 'express';

import { sendError } from 'src/utils';

import { OnChainConfig } from '@lily/types';

import { ElectrumProvider } from '@lily/shared-server';

const router = Router();
const isTestnet = !!('TESTNET' in process.env);
const OnchainDataProvider = new ElectrumProvider(
  process.env.ELECTRUM_IP,
  Number(process.env.ELECTRUM_PORT),
  isTestnet
);

OnchainDataProvider.initialize();

router.post('/account-data', async (req, res) => {
  // load data from cache
  // event.reply("/account-data", accountData);
  const config: OnChainConfig = req.body;

  try {
    const accountData = await OnchainDataProvider.getAccountData(config);
    res.send(accountData);
  } catch (e) {
    console.log(`(${config.id}) /account-data error: `, e);
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
