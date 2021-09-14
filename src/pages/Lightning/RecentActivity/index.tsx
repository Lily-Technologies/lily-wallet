import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Modal } from "src/components";

import PaymentRow from "./PaymentRow";
import PaymentRowLoading from "./PaymentRowLoading";

import { gray600, gray800, white } from "src/utils/colors";

import { LightningEvent } from "src/types";

const shouldDisplayDate = (payments: LightningEvent[], index: number) => {
  const currentItemDate = moment
    .unix(payments[index]?.creation_date)
    .format("MMDDYYYY");
  const prevItemDate = moment
    .unix(payments[index - 1]?.creation_date)
    .format("MMDDYYYY");

  if (index === 0) {
    return true;
  } else {
    if (currentItemDate !== prevItemDate) {
      return true;
    }
  }
  return false;
};

interface Props {
  events: LightningEvent[];
  loading: boolean;
  flat: boolean;
  maxItems?: number;
}

const RecentTransactions = ({
  events,
  loading,
  flat = false,
  maxItems = Infinity,
}: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  return (
    <RecentTransactionsWrapper>
      {(loading || events.length > 0) && (
        <RecentTransactionsHeader>Recent Activity</RecentTransactionsHeader>
      )}
      {loading && <PaymentRowLoading flat={flat} />}
      <PaymentsWrapper>
        {!loading &&
          events &&
          events.map(({ type, ...transaction }, index) => (
            <PaymentRowWrapper key={index}>
              {shouldDisplayDate(events, index) && (
                <DateWrapper>
                  {transaction.creation_date
                    ? moment
                        .unix(transaction.creation_date)
                        .format("MMMM DD, YYYY")
                    : "Waiting for confirmation..."}
                </DateWrapper>
              )}
              <PaymentRow
                creation_date={transaction.creation_date}
                title={transaction.title}
                value_sat={transaction.value_sat}
                type={type}
                onClick={
                  () => console.log("foo")
                  // openInModal(
                  //   <PaymentDetailsModal
                  //   // payment={transaction as LightningPayment}
                  //   />
                  // )
                }
              />
            </PaymentRowWrapper>
          ))}
        {!loading && events.length === 0 && (
          <NoPaymentsSection flat={flat}>
            <NoPaymentsHeader>No activity</NoPaymentsHeader>
            <DeadFlower src={require("src/assets/dead-flower.svg")} />
            <NoPaymentsSubtext>
              No activity has been detected on this account yet.
            </NoPaymentsSubtext>
          </NoPaymentsSection>
        )}
      </PaymentsWrapper>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </RecentTransactionsWrapper>
  );
};

const RecentTransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PaymentsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PaymentRowWrapper = styled.div``;

const DateWrapper = styled.div`
  margin: 1.5em 0 1em;
  color: ${gray800};
`;

const RecentTransactionsHeader = styled.h2`
  font-size: 1.5em;
  margin-top: 1.75em;
  margin-bottom: 0;
  font-weight: 500;
`;

const NoPaymentsSection = styled.div<{ flat: boolean }>`
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

const NoPaymentsHeader = styled.h3`
  color: ${gray600};
`;
const NoPaymentsSubtext = styled.h4`
  color: ${gray600};
`;

const DeadFlower = styled.img`
  width: 6.25em;
  color: ${gray800};
`;

export default RecentTransactions;
