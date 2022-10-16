import { useState } from 'react';

import { Unit } from 'src/components';

import { UtxoInputSelectRow } from './UtxoInputSelectRow';

import { LilyOnchainAccount, UTXO } from '@lily/types';

interface Props {
  currentAccount: LilyOnchainAccount;
  onSave: (utxos: UTXO[]) => void;
  cancel: () => void;
  requiredSendAmount: number;
}

export const SelectInputsForm = ({ currentAccount, onSave, cancel, requiredSendAmount }: Props) => {
  const { availableUtxos } = currentAccount;
  const [selectedInputs, setSelectedInputs] = useState<UTXO[]>([]);

  const handleChange = (currentUtxo: UTXO) => {
    if (selectedInputs.includes(currentUtxo)) {
      const updatedInputs = selectedInputs.filter((input) => input !== currentUtxo);
      setSelectedInputs(updatedInputs);
    } else {
      const updatedInputs = [...selectedInputs, currentUtxo];
      setSelectedInputs(updatedInputs);
    }
  };

  const selectedInputTotal = selectedInputs.reduce((accum, input) => accum + input.value, 0);
  const remaining = requiredSendAmount - selectedInputTotal;

  return (
    <>
      <div className='space-y-1 bg-gray-50 px-5 py-4 sm:px-6 border-b border-gray-500/10 dark:border-gray-900/10 dark:bg-slate-800'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100' id='slide-over-title'>
          Select inputs
        </h2>
        <p className='text-sm text-gray-500 dark:text-slate-400'>
          Choose which inputs you want to use in this transaction
        </p>
      </div>
      <div className='dark:bg-slate-900 overflow-y-auto'>
        <ul className='overflow-auto'>
          {availableUtxos.map((utxo) => {
            const id = `${utxo.txid}:${utxo.vout}`;
            const isSelected = selectedInputs.includes(utxo);

            return (
              <UtxoInputSelectRow
                id={id}
                isSelected={isSelected}
                utxo={utxo}
                handleChange={handleChange}
              />
            );
          })}
        </ul>
      </div>
      <div className='flex justify-between align-center bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-900/10 dark:bg-slate-800'>
        <div className='flex flex-col w-52 text-right'>
          <span>
            <Unit value={requiredSendAmount} />{' '}
            <span className='text-gray-500 text-sm'>required</span>
          </span>
          <span className='border-b border-gray-200'>
            <Unit value={selectedInputTotal} />{' '}
            <span className='text-gray-500 text-sm'>selected</span>
          </span>
          <span>
            {remaining > 0 ? (
              <>
                <Unit value={remaining} /> <span className='text-gray-500 text-sm'>remaining</span>
              </>
            ) : (
              <span className='font-medium text-green-500'>Ready to send</span>
            )}
          </span>
        </div>
        <div className='text-right flex items-center'>
          <button
            onClick={() => cancel()}
            className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedInputs)}
            className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-800 dark:bg-slate-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
