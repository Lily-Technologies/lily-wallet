import { useContext, useEffect, useState } from 'react';

import { Unit } from 'src/components';
import { LabelTag } from 'src/pages/Vault/Settings/Addresses/LabelTag';

import { PlatformContext } from 'src/context';

import { classNames } from 'src/utils/other';

import { UTXO, AddressLabel } from '@lily/types';

interface Props {
  id: string;
  isSelected: boolean;
  utxo: UTXO;
  handleChange: (utxo: UTXO) => void;
}

export const UtxoInputSelectRow = ({ id, isSelected, utxo, handleChange }: Props) => {
  const [labels, setLabels] = useState<AddressLabel[]>([]);
  const { platform } = useContext(PlatformContext);

  useEffect(() => {
    const retrieveLabels = async () => {
      const retrievedLabels = await platform.getAddressLabels(utxo.address.address);
      setLabels(retrievedLabels);
    };
    retrieveLabels();
  }, []);

  return (
    <label
      htmlFor={id}
      className={classNames(
        isSelected
          ? 'border-green-200/10 bg-green-100/40 dark:bg-green-800'
          : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800',
        'cursor-pointer flex items-center justify-between w-full p-4 border'
      )}
    >
      <div>
        <input
          id={id}
          aria-describedby={`UTXO ${id}`}
          name={`UTXO ${id}`}
          type='checkbox'
          checked={isSelected}
          onChange={() => handleChange(utxo)}
          className='mr-4 h-4 w-4 rounded border-gray-300 dark:border-slate-300 bg-gray-100 dark:bg-slate-700 text-green-600 focus:ring-green-500'
        />
        <span className='font-medium dark:text-slate-200'>
          <Unit value={utxo.value} />
        </span>
      </div>
      <div className='flex flex-col text-right'>
        <span
          className={classNames(
            isSelected ? 'dark:text-slate-200' : '',
            'text-sm dark:text-slate-400'
          )}
        >
          {utxo.txid}:{utxo.vout}
        </span>
        <ul
          role='list'
          className='mt-2 inline-flex leading-8 space-x-1 items-center justify-end flex-wrap'
        >
          {labels.map((label) => (
            <li className='inline' key={label.id}>
              <LabelTag label={label} />
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
};
