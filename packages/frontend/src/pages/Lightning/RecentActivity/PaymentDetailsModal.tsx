import React from 'react';
import styled from 'styled-components';
import { Payment } from '@lily-technologies/lnrpc';

import { Button } from 'src/components';

import PaymentTypeIcon from './PaymentTypeIcon';

import { white, green600, gray700, gray800 } from 'src/utils/colors';

interface Props {
  payment: Payment;
}

const getPaymentType = (transaction: Payment) => {
  if (Number(transaction.valueSat) > 0) {
    return 'PAYMENT_RECEIVE';
  } else if (Number(transaction.valueSat) < 0) {
    return 'PAYMENT_SEND';
  } else {
    return 'CHANNEL_OPEN';
  }
};

const PaymentDetailsModal = ({ payment }: Props) => {
  return (
    <Wrapper>
      <HeaderWrapper>
        <PaymentTypeIcon type={getPaymentType(payment)} />
        <HeaderInfo>
          <Header>Payment Details</Header>
          <PaymentId>{payment.paymentHash}</PaymentId>
        </HeaderInfo>
      </HeaderWrapper>

      {/* <OverflowSection>
        <MoreDetailsSection style={{ marginTop: 0 }}>
          <MoreDetailsHeader>Inputs</MoreDetailsHeader>
          <TxOutputSection>
            {transaction.vin.map((input) => {
              return (
                <OutputItem>
                  <OutputAddress>{`${input.prevout.scriptpubkey_address}:${input.vout}`}</OutputAddress>
                  <OutputAmount>
                    {satoshisToBitcoins(input.prevout.value).toNumber()} BTC
                  </OutputAmount>
                </OutputItem>
              );
            })}
          </TxOutputSection>
        </MoreDetailsSection>
        <MoreDetailsSection>
          <MoreDetailsHeader>Outputs</MoreDetailsHeader>
          <TxOutputSection>
            {transaction.vout.map((output) => {
              return (
                <OutputItem>
                  <OutputAddress>{output.scriptpubkey_address}</OutputAddress>
                  <OutputAmount>
                    {satoshisToBitcoins(output.value).toNumber()} BTC
                  </OutputAmount>
                </OutputItem>
              );
            })}
          </TxOutputSection>
        </MoreDetailsSection>
      </OverflowSection> */}
      <MoreDetailsSection>
        <MoreDetailsHeader>Status</MoreDetailsHeader>
        <StatusItem>Date: {payment.creationTimeNs}</StatusItem>
      </MoreDetailsSection>
      <Buttons>
        <ViewExplorerButton
          background={green600}
          color={white}
          onClick={
            () => {}
            // window.open(
            //   `https://blockstream.info/tx/${payment.tx_hash}`,
            //   "_blank",
            //   "nodeIntegration=no"
            // )
          }
        >
          Copy Preimage
        </ViewExplorerButton>
      </Buttons>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5em;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5em;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.25em;
`;

const Header = styled.h1`
  color: ${gray800};
  margin: 0;
  font-weight: 500;
`;

const PaymentId = styled.h5`
  color: ${gray700};
  margin: 0;
  font-weight: 500;
  margin-top: 0.25em;
`;

const ViewExplorerButton = styled.button`
  ${Button};
`;

const MoreDetailsSection = styled.div`
  margin-top: 1.5em;
`;

const MoreDetailsHeader = styled.div`
  color: ${gray800};
  font-size: 1.5em;
`;

const StatusItem = styled.h4`
  color: ${gray700};
  margin: 0;
  font-weight: 500;
  margin-top: 0.5em;
  margin-left: 0.5em;
`;

const Buttons = styled.div`
  margin-top: 0.5em;
  display: flex;
  justify-content: flex-end;
`;

export default PaymentDetailsModal;
