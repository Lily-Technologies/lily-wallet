import React, { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { networks, Network, Psbt } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import { satoshisToBitcoins } from 'unchained-bitcoin';

import { Button, Input, Dropdown, Modal, FileUploader } from '../../components';

import { AccountMapContext } from '../../AccountMapContext';

import PastePsbtModalContent from './PastePsbtModalContent';

import { bitcoinNetworkEqual } from '../../utils/files';
import { white, gray400, red, green600 } from '../../utils/colors';
import { validateAddress, validateSendAmount, getPsbtFromText } from '../../utils/send';

import { SetStateNumber, File } from '../../types';

interface Props {
  setFinalPsbt: React.Dispatch<React.SetStateAction<Psbt | undefined>>
  finalPsbt: Psbt | undefined
  setStep: SetStateNumber
  createTransactionAndSetState: (_recipientAddress: string, _sendAmount: string, _fee: BigNumber) => Promise<Psbt>
  currentBitcoinNetwork: Network
}

const SendTxForm = ({
  setFinalPsbt,
  finalPsbt,
  setStep,
  createTransactionAndSetState,
  currentBitcoinNetwork,
}: Props) => {
  const [recipientAddress, setRecipientAddress] = useState(finalPsbt && finalPsbt.txOutputs[0].address || ''); // eslint-disable-line
  const [sendAmount, setSendAmount] = useState(finalPsbt && satoshisToBitcoins(finalPsbt.txOutputs[0].value).toString() || ''); // eslint-disable-line
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [sendAmountError, setSendAmountError] = useState(false);
  const [recipientAddressError, setRecipientAddressError] = useState(false);
  const { currentAccount } = useContext(AccountMapContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const fileUploadLabelRef = useRef<HTMLLabelElement>(null);
  const [importTxFromFileError, setImportTxFromFileError] = useState('');

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  }

  const importTxFromFile = (file: string) => {
    try {
      const tx = getPsbtFromText(file);
      setFinalPsbt(tx);
      setImportTxFromFileError('');
      setStep(1);
    } catch (e) {
      setImportTxFromFileError(e.message);
    }
  }

  const validateForm = (_recipientAddress: string, _sendAmount: string, _currentBalance: number): boolean => {
    let valid = true;
    if (!validateAddress(_recipientAddress, currentBitcoinNetwork)) {
      valid = false;
      setRecipientAddressError(true)
    } if (!validateSendAmount(_sendAmount, _currentBalance)) {
      valid = false;
      setSendAmountError(true);
    }

    return valid;
  }

  const submitForm = async (_recipientAddress: string, _sendAmount: string, _currentBalance: number) => {
    const valid = validateForm(_recipientAddress, _sendAmount, _currentBalance);
    if (valid) {
      await createTransactionAndSetState(_recipientAddress, _sendAmount, new BigNumber(0));
      setStep(1);
    }
  }

  const dropdownItems = [
    {
      label: 'Import from file',
      onClick: () => {
        const txFileUploadButton = fileUploadLabelRef.current;
        if (txFileUploadButton !== null) {
          txFileUploadButton.click()
        }
      }
    },
    {
      label: 'Import from clipboard',
      onClick: () => {
        setImportTxFromFileError('')
        openInModal(
          <PastePsbtModalContent
            setImportTxFromFileError={setImportTxFromFileError}
            importTxFromFileError={importTxFromFileError}
            closeModal={closeModal}
            importTxFromFile={importTxFromFile}
          />
        )
      }
    }
  ]

  return (
    <SentTxFormContainer>
      <FileUploader
        accept="*"
        id="txFile"
        onFileLoad={({ file }: File) => {
          importTxFromFile(file)
        }}
      />
      <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor="txFile"></label>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}>
        {modalContent as React.ReactChild}
      </Modal>
      <Dropdown
        isOpen={optionsDropdownOpen}
        setIsOpen={setOptionsDropdownOpen}
        minimal={true}
        style={{ alignSelf: 'flex-end' }}
        dropdownItems={dropdownItems}
      />
      <InputContainer>
        <Input
          label="Send bitcoin to"
          type="text"
          onChange={setRecipientAddress}
          value={recipientAddress}
          placeholder={bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ?
            "tb1q4h5xd5wsalmes2496y8dtphc609rt0un3gl69r" :
            "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"}
          error={recipientAddressError}
          largeText={true}
          style={{ textAlign: 'right', fontSize: '0.85rem' }}
        />
      </InputContainer>
      <InputContainer>
        <Input
          label="Amount of bitcoin to send"
          type="text"
          value={sendAmount}
          onChange={setSendAmount}
          placeholder="0.0025"
          error={sendAmountError}
          inputStaticText="BTC"
          largeText={true}
        />
      </InputContainer>
      {sendAmountError && <SendAmountError>Not enough funds</SendAmountError>}
      <SendButtonContainer>
        <CopyAddressButton
          background={green600}
          color={white}
          onClick={() => submitForm(recipientAddress, sendAmount, currentAccount.currentBalance)}>
          Preview Transaction
          </CopyAddressButton>
        {importTxFromFileError && !modalIsOpen && <ErrorText style={{ paddingTop: '1em' }}>{importTxFromFileError}</ErrorText>}
      </SendButtonContainer>
    </SentTxFormContainer>
  )
}

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

const SendAmountError = styled.div`
  font-size: 0.5em;
  color: ${red};
  text-align: right;
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
  font-weight: 600;
`;

const ErrorText = styled.div`
  color: ${red};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

export default SendTxForm;