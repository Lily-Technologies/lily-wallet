import { useEffect, useState } from 'react';

import { Unit } from 'src/components';
import { useSelected, useShiftSelected } from 'src/hocs';

import { UtxoInputSelectRow } from './UtxoInputSelectRow';
import { SearchToolbar } from './SearchToolbar';

import { LilyOnchainAccount, UTXO } from '@lily/types';
import { createMap } from 'src/utils/accountMap';
import { normalizedIncludes } from 'src/utils/other';

export type SortOptions = 'asc' | 'desc' | null;

interface Props {
  currentAccount: LilyOnchainAccount;
  onSave: (utxos: UTXO[]) => void;
  cancel: () => void;
  requiredSendAmount: number;
}

export const SelectInputsForm = ({ currentAccount, onSave, cancel, requiredSendAmount }: Props) => {
  const { availableUtxos, addresses, changeAddresses } = currentAccount;

  const { selected, change } = useSelected<UTXO>([]);
  const { onChange, resetShiftSelectSelections } = useShiftSelected(availableUtxos, change);

  const [showTags, setShowTags] = useState(false);
  const [sort, setSort] = useState<SortOptions>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUtxos, setFilteredUtxos] = useState(availableUtxos);

  useEffect(() => {
    const currentFilteredUtxos = availableUtxos.filter((utxo) => {
      const addressMatch = normalizedIncludes(utxo.address.address, searchQuery);
      const txIdMatch = normalizedIncludes(utxo.txid, searchQuery);

      const addressMap = createMap([...addresses, ...changeAddresses], 'address');
      const utxoAddress = addressMap[utxo.address.address];

      const labelMatch = utxoAddress.tags.some((tag) =>
        tag.label.toLowerCase().includes(searchQuery)
      );

      return labelMatch || addressMatch || txIdMatch;
    });

    setFilteredUtxos(currentFilteredUtxos);
    resetShiftSelectSelections(currentFilteredUtxos);
  }, [searchQuery]);

  useEffect(() => {
    const sortedUtxos = [...filteredUtxos].sort((a, b) => {
      if (sort === 'asc') {
        return a.value - b.value;
      } else if (sort === 'desc') {
        return b.value - a.value;
      }
      return 0;
    });

    setFilteredUtxos(sortedUtxos);
    resetShiftSelectSelections(sortedUtxos);
  }, [sort]);

  const toggleSort = () => {
    if (sort === 'asc') {
      setSort(null);
    } else if (sort === 'desc') {
      setSort('asc');
    } else {
      setSort('desc');
    }
  };

  const selectedInputTotal = selected.reduce((accum, input) => accum + input.value, 0);
  const remaining = requiredSendAmount - selectedInputTotal;

  return (
    <>
      <div className='space-y-1 bg-white px-5 py-4 sm:px-6  dark:bg-slate-800'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100' id='slide-over-title'>
          Select inputs
        </h2>
        <p className='text-sm text-gray-500 dark:text-slate-400'>
          Choose which inputs you want to use in this transaction
        </p>
      </div>

      <div className='dark:bg-slate-800'>
        <SearchToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showTags={showTags}
          setShowTags={setShowTags}
          toggleSort={toggleSort}
          sort={sort}
        />
      </div>

      <div className='bg-gray-200 dark:bg-slate-900 overflow-y-auto flex-grow'>
        <ul className='overflow-auto space-y-4 py-4 px-5'>
          {[...filteredUtxos].map((utxo) => {
            const id = `${utxo.txid}:${utxo.vout}`;
            const isSelected = selected.includes(utxo);

            return (
              <UtxoInputSelectRow
                key={id}
                id={id}
                isSelected={isSelected}
                utxo={utxo}
                handleChange={onChange}
                showTags={showTags}
              />
            );
          })}
        </ul>
      </div>
      <div className='flex justify-between align-center bg-white px-4 py-3 sm:px-6 border-t border-gray-700/20 dark:border-slate-500/20 dark:bg-slate-800'>
        <div className='flex flex-col w-52 text-right'>
          <span className=''>
            <Unit className='dark:text-slate-100' value={selectedInputTotal} />{' '}
            <span className='text-gray-500 text-sm'>selected</span>
          </span>
          {remaining > 0 ? (
            <span>
              <Unit className='dark:text-slate-100' value={remaining} />{' '}
              <span className='text-gray-500 text-sm'>required</span>
            </span>
          ) : (
            <span>
              <Unit className='dark:text-slate-100' value={Math.abs(remaining)} />{' '}
              <span className='text-gray-500 text-sm'>change</span>
              <span className='text-transparent select-none text-xs'>x</span>
            </span>
          )}
        </div>
        <div className='text-right flex items-center'>
          <button
            onClick={() => cancel()}
            className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Cancel
          </button>
          <button
            disabled={remaining > 0}
            onClick={() => onSave(selected)}
            className='ml-3 inline-flex justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-transparent bg-gray-800 dark:bg-slate-700 disabled:hover:bg-gray-800 dark:disabled:hover:bg-slate-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
