import axios from 'axios';
import { Router } from 'express';
import moment from 'moment';

import { CoindeskCurrentPriceResponse, CoindeskHistoricPriceResponse } from '@lily/types';
import { sendError } from '../utils';

const router = Router();

router.get('/current-btc-price', async (req, res) => {
  const { data }: { data: CoindeskCurrentPriceResponse } = await axios.get(
    'https://api.coindesk.com/v1/bpi/currentprice.json'
  );
  const currentPriceWithCommasStrippedOut = data.bpi.USD.rate.replace(',', '');
  res.send(currentPriceWithCommasStrippedOut);
});

router.get('/historical-btc-price', async (req, res) => {
  try {
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
  } catch (e) {
    sendError(res, e);
  }
});

export default router;
