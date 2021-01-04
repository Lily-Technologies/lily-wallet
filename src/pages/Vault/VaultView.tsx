import React, { Fragment, useContext, useState } from "react";
import styled, { css } from "styled-components";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipPayload,
} from "recharts";
import { satoshisToBitcoins } from "unchained-bitcoin";
import moment from "moment";
import BigNumber from "bignumber.js";

import { AccountMapContext } from "../../AccountMapContext";

import { Loading, Modal, Button } from "../../components";

import { mobile } from "../../utils/media";

import RecentTransactions from "./RecentTransactions";
import { RescanModal } from "./RescanModal";

import { NodeConfig } from "../../types";

import {
  gray,
  white,
  darkGray,
  yellow100,
  yellow500,
} from "../../utils/colors";

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
        <DateTooltip>{moment.unix(label).format("MMMM DD, YYYY")}</DateTooltip>
      </TooltipContainer>
    );
  }

  return null;
};

interface Props {
  nodeConfig: NodeConfig;
}

const VaultView = ({ nodeConfig }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const { currentAccount } = useContext(AccountMapContext);
  const { currentBalance, transactions } = currentAccount;
  const transactionsCopyForChart = [...transactions];
  const transactionsCopyForRecentTransactions = [...transactions];
  const sortedTransactions = transactionsCopyForChart.sort(
    (a, b) => a.status.block_time - b.status.block_time
  );

  let dataForChart;

  if (transactions.length) {
    dataForChart = [
      {
        block_time: sortedTransactions[0].status.block_time - 1,
        totalValue: 0,
      },
    ];

    for (let i = 0; i < sortedTransactions.length; i++) {
      dataForChart.push({
        block_time: sortedTransactions[i].status.block_time,
        totalValue: new BigNumber(sortedTransactions[i].totalValue).toNumber(),
      });
    }

    dataForChart.push({
      block_time: Math.floor(Date.now() / 1000),
      totalValue: new BigNumber(
        sortedTransactions[sortedTransactions.length - 1].totalValue
      ).toNumber(),
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
      <RescanModal closeModal={closeModal} currentAccount={currentAccount} />
    );
  };

  return (
    <Fragment>
      {currentAccount.loading && (
        <ValueWrapper>
          <Loading style={{ margin: "10em 0" }} itemText={"Chart Data"} />
        </ValueWrapper>
      )}
      {transactions.length > 0 && !currentAccount.loading && (
        <ValueWrapper>
          <CurrentBalanceContainer>
            <CurrentBalanceText>Current Balance:</CurrentBalanceText>
            {satoshisToBitcoins(currentBalance).toFixed(8)} BTC
          </CurrentBalanceContainer>
          <ChartContainer>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart width={400} height={400} data={dataForChart}>
                <YAxis
                  dataKey="totalValue"
                  hide={true}
                  domain={["dataMin", "dataMax + 10000"]}
                />
                <XAxis
                  dataKey="block_time"
                  height={50}
                  interval={"preserveStartEnd"}
                  tickCount={transactions.length > 10 ? 5 : transactions.length}
                  tickFormatter={(blocktime) => {
                    return moment.unix(blocktime).format("MMM D");
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalValue"
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
                    marginLeft: -10,
                  }}
                  content={CustomTooltip}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ValueWrapper>
      )}
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
        loading={currentAccount.loading}
        flat={false}
        openRescanModal={
          nodeConfig?.provider === "Blockstream"
            ? undefined
            : () => openRescanModal()
        }
      />
      <Modal isOpen={modalIsOpen} onRequestClose={() => closeModal()}>
        <ModalContentWrapper>{modalContent}</ModalContentWrapper>
      </Modal>
    </Fragment>
  );
};

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};
`;

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
