import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from 'src/components';

import { white, green600, red500, gray500, gray600 } from 'src/utils/colors';

import { SetStateString } from 'src/types';

interface Props {
  closeModal: () => void;
  importTxFromFile: (file: string) => void;
  importTxFromFileError: string;
  setImportTxFromFileError: SetStateString;
}

const PastePsbtModalContent = ({
  closeModal,
  importTxFromFile,
  importTxFromFileError,
  setImportTxFromFileError
}: Props) => {
  const [pastedPsbtValue, setPastedPsbtValue] = useState('');

  const onClickCloseModal = () => {
    setPastedPsbtValue('');
    setImportTxFromFileError('');
    closeModal();
  };

  return (
    <>
      <div className='border-b border-gray-200 dark:border-gray-600 flex items-center justify-between px-6 py-7'>
        <span className='dark:text-white text-2xl'>Paste transaction</span>
      </div>
      <div style={{ padding: '1.5em' }}>
        <textarea
          rows={20}
          className='border px-2 py-3 resize-none mb-6 text-gray-900 dark:text-gray-200 shadow-sm focus:ring-green-500 focus:outline-none focus:border-green-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md'
          onChange={(e) => {
            setPastedPsbtValue(e.target.value);
          }}
        />
        {importTxFromFileError && (
          <ErrorText style={{ paddingBottom: '1em' }}>{importTxFromFileError}</ErrorText>
        )}
        <div className='flex justify-end'>
          <button
            className='inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-200 mr-4 bg-white hover:bg-gray-50 dark:bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            onClick={() => onClickCloseModal()}
          >
            Cancel
          </button>
          <button
            className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            onClick={() => {
              importTxFromFile(pastedPsbtValue);
            }}
          >
            Import transaction
          </button>
        </div>
      </div>
    </>
  );
};

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const PastePsbtTextArea = styled.textarea`
  width: 100%;
  resize: none;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  margin: 2em 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164, 202, 254, 0.45);
    border-color: #a4cafe;
  }
`;

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

const ImportButtons = styled.div`
  display: flex;
`;

const FromFileButton = styled.button`
  padding: 1em 1.25rem;
  border: 1px solid ${gray500};
  border-radius: 0.375rem;
  flex: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;

  &:hover {
    border: 1px solid ${gray600};
    cursor: pointer;
  }
`;

const ImportTxButton = styled.button`
  ${Button};
  flex: 1;
`;

export default PastePsbtModalContent;
