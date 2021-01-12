import React from "react";
import styled from "styled-components";

import { GrayLoadingAnimation } from "../../../components";

import { white, offWhite } from "../../../utils/colors";

interface Props {
  flat: boolean;
}

const TransactionRow = ({ flat }: Props) => {
  return (
    <TransactionsWrapper>
      <TransactionRowWrapper flat={flat}>
        <TransactionRowContainer flat={flat}>
          <GrayLoadingAnimation />
        </TransactionRowContainer>
      </TransactionRowWrapper>
      <TransactionRowWrapper flat={flat}>
        <TransactionRowContainer flat={flat}>
          <GrayLoadingAnimation />
        </TransactionRowContainer>
      </TransactionRowWrapper>
      <TransactionRowWrapper flat={flat}>
        <TransactionRowContainer flat={flat}>
          <GrayLoadingAnimation />
        </TransactionRowContainer>
      </TransactionRowWrapper>
      <TransactionRowWrapper flat={flat}>
        <TransactionRowContainer flat={flat}>
          <GrayLoadingAnimation />
        </TransactionRowContainer>
      </TransactionRowWrapper>
      <TransactionRowWrapper flat={flat}>
        <TransactionRowContainer flat={flat}>
          <GrayLoadingAnimation />
        </TransactionRowContainer>
      </TransactionRowWrapper>
    </TransactionsWrapper>
  );
};

const TransactionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 1em;
`;

const TransactionRowWrapper = styled.div<{ flat: boolean }>`
  border-bottom: 1px solid ${offWhite};
  background: ${(p) => (p.flat ? "transparent" : white)};
  box-shadow: ${(p) =>
    p.flat ? "none" : "rgba(43, 48, 64, 0.2) 0px 0.1rem 0.5rem 0px;"};
  align-items: center;
  flex-direction: column;
  margin-top: 1em;
`;

const TransactionRowContainer = styled.div<{ flat: boolean }>`
  display: flex;
  align-items: center;
  // padding: ${(p) => (p.flat ? ".75em" : "1.5em")};

  &:hover {
    background: ${(p) => !p.flat && offWhite};
    cursor: ${(p) => !p.flat && "pointer"};
  }
`;

export default TransactionRow;
