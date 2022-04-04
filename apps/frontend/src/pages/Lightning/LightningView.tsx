import React from 'react';
import styled from 'styled-components';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipPayload
} from 'recharts';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import moment from 'moment';

import { ChartEmptyState } from 'src/components';

import RecentActivity from './RecentActivity';

import { LilyLightningAccount } from '@lily/types';

import { requireLightning } from 'src/hocs';

import { gray400, gray500, yellow200, yellow500 } from 'src/utils/colors';

interface TooltipProps {
  active: boolean;
  payload: TooltipPayload[];
  label: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active) {
    return (
      <TooltipContainer>
        <div className='text-white'>{`${
          payload[0] && payload[0].value ? satoshisToBitcoins(payload[0].value as number) : 0
        } BTC`}</div>
        <DateTooltip>{moment.unix(label).format('MMMM DD, YYYY')}</DateTooltip>
      </TooltipContainer>
    );
  }

  return null;
};

const CustomTick = ({ x, y, stroke, payload }) => {
  return (
    <text
      height='50'
      width='790'
      x={x}
      y={y}
      stroke={stroke}
      fill='#666'
      className='recharts-text recharts-cartesian-axis-tick-value'
      textAnchor='middle'
    >
      <tspan x={x} dy='1.5em'>
        {moment.unix(payload.value).format('MMM D')}
      </tspan>
    </text>
  );
};

interface Props {
  currentAccount: LilyLightningAccount;
}

const LightningView = ({ currentAccount }: Props) => {
  const { currentBalance, events, balanceHistory } = currentAccount;

  return (
    <>
      {currentAccount.loading ? (
        <div style={{ height: window.innerWidth < 768 ? '16rem' : '32rem' }}>
          <div className='h-full relative shadow-md bg-white dark:bg-gray-800 rounded-md'>
            <ChartEmptyState />
          </div>
        </div>
      ) : null}
      {events.length > 0 && !currentAccount.loading ? (
        <div className='bg-white dark:bg-gray-800 rounded-md shadow'>
          <CurrentBalanceContainer className='p-6'>
            <div className='ml-2 mt-2 text-sm md:text-lg leading-6 font-medium text-gray-500 dark:text-gray-400'>
              Current Balance:
            </div>
            <div className='ml-2 mt-1 text-xl md:text-3xl leading-6 font-medium text-gray-700 dark:text-gray-200'>
              {satoshisToBitcoins(currentBalance.balance).toFixed(8)} BTC
            </div>
          </CurrentBalanceContainer>
          <div>
            <ResponsiveContainer width='100%' height={window.innerWidth < 768 ? 200 : 400}>
              <AreaChart width={400} height={400} data={balanceHistory}>
                <YAxis
                  dataKey='totalValue'
                  hide={true}
                  domain={['dataMin - 500', 'dataMax + 10000']}
                  allowDataOverflow={true}
                />
                <XAxis
                  dataKey='blockTime'
                  scale='auto'
                  type='number'
                  height={40}
                  domain={[
                    balanceHistory[0].blockTime!,
                    balanceHistory[balanceHistory.length - 1].blockTime!
                  ]}
                  tickCount={window.innerWidth < 768 ? 4 : 7}
                  tickSize={0}
                  interval={0}
                  tick={CustomTick}
                  tickLine={{ stroke: gray400 }}
                  allowDataOverflow={true}
                />
                <Area
                  type='monotone'
                  dataKey='totalValue'
                  stroke={yellow500}
                  strokeWidth={2}
                  isAnimationActive={false}
                  fill={yellow200}
                />
                <Tooltip
                  offset={-100}
                  cursor={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{
                    marginLeft: -10
                  }}
                  content={CustomTooltip}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
      <RecentActivity events={events} loading={!!currentAccount.loading} flat={false} />
    </>
  );
};

const CurrentBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TooltipContainer = styled.div`
  background: rgba(31, 31, 31, 0.75);
  padding: 1em;
  border-radius: 4px;
  text-align: center;
`;

const DateTooltip = styled.div`
  color: ${gray500};
  font-size: 0.75em;
`;

export default requireLightning(LightningView);
