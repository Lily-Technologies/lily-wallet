import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
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

import { Loading, Modal } from "src/components";

import RecentTransactions from "./RecentTransactions";
import { RescanModal } from "./RescanModal";

import { NodeConfig, LilyOnchainAccount } from "src/types";
import { requireOnchain } from "src/hocs";

import {
  white,
  gray500,
  gray600,
  yellow100,
  yellow500,
} from "src/utils/colors";

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
  toggleRefresh: () => void;
  currentAccount: LilyOnchainAccount;
}

const VaultView = ({ currentAccount, nodeConfig, toggleRefresh }: Props) => {
  const [progress, setProgress] = useState<number>(0);
  const { currentBalance, transactions } = currentAccount;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
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

  const scanProgress = useCallback(async () => {
    try {
      if (
        nodeConfig.provider === "Custom Node" ||
        nodeConfig.provider === "Bitcoin Core"
      ) {
        const { scanning } = await window.ipcRenderer.invoke("/getWalletInfo", {
          currentAccount,
        });
        if (scanning) {
          setProgress(scanning.progress);
        } else if (progress < 100) {
          // if scanning is false and progress is defined,
          // then we must have had progress sometime in the past,
          // so we are finished scanning, so refetch.
          // setProgress over 100 to render "refetching" message to user
          toggleRefresh();
          setProgress(420);
        } else if (currentAccount.loading.progress && !!!progress) {
          // if scanning is false, progress is 0, but current.loading.progress exists
          // then we were returned currentAccount data while still rescanning and then navigated to this page
          // we are done rescanning (because !!!scanning), so refetch data.
          toggleRefresh();
          setProgress(420);
        }
      }
    } catch (e) {
      console.log("e: ", e);
    }
  }, [currentAccount, nodeConfig.provider, toggleRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const openRescanModal = () => {
    openInModal(
      <RescanModal
        toggleRefresh={toggleRefresh}
        closeModal={closeModal}
        currentAccount={currentAccount}
      />
    );
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      scanProgress();
      if (
        progress > 100 &&
        (!!!currentAccount.loading || !!currentAccount.loading.progress)
      ) {
        setProgress(0);
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentAccount, scanProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {currentAccount.loading ||
      (progress && currentAccount.transactions.length === 0) ? (
        <ValueWrapper>
          {/* @ts-ignore-line */}
          <Loading
            style={{ margin: "10em 0" }}
            message={
              progress > 100
                ? "Fetching newly scanned transactions"
                : progress
                ? `Scanning for transactions \n (${(progress * 100).toFixed(
                    2
                  )}% complete)`
                : undefined
            }
            itemText={!progress ? "Transaction Data" : undefined}
          />
        </ValueWrapper>
      ) : null}
      {transactions.length > 0 && !currentAccount.loading ? (
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
        loading={!!currentAccount.loading || progress > 0}
        flat={false}
        openRescanModal={
          nodeConfig?.provider === "Blockstream"
            ? undefined
            : () => openRescanModal()
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
