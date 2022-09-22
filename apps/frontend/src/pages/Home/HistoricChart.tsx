import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipPayload
} from 'recharts';

import { ChartEmptyState, Unit } from 'src/components';

import { green700, white, gray500, yellow200, yellow500 } from 'src/utils/colors';

import { UnitContext } from 'src/context';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

interface Props {
  active: boolean;
  payload: TooltipPayload[];
  label: string;
}

const CustomTooltip = ({ active, payload, label }: Props) => {
  if (active) {
    return (
      <TooltipContainer>
        <PriceTooltip>{formatter.format(payload[0].value as number)}</PriceTooltip>
        <DateTooltip>{moment(label).format('MMMM DD, YYYY')}</DateTooltip>
      </TooltipContainer>
    );
  }

  return null;
};

export const HistoricChart = ({
  historicalBitcoinPrice,
  currentBitcoinPrice
}: {
  historicalBitcoinPrice: any;
  currentBitcoinPrice: BigNumber;
}) => {
  const { unit } = useContext(UnitContext);
  const [currentDomain, setCurrentDomain] = useState(0);
  const [animateChart, setAnimateChart] = useState(false);

  const oneMonthDomain = Object.keys(historicalBitcoinPrice).length - 31;
  const sixMonthDomain = Object.keys(historicalBitcoinPrice).length - 30 * 6;
  const oneYearDomain = Object.keys(historicalBitcoinPrice).length - 365;

  const changeDomain = (domain: number) => {
    setAnimateChart(true);
    setCurrentDomain(domain);
  };

  const getChartInterval = () => {
    if (currentDomain === oneMonthDomain) {
      return 3;
    } else if (currentDomain === sixMonthDomain) {
      return 21;
    } else if (currentDomain === oneYearDomain) {
      return 35;
    }
    // const allDomain = 0;
    // currentDomain === allDomain
    return 465;
  };

  return (
    <ChartContainer className='bg-white dark:bg-gray-800'>
      <ChartInfo className='p-4 md:p-6'>
        <div className='flex flex-col'>
          <div className='ml-2 mt-2 text-sm md:text-lg leading-6 font-medium text-gray-500 dark:text-gray-400'>
            Current Price:
          </div>
          <div className='ml-2 mt-1 text-xl md:text-3xl leading-6 font-medium text-gray-700 dark:text-gray-200'>
            {unit === 'BTC'
              ? `1 BTC = ${formatter.format(currentBitcoinPrice.toNumber())}`
              : `$1 = ${(1 / (currentBitcoinPrice.toNumber() / 100000000)).toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })} sats`}
          </div>
        </div>
        <ChartControlsContainer>
          <ChartControlItem
            active={currentDomain === oneMonthDomain}
            onClick={() => changeDomain(oneMonthDomain)}
          >
            1M
          </ChartControlItem>
          <ChartControlItem
            active={currentDomain === sixMonthDomain}
            onClick={() => changeDomain(sixMonthDomain)}
          >
            6M
          </ChartControlItem>
          <ChartControlItem
            active={currentDomain === oneYearDomain}
            onClick={() => changeDomain(oneYearDomain)}
          >
            1Y
          </ChartControlItem>
          <ChartControlItem active={currentDomain === 0} onClick={() => changeDomain(0)}>
            ALL
          </ChartControlItem>
        </ChartControlsContainer>
      </ChartInfo>
      <ResponsiveContainer width='100%' height={window.innerWidth < 768 ? 200 : 400}>
        {historicalBitcoinPrice.length ? ( // if the call to get historical price fails, then set loading or filler screen
          <AreaChart
            width={400}
            height={400}
            data={historicalBitcoinPrice.slice(currentDomain, historicalBitcoinPrice.length)}
          >
            <YAxis hide={true} domain={['dataMin - 500', 'dataMax + 500']} />
            <XAxis
              dataKey='date'
              tickCount={window.innerWidth < 768 ? 4 : 7}
              interval={getChartInterval()} // TODO: adjust to accept 1yr, 1month, 1 week, need to use domain prop
              tickLine={false}
              tickFormatter={(date) => {
                if (currentDomain === oneMonthDomain) {
                  return moment(date).format('MMM D');
                } else if (currentDomain === sixMonthDomain) {
                  return moment(date).format('MMM D');
                } else {
                  return moment(date).format('MMM YYYY');
                }
              }}
            />
            <Area
              className=''
              type='monotone'
              dataKey='price'
              stroke={yellow500}
              strokeWidth={2}
              isAnimationActive={animateChart}
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
        ) : (
          <ChartEmptyState />
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const ChartControlsContainer = styled.div`
  display: flex;
  font-weight: 500;
`;

const ChartControlItem = styled.div<{ active: boolean }>`
  color: ${(p) => (p.active ? green700 : gray500)};
  padding: 0.25em;
  cursor: pointer;
  margin: 0 0.25em;
`;

const ChartContainer = styled.div`
  padding: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.385em;
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
