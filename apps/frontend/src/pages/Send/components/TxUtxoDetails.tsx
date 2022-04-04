import React from 'react';
import styled from 'styled-components';
import { Psbt } from 'bitcoinjs-lib';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import { Buffer } from 'buffer';

import { createUtxoMapFromUtxoArray, getFee } from 'src/utils/send';
import { cloneBuffer } from 'src/utils/other';
import { gray100, gray300, gray600, green800 } from 'src/utils/colors';
import { requireOnchain } from 'src/hocs';

import { LilyOnchainAccount, UtxoMap } from '@lily/types';

interface Props {
  currentAccount: LilyOnchainAccount;
  psbt: Psbt;
  currentBitcoinPrice: number;
}

const TransactionUtxoDetails = ({ currentAccount, psbt, currentBitcoinPrice }: Props) => {
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
        <div>
          <h3 className='text-2xl dark:text-gray-200 mb-2'>Inputs</h3>
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
                  {satoshisToBitcoins(utxo.value).toNumber()} BTC
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
                {satoshisToBitcoins(output.value).toNumber()} BTC
              </span>
            </div>
          ))}

          <h3 className='flex justify-between mt-6 text-xl dark:text-gray-300'>
            Fees:{' '}
            {
              <span>
                {satoshisToBitcoins(_fee).toNumber()} BTC ($
                {satoshisToBitcoins(_fee).multipliedBy(currentBitcoinPrice).toFixed(2)})
              </span>
            }
          </h3>
        </div>
      </div>
    </>
  );
};

export default requireOnchain(TransactionUtxoDetails);
