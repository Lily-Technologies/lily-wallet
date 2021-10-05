import React, { useState } from "react";
import styled from "styled-components";
import { decode } from "bolt11";
import moment from "moment";

import { Button, Countdown, Modal } from "src/components";

import {
    white,
    gray400,
    green600,
    gray600,
    gray800,
    red500,
    gray300,
    yellow600,
} from "src/utils/colors";

import PaymentSuccess from "./PaymentSuccess";

import { LilyLightningAccount, SetStateNumber } from "src/types";
// import { Payment, PaymentFailureReason, PaymentStatus } from "@radar/lnrpc";

interface Props {
    paymentRequest: string;
    setStep: SetStateNumber;
    currentAccount: LilyLightningAccount;
}

const LightningPaymentConfirm = ({
    paymentRequest,
    setStep,
    currentAccount,
}: Props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
    const [paymentError, setPaymentError] = useState("");
    const [invoiceExpired, setInvoiceExpired] = useState(false);

    const openInModal = (component: JSX.Element) => {
        setModalIsOpen(true);
        setModalContent(component);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent(null);
    };

    const decoded = decode(paymentRequest);
    const description = decoded.tags.filter(
        (item) => item.tagName === "description"
    )[0].data;

    const sendPayment = () => {
        window.ipcRenderer.send("/lightning-send-payment", {
            paymentRequest: paymentRequest,
            config: currentAccount.config,
        });

        window.ipcRenderer.on(
            "/lightning-send-payment",
            async (_event: any, ...args: any) => {
                const response = args[0];
                try {
                    if (response.status === 2) {
                        openInModal(
                            <PaymentSuccess
                                currentAccount={currentAccount}
                                payment={response}
                            />
                        );
                    }

                    if (response.status === 3) {
                        if (response.failureReason === 2) {
                            setPaymentError("No route to user");
                        } else if (response.failureReason === 5) {
                            setPaymentError("Not enough balance");
                        } else {
                            setPaymentError("Unkown error making payment. Contact support.");
                        }
                    }
                } catch (e) {
                    console.log("/lightning-send-payment e: ", e);
                }
            }
        );
    };

    return (
        <AccountReceiveContentLeft>
            <HeaderContainer>Payment summary</HeaderContainer>
            <TxReviewWrapper>
                <TxItem style={{ marginTop: 0 }}>
                    <TxItemLabel>Description</TxItemLabel>
                    <TxItemValue>{description}</TxItemValue>
                </TxItem>

                <TxItem>
                    <TxItemLabel>Amount</TxItemLabel>
                    <TxItemValue>{decoded.satoshis} sats</TxItemValue>
                </TxItem>

                {/* TODO: implement this logic */}
                <TxItem>
                    <TxItemLabel>Estimated fee</TxItemLabel>
                    <TxItemValue>50 sats</TxItemValue>
                </TxItem>
            </TxReviewWrapper>
            <TxReviewWrapper
                style={{
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgb(229, 231, 235)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                }}
            >
                <TxItem style={{ marginTop: 0 }}>
                    <TxItemLabel>Total</TxItemLabel>
                    <TxItemValue>{decoded.satoshis} sats</TxItemValue>
                </TxItem>
            </TxReviewWrapper>

            {!!!invoiceExpired && (
                <ExpirationContainer>
                    Expires in{" "}
                    <Countdown
                        onExpire={() => setInvoiceExpired(true)}
                        endTimeSeconds={decoded.timeExpireDate!}
                        style={{ marginLeft: "0.25rem" }}
                    />
                </ExpirationContainer>
            )}
            {invoiceExpired && (
                <ErrorContainer>
                    This invoice has expired
                </ErrorContainer>
            )}
            {paymentError && !invoiceExpired && (
                <ErrorContainer style={{
                    marginTop: '0.5em',
                    fontWeight: 500
                }}>
                    Error: {paymentError}
                </ErrorContainer>
            )}
            <ActionButtonContainer>
                <CancelPaymentButton
                    background={!!invoiceExpired ? green600 : white}
                    color={!!invoiceExpired ? white : gray600}
                    onClick={() => setStep(0)}
                >
                    {invoiceExpired ? 'Go back' : 'Cancel'}
                </CancelPaymentButton>
                {!!!invoiceExpired && (
                    <SendPaymentButton
                        color={white}
                        background={green600}
                        disabled={!!invoiceExpired}
                        onClick={() => sendPayment()}
                    >
                        {paymentError ? "Try again" : "Send payment"}
                    </SendPaymentButton>
                )}
            </ActionButtonContainer>

            <Modal
                isOpen={modalIsOpen}
                closeModal={() => setModalIsOpen(false)}
                style={{ content: { overflow: "inherit" } }}
            >
                {modalContent}
            </Modal>
        </AccountReceiveContentLeft>
    );
};

const ActionButtonContainer = styled.div`
  padding: 1.5rem 1rem;
  display: flex;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${red500};
`;

const ExpirationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${yellow600};
`;

const SendPaymentButton = styled.button`
  ${Button};
  font-weight: 500;
  width: 100%;
  margin-left: 1em;
`;

const CancelPaymentButton = styled.div`
  ${Button};
  width: 100%;
  border: 1px solid ${gray300};
`;

const AccountReceiveContentLeft = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  border-radius: 0.385em;
  justify-content: center;
  width: 100%;
`;

const TxReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const TxItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const TxItemLabel = styled.div``;

const TxItemValue = styled.div``;

const HeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.5em;
  height: 90px;
`;

export default LightningPaymentConfirm;
