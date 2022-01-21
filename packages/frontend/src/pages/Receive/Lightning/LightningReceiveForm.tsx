import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { Button, Input, Spinner } from 'src/components';

import { white, gray400, green600 } from 'src/utils/colors';

import { LilyLightningAccount } from '@lily/types';
import { SetStateNumber, SetStateString } from 'src/types';
import { requireLightning } from 'src/hocs';

import { PlatformContext } from 'src/context';

interface Props {
  setStep: SetStateNumber;
  setInvoice: SetStateString;
  currentAccount: LilyLightningAccount;
}

const LightningReceiveForm = ({ setStep, setInvoice, currentAccount }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [memo, setMemo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendAmountError, setSendAmountError] = useState('');
  const [memoError, setMemoError] = useState('');
  const { config } = currentAccount;

  const validateForm = (_recipientAddress: string, _sendAmount: string): boolean => {
    let valid = true;
    if (memo.length > 50) {
      valid = false;
      setMemoError('Memo too long');
    }
    return valid;
  };

  const submitForm = async (_recipientAddress: string, _sendAmount: string) => {
    const valid = validateForm(_recipientAddress, _sendAmount);
    if (valid) {
      try {
        setIsLoading(true);
        const { paymentRequest } = await platform.generateLightningInvoice({
          memo: memo,
          value: sendAmount,
          lndConnectUri: config.connectionDetails.lndConnectUri
        });

        setInvoice(paymentRequest);
        setStep(1);
      } catch (e) {
        setSendAmountError('Unable to create invoice');
        setIsLoading(false);
      }
    }
  };

  return (
    <SentTxFormContainer data-cy='send-form'>
      <InputContainer>
        <Input
          label='Invoice memo'
          type='text'
          onChange={setMemo}
          value={memo}
          placeholder={'Morning coffee'}
          error={memoError}
          largeText={true}
          id='lightning-memo'
          style={{ textAlign: 'right' }}
        />
      </InputContainer>
      <InputContainer>
        <Input
          label='Invoice amount'
          type='text'
          value={sendAmount}
          onChange={setSendAmount}
          placeholder='25000'
          error={sendAmountError}
          inputStaticText='sats'
          largeText={true}
          id='lightning-amount'
        />
      </InputContainer>
      <SendButtonContainer>
        <CopyAddressButton
          background={green600}
          color={white}
          disabled={isLoading}
          onClick={() => submitForm(memo, sendAmount)}
        >
          {isLoading ? (
            <>
              <Spinner /> <ButtonText>Generating invoice</ButtonText>
            </>
          ) : (
            'Generate invoice'
          )}
        </CopyAddressButton>
      </SendButtonContainer>
    </SentTxFormContainer>
  );
};

const SentTxFormContainer = styled.div`
  min-height: 400px;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  border-radius: 0.385em;
  justify-content: center;
  width: 100%;
  position: relative;
`;

const SendButtonContainer = styled.div`
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
`;

const CopyAddressButton = styled.button`
  ${Button};
  flex: 1;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
`;

const ButtonText = styled.span`
  margin-left: 0.75rem;
`;

export default requireLightning(LightningReceiveForm);
