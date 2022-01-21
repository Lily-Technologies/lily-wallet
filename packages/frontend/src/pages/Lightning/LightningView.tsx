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

import { Loading } from 'src/components';

import RecentActivity from './RecentActivity';

import { LilyLightningAccount } from '@lily/types';

import { requireLightning } from 'src/hocs';

import { white, gray400, gray500, gray600, yellow100, yellow500 } from 'src/utils/colors';

interface TooltipProps {
  active: boolean;
  payload: TooltipPayload[];
  label: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active) {
    return (
      <TooltipContainer>
        <PriceTooltip>{`${
          payload[0] && payload[0].value ? satoshisToBitcoins(payload[0].value as number) : 0
        } BTC`}</PriceTooltip>
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
  const { currentBalance, payments, events, balanceHistory } = currentAccount;
  console.log('currentAccount: ', currentAccount);

  return (
    <>
      {currentAccount.loading ? (
        <ValueWrapper>
          <Loading style={{ margin: '10em 0' }} itemText={'Transaction Data'} />
        </ValueWrapper>
      ) : null}
      {events.length > 0 && !currentAccount.loading ? (
        <ValueWrapper>
          <CurrentBalanceContainer>
            <CurrentBalanceText>Current Balance:</CurrentBalanceText>
            {satoshisToBitcoins(currentBalance.balance).toFixed(8)} BTC
          </CurrentBalanceContainer>
          <ChartContainer>
            <ResponsiveContainer width='100%' height={400}>
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
                  tickCount={7}
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
                  fill={yellow100}
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
          </ChartContainer>
        </ValueWrapper>
      ) : null}
      <RecentActivity events={events} loading={!!currentAccount.loading} flat={false} />
    </>
  );
};

const ValueWrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const ChartContainer = styled.div``;

const CurrentBalanceContainer = styled.div`
  font-size: 2em;
  display: flex;
  flex-direction: column;
  padding: 1em 1em 0;
`;

const CurrentBalanceText = styled.div`
  color: ${gray600};
  font-size: 0.5em;
`;

const TooltipContainer = styled.div`
  background: rgba(31, 31, 31, 0.75);
  padding: 1em;
  border-radius: 4px;
  text-align: center;
`;

const PriceTooltip = styled.div`
  color: ${white};
`;

const DateTooltip = styled.div`
  color: ${gray500};
  font-size: 0.75em;
`;

export default requireLightning(LightningView);
