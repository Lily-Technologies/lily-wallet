import React, { useState } from 'react';

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
          <div className='text-red-500 text-center px-0' style={{ paddingBottom: '1em' }}>
            {importTxFromFileError}
          </div>
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

export default PastePsbtModalContent;
