import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { satoshisToBitcoins } from "unchained-bitcoin";
import { Bitcoin } from '@styled-icons/boxicons-logos';
import { AddCircleOutline } from '@styled-icons/material';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Link } from "react-router-dom";
import { useSpring, animated } from 'react-spring';

import { PageWrapper, StyledIcon } from '../components';

import { blue, darkGray, white, black, lightBlue, gray, gray400, gray500, gray600 } from '../utils/colors';

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

const Home = ({ config, setCurrentAccount, accountMap, historicalBitcoinPrice, currentBitcoinPrice, flyInAnimation, prevFlyInAnimation }) => {
  const [currentDomain, setCurrentDomain] = useState(0);
  const [animateChart, setAnimateChart] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    if (flyInAnimation !== prevFlyInAnimation) { // if these values are different, change local
      setInitialLoad(true)
    }
  }, [flyInAnimation, prevFlyInAnimation])

  const oneMonthDomain = Object.keys(historicalBitcoinPrice).length - 31;
  const sixMonthDomain = Object.keys(historicalBitcoinPrice).length - (30 * 6);
  const oneYearDomain = Object.keys(historicalBitcoinPrice).length - 365;
  const allDomain = 0;

  const changeDomain = (domain) => {
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

  const chartProps = useSpring({ transform: initialLoad || (flyInAnimation === false && prevFlyInAnimation === false) ? 'translateY(0%)' : 'translateY(-120%)' });
  const accountsProps = useSpring({ transform: initialLoad || (flyInAnimation === false && prevFlyInAnimation === false) ? 'translateY(0%)' : 'translateY(120%)' });

  return (
    <PageWrapper>
      <animated.div style={{ ...chartProps }}>
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
                  stroke={blue}
                  strokeWidth={2}
                  isAnimationActive={animateChart}
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
            ) : (
                <div>Error Loading</div>
              )}
          </ResponsiveContainer>
        </ChartContainer >
      </animated.div>

      <animated.div style={{ ...accountsProps }}>
        <HomeHeadingItem style={{ marginTop: '2.5em', marginBottom: '1em' }}>Your Accounts</HomeHeadingItem>

        <AccountsWrapper>
          {[...accountMap.values()].map((account) => (
            <AccountItem to={`/vault/${account.config.id}`} onClick={() => { setCurrentAccount(account.config.id) }} key={account.config.id}>
              <StyledIcon as={Bitcoin} size={48} />
              <AccountInfoContainer>
                <AccountName>{account.name}</AccountName>
                {account.loading && 'Loading...'}
                {!account.loading && <CurrentBalance>Current Balance: {satoshisToBitcoins(account.currentBalance).toFixed(8)} BTC</CurrentBalance>}
                {!account.loading && <CurrentBalance>{getLastTransactionTime(account.transactions)}</CurrentBalance>}
              </AccountInfoContainer>
            </AccountItem>
          ))}
          <AccountItem to={`/setup`}>
            <StyledIcon as={AddCircleOutline} size={48} />
            <AccountInfoContainer>
              <AccountName>Add a new account</AccountName>
              <CurrentBalance>Create a new account to send, receive, and manage bitcoin</CurrentBalance>
            </AccountInfoContainer>
          </AccountItem>
          {!accountMap.size && (
            <InvisibleItem></InvisibleItem>
          )}
        </AccountsWrapper>
      </animated.div>
    </PageWrapper >
  )
};

const InvisibleItem = styled.div`
  height: 0;
  width: 0;
`;

const AccountItem = styled(Link)`
  background: ${white};
  padding: 1.5em;
  cursor: pointer;
  color: ${darkGray};
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);

  &:hover {
    color: ${gray500};
  }

  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;

  &:active {
    transform: scale(.99);
    outline: 0;
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
  color: ${black};
`;

const AccountName = styled.div`
  font-size: 1.25em;
`;

const CurrentBalance = styled.div`
  font-size: 0.65em;
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

export default Home