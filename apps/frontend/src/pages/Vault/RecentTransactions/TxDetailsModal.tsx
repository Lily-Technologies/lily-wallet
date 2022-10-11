import React from 'react';
import styled from 'styled-components';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import { Button, Unit } from 'src/components';

import { white, green600 } from 'src/utils/colors';

import { Transaction } from '@lily/types';

interface Props {
  transaction: Transaction;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TxDetailsModal = ({ transaction, setOpen }: Props) => {
  return (
    <>
      <div className='px-4 py-6 sm:px-6 bg-green-600'>
        <div className='flex items-start justify-between space-x-3'>
          <div className='space-y-1 truncate'>
            <Dialog.Title className='text-lg font-medium text-white'>
              Transaction details
            </Dialog.Title>
            <p className='text-sm text-green-300 truncate'>{transaction.txid}</p>
          </div>
          <div className='h-7 flex items-center'>
            <button
              type='button'
              className='text-white hover:text-gray-200'
              onClick={() => setOpen(false)}
            >
              <span className='sr-only'>Close panel</span>
              <XIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6 py-6'>
        <MoreDetailsSection style={{ marginTop: 0 }}>
          <h2 className='text-gray-800 dark:text-gray-200 text-2xl'>Inputs</h2>
          <TxOutputSection>
            {transaction.vin.map((input) => {
              return (
                <OutputItem className='bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'>
                  <span className='text-green-800 dark:text-green-200 grow break-all'>{`${input.prevout.scriptpubkey_address}:${input.vout}`}</span>
                  <span className='text-right ml-8 grow-0 whitespace-nowrap dark:text-gray-200'>
                    <Unit value={input.prevout.value} />
                  </span>
                </OutputItem>
              );
            })}
          </TxOutputSection>
        </MoreDetailsSection>
        <MoreDetailsSection>
          <h2 className='text-gray-800 dark:text-gray-200 text-2xl'>Outputs</h2>
          <TxOutputSection>
            {transaction.vout.map((output) => {
              return (
                <OutputItem className='bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'>
                  <span className='text-green-800 dark:text-green-200 grow break-all'>
                    {output.scriptpubkey_address}
                  </span>
                  <span className='text-right ml-8 grow-0 whitespace-nowrap dark:text-gray-200'>
                    <Unit value={output.value} />
                  </span>
                </OutputItem>
              );
            })}
          </TxOutputSection>
        </MoreDetailsSection>
        <MoreDetailsSection>
          <h2 className='text-gray-800 dark:text-gray-200 text-2xl'>Status</h2>
          <StatusItem className='text-gray-700 dark:text-gray-400'>
            {transaction.status.confirmed
              ? `Confirmed ${transaction.status.block_height} blocks ago`
              : 'Unconfirmed'}
          </StatusItem>
          <StatusItem className='text-gray-700 dark:text-gray-400'>
            Paid <Unit value={transaction.fee} />
          </StatusItem>
        </MoreDetailsSection>
        <Buttons>
          <ViewExplorerButton
            background={green600}
            color={white}
            onClick={() =>
              window.open(
                `https://blockstream.info/tx/${transaction.txid}`,
                '_blank',
                'nodeIntegration=no'
              )
            }
          >
            View on Blockstream
          </ViewExplorerButton>
        </Buttons>
      </div>
    </>
  );
};

const ViewExplorerButton = styled.button`
  ${Button};
`;

const TxOutputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  margin: 12px 0;
  align-items: center;
  border-radius: 4px;
`;

const MoreDetailsSection = styled.div`
  margin-top: 1.5em;
`;

const StatusItem = styled.h4`
  margin: 0;
  font-weight: 500;
  margin-top: 0.5em;
  margin-left: 0.5em;
`;

const Buttons = styled.div`
  margin-top: 0.5em;
  display: flex;
  justify-content: flex-end;
`;

export default TxDetailsModal;
