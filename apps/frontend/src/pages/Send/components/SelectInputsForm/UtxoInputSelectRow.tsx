import { useContext } from 'react';

import { Unit } from 'src/components';
import { LabelTag } from 'src/pages/Vault/Settings/Addresses/LabelTag';

import { AccountMapContext } from 'src/context';

import { classNames } from 'src/utils/other';
import { createMap } from 'src/utils/accountMap';

import { UTXO, LilyOnchainAccount } from '@lily/types';

interface Props {
  id: string;
  isSelected: boolean;
  utxo: UTXO;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, utxo: UTXO) => void;
  showTags: boolean;
}

export const UtxoInputSelectRow = ({ id, isSelected, utxo, handleChange, showTags }: Props) => {
  const {currentAccount } = useContext(AccountMapContext)
  const { addresses, changeAddresses } = currentAccount as LilyOnchainAccount;
  const addressMap = createMap([...addresses, ...changeAddresses], 'address')
  const utxoAddress = addressMap[utxo.address.address]

  return (
    <label
      htmlFor={id}
      className={classNames(
        isSelected
          ? 'border-green-900/20 bg-green-100/40 active:bg-green-500/25 dark:bg-green-800'
          : 'border-gray-800/15 active:bg-gray-50 hover:border-gray-900/20 bg-white dark:bg-slate-800 dark:border-slate-800 dark:hover:bg-slate-700',
        'select-none shadow cursor-pointer flex items-center justify-between w-full p-4 border dark:highlight-white/10 rounded-2xl group'
      )}
    >
      <div>
        <input
          id={id}
          aria-describedby={`UTXO ${id}`}
          name={`UTXO ${id}`}
          type='checkbox'
          checked={isSelected}
          onChange={(e) => handleChange(e, utxo)}
          className='mr-4 h-4 w-4 cursor-pointer rounded border-gray-300 dark:border-slate-300 bg-gray-100 dark:bg-slate-700 text-green-600 focus:ring-green-500'
        />
        <span className='font-medium dark:text-slate-200 group-hover:text-gray-600 dark:group-hover:text-slate-200'>
          <Unit value={utxo.value} />
        </span>
      </div>
      <div className='flex flex-col text-right'>
        <span
          className={classNames(
            isSelected
              ? 'dark:text-slate-200'
              : 'group-hover:text-gray-600 dark:group-hover:text-slate-400',
            'text-sm dark:text-slate-400'
          )}
        >
          {utxo.txid}:{utxo.vout}
        </span>
        {showTags ? (
          <ul
            role='list'
            className='mt-2 inline-flex leading-8 space-x-1 items-center justify-end flex-wrap'
          >
            {utxoAddress.tags.length ? (
              utxoAddress.tags.map((label) => (
                <li className='inline' key={label.id}>
                  <LabelTag label={label} />
                </li>
              ))
            ) : (
              <span className='text-gray-600 text-sm dark:text-slate-400'>No tags</span>
            )}
          </ul>
        ) : null}
      </div>
    </label>
  );
};
