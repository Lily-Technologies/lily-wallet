import axios from 'axios';
import moment from 'moment';
import {
  ElectrumProvider,
  LND,
  getFile,
  saveFile,
  LightningBaseProvider
} from '@lily/shared-server';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import {
  OnChainConfig,
  LightningConfig,
  CoindeskCurrentPriceResponse,
  CoindeskHistoricPriceResponse,
  OpenChannelRequestArgs
} from '@lily/types';
import { FundingPsbtVerify, FundingPsbtFinalize, CloseChannelRequest } from '@radar/lnrpc';

const app = express();
const port = process.env.EXPRESS_PORT; // default port to listen

const isTestnet = !!('TESTNET' in process.env);
const OnchainDataProvider = new ElectrumProvider(isTestnet);
let LightningDataProvider: LightningBaseProvider;
OnchainDataProvider.initialize();
const USER_DATA_DIRECTORY = process.env.USER_DATA_DIRECTORY;

app.use(cors());
app.use(bodyParser.json());

// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/bitcoin-network', async (req, res) => {
  res.send(isTestnet);
});

app.get('/get-config', async (req, res) => {
  try {
    const file = await getFile('lily-config-encrypted.txt', USER_DATA_DIRECTORY);
    res.send(JSON.stringify(file));
  } catch (e) {
    console.log('Failed to get Lily config');
  }
});

app.post('/save-config', async (req, res) => {
  const { encryptedConfigFile } = req.body;
  return saveFile(encryptedConfigFile, 'lily-config-encrypted.txt', USER_DATA_DIRECTORY);
});

