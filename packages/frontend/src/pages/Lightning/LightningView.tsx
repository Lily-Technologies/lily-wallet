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

import { white, gray500, gray600, yellow100, yellow500 } from 'src/utils/colors';

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
          payload[0].value ? satoshisToBitcoins(payload[0].value as number) : 0
        } BTC`}</PriceTooltip>
        <DateTooltip>{moment.unix(label).format('MMMM DD, YYYY')}</DateTooltip>
      </TooltipContainer>
    );
  }

  return null;
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
                <YAxis dataKey='totalValue' hide={true} domain={['dataMin', 'dataMax + 10000']} />
                <XAxis
                  dataKey='blockTime'
                  height={50}
                  interval={'preserveStartEnd'}
                  tickCount={payments.length > 10 ? 5 : payments.length}
                  tickFormatter={(blocktime) => {
                    return moment.unix(blocktime).format('MMM D');
                  }}
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
