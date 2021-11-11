import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { networks, Network, Psbt } from 'bitcoinjs-lib';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { Button, Input, Dropdown, FileUploader, Modal, ErrorModal, Spinner } from 'src/components';

import PastePsbtModalContent from './PastePsbtModalContent';

import { bitcoinNetworkEqual } from 'src/utils/files';
import { white, gray400, red500, green600 } from 'src/utils/colors';
import { validateAddress, validateSendAmount, getPsbtFromText, getFee } from 'src/utils/send';

import { requireOnchain } from 'src/hocs';

import { File, LilyOnchainAccount } from '@lily/types';
import { SetStateNumber } from 'src/types';

interface Props {
  currentAccount: LilyOnchainAccount;
  setFinalPsbt: React.Dispatch<React.SetStateAction<Psbt | undefined>>;
  finalPsbt: Psbt | undefined;
  setStep: SetStateNumber;
  createTransactionAndSetState: (
    _recipientAddress: string,
    _sendAmount: string,
    _fee: number
  ) => Promise<Psbt>;
  currentBitcoinNetwork: Network;
}

const OnchainSendTxForm = ({
  currentAccount,
  setFinalPsbt,
  finalPsbt,
  setStep,
  createTransactionAndSetState,
  currentBitcoinNetwork
}: Props) => {
  const [recipientAddress, setRecipientAddress] = useState(
    (finalPsbt && finalPsbt.txOutputs[0].address) || ''
  ); // eslint-disable-line
  const [sendAmount, setSendAmount] = useState(
    (finalPsbt && satoshisToBitcoins(finalPsbt.txOutputs[0].value).toString()) || ''
  ); // eslint-disable-line
  const [isLoading, setIsLoading] = useState(false);
  const [sendAmountError, setSendAmountError] = useState('');
  const [recipientAddressError, setRecipientAddressError] = useState('');
  const fileUploadLabelRef = useRef<HTMLLabelElement>(null);
  const [importTxFromFileError, setImportTxFromFileError] = useState('');
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

  const importTxFromFile = (file: string) => {
    try {
      const tx = getPsbtFromText(file);
      try {
        getFee(tx, currentAccount.transactions); // this verifies that the tx is for currentAccount
      } catch (e) {
        throw new Error('This transaction does not belong to the currently selected account.');
      }
      setFinalPsbt(tx);
      setImportTxFromFileError('');
      setStep(1);
    } catch (e) {
      if (e instanceof Error) {
        openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
      }
    }
  };

  const validateForm = (
    _recipientAddress: string,
    _sendAmount: string,
    _currentBalance: number
  ): boolean => {
    let valid = true;
    if (!validateAddress(_recipientAddress, currentBitcoinNetwork)) {
      valid = false;
      setRecipientAddressError('Invalid address');
    }
    if (!validateSendAmount(_sendAmount, _currentBalance)) {
      valid = false;
      setSendAmountError('Not enough funds');
    }

    return valid;
  };

  const submitForm = async (
    _recipientAddress: string,
    _sendAmount: string,
    _currentBalance: number
  ) => {
    const valid = validateForm(_recipientAddress, _sendAmount, _currentBalance);
    if (valid) {
      try {
        setIsLoading(true);
        const success = await createTransactionAndSetState(_recipientAddress, _sendAmount, 0);
        if (!success) throw new Error();
        setStep(1);
      } catch (e) {
        setSendAmountError('Unable to create transaction');
        setIsLoading(false);
      }
    }
  };

  const dropdownItems = [
    {
      label: 'Import from file',
      onClick: () => {
        const txFileUploadButton = fileUploadLabelRef.current;
        if (txFileUploadButton !== null) {
          txFileUploadButton.click();
        }
      }
    },
    {
      label: 'Import from clipboard',
      onClick: () => {
        setImportTxFromFileError('');
        openInModal(
          <PastePsbtModalContent
            setImportTxFromFileError={setImportTxFromFileError}
            importTxFromFileError={importTxFromFileError}
            closeModal={closeModal}
            importTxFromFile={importTxFromFile}
          />
        );
      }
    }
  ];

  return (
    <SentTxFormContainer data-cy='send-form'>
      <FileUploader
        accept='*'
        id='txFile'
        onFileLoad={({ file }: File) => {
          importTxFromFile(file);
        }}
      />
      <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor='txFile'></label>
      <InputContainer>
        <Dropdown minimal={true} style={{ alignSelf: 'flex-end' }} dropdownItems={dropdownItems} />
        <Input
          label='Send bitcoin to'
          type='text'
          onChange={setRecipientAddress}
          value={recipientAddress}
          placeholder={
            bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet)
              ? 'tb1q4h5xd5wsalmes2496y8dtphc609rt0un3gl69r'
              : 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
          }
          error={recipientAddressError}
          largeText={true}
          id='bitcoin-receipt'
          style={{ textAlign: 'right' }}
        />
      </InputContainer>
      <InputContainer>
        <Input
          label='Amount of bitcoin to send'
          type='text'
          value={sendAmount}
          onChange={setSendAmount}
          placeholder='0.0025'
          error={sendAmountError}
          inputStaticText='BTC'
          largeText={true}
          id='bitcoin-amount'
        />
      </InputContainer>
      <SendButtonContainer>
        <CopyAddressButton
          background={green600}
          color={white}
          onClick={() => submitForm(recipientAddress, sendAmount, currentAccount.currentBalance)}
        >
          {isLoading ? <Spinner /> : 'Preview Transaction'}
        </CopyAddressButton>
        {importTxFromFileError && !modalIsOpen && (
          <ErrorText style={{ paddingTop: '1em' }}>{importTxFromFileError}</ErrorText>
        )}
      </SendButtonContainer>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
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

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

export default requireOnchain(OnchainSendTxForm);
