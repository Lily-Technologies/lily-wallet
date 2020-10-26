import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipPayload } from 'recharts';

import { green700, darkGray, white, gray, yellow100, yellow500 } from '../../utils/colors';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: TooltipPayload[], label: string }) => {
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

export const HistoricChart = ({ historicalBitcoinPrice, currentBitcoinPrice }: { historicalBitcoinPrice: any, currentBitcoinPrice: BigNumber }) => {
  const [currentDomain, setCurrentDomain] = useState(0);
  const [animateChart, setAnimateChart] = useState(false);

  const oneMonthDomain = Object.keys(historicalBitcoinPrice).length - 31;
  const sixMonthDomain = Object.keys(historicalBitcoinPrice).length - (30 * 6);
  const oneYearDomain = Object.keys(historicalBitcoinPrice).length - 365;
  const allDomain = 0;

  const changeDomain = (domain: number) => {
    setAnimateChart(true);
    setCurrentDomain(domain);
  }

  const getChartInterval = () => {
    if (currentDomain === allDomain) {
      return 465
    } else if (currentDomain === oneMonthDomain) {
      return 3
    } else if (currentDomain === sixMonthDomain) {
      return 21
    } else if (currentDomain === oneYearDomain) {
      return 35
    }
  }

  return (
    <ChartContainer>
      <ChartInfo>
        <CurrentBitcoinPriceContainer>
          <CurrentPriceText>Current Price:</CurrentPriceText>
            1BTC = {formatter.format(currentBitcoinPrice.toNumber())}
        </CurrentBitcoinPriceContainer>
        <ChartControlsContainer>
          <ChartControlItem active={currentDomain === oneMonthDomain} onClick={() => changeDomain(oneMonthDomain)}>1M</ChartControlItem>
          <ChartControlItem active={currentDomain === sixMonthDomain} onClick={() => changeDomain(sixMonthDomain)}>6M</ChartControlItem>
          <ChartControlItem active={currentDomain === oneYearDomain} onClick={() => changeDomain(oneYearDomain)}>1Y</ChartControlItem>
          <ChartControlItem active={currentDomain === 0} onClick={() => changeDomain(0)}>ALL</ChartControlItem>
        </ChartControlsContainer>
      </ChartInfo >
      <ResponsiveContainer width="100%" height={400}>
        {historicalBitcoinPrice.length ? ( // if the call to get historical price fails, then set loading or filler screen
          <AreaChart width={400} height={400} data={historicalBitcoinPrice.slice(currentDomain, historicalBitcoinPrice.length)}>
            <YAxis hide={true} domain={['dataMin - 500', 'dataMax + 500']} />
            <XAxis
              dataKey="date"
              tickCount={6}
              interval={getChartInterval()} // TODO: adjust to accept 1yr, 1month, 1 week, need to use domain prop
              tickLine={false}
              tickFormatter={(date) => {
                if (currentDomain === oneMonthDomain) {
                  return moment(date).format('MMM D')
                } else if (currentDomain === sixMonthDomain) {
                  return moment(date).format('MMM D')
                } else {
                  return moment(date).format('MMM YYYY')
                }
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={yellow500}
              strokeWidth={2}
              isAnimationActive={animateChart}
              fill={yellow100} />
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
            <div>Error Loading</div>
          )}
      </ResponsiveContainer>
    </ChartContainer >
  )
}

const ChartInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2em 2em 0;
  align-items: center;
`;

const CurrentPriceText = styled.div`
  color: ${darkGray};
  font-size: 0.5em;
`;

const ChartControlsContainer = styled.div`
  display: flex;
`;

const ChartControlItem = styled.div<{ active: boolean }>`
  color: ${p => p.active ? green700 : gray};
  padding: 0.25em;
  cursor: pointer;
  margin: 0 0.25em;
`;

const CurrentBitcoinPriceContainer = styled.div`
  font-size: 2em;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled.div`
  padding: 0;
  // border: 1px solid ${gray};
  background: ${white};
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
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