import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { decode } from 'bolt11';

import { Countdown, Unit } from 'src/components';

import { black, white, red500, yellow600 } from 'src/utils/colors';

import { SetStateNumber } from 'src/types';
import { PlatformContext } from 'src/context';

interface Props {
  paymentRequest: string;
  setStep: SetStateNumber;
}

const LightningReceiveQr = ({ paymentRequest, setStep }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [invoiceExpired, setInvoiceExpired] = useState(false);

  const decoded = decode(paymentRequest);
  const description = decoded.tags.filter((item) => item.tagName === 'description')[0]?.data;
  const paymentHash = decoded.tags.filter((item) => item.tagName === 'payment_hash')[0]
    ?.data as string;

  useEffect(() => {
    const interval = setInterval(async () => {
      const { state } = await platform.getLightningInvoice({ paymentHash });
      // TODO: factor in other states
      if (state === 1) {
        // SETTLED
        setStep(2);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AccountReceiveContentLeft className='bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700'>
      <HeaderContainer className='text-gray-900 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700'>
        Invoice summary
      </HeaderContainer>
      <QRCodeWrapper>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 250 }}
          value={paymentRequest!}
        />
      </QRCodeWrapper>

      <TxReviewWrapper className='text-gray-900 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700'>
        <TxItem>
          <div className='text-gray-900 dark:text-gray-200'>Memo</div>
          <div className='text-gray-900 dark:text-gray-200 font-semibold'>{description}</div>
        </TxItem>

        <TxItem>
          <div className='text-gray-900 dark:text-gray-200'>Amount</div>
          <div className='text-gray-900 dark:text-gray-200 font-semibold'>
            <Unit value={Number(decoded.satoshis)} />
          </div>
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
      <div className='flex w-full justify-end mt-6 flex-col flex-col-reverse md:flex-row'>
        <button
          type='button'
          className='justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => setStep(0)}
        >
          Generate New Invoice
        </button>
        <CopyToClipboard text={paymentRequest!}>
          <button
            type='button'
            className='justify-center mb-2 md:mb-0 ml-0 sm:ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
          >
            Copy Invoice
          </button>
        </CopyToClipboard>
      </div>
    </AccountReceiveContentLeft>
  );
};

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
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

const HeaderContainer = styled.div`
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
