import React, { useContext } from 'react';
import { Psbt } from 'bitcoinjs-lib';
import { Buffer } from 'buffer';

import { Unit, Price } from 'src/components';

import { createUtxoMapFromUtxoArray, getFee } from 'src/utils/send';
import { cloneBuffer } from 'src/utils/other';

import { AccountMapContext } from 'src/context';

import { LilyOnchainAccount, UtxoMap } from '@lily/types';

interface Props {
  currentAccount: LilyOnchainAccount;
  psbt: Psbt;
}

const TransactionUtxoDetails = ({ currentAccount, psbt }: Props) => {
  const { availableUtxos, transactions } = currentAccount;
  const _fee = getFee(psbt, transactions);
  let utxosMap: UtxoMap;
  if (availableUtxos) {
    utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
  }

  return (
    <>
      <div className='border-b border-gray-200 dark:border-gray-600 flex items-center justify-between px-6 py-7'>
        <span className='dark:text-white text-2xl'>Transaction Details</span>
      </div>
      <div className='px-4 py-5'>
          <h3 className='text-2xl dark:text-gray-200 mb-2'>Inputs</h3>
        <div className='max-h-[50vh] overflow-auto'>
          {psbt.txInputs.map((input) => {
            const inputBuffer = cloneBuffer(input.hash);
            const utxo =
              utxosMap[`${Buffer.from(inputBuffer.reverse()).toString('hex')}:${input.index}`];
            return (
              <div className='flex items-center justify-between px-3 py-4 mb-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'>
                <span className='text-green-800 dark:text-green-200 grow break-all'>
                  {utxo.address.address}
                </span>
                <span className='text-right ml-8 grow-0 whitespace-nowrap dark:text-gray-200'>
                  <Unit value={utxo.value} />
                </span>
              </div>
            );
          })}
        </div>
        <div data-cy='transaction-outputs'>
          <h3 className='mt-4 text-2xl dark:text-gray-200 mb-2'>Outputs</h3>
          {psbt.txOutputs.map((output) => (
            <div className='flex items-center justify-between px-3 py-4 mb-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'>
              <span className='text-green-800 dark:text-green-200 grow break-all'>
                {output.address}
              </span>{' '}
              <span className='text-right ml-8 grow-0 whitespace-nowrap dark:text-gray-200'>
                <Unit value={output.value} />
              </span>
            </div>
          ))}

          <h3 className='flex justify-between mt-6 text-xl dark:text-gray-300'>
            Fees:{' '}
            {
              <span>
                <Unit value={_fee} /> (<Price value={_fee} />)
              </span>
            }
          </h3>
        </div>
      </div>
    </>
  );
};

export default TransactionUtxoDetails;
