import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Modal, Button } from "../../../components";

import TxDetailsModal from "./TxDetailsModal";
import TransactionRow from "./TransactionRow";
import TransactionRowLoading from "./TransactionRowLoading";

import { darkGray, white, green700 } from "../../../utils/colors";

import { Transaction } from "../../../types";

const shouldDisplayDate = (transactions: Transaction[], index: number) => {
  if (index === 0) {
    return true;
  } else {
    if (
      moment.unix(transactions[index].status.block_time).format("MMDDYYYY") !==
      moment.unix(transactions[index - 1].status.block_time).format("MMDDYYYY")
    ) {
      return true;
    }
  }
  return false;
};

interface Props {
  transactions: Transaction[];
  loading: boolean;
  flat: boolean;
  openRescanModal?: () => void;
  maxItems?: number;
}

const RecentTransactions = ({
  transactions,
  loading,
  flat = false,
  openRescanModal,
  maxItems = Infinity,
}: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };
  return (
    <RecentTransactionsWrapper>
      <Modal isOpen={modalIsOpen} onRequestClose={() => closeModal()}>
        {modalContent as React.ReactChild}
      </Modal>
      {(loading || transactions.length > 0) && (
        <RecentTransactionsHeader>Recent Activity</RecentTransactionsHeader>
      )}
      {loading && <TransactionRowLoading flat={flat} />}
      <TransactionsWrapper>
        {!loading &&
          transactions.map((transaction, index) => {
            // eslint-disable-line
            if (index < maxItems) {
              return (
                <TransactionRowWrapper key={index}>
                  {shouldDisplayDate(transactions, index) && (
                    <DateWrapper>
                      {transaction.status.confirmed
                        ? moment
                            .unix(transaction.status.block_time)
                            .format("MMMM DD, YYYY")
                        : "Waiting for confirmation..."}
                    </DateWrapper>
                  )}
                  <TransactionRow
                    onClick={() =>
                      openInModal(<TxDetailsModal transaction={transaction} />)
                    }
                    transaction={transaction}
                    flat={flat}
                  />
                </TransactionRowWrapper>
              );
            }
          })}
        {!loading && transactions.length === 0 && (
          <NoTransasctionsSection flat={flat}>
            <NoTransactionsHeader>No Transactions</NoTransactionsHeader>
            <DeadFlower src={require("../../../assets/dead-flower.svg")} />
            <NoTransactionsSubtext>
              No activity has been detected on this account yet.
            </NoTransactionsSubtext>

            {openRescanModal && (
              <RescanButton
                background={green700}
                color={white}
                onClick={() => openRescanModal()}
              >
                Scan for Transactions
              </RescanButton>
            )}
          </NoTransasctionsSection>
        )}
      </TransactionsWrapper>
    </RecentTransactionsWrapper>
  );
};

const RecentTransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TransactionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TransactionRowWrapper = styled.div``;

const DateWrapper = styled.div`
  margin: 1.5em 0 1em;
  color: ${darkGray};
`;

const RecentTransactionsHeader = styled.div`
  font-size: 1.5em;
  margin-top: 1.5em;
`;

const NoTransasctionsSection = styled.div<{ flat: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  background: ${(p) => (p.flat ? "transparent" : white)};
  box-shadow: ${(p) =>
    p.flat
      ? "none"
      : "0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);"};
  border-radius: 0.385em;
`;

const NoTransactionsHeader = styled.h3`
  color: ${darkGray};
`;
const NoTransactionsSubtext = styled.h4`
  color: ${darkGray};
`;

const DeadFlower = styled.img`
  width: 6.25em;
  color: ${darkGray};
`;

const RescanButton = styled.button`
  ${Button}
  margin-top: 0.75em;
`;

export default RecentTransactions;