app.post('/account-data', async (req, res) => {
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

app.post('/lightning-account-data', async (req, res) => {
  const config: LightningConfig = req.body;
  console.log(`Connecting to ${config.name}...`);
  try {
    LightningDataProvider = new LND(config.connectionDetails.lndConnectUri);
    LightningDataProvider.getAccountData(config, (accountData) => {
      res.send(accountData);
    });
  } catch (e) {
    console.log(`(${config.id}) /lightning-account-data: `, e);
  }
});

app.post('/open-channel', async (req, res) => {
  const { lightningAddress, channelAmount }: OpenChannelRequestArgs = req.body;
  try {
    LightningDataProvider.openChannelInitialize({ lightningAddress, channelAmount }, (data) => {
      res.send(data);
    });
  } catch (e) {
    console.log('error opening channel: ', e);
    res.send({
      error: {
        message: e
      }
    });
  }
});

app.post('/open-channel-verify', async (req, res) => {
  const { fundedPsbt, pendingChanId }: FundingPsbtVerify = req.body; // unsigned psbt

  try {
    await LightningDataProvider.openChannelVerify({ fundedPsbt, pendingChanId });
  } catch (e) {
    console.log('/open-channel-verify error: ', e);
  }
});

app.post('/open-channel-finalize', async (req, res) => {
  const { signedPsbt, pendingChanId }: FundingPsbtFinalize = req.body; // signed psbt
  try {
    await LightningDataProvider.openChannelFinalize({
      signedPsbt,
      pendingChanId
    });
  } catch (e) {
    console.log('/open-channel-finalize error: ', e);
  }
});

app.post('/close-channel', async (req, res) => {
  try {
    const args: CloseChannelRequest = req.body;
    LightningDataProvider.closeChannel(args, (data) => {
      res.send(data);
    });
  } catch (e) {
    console.log('/close-channel error: ', e);
    res.send({
      error: {
        message: e
      }
    });
  }
});

app.post('/lightning-send-payment', async (req, res) => {
  const { config, paymentRequest } = req.body;

  console.log(`(${config.id}): Sending payment...`);
  try {
    LightningDataProvider.sendPayment(paymentRequest, (data) => {
      console.log('data: ', data);
      if (data.status === 2 || data.status === 3) {
        res.send(data);
      }
    });
  } catch (e) {
    console.log('/lightning-send-payment e: ', e);
    throw new Error(e);
  }
});

app.post(`/lightning-connect`, async (req, res) => {
  const { lndConnectUri } = req.body;
  try {
    const LightningDataProvider = new LND(lndConnectUri);
    const info = await LightningDataProvider.initialize();
    res.send(info);
  } catch (e) {
    console.log('/lightning-connect e: ', e);
    throw new Error(e);
  }
});

app.post('/lightning-invoice', async (req, res) => {
  const { memo, value } = req.body;
  try {
    const invoice = await LightningDataProvider.getInvoice({ memo, value });
    res.send(invoice);
  } catch (e) {
    console.log('/lightning-invoice e: ', e);
    throw new Error(e);
  }
});

// ipcMain.handle('/download-item', async (event, { data, filename }) => {
//   try {
//     const win = BrowserWindow.getFocusedWindow();

//     const { canceled, filePath } = await dialog.showSaveDialog(win!, {
//       defaultPath: filename
//     });

//     if (filePath) {
//       fs.writeFile(filePath, data, (err) => {
//         if (err) {
//           return Promise.reject(false);
//         } else {
//           return Promise.resolve(true);
//         }
//       });
//     }
//   } catch (e) {
//     return Promise.reject(false);
//   }
// });

app.get('/current-btc-price', async (req, res) => {
  const { data }: { data: CoindeskCurrentPriceResponse } = await axios.get(
    'https://api.coindesk.com/v1/bpi/currentprice.json'
  );
  const currentPriceWithCommasStrippedOut = data.bpi.USD.rate.replace(',', '');
  res.send(currentPriceWithCommasStrippedOut);
});

app.get('/historical-btc-price', async (req, res) => {
  const { data }: { data: CoindeskHistoricPriceResponse } = await axios.get(
    `https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-01-01&end=${moment().format(
      'YYYY-MM-DD'
    )}`
  );
  const historicalBitcoinPrice = data.bpi;
  let priceForChart: { price: number; date: string }[] = [];
  for (let i = 0; i < Object.keys(historicalBitcoinPrice).length; i++) {
    priceForChart.push({
      price: Object.values(historicalBitcoinPrice)[i],
      date: Object.keys(historicalBitcoinPrice)[i]
    });
  }
  res.send(priceForChart);
});

app.get('/enumerate', async (req, res) => {
  throw new Error('Function not implemented');
});

app.post('/xpub', async (req, res) => {
  throw new Error('Function not implemented');
});

app.post('/sign', async (req, res) => {
  throw new Error('Function not implemented');
});

app.post('/promptpin', async (req, res) => {
  throw new Error('Function not implemented');
});

app.post('/sendpin', async (req, res) => {
  throw new Error('Function not implemented');
});

app.get('/estimate-fee', async (req, res) => {
  try {
    const feeRates = await OnchainDataProvider.estimateFee();
    res.send(feeRates);
  } catch (e) {
    console.log(`error /estimate-fee ${e}`);
    new Error('Error retrieving fee');
  }
});

app.post('/broadcastTx', async (req, res) => {
  const { txHex } = req.body;
  try {
    const txId = await OnchainDataProvider.broadcastTransaction(txHex);
    res.send(txId);
  } catch (e) {
    console.log(`error /broadcastTx ${e}`);
    new Error('Error broadcasting transaction');
  }
});

app.get('/get-node-config', async (req, res) => {
  const nodeConfig = await OnchainDataProvider.getConfig();
  res.send(nodeConfig);
});

app.post('/isConfirmedTransaction', async (req, res) => {
  const { txId } = req.body;
  if (txId.length === 64) {
    try {
      const isConfirmed = await OnchainDataProvider.isConfirmedTransaction(txId);
      return res.send(isConfirmed);
    } catch (e) {
      console.log(`error /isConfirmedTransaction ${e}`);
      throw new Error(e);
    }
  }
  console.log(`error /isConfirmedTransaction: Invalid txIdxx: `, txId);
  return Promise.reject({ success: false });
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
