import { Router } from 'express';

import { getFile, saveFile } from '@lily/shared-server';

const APP_DATA_DIRECTORY = process.env.APP_DATA_DIR;
const CONFIG_FILE_NAME = 'lily-config-encrypted.txt';

const router = Router();

router.get('/get-config', async (req, res) => {
  try {
    const file = await getFile(CONFIG_FILE_NAME, APP_DATA_DIRECTORY);
    res.send(JSON.stringify(file));
  } catch (e) {
    console.log('Failed to get Lily config');
  }
});

router.post('/save-config', async (req, res) => {
  const { encryptedConfigFile } = req.body;
  await saveFile(encryptedConfigFile, CONFIG_FILE_NAME, APP_DATA_DIRECTORY);
});

export default router;
