import { getFile, saveFile } from '@lily/shared-server';
import { EMPTY_CONFIG } from '@lily/types';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import { encode } from 'lndconnect';
import { AES } from 'crypto-js';

const APP_DATA_DIRECTORY = process.env.APP_DATA_DIR;
const CONFIG_FILE_NAME = 'lily-config-encrypted.txt';

export const setInitialConfig = async () => {
  let configExists = false;
  try {
    const configFile = await getFile(CONFIG_FILE_NAME, APP_DATA_DIRECTORY);
    configExists = !!configFile;
  } catch (e) {
    console.log('No config file exists');
  }

  if (!configExists && process.env.APP_PASSWORD) {
    try {
      const { file: macaroon } = await getFile(
        'admin.macaroon',
        '/lnd/data/chain/bitcoin/mainnet', // TODO: make dynamic for other platforms
        'hex'
      );
      const { file: tlsCert } = await getFile('tls.cert', '/lnd', 'utf8');
      const lndHost = `${process.env.LND_IP}:${process.env.LND_GRPC_PORT}`;

      const emptyConfig = EMPTY_CONFIG;
      emptyConfig.isEmpty = false;
      emptyConfig.lightning[0] = {
        id: uuidv4(),
        type: 'lightning',
        created_at: Date.now(),
        name: 'Umbrel', // TODO: make dynamic for other platforms
        network: 'mainnet',
        connectionDetails: {
          lndConnectUri: encode({
            host: lndHost,
            cert: tlsCert,
            macaroon: macaroon
          })
        }
      };

      const encryptedConfigObject = AES.encrypt(
        JSON.stringify(emptyConfig),
        process.env.APP_PASSWORD
      ).toString();

      await saveFile(encryptedConfigObject, CONFIG_FILE_NAME, APP_DATA_DIRECTORY);
      console.log(`Saved ${CONFIG_FILE_NAME} to ${APP_DATA_DIRECTORY}`);
    } catch (e) {
      console.log('error: ', e);
    }
  }
};
