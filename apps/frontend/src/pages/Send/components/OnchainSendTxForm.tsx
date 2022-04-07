import React, { useContext, useState, useRef } from 'react';
import styled from 'styled-components';
import { networks, Network, Psbt } from 'bitcoinjs-lib';

import {
  Input,
  Dropdown,
  FileUploader,
  Modal,
  ErrorModal,
  Select,
  Spinner,
  UnitInput
} from 'src/components';

import PastePsbtModalContent from './PastePsbtModalContent';

import { bitcoinNetworkEqual } from 'src/utils/files';
import { red500 } from 'src/utils/colors';
import {
  validateAddress,
  validateSendAmount,
  getPsbtFromText,
  getFee,
  RecipientItem
} from 'src/utils/send';

import { File, LilyAccount, LilyLightningAccount, LilyOnchainAccount } from '@lily/types';
import { SetStateNumber } from 'src/types';
import { AccountMapContext, UnitContext } from 'src/context';

interface Props {
  currentAccount: LilyOnchainAccount;
  setFinalPsbt: React.Dispatch<React.SetStateAction<Psbt | undefined>>;
  finalPsbt: Psbt | undefined;
  setStep: SetStateNumber;
  createTransactionAndSetState: (recipients: RecipientItem[], _fee: number) => Promise<Psbt>;
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
  const { getValue } = useContext(UnitContext);
  const { setCurrentAccountId, accountMap } = useContext(AccountMapContext);
  const [recipientAddress, setRecipientAddress] = useState(
    finalPsbt ? finalPsbt.txOutputs[0].address! : ''
  );
  const [sendAmount, setSendAmount] = useState(
    finalPsbt ? finalPsbt.txOutputs[0].value.toString() : ''
  );
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

  const getCurrentBalance = (account: LilyAccount) => {
    if (account.loading) {
      return 'Loading...';
    } else if (account.config.type === 'onchain') {
      return getValue((account as LilyOnchainAccount).currentBalance);
    } else {
      return getValue(Number((account as LilyLightningAccount).currentBalance.balance));
    }
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
        const success = await createTransactionAndSetState(
          [{ address: _recipientAddress, value: Number(_sendAmount) }],
          0
        );
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
    <div className='bg-white dark:bg-gray-800 rounded-md shadow'>
      <div className='py-6 px-4 sm:p-6 ' data-cy='send-form'>
        <FileUploader
          accept='*'
          id='txFile'
          onFileLoad={({ file }: File) => {
            importTxFromFile(file);
          }}
        />
        <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor='txFile'></label>
        <div className='w-full flex justify-end text-gray-900 dark:text-gray-200'>
          <Dropdown
            minimal={true}
            style={{ alignSelf: 'flex-end' }}
            dropdownItems={dropdownItems}
          />
        </div>
        <div className='grid grid-cols-4 gap-6'>
          <div className='col-span-4 lg:col-span-2'>
            <Select
              label='From account'
              initialSelection={{
                label: `${currentAccount.config.name} (${getCurrentBalance(currentAccount)})`,
                onClick: () => setCurrentAccountId(currentAccount.config.id)
              }}
              options={Object.values(accountMap).map((item) => {
                return {
                  label: `${item.name} (${getCurrentBalance(item)})`,
                  onClick: () => {
                    setCurrentAccountId(item.config.id);
                  }
                };
              })}
            />
          </div>
          <div className='hidden lg:block lg:col-span-2'></div>
          <div className='col-span-4 lg:col-span-2'>
            <Input
              label='Send bitcoin to'
              type='text'
              onChange={(value) => {
                setRecipientAddress(value);
                setRecipientAddressError('');
              }}
              value={recipientAddress}
              placeholder={
                bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet)
                  ? 'tb1q4h5xd5wsalmes2496y8dtphc609rt0un3gl69r'
                  : 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
              }
              error={recipientAddressError}
              // largeText={true}
              id='bitcoin-receipt'
              style={{ textAlign: 'right' }}
            />
          </div>
          <div className='col-span-4 lg:col-span-2'>
            <UnitInput
              label='Amount to send'
              value={sendAmount}
              onChange={(value) => {
                setSendAmount(value);
                setSendAmountError('');
              }}
              error={sendAmountError}
              id='bitcoin-amount'
            />
          </div>
        </div>
      </div>
      <div className='text-right py-3 px-4 mt-2 border bg-gray-50 dark:border-gray-900 dark:bg-gray-700 rounded-bl-md rounded-br-md'>
        <button
          disabled={!!currentAccount.loading}
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md disabled:bg-red-500 text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
          onClick={() => submitForm(recipientAddress, sendAmount, currentAccount.currentBalance)}
        >
          {!!currentAccount.loading ? (
            'Loading...'
          ) : isLoading ? (
            <>
              <Spinner />
              Creating transaction...
            </>
          ) : (
            'Preview Transaction'
          )}
        </button>
        {importTxFromFileError && !modalIsOpen && (
          <ErrorText style={{ paddingTop: '1em' }}>{importTxFromFileError}</ErrorText>
        )}
      </div>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

export default OnchainSendTxForm;
