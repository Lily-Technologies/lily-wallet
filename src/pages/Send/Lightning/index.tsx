import React, { useState } from "react";
import styled, { css } from "styled-components";
import { satoshisToBitcoins } from "unchained-bitcoin";

import { GridArea } from "src/components";

import LightningSendTxForm from "./LightningSendTxForm";
import LightningPaymentConfirm from "./LightningPaymentConfirm";

import { requireLightning } from "src/hocs";

import {
  white,
  gray400,
  gray500,
  gray600,
} from "src/utils/colors";

import { mobile } from "src/utils/media";

import {
  LilyLightningAccount,
} from "src/types";

interface Props {
  currentAccount: LilyLightningAccount;
}

const SendLightning = ({
  currentAccount,
}: Props) => {
  document.title = `Send - Lily Wallet`;
  const [step, setStep] = useState(0);
  const [paymentRequest, setPaymentRequest] = useState("");
  const { currentBalance } = currentAccount;


  return (
    <GridArea>
      {step === 0 && (
        <LightningSendTxForm
          setStep={setStep}
          setPaymentRequest={setPaymentRequest}
          paymentRequest={paymentRequest}
        />
      )}

      {step === 1 && (
        <LightningPaymentConfirm
          setStep={setStep}
          paymentRequest={paymentRequest}
          currentAccount={currentAccount}
        />
      )}

      <SendContentRight>
        <CurrentBalanceWrapper>
          <CurrentBalanceText>Current Balance:</CurrentBalanceText>
          <CurrentBalanceValue>
            {satoshisToBitcoins(currentBalance.balance).toNumber()} BTC
          </CurrentBalanceValue>
        </CurrentBalanceWrapper>
      </SendContentRight>
    </GridArea>
  );
};

const SendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  width: 100%;

  ${mobile(css`
    order: -1;
    min-height: auto;
  `)};
`;

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: "flex";
  flex-direction: column;
  border-radius: 0.385em;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  background: ${white};
  text-align: right;
`;

const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${gray600};
`;

const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;

export const InputStaticText = styled.label<{
  text: string;
  disabled: boolean;
}>`
  position: relative;
  display: flex;
  flex: 0 0;
  justify-self: center;
  align-self: center;
  margin-left: -87px;
  z-index: 1;
  margin-right: 40px;
  font-size: 1.5em;
  font-weight: 100;
  color: ${gray500};

  &::after {
    content: ${(p) => p.text};
    position: absolute;
    top: 4px;
    left: 94px;
    font-family: arial, helvetica, sans-serif;
    font-size: 0.75em;
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
`;

export default requireLightning(SendLightning);
