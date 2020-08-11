import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { satoshisToBitcoins } from "unchained-bitcoin";
import moment from 'moment';
import BigNumber from 'bignumber.js';

import { Loading } from '../../components';

import RecentTransactions from '../../components/transactions/RecentTransactions';

import { gray, white, darkGray, lightBlue, blue } from '../../utils/colors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <TooltipContainer>
        <PriceTooltip>{`${payload[0].value ? satoshisToBitcoins(payload[0].value) : 0} BTC`}</PriceTooltip>
        <DateTooltip>{moment.unix(label).format('MMMM DD, YYYY')}</DateTooltip>
      </TooltipContainer>
    );
  }

  return null;
};

const VaultView = ({ currentAccount }) => {
  const { currentBalance, transactions } = currentAccount;
  const transactionsCopy = [...transactions];
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
        totalValue: new BigNumber(sortedTransactions[i].totalValue).toNumber()
      })
    }

    dataForChart.push({
      block_time: Math.floor(Date.now() / 1000),
      totalValue: new BigNumber(sortedTransactions[sortedTransactions.length - 1].totalValue).toNumber()
    });
  }

  return (
    <Fragment>
      {currentAccount.loading && (
        <ValueWrapper>
          <Loading style={{ margin: '10em 0' }} itemText={'Chart Data'} />
        </ValueWrapper>
      )}
      {transactions.length > 0 && (
        <ValueWrapper>
          <CurrentBalanceContainer>
            <CurrentBalanceText>Current Balance:</CurrentBalanceText>
            {satoshisToBitcoins(currentBalance).toFixed(8)} BTC
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
                <Area
                  type="monotone"
                  dataKey="totalValue"
                  stroke={blue}
                  strokeWidth={2}
                  isAnimationActive={false}
                  fill={lightBlue} />
                <Tooltip
                  offset={-100}
                  cursor={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{
                    marginLeft: -10
                  }}
                  content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ValueWrapper>
      )}
      <RecentTransactions
        transactions={transactionsCopy.sort((a, b) => {
          console.log('a: ', a)
          console.log('b: ', b)
          if (!b.status.confirmed && !a.status.confirmed) {
            return 0;
          } else if (!b.status.confirmed) {
            return -1;
          } else if (!a.status.confirmed) {
            return -1;
          }
          return b.status.block_time - a.status.block_time
        })}
        loading={currentAccount.loading} />
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

const TooltipContainer = styled.div`
  background: rgba(31, 31, 31, 0.75); // black
  padding: 1em;
  border-radius: 4px;
  text-align: center;
`;

const PriceTooltip = styled.div`
  color: ${white};
`;

const DateTooltip = styled.div`
  color: ${gray};
  font-size: 0.75em;
`;

export default VaultView;