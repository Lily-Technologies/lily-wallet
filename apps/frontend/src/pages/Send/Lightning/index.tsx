import React, { useState } from 'react';
import styled from 'styled-components';

import LightningSendTxForm from './LightningSendTxForm';
import LightningPaymentConfirm from './LightningPaymentConfirm';

import { gray500 } from 'src/utils/colors';

import { LilyLightningAccount } from '@lily/types';

interface Props {
  currentAccount: LilyLightningAccount;
}

const SendLightning = ({ currentAccount }: Props) => {
  const [step, setStep] = useState(0);
  const [paymentRequest, setPaymentRequest] = useState('');

  return (
    <>
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
    </>
  );
};

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

export default SendLightning;
