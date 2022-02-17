import { useContext, useState } from 'react';
import { QrcodeIcon } from '@heroicons/react/outline';
import { decode } from 'bolt11';

import { Button, Textarea, Modal, Select } from 'src/components';

import { AccountMapContext } from 'src/context';

import { SetStateNumber, SetStateString } from 'src/types';

import ScanLightningQrCode from './ScanLightningQrCode';

interface Props {
  setStep: SetStateNumber;
  setPaymentRequest: SetStateString;
  paymentRequest: string;
}

const LightningSendTxForm = ({ setStep, setPaymentRequest, paymentRequest }: Props) => {
  const { setCurrentAccountId, accountMap, currentAccount } = useContext(AccountMapContext);
  const [invoiceError, setInvoiceError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const sendPayment = (payReq: string) => {
    try {
      decode(payReq); // if this fails, goes to catch case
      setStep(1);
    } catch (e) {
      setInvoiceError('Invalid invoice');
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-md shadow'>
      <div className='py-6 px-4 sm:p-6 ' data-cy='send-form'>
        <div className='grid grid-cols-4 gap-6'>
          <div className='col-span-4 sm:col-span-2'>
            <Select
              label='From account'
              initialSelection={{
                label: currentAccount.config.name,
                onClick: () => setCurrentAccountId(currentAccount.config.id)
              }}
              options={Object.values(accountMap).map((item) => {
                return {
                  label: item.name,
                  onClick: () => setCurrentAccountId(item.config.id)
                };
              })}
            />
          </div>
          <div className='col-span-4'>
            <Textarea
              label='Lightning invoice'
              onChange={(value) => {
                setInvoiceError('');
                setPaymentRequest(value);
              }}
              value={paymentRequest}
              placeholder={
                'lnbc55u1ps4x37npp5q4t0n6xdgdwlz75dfpfwgwv8ay5vfperylf8rlsrmunhc60egjhpuqdqhf4hhymnfdenjqcm0venx2egcqzpgxqy3tsgp58ax9jguu37tam7y7p8erstlmhewu7zcezhrgtxat22p2cjt4wenq9qyyssqmed02tersfdaft846nsnsudwjd8h08f0ulf73zudkfryt5uvnqqx9d5zvejjevhp52dwdhn4fkpt9aessjlpqd8u8lqleann52d9chcr67cpzsujl9'
              }
              error={invoiceError}
              id='lightning-invoice'
              rows={8}
              onPaste={(payReq) => {
                setPaymentRequest(payReq);
                sendPayment(payReq);
              }}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-end items-center text-right py-3 px-4 mt-2 border dark:border-gray-900 bg-gray-50 dark:bg-gray-700 rounded-bl-md rounded-br-md'>
        {/* TODO: Remove button since react-qr-scanner won't work on unsecure connections. */}
        <button
          className='inline-flex bg-white mr-3 py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-sky-500'
          onClick={() =>
            openInModal(
              <ScanLightningQrCode
                onSuccess={(data) => {
                  setPaymentRequest(data);
                  sendPayment(data);
                  closeModal();
                }}
              />
            )
          }
        >
          <QrcodeIcon className='sm:-ml-1 mr-0 sm:mr-2 h-5 w-5' aria-hidden='true' />
          <span className='hidden sm:inline-flex'>Scan invoice</span>
        </button>
        <button
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => sendPayment(paymentRequest)}
        >
          Preview transaction
        </button>
      </div>
      <Modal isOpen={modalIsOpen} closeModal={() => closeModal()}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default LightningSendTxForm;
