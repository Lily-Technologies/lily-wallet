import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { satoshisToBitcoins } from "unchained-bitcoin";
import moment from 'moment';

import RecentTransactions from '../../components/transactions/RecentTransactions';

import { gray, white, darkGray, lightBlue } from '../../utils/colors';

const VaultView = ({ currentBalance, currentBitcoinPrice, transactions, loadingDataFromBlockstream }) => {
  const sortedTransactions = transactions.sort((a, b) => a.status.block_time - b.status.block_time);

  let dataForChart;

  if (transactions.length) {
    dataForChart = [{
      block_time: sortedTransactions[0].status.block_time - 1,
      totalValue: 0
    }];

    for (let i = 0; i < sortedTransactions.length; i++) {
      dataForChart.push({
        block_time: sortedTransactions[i].status.block_time,
        totalValue: sortedTransactions[i].totalValue.toNumber()
      })
    }

    dataForChart.push({
      block_time: Date.now(),
      totalValue: sortedTransactions[sortedTransactions.length - 1].totalValue.toNumber()
    });
  }

  return (
    <Fragment>
      {transactions.length > 0 && (
        <ValueWrapper>
          <CurrentBalanceContainer>
            <CurrentBalanceText>Current Balance:</CurrentBalanceText>
            {satoshisToBitcoins(currentBalance.toNumber()).toFixed(8)} BTC
          </CurrentBalanceContainer>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart width={400} height={400} data={dataForChart}>
                <YAxis dataKey="totalValue" hide={true} domain={['dataMin', 'dataMax + 10000']} />
                <XAxis
                  dataKey="block_time"
                  height={50}
                  interval={1}
                  tickFormatter={(blocktime) => {
                    return moment.unix(blocktime).format('MMM D')
                  }}
                />
                <Area type="monotone" dataKey="totalValue" stroke="#8884d8" strokeWidth={2} fill={lightBlue} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ValueWrapper>
      )}
      <RecentTransactions transactions={transactions} loading={loadingDataFromBlockstream} />
    </Fragment>
  )
}

const ValueWrapper = styled.div`
  background: ${white};
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border: 1px solid ${gray};
`;

const ChartContainer = styled.div``;

const CurrentBalanceContainer = styled.div`
  font-size: 2em;
  display: flex;
  flex-direction: column;
  padding: 1em 1em 0
`;

const CurrentBalanceText = styled.div`
  color: ${darkGray};
  font-size: 0.5em;
`;

export default VaultView;