import { useState } from 'react';
import { Psbt } from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { AdjustmentsIcon } from '@heroicons/react/outline';

import { Unit, Price } from 'src/components';

import { createUtxoMapFromUtxoArray, getFee } from 'src/utils/send';
import { cloneBuffer } from 'src/utils/other';

import { LilyOnchainAccount, UtxoMap, UTXO } from '@lily/types';

import { SelectInputsForm } from './SelectInputsForm';

interface Props {
  currentAccount: LilyOnchainAccount;
  psbt: Psbt;
  adjustInputs?: (utxos: UTXO[]) => Promise<Psbt>;
}

const TransactionUtxoDetails = ({ currentAccount, psbt, adjustInputs }: Props) => {
  const [showSelectInputsForm, setShowSelectInputsForm] = useState(false);

  const { availableUtxos, transactions } = currentAccount;

  const _fee = getFee(psbt, transactions);
  let utxosMap: UtxoMap;
  if (availableUtxos) {
    utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
  }

  if (showSelectInputsForm) {
    return (
      <SelectInputsForm
        onSave={(utxos: UTXO[]) => {
          if (adjustInputs) {
            adjustInputs(utxos);
            setShowSelectInputsForm(false);
          }
        }}
        cancel={() => setShowSelectInputsForm(false)}
        currentAccount={currentAccount}
        requiredSendAmount={psbt.txOutputs[0].value}
      />
    );
  }

  return (
    <>
      <div className='space-y-1 bg-white px-5 py-4 sm:px-6  dark:bg-slate-800 border-b border-gray-700/20 dark:border-slate-500/20'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100' id='slide-over-title'>
          Transaction details
        </h2>
        <p className='text-sm text-gray-500 dark:text-slate-400'>
          Choose which inputs you want to use in this transaction
        </p>
      </div>
      <div className='space-y-6'>
        <div className='px-4 py-5 space-y-6'>
          <div>
            <div className='flex justify-between pb-2'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100'>Inputs</h2>
              <button
                onClick={() => setShowSelectInputsForm(true)}
                className='flex items-center text-sm font-medium text-green-700 dark:text-green-600 hover:text-green-600 dark:hover:text-green-500'
              >
                <AdjustmentsIcon className='w-4 h-4 mr-1' />
                Adjust input(s)
              </button>
            </div>
            <ul className='max-h-[50vh] overflow-auto space-y-4 py-1'>
              {psbt.txInputs.map((input) => {
                const inputBuffer = cloneBuffer(input.hash);
                const utxo =
                  utxosMap[`${Buffer.from(inputBuffer.reverse()).toString('hex')}:${input.index}`];
                return (
                  <li className='border-gray-800/15 active:bg-gray-50 bg-white dark:bg-slate-800 dark:border-slate-800 shadow flex items-center justify-between w-full p-4 border dark:highlight-white/10 rounded-2xl group'>
                    {/* <li className='flex items-center justify-between px-3 py-4 mb-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'> */}
                    <span className='text-sm dark:text-slate-400'>{utxo.address.address}</span>
                    <span className='font-medium dark:text-slate-200'>
                      <Unit value={utxo.value} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100 pb-2'>Outputs</h2>
            <ul className='space-y-4 py-1'>
              {psbt.txOutputs.map((output) => (
                <li className='border-gray-800/15 active:bg-gray-50 bg-white dark:bg-slate-800 dark:border-slate-800 shadow flex items-center justify-between w-full p-4 border dark:highlight-white/10 rounded-2xl group'>
                  <span className='text-sm dark:text-slate-400'>{output.address}</span>{' '}
                  <span className='text-right ml-8 grow-0 whitespace-nowrap dark:text-gray-200'>
                    <Unit value={output.value} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex justify-between'>
            <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100'>Fees:</h2>

            <span className='text-gray-900 dark:text-slate-100'>
              <Unit value={_fee} /> (<Price value={_fee} />)
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionUtxoDetails;
