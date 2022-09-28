import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { decode } from 'bolt11';
import { ClipboardCheckIcon, DuplicateIcon } from '@heroicons/react/outline';
import { ChannelBalanceResponse } from '@lily-technologies/lnrpc';

import { Countdown, Unit } from 'src/components';

import { black, white, red500, yellow600 } from 'src/utils/colors';

import { SetStateNumber } from 'src/types';
import { AccountMapContext, PlatformContext, UnitContext } from 'src/context';

interface Props {
  paymentRequest: string;
  setStep: SetStateNumber;
}

const LightningReceiveQr = ({ paymentRequest, setStep }: Props) => {
  const { platform } = useContext(PlatformContext);
  const { currentAccount } = useContext(AccountMapContext);
  const { getValue } = useContext(UnitContext);
  const [invoiceExpired, setInvoiceExpired] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <AccountReceiveContentLeft className='bg-white dark:bg-gray-800 border border-gray-900/20 dark:border-gray-500/20'>
      <div className='flex flex-col py-4 px-6 text-gray-900 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700'>
        <div className='divide-y divide-slate-800/10 dark:divide-slate-200/10'>
          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Receive to</div>
            <div className='text-gray-900 dark:text-gray-200 font-semibold'>
              {currentAccount.name} (
              <Unit
                value={(currentAccount.currentBalance as ChannelBalanceResponse).localBalance!.sat}
              />{' '}
              )
            </div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Memo</div>
            <div className='text-gray-900 dark:text-gray-200 font-semibold'>{description}</div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Amount</div>
            <div className='text-gray-900 dark:text-gray-200 font-semibold'>
              <Unit value={decoded.satoshis!} />
            </div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Status</div>
            <div className='text-gray-900 dark:text-gray-200 font-semibold flex flex-col text-right'>
              {invoiceExpired ? 'Expired' : 'Waiting for payment'}
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                (Invoice expires in
                <Countdown
                  onExpire={() => setInvoiceExpired(true)}
                  endTimeSeconds={decoded.timeExpireDate!}
                  style={{ marginLeft: '0.25rem' }}
                />
                )
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-col bg-gray-50 dark:bg-gray-700 px-3 py-4 border border-gray-900/10 dark:border-gray-900 rounded-md items-center'>
          <QRCode
            bgColor={white}
            fgColor={black}
            level='Q'
            style={{ width: 250 }}
            value={paymentRequest!}
          />
        </div>
      </div>
      <div className='flex w-full justify-end py-4 px-5 flex-col-reverse md:flex-row'>
        <button
          type='button'
          className='justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => setStep(0)}
        >
          Generate new invoice
        </button>
        <CopyToClipboard text={paymentRequest!} onCopy={() => onCopy()}>
          <button
            type='button'
            className='justify-center mb-2 md:mb-0 ml-0 sm:ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
          >
            Copy invoice
            {copied ? (
              <ClipboardCheckIcon className='ml-1.5 h-4 w-4' />
            ) : (
              <DuplicateIcon className='ml-1.5 h-4 w-4' />
            )}
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
