import { Router } from 'express';

import { enumerate, getXPub, sendpin, promptpin, signtx } from '@lily/shared-server';
import { HwiResponseEnumerate } from '@lily/types';

import { sendError } from 'src/utils';

const router = Router();

const isTestnet = !!('TESTNET' in process.env);

router.get('/enumerate', async (req, res) => {
  try {
    const resp = JSON.parse(await enumerate());
    if (resp.error) {
      sendError(res, 'Error finding devices');
    }
    const filteredDevices = (resp as HwiResponseEnumerate[]).filter((device) => {
      return (
        device.type === 'coldcard' ||
        device.type === 'ledger' ||
        device.type === 'trezor' ||
        device.type === 'bitbox02'
      );
    });
    res.send(filteredDevices);
  } catch (e) {
    console.log('/enumerate error: ', e);
    sendError(res, e);
  }
});

router.post('/xpub', async (req, res) => {
  const { deviceType, devicePath, path } = req.body;
  const resp = JSON.parse(await getXPub(deviceType, devicePath, path, isTestnet)); // responses come back as strings, need to be parsed
  if (resp.error) {
    sendError(res, 'Error getting xpub');
  }
  res.send(resp);
});

router.post('/sign', async (req, res) => {
  const { deviceType, devicePath, psbt } = req.body;
  const resp = JSON.parse(await signtx(deviceType, devicePath, psbt, isTestnet));
  if (resp.error) {
    sendError(res, 'Error signing transaction');
  }
  return Promise.resolve(resp);
});

router.post('/promptpin', async (req, res) => {
  const { deviceType, devicePath } = req.body;
  const resp = JSON.parse(await promptpin(deviceType, devicePath));
  if (resp.error) {
    console.log('/promptpin e: ', resp);
    sendError(res, 'Error prompting pin');
  }
  res.send(resp);
});

router.post('/sendpin', async (req, res) => {
  const { deviceType, devicePath, pin } = req.body;
  const resp = JSON.parse(await sendpin(deviceType, devicePath, pin));
  if (resp.error) {
    sendError(res, 'Error sending pin');
  }
  res.send(resp);
});
