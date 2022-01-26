import React, { useState } from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from 'unchained-bitcoin';
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

import { ChartEmptyState, Modal } from 'src/components';

import RecentTransactions from './RecentTransactions';
import { RescanModal } from './RescanModal';

import { requireOnchain } from 'src/hocs';

import { white, gray400, gray500, gray600, yellow100, yellow500 } from 'src/utils/colors';

import { NodeConfigWithBlockchainInfo, LilyOnchainAccount } from '@lily/types';

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
  nodeConfig: NodeConfigWithBlockchainInfo;
  toggleRefresh: () => void;
  currentAccount: LilyOnchainAccount;
}

const VaultView = ({ currentAccount, nodeConfig, toggleRefresh }: Props) => {
  const { currentBalance, transactions } = currentAccount;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const transactionsCopyForChart = [...transactions];
  const transactionsCopyForRecentTransactions = [...transactions];
  const sortedTransactions = transactionsCopyForChart.sort(
    (a, b) => a.status.block_time - b.status.block_time
  );
  console.log('currentAccount: ', currentAccount);

  let dataForChart: { block_time: number; totalValue: number }[] = [];

  if (transactions.length) {
    dataForChart = [
      {
        block_time: sortedTransactions[0].status.block_time - 1,
        totalValue: 0
      }
    ];

    for (let i = 0; i < sortedTransactions.length; i++) {
      dataForChart.push({
        block_time: sortedTransactions[i].status.block_time,
        totalValue: new BigNumber(sortedTransactions[i].totalValue).toNumber()
      });
    }

    dataForChart.push({
      block_time: Math.floor(Date.now() / 1000),
      totalValue: new BigNumber(
        sortedTransactions[sortedTransactions.length - 1].totalValue
      ).toNumber()
    });
  }

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const openRescanModal = () => {
    openInModal(
      <RescanModal
        toggleRefresh={toggleRefresh}
        closeModal={closeModal}
        currentAccount={currentAccount}
      />
    );
  };

  return (
    <>
      {currentAccount.loading ? (
        <div style={{ height: '32rem' }}>
          <div className='h-full relative shadow-md bg-white rounded-md'>
            <ChartEmptyState />
          </div>
        </div>
      ) : null}
      {transactions.length > 0 && !currentAccount.loading ? (
        <ValueWrapper>
          <CurrentBalanceContainer>
            <CurrentBalanceText>Current Balance:</CurrentBalanceText>
            {satoshisToBitcoins(currentBalance).toFixed(8)} BTC
          </CurrentBalanceContainer>
          <ChartContainer>
            <ResponsiveContainer width='100%' height={400}>
              <AreaChart width={400} height={400} data={dataForChart}>
                <YAxis dataKey='totalValue' hide={true} domain={['dataMin', 'dataMax + 10000']} />
                <XAxis
                  dataKey='block_time'
                  height={40}
                  scale='auto'
                  type='number'
                  tickCount={7}
                  tickSize={0}
                  interval={0}
                  tick={CustomTick}
                  tickLine={{ stroke: gray400 }}
                  allowDataOverflow={true}
                  domain={[
                    // 'auto',
                    // 'auto'
                    dataForChart[0].block_time!,
                    // dataForChart[dataForChart.length - 1].block_time! - 2629743,
                    dataForChart[dataForChart.length - 1].block_time!
                  ]}
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
      <RecentTransactions
        transactions={transactionsCopyForRecentTransactions.sort((a, b) => {
          if (!b.status.confirmed && !a.status.confirmed) {
            return 0;
          } else if (!b.status.confirmed) {
            return -1;
          } else if (!a.status.confirmed) {
            return -1;
          }
          return b.status.block_time - a.status.block_time;
        })}
        loading={!!currentAccount.loading}
        flat={false}
        openRescanModal={
          nodeConfig?.provider === 'Blockstream' ? undefined : () => openRescanModal()
        }
      />
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
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

export default requireOnchain(VaultView);
