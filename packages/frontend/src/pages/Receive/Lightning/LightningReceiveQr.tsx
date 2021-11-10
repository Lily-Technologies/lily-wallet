import React, { useState } from 'react';
import styled from 'styled-components';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { decode } from 'bolt11';

import { Button, Countdown } from 'src/components';

import { black, white, gray400, green600, gray600, red500, yellow600 } from 'src/utils/colors';

import { SetStateNumber } from 'src/types';

interface Props {
  paymentRequest: string;
  setStep: SetStateNumber;
}

const LightningReceiveQr = ({ paymentRequest, setStep }: Props) => {
  const [invoiceExpired, setInvoiceExpired] = useState(false);

  const decoded = decode(paymentRequest);
  const description = decoded.tags.filter((item) => item.tagName === 'description')[0]?.data;

  // TODO: screen shows success on payment receive

  return (
    <AccountReceiveContentLeft>
      <HeaderContainer>Invoice summary</HeaderContainer>
      <QRCodeWrapper>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 250 }}
          value={paymentRequest!}
        />
      </QRCodeWrapper>

      <TxReviewWrapper>
        <TxItem>
          <TxItemLabel>Memo</TxItemLabel>
          <TxItemValue>{description}</TxItemValue>
        </TxItem>

        <TxItem>
          <TxItemLabel>Amount</TxItemLabel>
          <TxItemValue>{decoded.satoshis} sats</TxItemValue>
        </TxItem>

        {!!!invoiceExpired && (
          <ExpirationContainer>
            Expires in{' '}
            <Countdown
              onExpire={() => setInvoiceExpired(true)}
              endTimeSeconds={decoded.timeExpireDate!}
              style={{ marginLeft: '0.25rem' }}
            />
          </ExpirationContainer>
        )}
        {invoiceExpired && <ErrorContainer>This invoice has expired</ErrorContainer>}
      </TxReviewWrapper>

      <ReceiveButtonContainer>
        <CopyToClipboard text={paymentRequest!}>
          <CopyAddressButton color={white} background={green600}>
            Copy Invoice
          </CopyAddressButton>
        </CopyToClipboard>
        <NewAddressButton background='transparent' color={gray600} onClick={() => setStep(0)}>
          Generate New Invoice
        </NewAddressButton>
      </ReceiveButtonContainer>
    </AccountReceiveContentLeft>
  );
};

const ReceiveButtonContainer = styled.div`
  margin: 24px;
`;

const CopyAddressButton = styled.div`
  ${Button};
  font-weight: 500;
`;

const NewAddressButton = styled.div`
  ${Button};
`;

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
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
  border-bottom: 1px solid rgb(229, 231, 235);
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

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${red500};
  margin-top: 24px;
`;

const ExpirationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${yellow600};
  margin-top: 24px;
`;

export default LightningReceiveQr;
