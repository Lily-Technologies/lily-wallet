import React, { useState } from "react";
import styled from "styled-components";
import { decode } from 'bolt11'

import {
    Button,
    Input,
} from "src/components";

import { white, gray400, red500, green600 } from "src/utils/colors";

import { LilyLightningAccount, SetStateNumber, SetStateString } from "src/types";

interface Props {
    currentAccount: LilyLightningAccount;
    setStep: SetStateNumber;
    setPaymentRequest: SetStateString;
    paymentRequest: string;
}

const SendTxForm = ({
    currentAccount,
    setStep,
    setPaymentRequest,
    paymentRequest
}: Props) => {
    const [invoiceError, setInvoiceError] = useState("")

    const sendPayment = () => {
        try {
            const decoded = decode(paymentRequest);
            setStep(1)
        } catch (e) {
            setInvoiceError('Invalid invoice')
        }
    }

    return (
        <SentTxFormContainer data-cy="send-form">
            <InputContainer>
                <Input
                    label="Lightning invoice"
                    type="text"
                    onChange={setPaymentRequest}
                    value={paymentRequest}
                    placeholder={"lnbc100u1ps5husypp5mdzvgu0fne7natugpkccmjyt60xpqvek0axm39d4fyu25"}
                    error={invoiceError}
                    largeText={true}
                    id="bitcoin-receipt"
                    style={{ textAlign: "right" }}
                />
            </InputContainer>
            <SendButtonContainer>
                <CopyAddressButton
                    background={green600}
                    color={white}
                    onClick={() =>
                        sendPayment()
                    }
                >
                    Preview transaction
                </CopyAddressButton>
                {invoiceError && (
                    <ErrorText style={{ paddingTop: "1em" }}>
                        {invoiceError}
                    </ErrorText>
                )}
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

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

export default SendTxForm;
