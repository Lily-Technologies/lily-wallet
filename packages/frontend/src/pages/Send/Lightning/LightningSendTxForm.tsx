import React, { useState } from 'react';
import styled from 'styled-components';
import { decode } from 'bolt11';

import { Button, Textarea, Modal } from 'src/components';

import { white, gray400, gray600, green600 } from 'src/utils/colors';

import { SetStateNumber, SetStateString } from 'src/types';

import ScanLightningQrCode from './ScanLightningQrCode';

interface Props {
  setStep: SetStateNumber;
  setPaymentRequest: SetStateString;
  paymentRequest: string;
}

const LightningSendTxForm = ({ setStep, setPaymentRequest, paymentRequest }: Props) => {
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
    <SentTxFormContainer data-cy='send-form'>
      <InputContainer>
        <Textarea
          label='Lightning invoice'
          onChange={setPaymentRequest}
          value={paymentRequest}
          placeholder={
            'lnbc55u1ps4x37npp5q4t0n6xdgdwlz75dfpfwgwv8ay5vfperylf8rlsrmunhc60egjhpuqdqhf4hhymnfdenjqcm0venx2egcqzpgxqy3tsgp58ax9jguu37tam7y7p8erstlmhewu7zcezhrgtxat22p2cjt4wenq9qyyssqmed02tersfdaft846nsnsudwjd8h08f0ulf73zudkfryt5uvnqqx9d5zvejjevhp52dwdhn4fkpt9aessjlpqd8u8lqleann52d9chcr67cpzsujl9'
          }
          error={invoiceError}
          id='lightning-invoice'
          largeText={true}
          rows={8}
          onPaste={(payReq) => {
            setPaymentRequest(payReq);
            sendPayment(payReq);
          }}
        />
      </InputContainer>
      <SendButtonContainer>
        <CopyAddressButton
          background={green600}
          color={white}
          onClick={() => sendPayment(paymentRequest)}
        >
          Preview transaction
        </CopyAddressButton>
        <ScanInvoiceFromQRButton
          background='transparent'
          color={gray600}
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
          Scan Invoice QR Code
        </ScanInvoiceFromQRButton>
      </SendButtonContainer>
      <Modal isOpen={modalIsOpen} closeModal={() => closeModal()}>
        {modalContent}
      </Modal>
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

const ScanInvoiceFromQRButton = styled.button`
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

export default LightningSendTxForm;
