require('dotenv').config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { setInitialConfig } from 'src/utils';

const app = express();
app.use(cors());
app.use(bodyParser.json());

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', error);
});

setInitialConfig();

const port = process.env.EXPRESS_PORT; // default port to listen

const isTestnet = !!('TESTNET' in process.env);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/bitcoin-network', async (req, res) => {
  res.send(isTestnet);
});

app.use(require('src/routes/chart'));
app.use(require('src/routes/config'));
app.use(require('src/routes/hwi'));
app.use(require('src/routes/lightning'));
app.use(require('src/routes/onchain'));

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
