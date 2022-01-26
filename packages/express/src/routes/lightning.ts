import { Router } from 'express';
import {
  FundingPsbtVerify,
  FundingPsbtFinalize,
  CloseChannelRequest,
  QueryRoutesRequest
} from '@lily-technologies/lnrpc';

import { LND, LightningBaseProvider } from '@lily/shared-server';
import { LightningConfig, OpenChannelRequestArgs } from '@lily/types';

import { sendError } from '../utils';

const router = Router();

let LightningDataProvider: LightningBaseProvider;

router.post('/lightning-account-data', async (req, res) => {
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

router.post('/open-channel', async (req, res) => {
  const { lightningAddress, channelAmount }: OpenChannelRequestArgs = req.body;
  try {
    LightningDataProvider.openChannelInitialize(
      { lightningAddress, channelAmount },
      (err, data) => {
        if (err) {
          console.log('if err: ', err);
          sendError(res, err.message);
        }
        res.send(data);
      }
    );
  } catch (e) {
    console.log('error opening channel: ', e);
    sendError(res, e);
  }
});

router.post('/open-channel-verify', async (req, res) => {
  const { fundedPsbt, pendingChanId }: FundingPsbtVerify = req.body; // unsigned psbt

  try {
    await LightningDataProvider.openChannelVerify({
      fundedPsbt,
      pendingChanId,
      skipFinalize: false
    });
    res.send({ success: true });
  } catch (e) {
    console.log('/open-channel-verify error: ', e);
    sendError(res, e);
  }
});

router.post('/open-channel-finalize', async (req, res) => {
  const { signedPsbt, pendingChanId }: FundingPsbtFinalize = req.body; // signed psbt
  try {
    await LightningDataProvider.openChannelFinalize({
      signedPsbt,
      pendingChanId
    });
    res.send({ success: true });
  } catch (e) {
    console.log('/open-channel-finalize error: ', e);
    sendError(res, e);
  }
});

router.post('/close-channel', async (req, res) => {
  try {
    const args: CloseChannelRequest = req.body;
    LightningDataProvider.closeChannel(args, (data) => {
      res.send(data);
    });
  } catch (e) {
    console.log('/close-channel error: ', e);
    sendError(res, e);
  }
});

router.post('/lightning-send-payment', async (req, res) => {
  const { config, paymentRequest } = req.body;

  console.log(`(${config.id}): Sending payment...`);
  try {
    LightningDataProvider.sendPayment(paymentRequest, (data) => {
      if (data.status === 2 || data.status === 3) {
        res.send(data);
      }
    });
  } catch (e) {
    console.log('/lightning-send-payment e: ', e);
    sendError(res, e);
  }
});

router.post(`/lightning-connect`, async (req, res) => {
  const { lndConnectUri } = req.body;
  try {
    LightningDataProvider = new LND(lndConnectUri);
    const info = await LightningDataProvider.initialize();
    res.send(info);
  } catch (e) {
    console.log('/lightning-connect e: ', e);
    sendError(res, e);
  }
});

router.get('/invoice/:paymentHash', async (req, res) => {
  const { paymentHash } = req.params;
  try {
    const invoice = await LightningDataProvider.getInvoice({ paymentHash });
    res.send(invoice);
  } catch (e) {
    console.log('/get-invoice e: ', e);
    sendError(res, e);
  }
});

router.post('/generate-invoice', async (req, res) => {
  const { memo, value } = req.body;
  try {
    const invoice = await LightningDataProvider.generateInvoice({ memo, value });
    res.send(invoice);
  } catch (e) {
    console.log('/generate-invoice e: ', e);
    sendError(res, e);
  }
});

router.post('/get-routes', async (req, res) => {
  const { pubKey, amt }: QueryRoutesRequest = req.body;
  try {
    const routes = await LightningDataProvider.getRoutes({ pubKey, amt });
    res.send(routes);
  } catch (e) {
    console.log('/get-routes e: ', e);
    sendError(res, e);
  }
});

export default router;
