import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { satoshisToBitcoins } from "unchained-bitcoin";
import { Bitcoin } from '@styled-icons/boxicons-logos';
import { RestaurantMenu } from '@styled-icons/material';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Link } from "react-router-dom";

import { PageWrapper, StyledIcon, StyledIconSpinning } from '../components';

import { blue, darkGray, white, lightBlue, offWhite, gray } from '../utils/colors';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <TooltipContainer>
        <PriceTooltip>{formatter.format(payload[0].value)}</PriceTooltip>
        <DateTooltip>{moment(label).format('MMMM DD, YYYY')}</DateTooltip>
      </TooltipContainer>
    );
  }

  return null;
};

const getLastTransactionTime = (transactions) => {
  if (transactions.length === 0) { // if no transactions yet
    return `No activity on this account yet`
  } else if (!transactions[0].status.confirmed) { // if last transaction isn't confirmed yet
    return `Last transaction was moments ago`
  } else { // if transaction is confirmed, give moments ago
    return `Last transaction was ${moment.unix(transactions[0].status.block_time).fromNow()}`
  }
}

const Home = ({ config, accountMap, priceForChart, currentBitcoinPrice, loading }) => {
  const [currentDomain, setCurrentDomain] = useState(0);

  const oneMonthDomain = Object.keys(priceForChart).length - 31;
  const sixMonthDomain = Object.keys(priceForChart).length - (30 * 6);
  const oneYearDomain = Object.keys(priceForChart).length - 365;
  const allDomain = 0;

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
    <PageWrapper>
      <ChartContainer>
        <ChartInfo>
          <CurrentBitcoinPriceContainer>
            <CurrentPriceText>Current Price:</CurrentPriceText>
            1BTC = {formatter.format(currentBitcoinPrice.toNumber())}
          </CurrentBitcoinPriceContainer>
          <ChartControlsContainer>
            <ChartControlItem active={currentDomain === oneMonthDomain} onClick={() => setCurrentDomain(oneMonthDomain)}>1M</ChartControlItem>
            <ChartControlItem active={currentDomain === sixMonthDomain} onClick={() => setCurrentDomain(sixMonthDomain)}>6M</ChartControlItem>
            <ChartControlItem active={currentDomain === oneYearDomain} onClick={() => setCurrentDomain(oneYearDomain)}>1Y</ChartControlItem>
            <ChartControlItem active={currentDomain === 0} onClick={() => setCurrentDomain(0)}>ALL</ChartControlItem>
          </ChartControlsContainer>
        </ChartInfo >
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart width={400} height={400} data={priceForChart.slice(currentDomain, priceForChart.length)}>
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
              stroke={blue}
              strokeWidth={2}
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
      </ChartContainer >

      <HomeHeadingItem style={{ marginTop: '2.5em', marginBottom: '1em' }}>Your Accounts</HomeHeadingItem>

      <AccountsWrapper>
        {loading && <LoadingAnimation flat={true}>
          <StyledIconSpinning as={RestaurantMenu} size={96} />
          <LoadingText>Loading Accounts</LoadingText>
          <LoadingSubText>Please wait...</LoadingSubText>
        </LoadingAnimation>}
        {[...accountMap.values()].map((account) => (
          <AccountItem to={`/vault/${account.config.id}`} key={account.config.id}>
            <StyledIcon as={Bitcoin} size={36} />
            <AccountInfoContainer>
              <AccountName>{account.name}</AccountName>
              <CurrentBalance>Current Balance: {satoshisToBitcoins(account.currentBalance.toNumber()).toFixed(8)} BTC</CurrentBalance>
              <CurrentBalance>{getLastTransactionTime(account.transactions)}</CurrentBalance>
            </AccountInfoContainer>
          </AccountItem>
        ))}
      </AccountsWrapper>
    </PageWrapper >
  )
};


const AccountItem = styled(Link)`
  background: ${white};
  padding: 1.5em;
  border: 1px solid ${gray};
  cursor: pointer;
  color: ${gray};
  text-decoration: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background: ${offWhite};
  }

  &:visited {
    color: ${gray};
  }
`;

const AccountInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const AccountsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 1em;
`;

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

const ChartControlItem = styled.div`
  color: ${p => p.active ? blue : gray};
  padding: 0.25em;
  cursor: pointer;
  margin: 0 0.25em;
`;

const CurrentBitcoinPriceContainer = styled.div`
  font-size: 2em;
  display: flex;
  flex-direction: column;
`;

const HomeHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 4em 0 0;
  font-weight: 400;
  color: ${darkGray};
`;

const AccountName = styled.div`
  font-size: 1em;
  color: ${darkGray};
`;

const CurrentBalance = styled.div`
  font-size: 0.5em;
`;

const ChartContainer = styled.div`
  padding: 0;
  border: 1px solid ${gray};
  background: ${white};
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
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

const LoadingAnimation = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  box-shadow: background: ${p => p.flat ? 'transparent' : 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'};
  margin: 18px 0;
  flex-direction: column;
  color: ${darkGray};
  padding: 1.5em;
`;

const LoadingText = styled.div`
  font-size: 1.5em;
  margin: 4px 0;
`;

const LoadingSubText = styled.div`
    font-size: .75em;
`;


export default Home