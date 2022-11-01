import { Router } from 'express';

import {
  dbConnect,
  addAddressTag,
  deleteAddressTag,
  getAllLabelsForAddress,
  addTransactionDescription,
  getTransactionDescription
} from '@lily/shared-server';

const APP_DATA_DIRECTORY = process.env.APP_DATA_DIR;

const router = Router();

router.post('/add-address-label', async (req, res) => {
  const { address, label } = req.body;
  try {
    const db = await dbConnect(APP_DATA_DIRECTORY);
    const response = await addAddressTag(db, address, label);
    return Promise.resolve(response);
  } catch (e) {
    console.log(`error /add-address-label ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

router.post('/delete-address-label', async (req, res) => {
  const { id } = req.body;
  try {
    const db = await dbConnect(APP_DATA_DIRECTORY);
    await deleteAddressTag(db, id);
    return Promise.resolve();
  } catch (e) {
    console.log(`error /delete-address-label ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

router.post('/get-address-labels', async (req, res) => {
  const { address } = req.body;
  try {
    const db = await dbConnect(APP_DATA_DIRECTORY);
    const labels = await getAllLabelsForAddress(db, address);
    return Promise.resolve(labels);
  } catch (e) {
    console.log(`error /get-address-labels ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

router.post('/add-transaction-description', async (req, res) => {
  const { txid, description } = req.body;
  console.log(`Adding description ${description} to tx ${txid}`);
  try {
    const db = await dbConnect(APP_DATA_DIRECTORY);
    const response = await addTransactionDescription(db, txid, description);
    return Promise.resolve(response);
  } catch (e) {
    console.log(`error /add-transaction-description ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});
router.post('/get-transaction-description', async (req, res) => {
  const { txid } = req.body;
  try {
    const db = await dbConnect(APP_DATA_DIRECTORY);
    const description = await getTransactionDescription(db, txid);
    return Promise.resolve(description);
  } catch (e) {
    console.log(`error /get-transaction-description ${e}`);
    return Promise.reject({ success: false, error: e });
  }
});

export default router;
