import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { decode } from 'bolt11';
import type { Payment, ChannelBalanceResponse } from '@lily-technologies/lnrpc';

import { Button, Countdown, Modal, Unit } from 'src/components';

import { white, green600, gray600, red500, gray300, yellow600 } from 'src/utils/colors';

import PaymentSuccess from './PaymentSuccess';

import { LilyLightningAccount } from '@lily/types';
import { SetStateNumber } from 'src/types';
import { classNames } from 'src/utils/other';

import { PlatformContext, UnitContext } from 'src/context';

interface Props {
  paymentRequest: string;
  setStep: SetStateNumber;
  currentAccount: LilyLightningAccount;
}

const LightningPaymentConfirm = ({ paymentRequest, setStep, currentAccount }: Props) => {
  const [sendPaymentIsLoading, setSendPaymentIsLoading] = useState(false);
  const [estimateFeeLoading, setEstimateFeeLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const [invoiceExpired, setInvoiceExpired] = useState(false);
  const { platform } = useContext(PlatformContext);
  const { getValue } = useContext(UnitContext);
  const [estimatedFee, setEstimatedFee] = useState(0);

  const decoded = decode(paymentRequest);
  const description = decoded.tags.filter((item) => item.tagName === 'description')[0].data;

  useEffect(() => {
    const getFee = async () => {
      setEstimateFeeLoading(true);
      try {
        const { routes } = await platform.getRoutes({
          pubKey: decoded.payeeNodeKey!,
          amt: decoded.satoshis?.toString()
        });

        setEstimatedFee(Math.floor(Number(routes[0].totalAmt) - decoded.satoshis!));
      } catch (e) {
        console.log('e: ', e);
      }
      setEstimateFeeLoading(false);
    };
    getFee();
  }, []);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const sendPayment = () => {
    setSendPaymentIsLoading(true);
    setPaymentError('');
    platform.sendLightningPayment(paymentRequest, currentAccount.config, (response: Payment) => {
      try {
        if (response.status === 2) {
          // PaymentStatus.SUCCEEDED
          openInModal(<PaymentSuccess payment={response} />);
          setSendPaymentIsLoading(false);
        }

        if (response.status === 3) {
          // PaymentStatus.FAILED
          if (response.failureReason === 2) {
            // PaymentFailureReason.FAILURE_REASON_NO_ROUTE
            setPaymentError('No route to user');
            setSendPaymentIsLoading(false);
          } else if (
            response.failureReason === 5 // PaymentFailureReason.FAILURE_REASON_INSUFFICIENT_BALANCE
          ) {
            setPaymentError('Not enough balance');
            setSendPaymentIsLoading(false);
          } else {
            setPaymentError('Unknown error making payment. Contact support.');
            setSendPaymentIsLoading(false);
          }
        }
      } catch (e) {
        console.log('/lightning-send-payment e: ', e);
        setSendPaymentIsLoading(false);
      }
    });
  };

  return (
    <div className='bg-white rounded-md shadow dark:bg-gray-800 border border-gray-900/20 dark:border-gray-500/20'>
      <div className='pt-4 px-6'>
        <div className='divide-y divide-slate-800/10 dark:divide-slate-200/10'>
          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Send from</div>
            <div className='text-gray-900 dark:text-gray-200 font-medium'>
              {currentAccount.name} (
              <Unit
                value={(currentAccount.currentBalance as ChannelBalanceResponse).localBalance!.sat}
              />{' '}
              )
            </div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Memo</div>
            <div className='text-gray-900 dark:text-gray-200 font-medium'>{description}</div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Amount</div>
            <div className='text-gray-900 dark:text-gray-200 font-medium'>
              <Unit value={decoded.satoshis!} />
            </div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Estimated fee</div>
            <div className='text-gray-900 dark:text-gray-200 font-medium'>
              {estimateFeeLoading ? 'Calculating...' : <Unit value={estimatedFee} />}
            </div>
          </div>
        </div>
      </div>
      <div className='border-t border-slate-800/10 dark:border-slate-200/10'>
        <div className='px-6'>
          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Total</div>
            <div className='text-gray-900 dark:text-gray-200 font-medium'>
              {getValue(decoded.satoshis! + estimatedFee)}
            </div>
          </div>

          <div className='flex flex-wrap justify-between py-4'>
            <div className='text-gray-900 dark:text-gray-200'>Status</div>
            <div
              className={classNames(
                invoiceExpired ? 'text-red-500' : 'text-gray-900 dark:text-gray-200',
                'font-medium flex flex-col text-right'
              )}
            >
              {invoiceExpired ? 'Expired' : 'Waiting for payment'}
              {!invoiceExpired ? (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  (Expires in
                  <Countdown
                    onExpire={() => setInvoiceExpired(true)}
                    endTimeSeconds={decoded.timeExpireDate!}
                    style={{ marginLeft: '0.25rem' }}
                  />
                  )
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {paymentError && !invoiceExpired && (
        <ErrorContainer
          style={{
            marginTop: '0.5em',
            fontWeight: 500
          }}
        >
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
            disabled={!!invoiceExpired || sendPaymentIsLoading}
            onClick={() => sendPayment()}
          >
            {paymentError ? 'Try again' : sendPaymentIsLoading ? 'Sending...' : 'Send payment'}
          </SendPaymentButton>
        )}
      </ActionButtonContainer>

      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </div>
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
